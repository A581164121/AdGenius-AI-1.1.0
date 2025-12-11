import React from 'react';
import { Heart, Share2, ZoomIn } from 'lucide-react';

const showcaseItems = [
  {
    id: 1,
    title: 'Neon Energy Drink',
    author: 'Studio X',
    tags: ['Beverage', 'Cyberpunk'],
    color: 'from-pink-500 to-purple-600',
    height: 'h-64',
  },
  {
    id: 2,
    title: 'Eco Skincare',
    author: 'GreenLife',
    tags: ['Beauty', 'Nature'],
    color: 'from-green-400 to-teal-500',
    height: 'h-96',
  },
  {
    id: 3,
    title: 'Urban Sneaker',
    author: 'KicksDaily',
    tags: ['Fashion', 'Street'],
    color: 'from-orange-400 to-red-500',
    height: 'h-80',
  },
  {
    id: 4,
    title: 'Luxury Watch',
    author: 'Timepiece Co.',
    tags: ['Accessories', 'Premium'],
    color: 'from-slate-700 to-slate-900',
    height: 'h-72',
  },
  {
    id: 5,
    title: 'Summer Collection',
    author: 'Vogue AI',
    tags: ['Apparel', 'Summer'],
    color: 'from-yellow-400 to-orange-500',
    height: 'h-80',
  },
  {
    id: 6,
    title: 'Tech Headphones',
    author: 'AudioLab',
    tags: ['Electronics', 'Studio'],
    color: 'from-blue-500 to-indigo-600',
    height: 'h-64',
  },
];

export const ShowcaseView: React.FC = () => {
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
            className={`break-inside-avoid relative group rounded-2xl overflow-hidden bg-gradient-to-br ${item.color} ${item.height} shadow-lg`}
          >
            {/* Simulated Image Content */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-overlay">
                <span className="text-9xl font-black text-white select-none">AI</span>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col justify-end p-6">
              <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-white font-bold text-lg">{item.title}</h3>
                <p className="text-white/80 text-sm mb-3">by {item.author}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-xs bg-white/20 backdrop-blur-md text-white px-2 py-1 rounded-full">
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
    </div>
  );
};