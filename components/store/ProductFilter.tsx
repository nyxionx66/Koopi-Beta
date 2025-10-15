'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

type FilterProps = {
  theme: {
    primaryColor: string;
    accentColor: string;
    backgroundColor?: string;
    textColor: string;
    fontFamily?: string;
  };
  categories: string[];
  onFilterChange: (filters: FilterState) => void;
  totalProducts: number;
  filteredCount: number;
};

export type FilterState = {
  searchTerm: string;
  category: string;
  priceMin: string;
  priceMax: string;
  sortBy: string;
};

export function ProductFilter({ theme, categories, onFilterChange, totalProducts, filteredCount }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    category: '',
    priceMin: '',
    priceMax: '',
    sortBy: 'newest',
  });

  const [showFilters, setShowFilters] = useState(false);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const cleared: FilterState = {
      searchTerm: '',
      category: '',
      priceMin: '',
      priceMax: '',
      sortBy: 'newest',
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters = filters.searchTerm || filters.category || filters.priceMin || filters.priceMax;

  return (
    <div className="mb-6 sm:mb-8 space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
            style={{ color: theme.textColor, opacity: 0.5 }}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2"
            style={{
              backgroundColor: theme.backgroundColor || '#ffffff',
              color: theme.textColor,
              borderColor: theme.textColor + '20',
            }}
            onFocus={(e) => e.target.style.borderColor = theme.primaryColor}
            onBlur={(e) => e.target.style.borderColor = theme.textColor + '20'}
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border-2 font-medium transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: showFilters ? theme.primaryColor : (theme.backgroundColor || '#ffffff'),
            color: showFilters ? '#ffffff' : theme.textColor,
            borderColor: theme.primaryColor,
          }}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div 
          className="p-5 rounded-lg border-2 space-y-4 animate-in fade-in slide-in-from-top-2"
          style={{
            backgroundColor: theme.backgroundColor || '#ffffff',
            borderColor: theme.textColor + '20',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.textColor }}>
                Category
              </label>
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => updateFilters({ category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.backgroundColor || '#ffffff',
                    color: theme.textColor,
                    borderColor: theme.textColor + '30',
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.primaryColor}
                  onBlur={(e) => e.target.style.borderColor = theme.textColor + '30'}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: theme.textColor, opacity: 0.5 }}
                />
              </div>
            </div>

            {/* Price Min */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.textColor }}>
                Min Price
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.priceMin}
                onChange={(e) => updateFilters({ priceMin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: theme.backgroundColor || '#ffffff',
                  color: theme.textColor,
                  borderColor: theme.textColor + '30',
                }}
                onFocus={(e) => e.target.style.borderColor = theme.primaryColor}
                onBlur={(e) => e.target.style.borderColor = theme.textColor + '30'}
              />
            </div>

            {/* Price Max */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.textColor }}>
                Max Price
              </label>
              <input
                type="number"
                placeholder="Any"
                value={filters.priceMax}
                onChange={(e) => updateFilters({ priceMax: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: theme.backgroundColor || '#ffffff',
                  color: theme.textColor,
                  borderColor: theme.textColor + '30',
                }}
                onFocus={(e) => e.target.style.borderColor = theme.primaryColor}
                onBlur={(e) => e.target.style.borderColor = theme.textColor + '30'}
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.textColor }}>
                Sort By
              </label>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilters({ sortBy: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.backgroundColor || '#ffffff',
                    color: theme.textColor,
                    borderColor: theme.textColor + '30',
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.primaryColor}
                  onBlur={(e) => e.target.style.borderColor = theme.textColor + '30'}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
                <ChevronDown 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: theme.textColor, opacity: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-end pt-2">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: theme.textColor + '10',
                  color: theme.textColor,
                }}
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: theme.textColor, opacity: 0.7 }}>
          {filteredCount === totalProducts 
            ? `Showing all ${totalProducts} products` 
            : `Showing ${filteredCount} of ${totalProducts} products`
          }
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm font-medium underline hover:no-underline transition-all"
            style={{ color: theme.primaryColor }}
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
