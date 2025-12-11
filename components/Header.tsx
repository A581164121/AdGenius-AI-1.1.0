import React from 'react';
import { Sparkles, LayoutTemplate, Image as ImageIcon, Wallet, Sun, Moon, Monitor, PenTool } from 'lucide-react';
import { Theme, View } from '../types';

interface HeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onThemeChange, currentView, onViewChange }) => {
  const navItemClass = (view: View) => `
    text-sm font-medium transition-colors flex items-center gap-2 px-3 py-2 rounded-lg
    ${currentView === view 
      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800'}
  `;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button onClick={() => onViewChange('generator')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">AdGenius AI</span>
        </button>

        <nav className="hidden md:flex items-center gap-2">
          <button onClick={() => onViewChange('generator')} className={navItemClass('generator')}>
            <PenTool className="w-4 h-4" /> Create
          </button>
          <button onClick={() => onViewChange('templates')} className={navItemClass('templates')}>
            <LayoutTemplate className="w-4 h-4" /> Templates
          </button>
          <button onClick={() => onViewChange('showcase')} className={navItemClass('showcase')}>
            <ImageIcon className="w-4 h-4" /> Showcase
          </button>
          <button onClick={() => onViewChange('pricing')} className={navItemClass('pricing')}>
            <Wallet className="w-4 h-4" /> Pricing
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-full p-1">
             <button 
              onClick={() => onThemeChange('light')}
              className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white text-yellow-500 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
              title="Light Mode"
             >
               <Sun className="w-4 h-4" />
             </button>
             <button 
              onClick={() => onThemeChange('white')}
              className={`p-1.5 rounded-full transition-all ${theme === 'white' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
              title="Clean White Mode"
             >
               <Monitor className="w-4 h-4" />
             </button>
             <button 
              onClick={() => onThemeChange('dark')}
              className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-slate-700 text-indigo-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
              title="Dark Mode"
             >
               <Moon className="w-4 h-4" />
             </button>
          </div>
          
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-transparent dark:border-indigo-800">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};