import { Timestamp } from 'firebase/firestore';

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Promotion {
  id: string;
  storeId: string;
  code: string;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  applicationType: 'entire_order' | 'specific_products';
  applicableProductIds?: string[];
  conditions: {
    minPurchaseAmount?: number;
    startDate?: Timestamp;
    endDate?: Timestamp;
    maxTotalUses?: number;
    maxUsesPerCustomer?: number;
    newProductsOnly?: boolean;
  };
  currentUses: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}