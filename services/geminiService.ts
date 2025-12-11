import { GoogleGenAI, Type } from "@google/genai";
import { AdConfiguration } from "../types";

// Initialize the client
// process.env.API_KEY is guaranteed to be available per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Optimizes a short user prompt into a detailed descriptive prompt using a text model.
 */
export const optimizeTextPrompt = async (text: string, type: 'product' | 'scene'): Promise<string> => {
  if (!text.trim()) return "";

  try {
    const systemInstruction = type === 'product' 
      ? "You are an expert commercial copywriter. Expand the user's short product description into a detailed, sensory-rich description suitable for an image generation prompt. Keep it under 40 words. Focus on material, texture, and lighting."
      : "You are an expert art director. Expand the user's short scene description into a detailed, atmospheric setting description for a photoshoot. Focus on lighting, mood, background elements, and color palette. Keep it under 40 words.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: text,
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: 100,
      }
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Error optimizing prompt:", error);
    return text; // Fallback to original text
  }
};

/**
 * Analyzes the product and scene description to determine the best integration strategy.
 */
const analyzeAdConfiguration = async (productDesc: string, sceneDesc: string): Promise<{ integration: string; category: string; visuals: string }> => {
  try {
    const prompt = `Analyze the following elements for an advertisement image generation task:
    Product Description: "${productDesc}"
    Scene Description: "${sceneDesc}"

    Determine the following:
    1. Product Category (e.g., Footwear, Jewelry, Bag, Beverage, Electronics, Apparel).
    2. Integration Mode: How should a model interact with this product? 
       - 'worn': for clothes, shoes, jewelry, watches, glasses.
       - 'held': for phones, bottles, bags, small objects.
       - 'placed': for furniture, large objects, stationary items.
    3. Visual Context: A brief phrase describing the visual interaction (e.g., "draped elegantly around the neck", "held confidently in hand", "worn on feet").

    Return the result in JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            integration: { type: Type.STRING },
            visuals: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    return { integration: 'placed', category: 'General', visuals: 'integrated into the scene' };
  } catch (e) {
    console.warn("Auto-analysis failed, falling back to defaults", e);
    return { integration: 'placed', category: 'General', visuals: 'integrated into the scene' };
  }
};

/**
 * Generates the advertisement image using the image generation model.
 */
export const generateAdvertisementImage = async (config: AdConfiguration): Promise<string> => {
  try {
    const parts: any[] = [];
    let hasModel = false;
    let hasProduct = false;

    // 1. Add visual context (Images)
    if (config.modelImage) {
      // Remove header if present (e.g., "data:image/png;base64,")
      const base64Data = config.modelImage.split(',')[1];
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg', 
          data: base64Data,
        },
      });
      hasModel = true;
    }

    if (config.productImage) {
      const base64Data = config.productImage.split(',')[1];
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
      });
      hasProduct = true;
    }

    // 2. Intelligent Prompt Construction
    let prompt = `Generate a high-quality, professional advertisement image. `;
    
    // Auto-detection logic
    let integrationStrategy = config.mode;
    let specificVisuals = "";

    if (config.mode === 'auto' && config.productDescription) {
        const analysis = await analyzeAdConfiguration(config.productDescription, config.sceneDescription);
        // Map analysis to strategies
        if (analysis.integration === 'worn') integrationStrategy = 'garment';
        else if (analysis.integration === 'held') integrationStrategy = 'person';
        else integrationStrategy = 'object';
        
        specificVisuals = analysis.visuals;
        console.log("Auto-detected strategy:", integrationStrategy, analysis);
    }

    // Explicitly guide the model on how to use the images
    if (hasModel && hasProduct) {
        prompt += `Use the first image as the reference model/subject and the second image as the product/garment. `;
    } else if (hasModel) {
        prompt += `Use the provided image as the reference model/subject. `;
    } else if (hasProduct) {
        prompt += `Use the provided image as the main product to feature. `;
    }
    
    // Mode-specific instructions
    if (integrationStrategy === 'garment') {
      prompt += `The model should be depicted wearing the uploaded product. ${specificVisuals ? `Specifically, it should be ${specificVisuals}.` : 'Ensure it fits seamlessly and drapes naturally.'} `;
    } else if (integrationStrategy === 'object') {
      prompt += `Seamlessly integrate the uploaded product into the scene. ${specificVisuals ? `It should be ${specificVisuals}.` : ''} The product should be showcased prominently with realistic shadows and reflections. `;
    } else if (integrationStrategy === 'person') {
      prompt += `Generate a professional lifestyle shot. The model should be interacting naturally with the product. ${specificVisuals ? `It should be ${specificVisuals}.` : ''} `;
    } else {
        // Fallback if auto failed or no specific mode
        prompt += `Integrate the product naturally into the scene with the model. `;
    }

    if (config.productDescription) {
      prompt += `Product details: ${config.productDescription}. `;
    }

    if (config.sceneDescription) {
      prompt += `Scene: ${config.sceneDescription}. `;
    }

    if (config.brandText) {
      prompt += `Include the text "${config.brandText}" naturally in the composition or as a stylish overlay suitable for an ad. `;
    }

    prompt += `The final output should be suitable for marketing and advertising purposes. The lighting should be cinematic and studio-quality. Photorealistic 8k resolution, clean and professional composition.`;

    // Add Negative Prompt
    const negativePrompt = "Do not generate low-resolution images, cartoonish designs, unrealistic proportions, cluttered layouts, or unprofessional components. Do not include text overlays or watermarks.";
    prompt += ` \n\nNegative prompt: ${negativePrompt}`;

    parts.push({ text: prompt });

    // 3. Call the API
    // Using gemini-2.5-flash-image for reliable image generation with mixed inputs
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        // Mapping UI aspect ratio to supported API strings if needed, 
        // strictly following allowed values: "1:1", "3:4", "4:3", "9:16", and "16:9".
        imageConfig: {
            aspectRatio: config.aspectRatio,
        }
      }
    });

    // 4. Extract Image
    // The response may contain multiple parts, we look for inlineData
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Ad Generation Error:", error);
    throw error;
  }
};

/**
 * Edits an existing generated image based on a text instruction.
 */
export const editGeneratedImage = async (base64Image: string, editInstruction: string): Promise<string> => {
  try {
    const base64Data = base64Image.split(',')[1];
    // Simple mime type extraction, defaulting to jpeg if complex
    const mimeMatch = base64Image.match(/^data:(.*?);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const parts = [
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      },
      { text: editInstruction },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
    });

    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Edit Generation Error:", error);
    throw error;
  }
};