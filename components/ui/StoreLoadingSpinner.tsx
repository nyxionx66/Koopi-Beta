'use client';

import React from 'react';

type StoreLoadingSpinnerProps = {
  primaryColor?: string;
  backgroundColor?: string;
};

export function StoreLoadingSpinner({ primaryColor = '#000000', backgroundColor = '#ffffff' }: StoreLoadingSpinnerProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="flex items-center justify-center space-x-2">
        <div
          className="w-4 h-4 rounded-full animate-pulse"
          style={{ backgroundColor: primaryColor, animationDelay: '0s' }}
        ></div>
        <div
          className="w-4 h-4 rounded-full animate-pulse"
          style={{ backgroundColor: primaryColor, animationDelay: '0.2s' }}
        ></div>
        <div
          className="w-4 h-4 rounded-full animate-pulse"
          style={{ backgroundColor: primaryColor, animationDelay: '0.4s' }}
        ></div>
      </div>
    </div>
  );
}