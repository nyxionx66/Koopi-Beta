export type Product = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  status: string;
  images?: string[];
  type?: string;
  vendor?: string;
  category?: string;
  tags?: string[];
  inventory?: number;
  rating?: number;
  variants?: {
    name: string;
    options: string[];
  }[];
  reviews?: {
    id: string;
    author: string;
    rating: number;
    comment: string;
    createdAt: any;
  }[];
  relatedProducts?: string[];
};

export type Theme = {
  primaryColor: string;
  accentColor: string;
  backgroundColor?: string;
  textColor?: string;
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
  storeId?: string;
  buyerId?: string;
  buyerEmail: string;
  isGuest: boolean;
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
  createdAt: any;
  updatedAt: any;
};