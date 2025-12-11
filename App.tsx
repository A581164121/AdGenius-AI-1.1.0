import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { AdConfiguration, AspectRatio, OptimizeTarget } from './types';
import { generateAdvertisementImage, optimizeTextPrompt, editGeneratedImage } from './services/geminiService';
import { Wand2, User, ShoppingBag, Box, Loader2, Sparkles, Download, Share2, Image as ImageIcon, Eraser, PlusCircle, ArrowRight, X, ScanFace } from 'lucide-react';

function App() {
  const [config, setConfig] = useState<AdConfiguration>({
    modelImage: null,
    productImage: null,
    productDescription: "",
    brandText: "",
    sceneDescription: "A confident young professional standing in a modern, sunlit city street.",
    aspectRatio: AspectRatio.SQUARE,
    mode: 'auto',
  });

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState<OptimizeTarget | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Magic Edit State
  const [editMode, setEditMode] = useState<'background' | 'add' | 'remove' | null>(null);
  const [editInput, setEditInput] = useState("");

  const handleConfigChange = (key: keyof AdConfiguration, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setError(null);
    setIsGenerating(true);
    // Reset edit state when regenerating
    setEditMode(null);
    setEditInput("");
    
    try {
      if (!process.env.API_KEY) {
        throw new Error("API Key is missing in environment variables.");
      }
      const image = await generateAdvertisementImage(config);
      setGeneratedImage(image);
    } catch (err: any) {
      setError(err.message || "Failed to generate image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimize = async (target: OptimizeTarget) => {
    const text = target === 'product' ? config.productDescription : config.sceneDescription;
    if (!text) return;

    setIsOptimizing(target);
    try {
      const optimized = await optimizeTextPrompt(text, target);
      handleConfigChange(target === 'product' ? 'productDescription' : 'sceneDescription', optimized);
    } catch (err) {
      console.warn("Optimization failed", err);
    } finally {
      setIsOptimizing(null);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ad-genius-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMagicEdit = async () => {
    if (!generatedImage || !editInput || !editMode) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      let instruction = "";
      switch (editMode) {
        case 'background':
          instruction = `Change the background to ${editInput}. Keep the foreground objects unchanged and seamlessly integrated.`;
          break;
        case 'add':
          instruction = `Add ${editInput} to the image. Ensure realistic lighting, shadows, and perspective matching the scene.`;
          break;
        case 'remove':
          instruction = `Remove ${editInput} from the image. Inpaint the area naturally to match the surrounding background.`;
          break;
      }
      
      const newImage = await editGeneratedImage(generatedImage, instruction);
      setGeneratedImage(newImage);
      
      // Reset edit state
      setEditMode(null);
      setEditInput("");
    } catch (err: any) {
      setError(err.message || "Failed to edit image");
    } finally {
      setIsGenerating(false);
    }
  };

  const getEditPromptLabel = () => {
    switch(editMode) {
      case 'background': return "Describe new background";
      case 'add': return "What object to add?";
      case 'remove': return "What object to remove?";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Studio-Quality Ads in Seconds</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Upload your product, define the scene, and let our AI model photography engine generate professional marketing assets instantly.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT COLUMN: CONFIGURATION */}
          <div className="w-full lg:w-[400px] bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col gap-6 shrink-0">
            
            <div className="flex items-center gap-2 text-indigo-600 font-medium">
              <User className="w-5 h-5" />
              <h2>Configuration</h2>
            </div>

            {/* Mode Selection */}
            <div className="bg-gray-100 p-1 rounded-lg grid grid-cols-4 gap-1">
              {[
                { id: 'auto', label: 'Auto', icon: ScanFace },
                { id: 'object', label: 'Object', icon: Box },
                { id: 'garment', label: 'Wear', icon: ShoppingBag },
                { id: 'person', label: 'Life', icon: User },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleConfigChange('mode', m.id)}
                  className={`flex flex-col items-center justify-center gap-1 py-2 rounded-md transition-all text-[10px] font-medium ${
                    config.mode === m.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <m.icon className="w-4 h-4" />
                  {m.label}
                </button>
              ))}
            </div>

            {/* Upload Areas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Model Reference</span>
                <ImageUploader 
                  label="Upload Base" 
                  image={config.modelImage} 
                  onImageChange={(val) => handleConfigChange('modelImage', val)}
                  icon={<User className="w-6 h-6" />}
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Image</span>
                <ImageUploader 
                  label="Upload Product" 
                  image={config.productImage} 
                  onImageChange={(val) => handleConfigChange('productImage', val)}
                  icon={<ShoppingBag className="w-6 h-6" />}
                />
              </div>
            </div>

            {/* Product Description */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Product Description</label>
                <button 
                  onClick={() => handleOptimize('product')}
                  disabled={isOptimizing === 'product' || !config.productDescription}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 disabled:opacity-50"
                >
                  {isOptimizing === 'product' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Magic Optimize
                </button>
              </div>
              <textarea 
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-20"
                placeholder="e.g. A silver diamond necklace..."
                value={config.productDescription}
                onChange={(e) => handleConfigChange('productDescription', e.target.value)}
              />
            </div>

            {/* Brand Text */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Brand Text</label>
              <input 
                type="text"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="New Arrival"
                value={config.brandText}
                onChange={(e) => handleConfigChange('brandText', e.target.value)}
              />
            </div>

            {/* Aspect Ratio */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Aspect Ratio</label>
              <AspectRatioSelector 
                selected={config.aspectRatio} 
                onChange={(val) => handleConfigChange('aspectRatio', val)} 
              />
            </div>

            {/* Scene Description */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Scene Description</label>
                <button 
                  onClick={() => handleOptimize('scene')}
                  disabled={isOptimizing === 'scene' || !config.sceneDescription}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 disabled:opacity-50"
                >
                  {isOptimizing === 'scene' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Magic Optimize
                </button>
              </div>
              <textarea 
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24"
                placeholder="Describe the environment..."
                value={config.sceneDescription}
                onChange={(e) => handleConfigChange('sceneDescription', e.target.value)}
              />
            </div>

            {/* Action Button */}
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating && !editMode ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Asset...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Advertisement
                </>
              )}
            </button>
            
            {error && (
              <div className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
                {error}
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: PREVIEW & EDIT */}
          <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full min-h-[600px]">
             <div className="flex items-center gap-2 text-indigo-600 font-medium mb-4">
              <ImageIcon className="w-5 h-5" />
              <h2>Preview</h2>
            </div>
            
            {/* Image Preview Area */}
            <div className="flex-1 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group min-h-[400px]">
              {generatedImage ? (
                <>
                  <img 
                    src={generatedImage} 
                    alt="Generated Advertisement" 
                    className="max-w-full max-h-full object-contain shadow-2xl" 
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={handleDownload}
                       className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 text-slate-700 transition-colors"
                       title="Download Image"
                     >
                        <Download className="w-5 h-5" />
                     </button>
                     <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 text-slate-700 transition-colors">
                        <Share2 className="w-5 h-5" />
                     </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-600">Ready to create</h3>
                  <p className="text-sm">Upload images and define your scene to begin.</p>
                </div>
              )}
              
              {isGenerating && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-3">
                     <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                     <p className="text-indigo-900 font-medium animate-pulse">
                        {editMode ? 'Applying Magic Edit...' : 'Designing your ad...'}
                     </p>
                  </div>
                </div>
              )}
            </div>

            {/* Magic Edit Section */}
            <div className="mt-6 pt-6 border-t border-gray-100">
               <div className="flex items-center gap-2 text-indigo-600 font-medium mb-3">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-sm uppercase tracking-wide font-semibold">Magic Edit</h3>
              </div>
              
              {editMode ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-indigo-900">{getEditPromptLabel()}</span>
                    <button 
                      onClick={() => {
                        setEditMode(null);
                        setEditInput("");
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      autoFocus
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder={editMode === 'background' ? "e.g. a luxury penthouse" : (editMode === 'add' ? "e.g. a red rose" : "e.g. the chair")}
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleMagicEdit()}
                    />
                    <button 
                      onClick={handleMagicEdit}
                      disabled={!editInput.trim() || isGenerating}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      Apply <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setEditMode('background')}
                    disabled={!generatedImage || isGenerating}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-indigo-600 text-gray-500 transition-colors">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Change Background</span>
                  </button>

                  <button 
                    onClick={() => setEditMode('add')}
                    disabled={!generatedImage || isGenerating}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-indigo-600 text-gray-500 transition-colors">
                      <PlusCircle className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Add Object</span>
                  </button>

                  <button 
                    onClick={() => setEditMode('remove')}
                    disabled={!generatedImage || isGenerating}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-indigo-600 text-gray-500 transition-colors">
                      <Eraser className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Remove Object</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;