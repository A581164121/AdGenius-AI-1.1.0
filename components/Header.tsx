import React from 'react';
import { Sparkles, LayoutTemplate, Image as ImageIcon, Wallet } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">AdGenius AI</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4" /> Templates
          </a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Showcase
          </a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2">
            <Wallet className="w-4 h-4" /> Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};