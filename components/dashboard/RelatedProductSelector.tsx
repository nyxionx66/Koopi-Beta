'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { Product } from '@/types';
import { Check, Plus } from 'lucide-react';
import { InlineLoader } from '../ui/InlineLoader';

type RelatedProductSelectorProps = {
  selectedProducts: string[];
  onChange: (selectedProducts: string[]) => void;
};

export function RelatedProductSelector({ selectedProducts, onChange }: RelatedProductSelectorProps) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('storeId', '==', user.uid));
      const snapshot = await getDocs(q);
      const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (productId: string) => {
    const newSelection = selectedProducts.includes(productId)
      ? selectedProducts.filter(id => id !== productId)
      : [...selectedProducts, productId];
    onChange(newSelection);
  };

  if (loading) {
    return <InlineLoader message="Loading products..." primaryColor="#000000" size="sm" />;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Related Products</h3>
      <div className="grid grid-cols-3 gap-4">
        {products.map(product => (
          <button
            key={product.id}
            onClick={() => toggleProduct(product.id)}
            className={`p-2 border rounded-lg ${selectedProducts.includes(product.id) ? 'border-blue-500' : ''}`}
          >
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-24 object-cover rounded-md" />
            ) : (
              <div className="w-full h-24 bg-gray-100 rounded-md"></div>
            )}
            <p className="text-sm mt-2">{product.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}