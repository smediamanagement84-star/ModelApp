
import React, { useState } from 'react';
import { Model } from '../types';
import { User } from 'lucide-react';

interface ModelCardProps {
  model: Model;
  onClick?: () => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer flex flex-col"
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
        
        {/* Placeholder Icon */}
        <div className={`absolute inset-0 flex items-center justify-center text-gray-300 transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
          <User className="w-16 h-16 opacity-30" />
        </div>

        <img
          src={model.imageUrl}
          alt={model.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`relative z-10 w-full h-full object-cover transition-all duration-700 ease-out
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            group-hover:grayscale group-hover:scale-105
          `}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 z-10 transition-colors duration-300 pointer-events-none bg-black/0 group-hover:bg-black/10" />
      </div>
      <div className="pt-4 flex justify-between items-end">
        <div>
          <h3 className="font-serif text-xl text-black">{model.name}</h3>
          <p className="text-xs uppercase tracking-widest mt-1 text-gray-500">
            {model.role === 'Model' ? model.category : model.role}
          </p>
        </div>
        <div className="text-right">
           <p className="text-xs text-gray-400">{model.height ? `${model.height}cm` : ''}</p>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
