import React from 'react';
import type { BonsaiStyle } from '../types';

interface StyleSelectorProps {
  value: BonsaiStyle;
  onChange: (style: BonsaiStyle) => void;
}

const STYLE_DETAILS = [
  {
    style: 'Chokkan',
    image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=300',
    description: 'Formal upright style with straight trunk'
  },
  {
    style: 'Moyogi',
    image: 'https://images.unsplash.com/photo-1611171711810-bd87831ade4c?w=300',
    description: 'Informal upright with curved trunk'
  },
  {
    style: 'Shakan',
    image: 'https://images.unsplash.com/photo-1610123172763-1f587473048f?w=300',
    description: 'Slanting style, trunk grows at an angle'
  },
  {
    style: 'Kengai',
    image: 'https://images.unsplash.com/photo-1612911969147-76f87ed6d91f?w=300',
    description: 'Cascade style, grows downward below pot base'
  },
  {
    style: 'Han-Kengai',
    image: 'https://images.unsplash.com/photo-1604507981841-37a7d0c522f2?w=300',
    description: 'Semi-cascade, grows downward but not below pot'
  },
  {
    style: 'Multiple Trunk',
    image: 'https://images.unsplash.com/photo-1620148639493-5a7cc139813d?w=300',
    description: 'Several trunks growing from one root system'
  },
  {
    style: 'Forest',
    image: 'https://images.unsplash.com/photo-1624508015916-d5c3cdc6dacd?w=300',
    description: 'Group of trees planted together'
  }
] as const;

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  const handleStyleClick = (e: React.MouseEvent, style: BonsaiStyle) => {
    e.preventDefault(); // Prevent form submission
    onChange(style);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {STYLE_DETAILS.map((style) => (
        <button
          key={style.style}
          type="button" // Explicitly set button type to prevent form submission
          onClick={(e) => handleStyleClick(e, style.style)}
          className={`relative group overflow-hidden rounded-lg border-2 transition-all ${
            value === style.style
              ? 'border-bonsai-green ring-2 ring-bonsai-green ring-offset-2'
              : 'border-transparent hover:border-bonsai-green/50'
          }`}
        >
          <div className="aspect-square">
            <img
              src={style.image}
              alt={style.style}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex flex-col justify-end">
            <h4 className="text-white font-medium">{style.style}</h4>
            <p className="text-white/80 text-sm line-clamp-2">
              {style.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}