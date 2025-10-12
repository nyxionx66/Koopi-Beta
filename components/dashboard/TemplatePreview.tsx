'use client';

import React from 'react';
import { templates } from '@/lib/templates';

type TemplatePreviewProps = {
  templateId: keyof typeof templates;
  isSelected: boolean;
  onClick: () => void;
};

export function TemplatePreview({ templateId, isSelected, onClick }: TemplatePreviewProps) {
  const template = templates[templateId];

  return (
    <button
      onClick={onClick}
      className={`w-full p-2 border-2 rounded-lg transition-all ${
        isSelected ? 'border-gray-900 shadow-lg' : 'border-transparent hover:border-gray-300'
      }`}
    >
      <div 
        className="h-32 rounded-md flex flex-col justify-between p-3"
        style={{ 
          backgroundColor: template.theme.backgroundColor,
          fontFamily: template.theme.fontFamily,
        }}
      >
        <div className="flex justify-between items-start">
          <div className="w-8 h-3 rounded-full" style={{ backgroundColor: template.theme.textColor }}></div>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: template.theme.primaryColor }}></div>
        </div>
        <div className="space-y-1">
          <div className="w-3/4 h-3 rounded-full" style={{ backgroundColor: template.theme.textColor }}></div>
          <div className="w-1/2 h-2 rounded-full" style={{ backgroundColor: template.theme.textColor, opacity: 0.7 }}></div>
        </div>
      </div>
      <p className="text-sm font-medium capitalize mt-2">{templateId}</p>
    </button>
  );
}