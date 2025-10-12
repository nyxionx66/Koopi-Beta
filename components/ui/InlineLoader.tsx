'use client';

import React from 'react';
import { UniversalLoader } from './UniversalLoader';

type InlineLoaderProps = {
  message?: string;
  primaryColor?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function InlineLoader({ 
  message = '', 
  primaryColor = '#000000',
  size = 'sm'
}: InlineLoaderProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <UniversalLoader 
        size={size}
        primaryColor={primaryColor}
        message={message}
      />
    </div>
  );
}