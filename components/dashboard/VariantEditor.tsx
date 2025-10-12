'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

type Variant = {
  name: string;
  options: string[];
};

type VariantEditorProps = {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
};

export function VariantEditor({ variants, onChange }: VariantEditorProps) {
  const handleAddVariant = () => {
    onChange([...variants, { name: '', options: [''] }]);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    onChange(newVariants);
  };

  const handleVariantNameChange = (index: number, name: string) => {
    const newVariants = [...variants];
    newVariants[index].name = name;
    onChange(newVariants);
  };

  const handleOptionChange = (variantIndex: number, optionIndex: number, value: string) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options[optionIndex] = value;
    onChange(newVariants);
  };

  const handleAddOption = (variantIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options.push('');
    onChange(newVariants);
  };

  const handleRemoveOption = (variantIndex: number, optionIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options.splice(optionIndex, 1);
    onChange(newVariants);
  };

  return (
    <div className="space-y-4">
      {variants.map((variant, variantIndex) => (
        <div key={variantIndex} className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <input
              type="text"
              value={variant.name}
              onChange={(e) => handleVariantNameChange(variantIndex, e.target.value)}
              placeholder="Variant Name (e.g., Size)"
              className="w-full font-semibold border-b focus:outline-none"
            />
            <button onClick={() => handleRemoveVariant(variantIndex)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
          <div className="space-y-2">
            {variant.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(variantIndex, optionIndex, e.target.value)}
                  placeholder="Option (e.g., Small)"
                  className="w-full px-2 py-1 border rounded-md"
                />
                <button onClick={() => handleRemoveOption(variantIndex, optionIndex)}>
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
            <button onClick={() => handleAddOption(variantIndex)} className="text-sm text-blue-500 flex items-center gap-1">
              <Plus className="w-3 h-3" />
              Add Option
            </button>
          </div>
        </div>
      ))}
      <button onClick={handleAddVariant} className="w-full py-2 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 text-gray-500 hover:border-gray-400">
        <Plus className="w-4 h-4" />
        Add Variant
      </button>
    </div>
  );
}