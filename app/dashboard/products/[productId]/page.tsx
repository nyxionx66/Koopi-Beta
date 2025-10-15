"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useRouter, useParams } from 'next/navigation';
import { X, Upload, ArrowRight, ArrowLeft, Package, DollarSign, Image as ImageIcon, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VariantEditor } from '@/components/dashboard/VariantEditor';
import { ReviewManagement } from '@/components/dashboard/ReviewManagement';
import { RelatedProductSelector } from '@/components/dashboard/RelatedProductSelector';
import { PageLoader } from '@/components/ui/PageLoader';

const EditProductPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [type, setType] = useState('');
  const [vendor, setVendor] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('100.00');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [inventoryTracked, setInventoryTracked] = useState(false);
  const [chargeTax, setChargeTax] = useState(true);
  const [variants, setVariants] = useState<{ name: string; options: { value: string }[] }[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<string[]>([]);
  const [variantStock, setVariantStock] = useState<{ [key: string]: number }>({});
  
  // Media states
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = 'Edit Product - Koopi Dashboard';
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch product data
  useEffect(() => {
    if (user && productId) {
      fetchProduct();
    }
  }, [user, productId]);

  useEffect(() => {
    if (inventoryTracked && variants.length > 0) {
      const totalStock = Object.values(variantStock).reduce((acc, stock) => acc + stock, 0);
      setQuantity(totalStock.toString());
    }
  }, [variantStock, inventoryTracked, variants]);

  const fetchProduct = async () => {
    if (!user || !productId) return;
    
    try {
      const productDoc = await getDoc(doc(db, 'products', productId));
      
      if (!productDoc.exists()) {
        alert('Product not found');
        router.push('/dashboard/products');
        return;
      }

      const data = productDoc.data();
      
      // Check if product belongs to this user
      if (data.storeId !== user.uid) {
        alert('You do not have permission to edit this product');
        router.push('/dashboard/products');
        return;
      }

      // Populate form fields
      setTitle(data.name || '');
      setDescription(data.description || '');
      setStatus(data.status || 'Active');
      setType(data.type || '');
      setVendor(data.vendor || '');
      setTags(data.tags?.join(', ') || '');
      setCategory(data.category || '');
      setPrice(data.price?.toString() || '100.00');
      setCompareAtPrice(data.compareAtPrice?.toString() || '');
      setQuantity(data.quantity?.toString() || '');
      setInventoryTracked(data.inventoryTracked || false);
      setChargeTax(data.chargeTax !== false);
      setVariants(data.variants || []);
      setRelatedProducts(data.relatedProducts || []);
      setExistingImages(data.images || []);
      setVariantStock(data.variantStock || {});
      
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to load product');
      router.push('/dashboard/products');
    } finally {
      setLoading(false);
    }
  };

  const getVariantCombinations = () => {
    if (variants.length === 0) return [];

    const combinations = variants.reduce((acc, variant) => {
      if (acc.length === 0) {
        return variant.options.map(option => ({ [variant.name]: option.value }));
      }
      return acc.flatMap(combination =>
        variant.options.map(option => ({ ...combination, [variant.name]: option.value }))
      );
    }, [] as { [key: string]: string }[]);

    return combinations;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
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

  const handleVariantStockChange = (variantKey: string, value: string) => {
    setVariantStock(prev => ({ ...prev, [variantKey]: parseInt(value) || 0 }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const removeMedia = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setMediaFiles(prev => prev.filter((_, i) => i !== index));
      setMediaPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const uploadMedia = async () => {
    if (mediaFiles.length === 0) return [];

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];
        const uniqueId = Date.now() + Math.random().toString(36).substring(2, 9);
        const storageRef = ref(storage, `products/${user!.uid}/${uniqueId}_${file.name}`);
        
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);
        
        setUploadProgress(Math.round(((i + 1) / mediaFiles.length) * 100));
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }

    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (!title.trim() || !price) {
      alert('Please fill in all required fields');
      return;
    }

    if (inventoryTracked && !quantity) {
      alert('Please enter inventory quantity');
      return;
    }

    setSaving(true);

    try {
      // Upload new media files
      const newImageUrls = await uploadMedia();
      
      // Combine existing and new images
      const allImages = [...existingImages, ...newImageUrls];

      // Prepare product data
      const productData = {
        name: title.trim(),
        description: description.trim(),
        status: status,
        price: parseFloat(price) || 0,
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        inventory: inventoryTracked ? parseInt(quantity) || 0 : 999999,
        quantity: inventoryTracked ? parseInt(quantity) || 0 : 999999,
        inventoryTracked,
        type: type || 'Physical',
        vendor: vendor || '',
        tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
        category: category || '',
        chargeTax,
        variants: variants.map(v => ({
          ...v,
          options: v.options.map(o => o.value)
        })),
        relatedProducts: relatedProducts || [],
        images: allImages,
        variantStock: variantStock || {},
        updatedAt: serverTimestamp(),
      };

      // Update product in Firestore
      await updateDoc(doc(db, 'products', productId), productData);

      alert('Product updated successfully!');
      router.push('/dashboard/products');
      
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <PageLoader message="Loading product..." primaryColor="#000000" backgroundColor="#f1f1f1" />;
  }

  const canProceed = () => {
    if (currentStep === 1) return title.trim() && description.trim();
    if (currentStep === 2) return true; // Media is optional
    if (currentStep === 3) return price && (!inventoryTracked || quantity);
    return false;
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 backdrop-blur-xl bg-white/60 rounded-[20px] p-4 sm:p-5 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/products" className="p-2 hover:bg-white/50 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Edit Product</h1>
                <p className="text-sm text-gray-600 mt-0.5">Update product information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 backdrop-blur-xl bg-white/60 rounded-[20px] p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between relative">
            {[1, 2, 3].map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    currentStep >= step 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-white/50 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep >= step ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step === 1 && 'Details'}
                    {step === 2 && 'Media'}
                    {step === 3 && 'Pricing'}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`flex-1 h-0.5 -mt-6 transition-colors ${
                    currentStep > step ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="backdrop-blur-2xl bg-white/70 rounded-[24px] border border-white/30 shadow-2xl p-6 sm:p-8 mb-6"
          >
            {/* Step 1: Product Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-1">Product Details</h2>
                  <p className="text-gray-600">Basic information about your product</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Wireless Headphones"
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe your product features, benefits, and specifications..."
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm shadow-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Product Type</label>
                    <input
                      type="text"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      placeholder="e.g., Electronics"
                      className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Vendor/Brand</label>
                    <input
                      type="text"
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                      placeholder="e.g., Sony"
                      className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., wireless, bluetooth, audio"
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStatus('Active')}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        status === 'Active'
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-white/80 text-gray-700 border border-gray-300 hover:bg-white'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('Draft')}
                      className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        status === 'Draft'
                          ? 'bg-gray-500 text-white shadow-md'
                          : 'bg-white/80 text-gray-700 border border-gray-300 hover:bg-white'
                      }`}
                    >
                      Draft
                    </button>
                  </div>
                </div>

                <div>
                  <VariantEditor variants={variants} onChange={setVariants} />
                </div>
                {inventoryTracked && variants.length > 0 && (
                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium text-gray-900">Variant Stock</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getVariantCombinations().map((combination, index) => {
                        const variantKey = Object.values(combination).join(' / ');
                        return (
                          <div key={`${variantKey}-${index}`}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{variantKey}</label>
                            <input
                              type="number"
                              value={variantStock[variantKey] || ''}
                              onChange={(e) => handleVariantStockChange(variantKey, e.target.value)}
                              placeholder="0"
                              className="w-full px-3 py-2 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {inventoryTracked && variants.length > 0 && (
                 <div className="space-y-4 pt-4">
                   <h3 className="text-lg font-medium text-gray-900">Variant Stock</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {getVariantCombinations().map(combination => {
                       const variantKey = Object.values(combination).join(' / ');
                       return (
                         <div key={variantKey}>
                           <label className="block text-sm font-medium text-gray-700 mb-1">{variantKey}</label>
                           <input
                             type="number"
                             value={variantStock[variantKey] || ''}
                             onChange={(e) => handleVariantStockChange(variantKey, e.target.value)}
                             placeholder="0"
                             className="w-full px-3 py-2 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                           />
                         </div>
                       );
                     })}
                   </div>
                 </div>
               )}
              </div>
            )}

            {/* Step 2: Media Upload */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-1">Product Media</h2>
                  <p className="text-gray-600">Upload images of your product</p>
                </div>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">Current Images</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} className="relative group">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeMedia(index, true)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview */}
                {mediaPreviews.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">New Images</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {mediaPreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg border-2 border-blue-400"
                          />
                          <button
                            type="button"
                            onClick={() => removeMedia(index, false)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white/50 hover:bg-white/80 hover:border-blue-400'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                </div>

                {uploading && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Uploading...</span>
                      <span className="text-sm font-bold text-blue-900">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Pricing & Inventory */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-1">Pricing & Inventory</h2>
                  <p className="text-gray-600">Set prices and manage stock</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Price (LKR) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Compare at Price (LKR)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        step="0.01"
                        value={compareAtPrice}
                        onChange={(e) => setCompareAtPrice(e.target.value)}
                        placeholder="Original price"
                        className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={inventoryTracked}
                        onChange={(e) => setInventoryTracked(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-900">Track Inventory</label>
                      <p className="text-xs text-gray-600 mt-1">
                        Enable this to track stock levels. When disabled, product is always available.
                      </p>
                    </div>
                  </div>
                </div>

                {inventoryTracked && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Number of items in stock"
                        className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
                      />
                    </div>
                    {parseInt(quantity) === 0 && (
                      <p className="text-sm text-orange-600 mt-2">⚠️ Product will show as "Out of Stock" to buyers</p>
                    )}
                  </div>
                )}

                {!inventoryTracked && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-800">
                      ✓ <strong>Unlimited stock:</strong> This product will always be available to purchase.
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={chargeTax}
                        onChange={(e) => setChargeTax(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-900">Charge Tax</label>
                      <p className="text-xs text-gray-600 mt-1">Add tax to this product at checkout</p>
                    </div>
                  </div>
                </div>

                <div>
                  <RelatedProductSelector
                    selectedProducts={relatedProducts}
                    onChange={setRelatedProducts}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between backdrop-blur-xl bg-white/60 rounded-[20px] p-4 border border-white/20 shadow-lg">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white/80 text-gray-700 border border-gray-300 hover:bg-white shadow-sm active:scale-95'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex gap-3">
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                  canProceed()
                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={saving || !canProceed()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                  saving || !canProceed()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600 shadow-md active:scale-95'
                }`}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Updating...' : 'Update Product'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
