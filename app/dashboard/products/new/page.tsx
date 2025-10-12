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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
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
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const nonImageFiles = files.filter(file => !file.type.startsWith('image/'));

    if (nonImageFiles.length > 0) {
      alert(`Only image files are accepted. The following files were ignored: ${nonImageFiles.map(f => f.name).join(', ')}`);
    }
    
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadMedia = async (): Promise<string[]> => {
    if (mediaFiles.length === 0) return [];
    
    const uploadedUrls: string[] = [];
    const totalFiles = mediaFiles.length;
    
    for (let i = 0; i < mediaFiles.length; i++) {
      const file = mediaFiles[i];
      try {
        const storageRef = ref(storage, `products/${user?.uid}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(url);
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw new Error(`Failed to upload ${file.name}. Please check CORS configuration.`);
      }
    }
    
    return uploadedUrls;
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
        images: mediaUrls, // Renamed from mediaUrls for consistency
        mediaUrls, // Keep for backward compatibility
        storeId: user.uid,
        userId: user.uid,
        productType: productType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        variants,
        relatedProducts,
        averageRating: 0,
        reviewCount: 0,
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
    { id: 2, title: 'Images & Variants', icon: ImageIcon },
    { id: 3, title: 'Pricing', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {showCelebration && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link 
              href={from === 'dashboard' ? '/dashboard' : '/dashboard/products'}
              className="group flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Add New Product</h1>
              <p className="text-sm text-gray-500 mt-1">Create and customize your product listing</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neutral-900 to-neutral-700 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Product'
            )}
          </button>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center w-full">
                  <motion.div 
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      currentStep > step.id 
                        ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30' 
                        : currentStep === step.id 
                        ? 'bg-gradient-to-br from-neutral-900 to-neutral-700 shadow-lg shadow-neutral-900/30' 
                        : 'bg-gray-100 border-2 border-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <step.icon className={`w-7 h-7 ${
                      currentStep >= step.id 
                        ? 'text-white' 
                        : 'text-gray-400'
                    }`} />
                  </motion.div>
                  <div className="mt-3 text-center">
                    <p className={`text-xs sm:text-sm font-bold transition-colors ${
                      currentStep >= step.id 
                        ? 'text-neutral-900' 
                        : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 sm:mx-4 rounded-full transition-all duration-300 ${
                    currentStep > step.id 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-10"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="border-b border-gray-100 pb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Basic Information</h2>
                  <p className="text-gray-500">Tell us about your product to get started</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Product Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Premium Cotton T-Shirt"
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all text-sm placeholder:text-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all text-sm resize-none placeholder:text-gray-400"
                      placeholder="Describe your product in detail... Tell customers what makes it special!"
                    />
                    <p className="text-xs text-gray-400 mt-2">Give a detailed description to help customers understand your product</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Category
                      </label>
                      <div className="relative">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all text-sm appearance-none bg-white"
                        >
                          <option value="">Select a category</option>
                          {getCategoriesForType().map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-5 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Tags (Optional)
                      </label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="summer, cotton, casual"
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all text-sm placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Images & Variants */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Product Images Section */}
                <div>
                  <div className="border-b border-gray-100 pb-6 mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Product Images</h2>
                    <p className="text-gray-500">Upload high-quality images to showcase your product</p>
                  </div>

                  {mediaPreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                      {mediaPreviews.map((preview, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group-hover:border-neutral-900 transition-all">
                            <img 
                              src={preview} 
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <button
                            onClick={() => removeMedia(index)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-2 left-2 bg-neutral-900 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                              Main Image
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  <div
                    className={`border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                      isDragging 
                        ? 'border-neutral-900 bg-gradient-to-br from-neutral-50 to-gray-50 scale-[1.02]' 
                        : 'border-gray-300 hover:border-gray-400 bg-gray-50/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-700 flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="file-upload"
                          className="text-neutral-900 hover:text-neutral-700 font-bold text-base underline cursor-pointer"
                        >
                          Click to upload
                        </label>
                        <span className="text-base text-gray-600"> or drag and drop</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        First image will be the main product image
                      </p>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Variants Section */}
                <div className="border-t border-gray-100 pt-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Variants</h2>
                    <p className="text-gray-500">Add options like size, color, or material (optional)</p>
                  </div>
                  <VariantEditor variants={variants} onChange={setVariants} />
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
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="border-b border-gray-100 pb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Pricing & Inventory</h2>
                  <p className="text-gray-500">Set your product pricing and manage stock levels</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-5 top-4.5 text-gray-500 text-base font-semibold">Rs</span>
                        <input
                          type="number"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-14 pr-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all text-base font-semibold"
                        />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Compare at Price
                        <span className="ml-2 text-xs text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-5 top-4.5 text-gray-500 text-base font-semibold">Rs</span>
                        <input
                          type="number"
                          step="0.01"
                          value={compareAtPrice}
                          onChange={(e) => setCompareAtPrice(e.target.value)}
                          placeholder="Original price"
                          className="w-full pl-14 pr-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all text-base placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {productType !== 'digital' && (
                    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border-2 border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-900">Track Inventory</label>
                          <p className="text-xs text-gray-500 mt-1">Monitor stock levels for this product</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={inventoryTracked}
                            onChange={(e) => setInventoryTracked(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neutral-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-neutral-900"></div>
                        </label>
                      </div>
                      
                      <AnimatePresence>
                        {inventoryTracked && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <label className="block text-sm font-semibold text-gray-700 mb-3 mt-4">
                              Quantity in Stock
                            </label>
                            <input
                              type="number"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-all text-base font-semibold"
                              placeholder="0"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <input 
                      type="checkbox" 
                      checked={chargeTax}
                      onChange={(e) => setChargeTax(e.target.checked)}
                      className="w-5 h-5 rounded mt-0.5"
                      id="tax"
                    />
                    <label htmlFor="tax" className="text-sm text-gray-700 cursor-pointer">
                      <span className="font-semibold block">Charge tax on this product</span>
                      <span className="text-xs text-gray-500">Tax will be calculated based on customer location</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-10 pt-8 border-t border-gray-200">
            {currentStep > 1 && (
              <motion.button
                type="button"
                onClick={handlePrev}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-4 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:shadow-md transition-all"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </motion.button>
            )}
            {currentStep < 3 ? (
              <motion.button
                type="button"
                onClick={handleNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-neutral-900 to-neutral-700 rounded-xl hover:shadow-lg transition-all"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSave}
                disabled={saving}
                whileHover={{ scale: saving ? 1 : 1.02 }}
                whileTap={{ scale: saving ? 1 : 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-green-500 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving Product...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    Save Product
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
        
        {/* Mobile Save Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg"
        >
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-neutral-900 to-neutral-700 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Product'
            )}
          </button>
        </motion.div>

        {/* Reviews */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-10 mt-6"
        >
          <div className="border-b border-gray-100 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
            <p className="text-gray-500">Manage customer reviews and ratings for this product</p>
          </div>
          <ReviewManagement reviews={[]} onApprove={() => {}} onDelete={() => {}} />
        </motion.div>

        {/* Related Products */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-10 mt-6 mb-20 sm:mb-6"
        >
          <div className="border-b border-gray-100 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Products</h2>
            <p className="text-gray-500">Select products to recommend alongside this item</p>
          </div>
          <RelatedProductSelector selectedProducts={relatedProducts} onChange={setRelatedProducts} />
        </motion.div>
      </div>
      
      {/* Upload Progress Modal */}
      <AnimatePresence>
        {uploading && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  {/* Animated Icon */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-700 flex items-center justify-center shadow-lg"
                  >
                    <Upload className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Uploading Images</h3>
                  <p className="text-sm text-gray-500 mb-6">Please wait while we upload your images...</p>
                  
                  {/* Progress Bar */}
                  <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-3 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 rounded-full relative"
                    >
                      <motion.div
                        animate={{ x: [0, 100, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />
                    </motion.div>
                  </div>
                  
                  {/* Progress Text */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">{uploadProgress}% complete</span>
                    <span className="text-neutral-900 font-bold">{mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddProductPage;
