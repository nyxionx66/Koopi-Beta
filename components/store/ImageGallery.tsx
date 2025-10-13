'use client';

import React, { useState } from 'react';
import { Package } from 'lucide-react';

type ImageGalleryProps = {
  images: string[];
  productName: string;
};

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-white/50 rounded-xl flex items-center justify-center border border-gray-200/50">
        <Package className="w-24 h-24 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-white/50 rounded-xl overflow-hidden border border-gray-200/50 shadow-inner">
        <img
          src={images[selectedImage]}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`aspect-square bg-white/50 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === idx ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-transparent hover:border-gray-300/50'
              }`}
            >
              <img src={img} alt={`${productName} ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}