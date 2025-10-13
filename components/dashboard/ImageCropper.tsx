'use client';

import { useState, useRef } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

type ImageCropperProps = {
  src: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onClose: () => void;
};

export function ImageCropper({ src, onCropComplete, onClose }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
  const imgRef = useRef<HTMLImageElement>(null);

  const getCroppedImg = () => {
    if (!imgRef.current || !crop.width || !crop.height) {
      return;
    }

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.drawImage(
      imgRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  };

  const handleCrop = async () => {
    const croppedImageUrl = await getCroppedImg();
    if (croppedImageUrl) {
      onCropComplete(croppedImageUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg">
        <ReactCrop crop={crop} onChange={c => setCrop(c)}>
          <img ref={imgRef} src={src} />
        </ReactCrop>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200">Cancel</button>
          <button onClick={handleCrop} className="px-4 py-2 rounded-lg bg-blue-500 text-white">Crop</button>
        </div>
      </div>
    </div>
  );
}