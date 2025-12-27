
import React from 'react';
import { Sparkles, LayoutTemplate, Image as ImageIcon, Wallet, Sun, Moon, Monitor, PenTool, LogIn, LogOut, Cloud } from 'lucide-react';
import { Theme, View, User } from '../types';

interface HeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  currentView: View;
  onViewChange: (view: View) => void;
  user: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onThemeChange, currentView, onViewChange, user, onLogout }) => {
  const navItemClass = (view: View) => `
    group text-sm font-semibold transition-all flex items-center gap-2 px-4 py-2.5 rounded-xl
    ${currentView === view 
      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 shadow-sm border border-indigo-100 dark:border-indigo-800' 
      : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent'}
  `;

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button onClick={() => onViewChange('generator')} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-slate-900 dark:text-white tracking-tighter leading-none">AdGenius AI</span>
              <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mt-0.5">Studio Edition</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1.5">
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
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full border border-green-100 dark:border-green-900/30">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Cloud Connected</span>
            <Cloud className="w-3 h-3" />
          </div>

          <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-2xl p-1 shadow-inner">
             <button 
              onClick={() => onThemeChange('light')}
              className={`p-2 rounded-xl transition-all ${theme === 'light' ? 'bg-white text-yellow-500 shadow-md' : 'text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
              title="Light Mode"
             >
               <Sun className="w-4 h-4" />
             </button>
             <button 
              onClick={() => onThemeChange('white')}
              className={`p-2 rounded-xl transition-all ${theme === 'white' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
              title="Clean White Mode"
             >
               <Monitor className="w-4 h-4" />
             </button>
             <button 
              onClick={() => onThemeChange('dark')}
              className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-700 text-indigo-400 shadow-md' : 'text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
              title="Dark Mode"
             >
               <Moon className="w-4 h-4" />
             </button>
          </div>
          
          <div className="pl-3 sm:pl-6 border-l border-gray-200 dark:border-slate-800">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[120px]">{user.email}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-sm shadow-md border border-white/20">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onViewChange('auth')}
                className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-2xl text-sm font-bold hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
