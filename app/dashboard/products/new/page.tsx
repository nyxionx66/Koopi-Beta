"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/firebase';
import { collection, addDoc, doc, updateDoc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, X, Upload, ArrowRight, ArrowLeft, Package, DollarSign, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { VariantEditor } from '@/components/dashboard/VariantEditor';
import { ReviewManagement } from '@/components/dashboard/ReviewManagement';
import { RelatedProductSelector } from '@/components/dashboard/RelatedProductSelector';
import { PageLoader } from '@/components/ui/PageLoader';

const AddProductPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from'); // 'dashboard' or 'products'
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [productType, setProductType] = useState('');
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [type, setType] = useState('');
  const [vendor, setVendor] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('0.00');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [inventoryTracked, setInventoryTracked] = useState(false);
  const [chargeTax, setChargeTax] = useState(true);
  const [variants, setVariants] = useState<{ name: string; options: string[] }[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<string[]>([]);
  
  // Media states
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Set page title
  useEffect(() => {
    document.title = 'Add Product - Koopi Dashboard';
  }, []);

  // Fetch product type from user's onboarding
  useEffect(() => {
    const fetchProductType = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const savedProductType = userData.onboarding?.productType || 'physical';
          setProductType(savedProductType);
        }
      }
    };
    fetchProductType();
  }, [user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Set window size for confetti
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const getCategoriesForType = () => {
    if (productType === 'digital') {
      return [
        { value: 'ebooks', label: 'E-books' },
        { value: 'courses', label: 'Online Courses' },
        { value: 'software', label: 'Software' },
        { value: 'templates', label: 'Templates' },
        { value: 'music', label: 'Music & Audio' },
        { value: 'graphics', label: 'Graphics & Design' },
      ];
    } else if (productType === 'services') {
      return [
        { value: 'consulting', label: 'Consulting' },
        { value: 'coaching', label: 'Coaching' },
        { value: 'design', label: 'Design Services' },
        { value: 'development', label: 'Development' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'other', label: 'Other Services' },
      ];
    } else {
      return [
        { value: 'fashion', label: 'Fashion & Apparel' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'home', label: 'Home & Garden' },
        { value: 'art', label: 'Art & Crafts' },
        { value: 'toys', label: 'Toys & Games' },
        { value: 'other', label: 'Other' },
      ];
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      setMediaFiles(prev => [...prev, ...imageFiles]);
      
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadMedia = async (): Promise<string[]> => {
    if (mediaFiles.length === 0) return [];
    
    const uploadPromises = mediaFiles.map(async (file) => {
      const storageRef = ref(storage, `products/${user?.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    });
    
    return Promise.all(uploadPromises);
  };

  const handleNext = () => {
    if (currentStep === 1 && !title.trim()) {
      alert('Please enter a product title');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = async () => {
    if (!user) {
      alert('Authentication error. Please refresh and try again.');
      return;
    }
    
    if (!title.trim()) {
      alert('Please enter a product title');
      return;
    }

    setSaving(true);

    try {
      const storeRef = doc(db, 'stores', user.uid);
      const storeDoc = await getDoc(storeRef);
      const isFirstProduct = !storeDoc.exists() || !storeDoc.data()?.hasProducts;
      
      let mediaUrls: string[] = [];
      if (mediaFiles.length > 0) {
        setUploading(true);
        mediaUrls = await uploadMedia();
        setUploading(false);
      }

      const productData = {
        name: title,
        title,
        description,
        status,
        type: type || (productType === 'digital' ? 'Digital Product' : productType === 'services' ? 'Service' : 'Physical Product'),
        vendor: vendor || '',
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        category: category || '',
        price: parseFloat(price) || 0,
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        inventory: inventoryTracked ? parseInt(quantity) || 0 : 0,
        quantity: inventoryTracked ? parseInt(quantity) || 0 : 0,
        inventoryTracked,
        chargeTax,
        mediaUrls,
        storeId: user.uid,
        userId: user.uid,
        productType: productType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        variants,
        relatedProducts,
      };

      await addDoc(collection(db, 'products'), productData);

      if (storeDoc.exists()) {
        await updateDoc(storeRef, {
          hasProducts: true,
          updatedAt: serverTimestamp()
        });
      } else {
        await setDoc(storeRef, {
          hasProducts: true,
          hasCustomizedStore: false,
          hasPaymentSetup: false,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      if (isFirstProduct) {
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          // Redirect based on where they came from
          if (from === 'dashboard') {
            router.push('/dashboard');
          } else {
            router.push('/dashboard/products');
          }
        }, 3000);
      } else {
        if (from === 'dashboard') {
          router.push('/dashboard');
        } else {
          router.push('/dashboard/products');
        }
      }
      
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product: ' + (error as Error).message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (authLoading) {
    return <PageLoader message="Loading..." primaryColor="#000000" backgroundColor="#f1f1f1" />;
  }

  if (!user) {
    return null;
  }

  const steps = [
    { id: 1, title: 'Basic Info', icon: Package },
    { id: 2, title: 'Images', icon: ImageIcon },
    { id: 3, title: 'Pricing', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      {showCelebration && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link 
              href={from === 'dashboard' ? '/dashboard' : '/dashboard/products'}
              className="text-gray-600 hover:text-gray-900 text-2xl"
            >
              ←
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Add product</h1>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#303030] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center w-full">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    currentStep > step.id 
                      ? 'bg-neutral-900 border-neutral-900' 
                      : currentStep === step.id 
                      ? 'bg-neutral-900 border-neutral-900' 
                      : 'bg-transparent border-neutral-300'
                  }`}>
                    <step.icon className={`w-6 h-6 ${
                      currentStep >= step.id 
                        ? 'text-white' 
                        : 'text-neutral-400'
                    }`} />
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-semibold ${
                      currentStep >= step.id 
                        ? 'text-neutral-900' 
                        : 'text-neutral-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 transition-all ${
                    currentStep > step.id 
                      ? 'bg-neutral-900' 
                      : 'bg-neutral-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                  <p className="text-gray-600">Tell us about your product</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Premium Cotton T-Shirt"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm resize-none"
                    placeholder="Describe your product in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm appearance-none"
                    >
                      <option value="">Select a category</option>
                      {getCategoriesForType().map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (Optional)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., summer, cotton, casual (separate with commas)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
                  />
                </div>
              </motion.div>
            )}

            {/* Variants */}
            {currentStep === 2 && (
              <motion.div
                key="step2-variants"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Variants</h2>
                  <p className="text-gray-600">Add options like size or color</p>
                </div>
                <VariantEditor variants={variants} onChange={setVariants} />
              </motion.div>
            )}

            {/* Step 2: Media */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Images</h2>
                  <p className="text-gray-600">Upload high-quality images of your product</p>
                </div>

                {mediaPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {mediaPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          onClick={() => removeMedia(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <div className="mb-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-neutral-900 hover:text-neutral-700 font-semibold text-sm underline"
                      >
                        Click to upload
                      </button>
                      <span className="text-sm text-gray-500"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Pricing */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing & Inventory</h2>
                  <p className="text-gray-600">Set your product pricing and stock levels</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-500 text-sm">Rs</span>
                      <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Compare at price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-500 text-sm">Rs</span>
                      <input
                        type="number"
                        step="0.01"
                        value={compareAtPrice}
                        onChange={(e) => setCompareAtPrice(e.target.value)}
                        placeholder="Optional"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>

                {productType !== 'digital' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-gray-700">Track Inventory</label>
                      <input
                        type="checkbox"
                        checked={inventoryTracked}
                        onChange={(e) => setInventoryTracked(e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                    </div>
                    
                    {inventoryTracked && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
                          placeholder="0"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={chargeTax}
                    onChange={(e) => setChargeTax(e.target.checked)}
                    className="w-5 h-5 rounded"
                    id="tax"
                  />
                  <label htmlFor="tax" className="text-sm text-gray-700">
                    Charge tax on this product
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-transparent border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-all"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-all disabled:opacity-50"
              >
                {saving ? 'Saving Product...' : 'Save Product'}
              </button>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reviews</h2>
          <p className="text-gray-600 mb-4">Manage customer reviews for this product</p>
          <ReviewManagement reviews={[]} onApprove={() => {}} onDelete={() => {}} />
        </div>

        {/* Related Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Products</h2>
          <p className="text-gray-600 mb-4">Select products to recommend to your customers</p>
          <RelatedProductSelector selectedProducts={relatedProducts} onChange={setRelatedProducts} />
        </div>
      </div>
      
      {/* Upload Progress Overlay */}
      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-700">Uploading images...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductPage;
