"use client";

import { AlertTriangle } from 'lucide-react';

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
};

export default function ConfirmDialog({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmDialogProps) {
  const colors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-gray-900 hover:bg-gray-800'
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="backdrop-blur-2xl bg-white/80 rounded-[24px] border border-white/30 shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            type === 'danger' ? 'bg-red-100' : type === 'warning' ? 'bg-yellow-100' : 'bg-gray-100'
          }`}>
            <AlertTriangle className={`w-6 h-6 ${
              type === 'danger' ? 'text-red-600' : type === 'warning' ? 'text-yellow-600' : 'text-gray-600'
            }`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
        
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 rounded-full hover:bg-white transition-colors shadow-sm border border-gray-200/80"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-full transition-colors shadow-md ${colors[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}