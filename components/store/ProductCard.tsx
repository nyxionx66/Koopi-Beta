'use client';

import Link from 'next/link';
import { Star, Package, TrendingUp } from 'lucide-react';

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    images?: string[];
    imageUrls?: string[];
    mediaUrls?: string[];
    averageRating?: number;
    reviewCount?: number;
    tags?: string[];
    status?: string;
    variants?: { name: string; options: string[] }[];
  };
  storeName: string;
  theme?: {
    primaryColor?: string;
    textColor?: string;
    backgroundColor?: string;
  };
};

const ProductCard = ({ product, storeName, theme }: ProductCardProps) => {
  // Get images from product
  const productImages = product.images || [];
  
  // Debug logging
  console.log('ProductCard:', product.name, 'Images:', productImages);
  
  // Calculate discount percentage
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  // Check if product has variants
  const hasVariants = product.variants && product.variants.length > 0;
  const variantCount = hasVariants 
    ? product.variants!.reduce((sum, v) => sum + v.options.length, 0)
    : 0;

  const primaryColor = theme?.primaryColor || '#000000';
  const textColor = theme?.textColor || '#000000';

  return (
    <Link href={`/store/${storeName}/product/${product.id}`}>
      <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
          {productImages.length > 0 ? (
            <img
              src={productImages[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{ display: 'block', maxWidth: '100%', height: '100%' }}
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div 
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg flex items-center gap-1"
              style={{ backgroundColor: primaryColor, zIndex: 10 }}
            >
              <TrendingUp className="w-3 h-3" />
              {discountPercent}% OFF
            </div>
          )}

          {/* Out of Stock Badge */}
          {product.status === 'Inactive' && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg" style={{ zIndex: 10 }}>
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {/* Product Name */}
          <h3 
            className="text-sm font-semibold line-clamp-2 min-h-[2.5rem] group-hover:underline"
            style={{ color: textColor }}
          >
            {product.name}
          </h3>

          {/* Rating */}
          {product.averageRating !== undefined && product.reviewCount !== undefined && product.reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.averageRating!) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            <span 
              className="text-lg font-bold"
              style={{ color: primaryColor }}
            >
              LKR {product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                LKR {product.compareAtPrice!.toFixed(2)}
              </span>
            )}
          </div>

          {/* Variants Info */}
          {hasVariants && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Package className="w-3 h-3" />
              <span>{variantCount} options available</span>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 text-xs rounded-full"
                  style={{ 
                    backgroundColor: primaryColor + '15',
                    color: primaryColor
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;