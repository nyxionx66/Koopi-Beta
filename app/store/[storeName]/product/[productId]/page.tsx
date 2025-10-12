"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { Package, ShoppingCart, ArrowLeft, Star, Check, User } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useBuyerAuth } from '@/contexts/BuyerAuthContext';
import Cart from '@/components/Cart';
import CartIcon from '@/components/CartIcon';
import { useStore } from '@/contexts/StoreContext';
import { ClassicProductLayout } from '@/components/store/templates/ClassicProductLayout';
import { ModernProductLayout } from '@/components/store/templates/ModernProductLayout';
import { MinimalistProductLayout } from '@/components/store/templates/MinimalistProductLayout';
import { BoldProductLayout } from '@/components/store/templates/BoldProductLayout';
import { Product } from '@/types';
import { PageLoader } from '@/components/ui/PageLoader';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storeName = params.storeName as string;
  const productId = params.productId as string;
  const { storeData: store, loading: storeLoading } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();
  const { buyer, buyerProfile } = useBuyerAuth();

  useEffect(() => {
    if (store && productId) {
      fetchProduct();
    }
  }, [store, productId]);

  // Set page title dynamically
  useEffect(() => {
    if (product && store) {
      document.title = `${product.name} - ${store.storeName}`;
    }
  }, [product, store]);

  const fetchProduct = async () => {
    if (!store) return;
    try {
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (productDoc.exists() && productDoc.data().storeId === store.ownerId) {
        const productData = { id: productDoc.id, ...productDoc.data() } as Product;
        setProduct(productData);
        
        // Initialize selected variants if product has variants
        if (productData.variants && productData.variants.length > 0) {
          const initialVariants: { [key: string]: string } = {};
          productData.variants.forEach(variant => {
            if (variant.options.length > 0) {
              initialVariants[variant.name] = variant.options[0];
            }
          });
          setSelectedVariants(initialVariants);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    const theme = store?.website?.theme || { primaryColor: '#000000', backgroundColor: '#ffffff' };
    return <PageLoader message="Loading product..." primaryColor={theme.primaryColor} backgroundColor={theme.backgroundColor} />;
  }

  if (error || !store || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This product does not exist'}</p>
          <Link href={`/store/${storeName}`} className="text-sm font-medium text-gray-900 hover:underline">
            Back to store
          </Link>
        </div>
      </div>
    );
  }

  const theme = store.website?.theme || {
    primaryColor: '#000000',
    accentColor: '#000000',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamily: 'inter'
  };

  const getFontClass = (font: string) => {
    switch (font) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      case 'system': return 'font-sans';
      default: return 'font-sans';
    }
  };

  const displayPrice = typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price || '0').toFixed(2);

  const handleAddToCart = () => {
    // Validate that all required variants are selected
    if (product.variants && product.variants.length > 0) {
      const missingVariants = product.variants.filter(
        variant => !selectedVariants[variant.name]
      );
      
      if (missingVariants.length > 0) {
        alert(`Please select: ${missingVariants.map(v => v.name).join(', ')}`);
        return;
      }
    }

    addToCart(
      {
        productId: product.id,
        storeId: store.ownerId,
        storeName: store.storeName,
        name: product.name,
        price: typeof product.price === 'number' ? product.price : parseFloat(product.price || '0'),
        image: product.images && product.images.length > 0 ? product.images[0] : undefined,
        variant: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined,
      },
      quantity
    );
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    setIsCartOpen(true);
  };

  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: option
    }));
  };

  const renderLayout = () => {
    const props = { 
      product, 
      theme, 
      handleAddToCart, 
      addedToCart, 
      quantity, 
      setQuantity,
      selectedVariants,
      handleVariantChange
    };
    switch (store.website?.templateId) {
      case 'modern':
        return <ModernProductLayout {...props} />;
      case 'minimalist':
        return <MinimalistProductLayout {...props} />;
      case 'bold':
        return <BoldProductLayout {...props} />;
      default:
        return <ClassicProductLayout {...props} />;
    }
  };

  const renderRelatedProducts = () => {
    if (!product?.relatedProducts || product.relatedProducts.length === 0) {
      return null;
    }

    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* This is a placeholder. In a real app, you'd fetch these products. */}
          {product.relatedProducts.map(productId => (
            <div key={productId} className="border rounded-lg p-4">
              <div className="w-full h-32 bg-gray-200 rounded-md mb-4"></div>
              <p className="font-semibold">Related Product</p>
              <p className="text-sm text-gray-500">$99.99</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReviews = () => {
    if (!product?.reviews || product.reviews.length === 0) {
      return null;
    }

    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          {product.reviews.map(review => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="ml-2 font-semibold">{review.author}</p>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Cart />
      <div className={`min-h-screen ${getFontClass(theme.fontFamily || 'inter')}`} style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
        {/* Header */}
        <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: theme.textColor + '20', backgroundColor: theme.backgroundColor + 'f0' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/store/${storeName}`}
                className="transition-opacity hover:opacity-70"
                style={{ color: theme.textColor }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              {store.website?.logo ? (
                <img src={store.website.logo} alt={store.storeName} className="h-8 object-contain" />
              ) : (
                <div className="text-lg sm:text-xl font-semibold" style={{ color: theme.textColor }}>{store.storeName}</div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {buyer && buyerProfile ? (
                <Link
                  href="/buyer/orders"
                  className="p-2 hover:opacity-70 transition-opacity"
                  style={{ color: theme.textColor }}
                  title={buyerProfile.name}
                >
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href={`/buyer/login?returnUrl=${encodeURIComponent(`/store/${storeName}/product/${productId}`)}`}
                  className="p-2 hover:opacity-70 transition-opacity"
                  style={{ color: theme.textColor }}
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
              <CartIcon iconColor={theme.textColor} badgeColor={theme.primaryColor} />
            </div>
          </div>
        </header>

        {renderLayout()}
        {renderRelatedProducts()}
        {renderReviews()}
      </div>
    </>
  );
}
