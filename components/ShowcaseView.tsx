
import React, { useState } from 'react';
import { Heart, Share2, ZoomIn, X, ExternalLink, User, Tag, Calendar, LayoutGrid } from 'lucide-react';

interface ShowcaseItem {
  id: number;
  title: string;
  author: string;
  tags: string[];
  color: string;
  description: string;
  imageAlt: string;
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: 1,
    title: 'Neon Energy Drink',
    author: 'Studio X',
    tags: ['Beverage', 'Cyberpunk'],
    color: 'from-pink-500 to-purple-600',
    description: 'A vibrant energy drink commercial featuring high-contrast neon lighting and a futuristic aesthetic designed for Gen-Z engagement.',
    imageAlt: 'Vibrant neon beverage ad'
  },
  {
    id: 2,
    title: 'Eco Skincare',
    author: 'GreenLife',
    tags: ['Beauty', 'Nature'],
    color: 'from-green-400 to-teal-500',
    description: 'Clean, minimalist skincare line presented in a lush botanical garden with organic textures and soft natural morning light.',
    imageAlt: 'Natural skincare product in garden'
  },
  {
    id: 3,
    title: 'Urban Sneaker',
    author: 'KicksDaily',
    tags: ['Fashion', 'Street'],
    color: 'from-orange-400 to-red-500',
    description: 'High-performance footwear showcased on a gritty urban asphalt with dynamic motion blur and high-speed energy.',
    imageAlt: 'Athletic footwear on city street'
  },
  {
    id: 4,
    title: 'Luxury Watch',
    author: 'Timepiece Co.',
    tags: ['Accessories', 'Premium'],
    color: 'from-slate-700 to-slate-900',
    description: 'Exquisite horology captured with macro photography on a dark obsidian surface, highlighting every polished gear and surface.',
    imageAlt: 'Premium watch macro shot'
  },
  {
    id: 5,
    title: 'Summer Collection',
    author: 'Vogue AI',
    tags: ['Apparel', 'Summer'],
    color: 'from-yellow-400 to-orange-500',
    description: 'A light and airy fashion spread featuring linen garments in a sun-drenched Mediterranean villa setting.',
    imageAlt: 'Summer fashion lifestyle shot'
  },
  {
    id: 6,
    title: 'Tech Headphones',
    author: 'AudioLab',
    tags: ['Electronics', 'Studio'],
    color: 'from-blue-500 to-indigo-600',
    description: 'Pro-grade studio headphones depicted with clean lines and soft rim lighting in a minimal contemporary studio environment.',
    imageAlt: 'Professional audio headphones ad'
  },
];

export const ShowcaseView: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);

  const handleOpenModal = (item: ShowcaseItem) => {
    console.log("Opening details for:", item.title);
    setSelectedItem(item);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-widest mb-3">
            <LayoutGrid className="w-4 h-4" />
            Curated Gallery
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Made with AdGenius</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Explore a gallery of stunning, high-conversion advertisements generated entirely by our AI model engine.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
            <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold">Featured</button>
            <button className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors">Latest</button>
            <button className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors">Popular</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {showcaseItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleOpenModal(item)}
            className="group relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-md hover:shadow-2xl cursor-pointer transform transition-all duration-500 hover:-translate-y-2 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50"
          >
            {/* Image Placeholder with Gradient */}
            <div className={`aspect-[4/3] bg-gradient-to-br ${item.color} relative overflow-hidden`}>
                <div className="absolute inset-0 flex items-center justify-center opacity-20 mix-blend-overlay scale-150 transition-transform duration-700 group-hover:scale-110">
                    <span className="text-[120px] font-black text-white select-none">AI</span>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[9px] bg-white/30 backdrop-blur-md text-white px-2 py-1 rounded-lg border border-white/20 uppercase font-bold tracking-tighter">
                        {tag}
                      </span>
                    ))}
                </div>
            </div>

            {/* Content Info */}
            <div className="p-6 bg-white dark:bg-slate-900 transition-colors duration-300">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                    <div className="flex gap-1">
                        <Heart className="w-4 h-4 text-slate-300 dark:text-slate-700 hover:text-red-500 transition-colors cursor-pointer" />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                   <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <User className="w-3 h-3" />
                   </div>
                   <span>{item.author}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">View Details</span>
                    <ZoomIn className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setSelectedItem(null)}></div>
          
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-in zoom-in-95 duration-400 border border-white/10">
            <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 z-20 p-2 bg-black/20 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all duration-200"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Visual Section */}
            <div className={`w-full lg:w-3/5 bg-gradient-to-br ${selectedItem.color} flex items-center justify-center min-h-[350px] lg:min-h-[600px] relative`}>
                 <span className="text-[180px] font-black text-white opacity-20 select-none">AI</span>
                 <div className="absolute bottom-10 left-10 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 text-white max-w-xs hidden sm:block">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Generated Sample</p>
                    <p className="text-sm font-medium leading-relaxed">Generated using the "Studio Pro" engine with 8K Cinematic textures.</p>
                 </div>
            </div>

            {/* Details Section */}
            <div className="w-full lg:w-2/5 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-slate-900">
                <div className="mb-8">
                    <div className="flex gap-2 mb-4">
                        {selectedItem.tags.map(tag => (
                          <span key={tag} className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800 uppercase font-bold tracking-widest">
                            {tag}
                          </span>
                        ))}
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">{selectedItem.title}</h3>
                    
                    <div className="space-y-5 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Created by</p>
                                <p className="text-base font-bold text-slate-900 dark:text-white">{selectedItem.author}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Date Generated</p>
                                <p className="text-base font-bold text-slate-900 dark:text-white">Oct 24, 2024</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-[24px] border border-gray-100 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">AI Analysis</h4>
                        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            {selectedItem.description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-[0.98]">
                        <ExternalLink className="w-5 h-5" /> Load Preset
                    </button>
                    <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-2xl transition-all flex items-center justify-center">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
