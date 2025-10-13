"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { Package, ShoppingCart, ArrowRight, Star, User } from 'lucide-react';
import Link from 'next/link';
import Cart from '@/components/Cart';
import CartIcon from '@/components/CartIcon';
import { useBuyerAuth } from '@/contexts/BuyerAuthContext';
import { useCart } from '@/contexts/CartContext';
import { useStore } from '@/contexts/StoreContext';
import { templates, Template } from '@/lib/templates';
import { InlineLoader } from '@/components/ui/InlineLoader';
import ProductCard from '@/components/store/ProductCard';
import { Product } from '@/types';

export default function StorePage() {
  const { storeData: store, loading } = useStore();
  const params = useParams();
  const storeName = params.storeName as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, setIsCartOpen } = useCart();
  const { buyer, buyerProfile } = useBuyerAuth();

  // Set page title dynamically
  useEffect(() => {
    if (store) {
      document.title = `${store.storeName} - Shop Online`;
    }
  }, [store]);

  useEffect(() => {
    if (store) {
      fetchProducts();
    }
  }, [store]);

  const fetchProducts = async () => {
    if (!store) return;
    setProductsLoading(true);
    try {
      const productsRef = collection(db, 'products');
      const productsQuery = query(productsRef, where('storeId', '==', store.ownerId), where('status', '==', 'Active'));
      const productsSnapshot = await getDocs(productsQuery);
      const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  if (error || !store) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Store Not Found</h1>
          <p className="text-gray-600">{error || 'This store does not exist'}</p>
        </div>
      </div>
    );
  }

  const templateId = store.website?.templateId || 'classic';
  const template = templates[templateId as Template] || templates.classic;

  const hero = store.website?.hero || {
    title: `Welcome to ${store.storeName}`,
    subtitle: store.storeDescription || 'Discover amazing products',
    ctaText: 'Shop Now',
    alignment: 'left'
  };

  const theme = store.website?.theme || {
    primaryColor: '#000000',
    accentColor: '#000000',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    fontFamily: 'inter'
  };

  const about = store.website?.about || {
    show: true,
    title: `About ${store.storeName}`,
    content: store.storeDescription || 'Welcome to our store!'
  };

  const footer = store.website?.footer || {
    text: '',
    showPoweredBy: true
  };

  const getFontClass = (font: string) => {
    switch (font) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      case 'system': return 'font-sans';
      default: return 'font-sans'; // inter
    }
  };

  const handleQuickAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    
    addToCart({
      productId: product.id,
      storeId: store.ownerId,
      storeName: store?.storeName || storeName,
      name: product.name,
      price: product.price ?? 0,
      image: product.images && product.images.length > 0 ? product.images[0] : undefined,
    }, 1);
    
    setIsCartOpen(true);
  };

  const sectionOrder = store.website?.sectionOrder || ['hero', 'about'];

  const sectionComponents: { [key: string]: React.ReactNode } = {
    hero: (
      <section
        className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6"
        style={{
          backgroundColor: hero.backgroundImage ? 'transparent' : theme.backgroundColor,
          backgroundImage: hero.backgroundImage ? `url(${hero.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className={`max-w-7xl mx-auto ${hero.backgroundImage ? 'bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-12' : ''} ${hero.alignment === 'center' ? 'text-center' : ''}`}>
          <div className={`${hero.alignment === 'center' ? 'mx-auto' : ''} max-w-3xl`}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4" style={{ color: hero.backgroundImage ? '#000000' : theme.textColor }}>
              {hero.title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8" style={{ color: hero.backgroundImage ? '#666666' : theme.textColor, opacity: 0.9 }}>
              {hero.subtitle}
            </p>
            <a
              href="#products"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
              style={{
                backgroundColor: theme.primaryColor,
                color: '#ffffff'
              }}
            >
              {hero.ctaText}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </section>
    ),
    about: about.show ? (
      <section id="about" className="py-12 sm:py-16 px-4 sm:px-6" style={{ backgroundColor: theme.textColor + '05' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6" style={{ color: theme.textColor }}>{about.title}</h2>
          <p className="text-base sm:text-lg max-w-3xl whitespace-pre-wrap" style={{ color: theme.textColor, opacity: 0.8 }}>
            {about.content}
          </p>
        </div>
      </section>
    ) : null,
  };

  return (
    <>
      <Cart />
      <div className={`min-h-screen ${getFontClass(theme.fontFamily || 'inter')}`} style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
        {/* Header */}
        <header className="border-b sticky top-0 z-50 backdrop-blur-sm" style={{ borderColor: theme.textColor + '20', backgroundColor: theme.backgroundColor + 'f0' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            {store.website?.logo ? (
              <img src={store.website.logo} alt={store.storeName} className="h-8 sm:h-10 object-contain" />
            ) : (
              <div className="text-lg sm:text-xl font-semibold" style={{ color: theme.textColor }}>{store.storeName}</div>
            )}
            <nav className="flex items-center gap-3 sm:gap-5">
              <a href="#products" className="text-sm font-medium transition-opacity hover:opacity-70 hidden sm:block" style={{ color: theme.textColor, opacity: 0.8 }}>
                Products
              </a>
              {about.show && (
                <a href="#about" className="text-sm font-medium transition-opacity hover:opacity-70 hidden sm:block" style={{ color: theme.textColor, opacity: 0.8 }}>
                  About
                </a>
              )}
              {buyer && buyerProfile ? (
                <Link
                  href="/buyer/orders"
                  className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: theme.textColor, opacity: 0.8 }}
                  title={buyerProfile.name}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Account</span>
                </Link>
              ) : (
                <Link
                  href={`/buyer/login?returnUrl=${encodeURIComponent(`/store/${storeName}`)}`}
                  className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: theme.textColor, opacity: 0.8 }}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
              <CartIcon iconColor={theme.textColor} badgeColor={theme.primaryColor} />
            </nav>
          </div>
        </header>

        {sectionOrder.map(key => (
          <React.Fragment key={key}>{sectionComponents[key]}</React.Fragment>
        ))}

        {/* Products Section */}
        <section id="products" className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: theme.textColor }}>Products</h2>
              {!productsLoading && (
                <div className="text-sm" style={{ color: theme.textColor, opacity: 0.7 }}>{products.length} items</div>
              )}
            </div>

            {productsLoading ? (
              <InlineLoader 
                message="Loading products..." 
                primaryColor={theme.primaryColor}
                size="md"
              />
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    storeName={storeName}
                    theme={theme}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="w-16 h-16 mx-auto mb-4" style={{ color: theme.textColor, opacity: 0.4 }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: theme.textColor }}>No products yet</h3>
                <p style={{ color: theme.textColor, opacity: 0.7 }}>Check back soon for new items</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
      <footer className="border-t py-6 sm:py-8 px-4 sm:px-6" style={{ borderColor: theme.textColor + '20' }}>
        <div className="max-w-7xl mx-auto text-center text-sm" style={{ color: theme.textColor, opacity: 0.7 }}>
          {footer.text ? (
            <p className="mb-2">{footer.text}</p>
          ) : (
            <p className="mb-2">&copy; {new Date().getFullYear()} {store.storeName}. All rights reserved.</p>
          )}
          {footer.showPoweredBy && (
            <p className="mt-2">Powered by Koopi</p>
          )}
        </div>
      </footer>
      </div>
    </>
  );
}