import React from 'react';
import { AspectRatio } from '../types';
import { Square, Monitor, Smartphone, RectangleHorizontal, RectangleVertical } from 'lucide-react';

interface Props {
  selected: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
}

const ratios = [
  { value: AspectRatio.SQUARE, label: '1:1', sub: 'Square', icon: Square },
  { value: AspectRatio.LANDSCAPE, label: '16:9', sub: 'Landscape', icon: Monitor },
  { value: AspectRatio.PORTRAIT, label: '9:16', sub: 'Portrait', icon: Smartphone },
  { value: AspectRatio.STANDARD, label: '4:3', sub: 'Standard', icon: RectangleHorizontal },
  { value: AspectRatio.VERTICAL, label: '3:4', sub: 'Vertical', icon: RectangleVertical },
];

export const AspectRatioSelector: React.FC<Props> = ({ selected, onChange }) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {ratios.map((ratio) => (
        <button
          key={ratio.value}
          onClick={() => onChange(ratio.value)}
          className={`
            flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200
            ${selected === ratio.value 
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm' 
              : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800'}
          `}
        >
          <ratio.icon className={`w-4 h-4 mb-1 ${selected === ratio.value ? 'stroke-[2.5px]' : ''}`} />
          <span className="text-[10px] font-bold">{ratio.label}</span>
          <span className="text-[9px] opacity-75 hidden sm:block">{ratio.sub}</span>
        </button>
      ))}
    </div>
  );
};