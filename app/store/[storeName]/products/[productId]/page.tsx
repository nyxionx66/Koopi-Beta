import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";

type ProductPageProps = {
  params: {
    productId: string;
    storeName: string;
  };
};

async function getProductData(productId: string) {
  const productRef = doc(db, "products", productId);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    return null;
  }

  return productSnap.data();
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductData(params.productId);
  
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} - Shop Online`,
    description: product.description || `Buy ${product.name} online`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductData(params.productId);

  if (!product) {
    notFound();
  }

  const imageUrl = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/placeholder.png';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              layout="fill"
              objectFit="cover"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>
            <p className="mt-2 text-3xl text-neutral-900">${product.price.toFixed(2)}</p>
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-gray-700" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
            <div className="mt-10">
              <button
                type="submit"
                className="w-full bg-neutral-900 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
              >
                Add to bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}