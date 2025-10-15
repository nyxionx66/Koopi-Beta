export type Product = {
  id: string;
  name: string;
  title?: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  status: string;
  images?: string[];
  imageUrls?: string[];
  mediaUrls?: string[];
  type?: string;
  vendor?: string;
  category?: string;
  tags?: string[];
  inventory?: number;
  quantity?: number;
  inventoryTracked?: boolean;
  rating?: number;
  averageRating?: number;
  reviewCount?: number;
  reviews?: Review[];
  variants?: {
    name: string;
    options: { value: string }[];
  }[];
  variantStock?: { [key: string]: number };
  relatedProducts?: string[];
  storeId?: string;
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
};

export type Review = {
  id: string;
  productId: string;
  storeId: string;
  buyerId?: string;
  buyerEmail: string;
  buyerName: string;
  rating: number;
  comment: string;
  helpful: number;
  verified: boolean;
  verifiedPurchase?: boolean; // True if buyer purchased and received the product
  createdAt: any;
  updatedAt?: any;
};

export type Theme = {
  primaryColor: string;
  accentColor: string;
  backgroundColor?: string;
  textColor: string;
  fontFamily?: string;
};

export type StoreData = {
  storeName: string;
  storeDescription: string;
  storeCategory: string;
  ownerId: string;
  website?: {
    enabled: boolean;
    logo?: string;
    hero: {
      title: string;
      subtitle: string;
      ctaText: string;
      backgroundImage?: string;
      alignment?: 'left' | 'center';
    };
    theme: Theme;
    about?: {
      show: boolean;
      title: string;
      content: string;
    };
    footer?: {
      text: string;
      showPoweredBy: boolean;
    };
    sectionOrder?: string[];
    templateId?: string;
  };
};
export type Order = {
  id: string;
  orderNumber: string;
  status: string;
  storeName: string;
  storeId: string;
  buyerId: string;
  buyerEmail: string;
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    variant?: { [key: string]: string };
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  isGuest?: boolean;
  createdAt: any;
  updatedAt: any;
};
export type UserProfile = {
  uid: string;
  email: string;
  name?: string;
  storeName?: string;
  storeLogoUrl?: string;
  subscriptionTier?: 'free' | 'pro';
  hasClaimedProOffer?: boolean;
  subscription?: {
    plan: 'free' | 'pro';
    status: 'active' | 'trialing' | 'cancelled';
    productCount: number;
    productLimit: number;
    trialEndDate?: any;
  };
  onboarding?: {
    isCompleted?: boolean;
  };
};

export type Notification = {
  id: string;
  userId: string;
  storeId: string;
  type: 'LOW_STOCK_PRODUCT' | 'LOW_STOCK_VARIANT';
  message: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  remainingStock: number;
  isRead: boolean;
  createdAt: any;
  link?: string;
};
