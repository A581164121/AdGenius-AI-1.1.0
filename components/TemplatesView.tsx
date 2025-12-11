import React from 'react';
import { AdConfiguration, Template } from '../types';
import { ArrowRight, FileJson } from 'lucide-react';
import { AD_TEMPLATES } from '../data/templates';

interface TemplatesViewProps {
  onSelectTemplate: (config: Partial<AdConfiguration>) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onSelectTemplate }) => {
  
  const downloadTemplateJson = (template: Template, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(template, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${template.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Start with a Professional Template</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Choose from our curated collection of high-converting ad layouts. Click any template to load it into the generator.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {AD_TEMPLATES.map((template) => (
          <div 
            key={template.id}
            className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 flex flex-col h-full cursor-pointer"
            onClick={() => onSelectTemplate(template.config)}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-4 rounded-xl ${template.color} transition-transform group-hover:scale-110 duration-300 shrink-0`}>
                <template.icon className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 truncate">{template.title}</h3>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium border border-gray-200 dark:border-slate-700">
                    {template.config.aspectRatio}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium capitalize border border-gray-200 dark:border-slate-700">
                    {template.config.mode}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed flex-1 line-clamp-3">
              {template.description}
            </p>
            
            <div className="flex gap-2 mt-auto">
              <button 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                Use <ArrowRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={(e) => downloadTemplateJson(template, e)}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 p-2 rounded-lg transition-colors"
                title="Download Template JSON"
              >
                <FileJson className="w-5 h-5" />
              </button>
            </div>
            
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-bl-full -z-10" />
          </div>
        ))}
      </div>
    </div>
  );
};