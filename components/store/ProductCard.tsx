import Link from 'next/link';
import Image from 'next/image';

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrls?: string[];
  };
  storeName: string;
};

const ProductCard = ({ product, storeName }: ProductCardProps) => {
  const imageUrl = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/placeholder.png';

  return (
    <Link href={`/store/${storeName}/products/${product.id}`}>
      <div className="group relative">
        <div className="w-full bg-gray-200 rounded-lg overflow-hidden aspect-w-1 aspect-h-1">
          <Image
            src={imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="group-hover:opacity-75 transition-opacity"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </h3>
          </div>
          <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;