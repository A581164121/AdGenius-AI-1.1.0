
import React, { useState } from 'react';
import { Heart, Share2, ZoomIn, X, ExternalLink, User, Tag, Calendar } from 'lucide-react';

interface ShowcaseItem {
  id: number;
  title: string;
  author: string;
  tags: string[];
  color: string;
  height: string;
  description?: string;
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: 1,
    title: 'Neon Energy Drink',
    author: 'Studio X',
    tags: ['Beverage', 'Cyberpunk'],
    color: 'from-pink-500 to-purple-600',
    height: 'h-64',
    description: 'A vibrant energy drink commercial featuring high-contrast neon lighting and a futuristic aesthetic.'
  },
  {
    id: 2,
    title: 'Eco Skincare',
    author: 'GreenLife',
    tags: ['Beauty', 'Nature'],
    color: 'from-green-400 to-teal-500',
    height: 'h-96',
    description: 'Clean, minimalist skincare line presented in a lush botanical garden with organic textures.'
  },
  {
    id: 3,
    title: 'Urban Sneaker',
    author: 'KicksDaily',
    tags: ['Fashion', 'Street'],
    color: 'from-orange-400 to-red-500',
    height: 'h-80',
    description: 'High-performance footwear showcased on a gritty urban asphalt with dynamic motion blur.'
  },
  {
    id: 4,
    title: 'Luxury Watch',
    author: 'Timepiece Co.',
    tags: ['Accessories', 'Premium'],
    color: 'from-slate-700 to-slate-900',
    height: 'h-72',
    description: 'Exquisite horology captured with macro photography on a dark obsidian surface.'
  },
  {
    id: 5,
    title: 'Summer Collection',
    author: 'Vogue AI',
    tags: ['Apparel', 'Summer'],
    color: 'from-yellow-400 to-orange-500',
    height: 'h-80',
    description: 'A light and airy fashion spread featuring linen garments in a sun-drenched Mediterranean villa.'
  },
  {
    id: 6,
    title: 'Tech Headphones',
    author: 'AudioLab',
    tags: ['Electronics', 'Studio'],
    color: 'from-blue-500 to-indigo-600',
    height: 'h-64',
    description: 'Pro-grade studio headphones depicted with clean lines and soft rim lighting in a minimal studio.'
  },
];

export const ShowcaseView: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Made with AdGenius</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Explore what's possible. A gallery of stunning advertisements generated entirely by our AI.
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {showcaseItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedItem(item)}
            className={`break-inside-avoid relative group rounded-2xl overflow-hidden bg-gradient-to-br ${item.color} ${item.height} shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
          >
            {/* Simulated Image Content */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-overlay">
                <span className="text-9xl font-black text-white select-none">AI</span>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col justify-end p-6">
              <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                <p className="text-white/80 text-sm mb-3 flex items-center gap-1">
                   <User className="w-3 h-3" /> by {item.author}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-full border border-white/10 uppercase tracking-tight">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-colors backdrop-blur-md">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-colors backdrop-blur-md">
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setSelectedItem(null)}></div>
          
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Image Section */}
            <div className={`w-full md:w-3/5 bg-gradient-to-br ${selectedItem.color} flex items-center justify-center min-h-[300px] md:min-h-[500px]`}>
                 <span className="text-[150px] font-black text-white opacity-20 select-none">AI</span>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-2/5 p-8 flex flex-col">
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">
                        <Tag className="w-3 h-3" />
                        {selectedItem.tags.join(' • ')}
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{selectedItem.title}</h3>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Created by</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedItem.author}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Date Generated</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">October 24, 2024</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-8">
                        <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                            "{selectedItem.description}"
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                        <ExternalLink className="w-4 h-4" /> Open In Studio
                    </button>
                    <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-3 rounded-xl transition-all">
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
