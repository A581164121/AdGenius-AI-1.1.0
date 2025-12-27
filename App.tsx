
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { AdConfiguration, AspectRatio, OptimizeTarget, Theme, View, User } from './types';
import { generateAdvertisementImage, optimizeTextPrompt, editGeneratedImage } from './services/geminiService';
import { Wand2, User as UserIcon, ShoppingBag, Box, Loader2, Sparkles, Download, Share2, Image as ImageIcon, Eraser, PlusCircle, ArrowRight, X, ScanFace, Type } from 'lucide-react';
import { TemplatesView } from './components/TemplatesView';
import { ShowcaseView } from './components/ShowcaseView';
import { PricingView } from './components/PricingView';
import { AuthView } from './components/AuthView';

function App() {
  const [config, setConfig] = useState<AdConfiguration>({
    modelImage: null,
    productImage: null,
    productDescription: "",
    brandText: "",
    creativeText: {
      textContent: "",
      fontStyle: "Bold Sans",
      textSize: "Medium",
      textColor: "White",
      textPosition: "Bottom Center",
      textShadow: "Soft Shadow",
      backgroundBlur: "None"
    },
    sceneDescription: "A confident young professional standing in a modern, sunlit city street.",
    aspectRatio: AspectRatio.SQUARE,
    mode: 'auto',
  });

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState<OptimizeTarget | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [theme, setTheme] = useState<Theme>('light');
  const [currentView, setCurrentView] = useState<View>('generator');
  const [user, setUser] = useState<User | null>(null);

  const [editMode, setEditMode] = useState<'background' | 'add' | 'remove' | null>(null);
  const [editInput, setEditInput] = useState("");

  const handleViewChange = (view: View) => {
    console.log(`[Navigation] Switching view to: ${view}`);
    setCurrentView(view);
    // Smooth scroll to top when changing views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfigChange = (key: keyof AdConfiguration, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleCreativeTextChange = (key: keyof AdConfiguration['creativeText'], value: string) => {
    setConfig(prev => ({
      ...prev,
      creativeText: {
        ...prev.creativeText,
        [key]: value
      }
    }));
  };

  const handleTemplateSelect = (templateConfig: Partial<AdConfiguration>) => {
    setConfig(prev => ({ ...prev, ...templateConfig }));
    handleViewChange('generator');
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    handleViewChange('generator');
  };

  const handleLogout = () => {
    setUser(null);
    handleViewChange('auth');
  };

  const handleGenerate = async () => {
    setError(null);
    setIsGenerating(true);
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

  const getMainBackground = () => {
    if (theme === 'dark') return 'bg-slate-950 text-white';
    if (theme === 'white') return 'bg-white text-slate-900';
    return 'bg-gray-50 text-slate-900';
  };

  const isGenerateDisabled = isGenerating || (!config.modelImage || !config.productImage);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${getMainBackground()} ${theme === 'dark' ? 'dark' : ''}`}>
      <Header 
        theme={theme} 
        onThemeChange={setTheme} 
        currentView={currentView}
        onViewChange={handleViewChange}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        {currentView === 'auth' && <AuthView onLogin={handleLogin} />}

        {currentView === 'generator' && (
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="mb-10">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Design Studio</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Craft studio-quality advertisement assets using professional AI photography.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Configuration Section */}
              <div className="w-full lg:w-[400px] bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 p-6 flex flex-col gap-6 shrink-0 transition-all">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-xs tracking-widest">
                  <UserIcon className="w-4 h-4" />
                  <h2>Workspace Settings</h2>
                </div>

                <div className="bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl grid grid-cols-4 gap-1">
                  {[
                    { id: 'auto', label: 'Auto', icon: ScanFace },
                    { id: 'object', label: 'Object', icon: Box },
                    { id: 'garment', label: 'Wear', icon: ShoppingBag },
                    { id: 'person', label: 'Life', icon: UserIcon },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleConfigChange('mode', m.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all text-[10px] font-bold ${
                        config.mode === m.id 
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md' 
                          : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <m.icon className="w-4 h-4" />
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Subject</span>
                    <ImageUploader 
                      label="Upload Model" 
                      image={config.modelImage} 
                      onImageChange={(val) => handleConfigChange('modelImage', val)}
                      icon={<UserIcon className="w-6 h-6" />}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Product</span>
                    <ImageUploader 
                      label="Upload Item" 
                      image={config.productImage} 
                      onImageChange={(val) => handleConfigChange('productImage', val)}
                      icon={<ShoppingBag className="w-6 h-6" />}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Product Details</label>
                    <button 
                      onClick={() => handleOptimize('product')}
                      disabled={isOptimizing === 'product' || !config.productDescription}
                      className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-lg font-bold flex items-center gap-1 disabled:opacity-50"
                    >
                      {isOptimizing === 'product' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Optimize
                    </button>
                  </div>
                  <textarea 
                    className="w-full border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24 placeholder-gray-400 dark:placeholder-slate-600 transition-all"
                    placeholder="Describe your product (e.g., A gold watch...)"
                    value={config.productDescription}
                    onChange={(e) => handleConfigChange('productDescription', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Brand Caption</label>
                  <input 
                    type="text"
                    className="w-full border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder-gray-400 dark:placeholder-slate-600 transition-all"
                    placeholder="e.g., Elegance Redefined"
                    value={config.brandText}
                    onChange={(e) => handleConfigChange('brandText', e.target.value)}
                  />
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerateDisabled}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2"
                >
                  {isGenerating && !editMode ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate Advertisement
                    </>
                  )}
                </button>
                
                {error && (
                  <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                    <X className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}
              </div>

              {/* Preview Section */}
              <div className="flex-1 w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 p-6 flex flex-col h-full min-h-[700px] transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-xs tracking-widest">
                    <ImageIcon className="w-4 h-4" />
                    <h2>Studio Canvas</h2>
                  </div>
                  {generatedImage && (
                    <div className="flex gap-2">
                       <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors">
                          <Download className="w-4 h-4" /> Export
                       </button>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 bg-gray-50 dark:bg-slate-950 rounded-3xl border-2 border-dashed border-gray-100 dark:border-slate-800 flex items-center justify-center overflow-hidden relative group">
                  {generatedImage ? (
                    <img 
                      src={generatedImage} 
                      alt="Generated" 
                      className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]" 
                    />
                  ) : (
                    <div className="flex flex-col items-center text-center px-6">
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm mb-6">
                        <Sparkles className="w-12 h-12 text-indigo-200 dark:text-indigo-900" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Canvas Empty</h3>
                      <p className="text-slate-400 max-w-xs text-sm">Fill in your subject and product details on the left to start the magic.</p>
                    </div>
                  )}
                  
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl flex items-center justify-center z-20">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                           <div className="w-16 h-16 border-4 border-indigo-100 dark:border-slate-800 rounded-full animate-pulse"></div>
                           <div className="absolute inset-0 w-16 h-16 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-indigo-900 dark:text-indigo-300 font-black uppercase text-xs tracking-[0.2em]">
                            {editMode ? 'Processing Edit' : 'Crafting Masterpiece'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest mb-6">
                    <Sparkles className="w-4 h-4" />
                    <h2>AI Magic Tools</h2>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                      {['background', 'add', 'remove'].map((type) => (
                        <button 
                          key={type}
                          onClick={() => setEditMode(type as any)}
                          disabled={!generatedImage || isGenerating}
                          className="flex flex-col items-center gap-3 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:border-indigo-100 transition-all group disabled:opacity-40"
                        >
                          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             {type === 'background' ? <ImageIcon className="w-5 h-5" /> : type === 'add' ? <PlusCircle className="w-5 h-5" /> : <Eraser className="w-5 h-5" />}
                          </div>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white capitalize">{type} Object</span>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {currentView === 'templates' && <TemplatesView onSelectTemplate={handleTemplateSelect} />}
        {currentView === 'showcase' && <ShowcaseView />}
        {currentView === 'pricing' && <PricingView />}
      </div>
      
      {/* Edit Modal Overlay */}
      {editMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white capitalize">Magic {editMode}</h3>
                    <button onClick={() => {setEditMode(null); setEditInput("")}} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                <p className="text-sm text-slate-500 mb-6">{getEditPromptLabel()}</p>
                <input 
                    type="text" 
                    autoFocus
                    className="w-full border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-6 transition-all"
                    placeholder="e.g., a modern luxury loft"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMagicEdit()}
                />
                <button 
                    onClick={handleMagicEdit}
                    disabled={!editInput.trim() || isGenerating}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    Apply Transformation <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
}

export default App;
