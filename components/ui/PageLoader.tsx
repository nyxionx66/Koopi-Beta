'use client';

import React from 'react';
import { UniversalLoader } from './UniversalLoader';

type PageLoaderProps = {
  message?: string;
  primaryColor?: string;
  backgroundColor?: string;
};

export function PageLoader({ 
  message = 'Loading...', 
  primaryColor = '#000000',
  backgroundColor = '#ffffff'
}: PageLoaderProps) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <UniversalLoader 
        size="lg"
        primaryColor={primaryColor}
        backgroundColor={backgroundColor}
        message={message}
      />
    </div>
  );
}