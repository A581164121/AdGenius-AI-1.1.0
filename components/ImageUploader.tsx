import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  image: string | null;
  onImageChange: (base64: string | null) => void;
  icon?: React.ReactNode;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onImageChange, icon }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`
          relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 h-32 flex flex-col items-center justify-center text-center cursor-pointer group
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-slate-800'}
          ${image ? 'bg-gray-50 dark:bg-slate-800' : 'bg-white dark:bg-slate-900'}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !image && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />

        {image ? (
          <div className="relative w-full h-full">
            <img src={image} alt="Upload" className="w-full h-full object-contain rounded-lg" />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onImageChange(null);
              }}
              className="absolute -top-2 -right-2 bg-white dark:bg-slate-700 rounded-full p-1 shadow-md border border-gray-100 dark:border-slate-600 text-gray-500 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="text-gray-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
              {icon || <Upload className="w-6 h-6" />}
            </div>
            <p className="text-xs font-medium text-gray-500 dark:text-slate-400">{label}</p>
          </div>
        )}
      </div>
    </div>
  );
};