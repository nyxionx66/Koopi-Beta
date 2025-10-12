"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Globe, Save, Eye, EyeOff, Palette, Type, Image as ImageIcon, ExternalLink, Upload, Trash2, Layout } from 'lucide-react';
import Link from 'next/link';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { DraggableSection } from '@/components/dashboard/DraggableSection';
import { useToast } from '@/hooks/useToast';
import { TemplatePreview } from '@/components/dashboard/TemplatePreview';
import { templates } from '@/lib/templates';
import { InstallingAnimation } from '@/components/dashboard/InstallingAnimation';
import { PageLoader } from '@/components/ui/PageLoader';

export default function WebsitePage() {
  const { user } = useAuth();
  const { ToastComponent, success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [hasProducts, setHasProducts] = useState(false);
  const [sectionOrder, setSectionOrder] = useState(['hero', 'about']);
  const [templateId, setTemplateId] = useState('classic');
  const [installingTemplate, setInstallingTemplate] = useState(false);
  
  const [websiteEnabled, setWebsiteEnabled] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  // Hero section
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroCtaText, setHeroCtaText] = useState('Shop Now');
  const [heroBackgroundImage, setHeroBackgroundImage] = useState('');
  const [heroAlignment, setHeroAlignment] = useState<'left' | 'center'>('left');
  
  // Theme
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [accentColor, setAccentColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  
  // Sections visibility
  const [showAbout, setShowAbout] = useState(true);
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutContent, setAboutContent] = useState('');
  
  // Footer
  const [footerText, setFooterText] = useState('');
  const [showPoweredBy, setShowPoweredBy] = useState(true);
  
  // Font
  const [fontFamily, setFontFamily] = useState('inter');

  useEffect(() => {
    if (user) {
      fetchWebsiteSettings();
    }
  }, [user]);

  const fetchWebsiteSettings = async () => {
    if (!user) return;

    try {
      const storeDoc = await getDoc(doc(db, 'stores', user.uid));
      
      if (storeDoc.exists()) {
        const storeData = storeDoc.data();
        setStoreName(storeData.storeName || '');
        setHasProducts(storeData.hasProducts || false);
        
        const website = storeData.website || {};
        setWebsiteEnabled(website.enabled || false);
        setLogoUrl(website.logo || '');
        
        // Hero
        setHeroTitle(website.hero?.title || `Welcome to ${storeData.storeName}`);
        setHeroSubtitle(website.hero?.subtitle || storeData.storeDescription || 'Discover amazing products');
        setHeroCtaText(website.hero?.ctaText || 'Shop Now');
        setHeroBackgroundImage(website.hero?.backgroundImage || '');
        setHeroAlignment(website.hero?.alignment || 'left');
        
        // Theme
        setPrimaryColor(website.theme?.primaryColor || '#000000');
        setAccentColor(website.theme?.accentColor || '#000000');
        setBackgroundColor(website.theme?.backgroundColor || '#ffffff');
        setTextColor(website.theme?.textColor || '#000000');
        setFontFamily(website.theme?.fontFamily || 'inter');
        
        // About
        setShowAbout(website.about?.show !== false);
        setAboutTitle(website.about?.title || `About ${storeData.storeName}`);
        setAboutContent(website.about?.content || storeData.storeDescription || '');
        
        // Footer
        setFooterText(website.footer?.text || '');
        setShowPoweredBy(website.footer?.showPoweredBy !== false);
        
        // Load section order
        if (website.sectionOrder && Array.isArray(website.sectionOrder)) {
          setSectionOrder(website.sectionOrder);
        } else {
          // Default order for stores that haven't saved this yet
          setSectionOrder(['hero', 'about']);
        }
        
        setTemplateId(website.templateId || 'classic');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching website settings:', err);
      error('Failed to load website settings');
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingLogo(true);
    try {
      const storageRef = ref(storage, `stores/${user.uid}/logo/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setLogoUrl(url);
      setLogoFile(file);
      success('Logo uploaded successfully!');
    } catch (err) {
      console.error('Error uploading logo:', err);
      error('Failed to upload logo. Please try again.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const storeRef = doc(db, 'stores', user.uid);
      
      await updateDoc(storeRef, {
        website: {
          enabled: websiteEnabled,
          logo: logoUrl,
          hero: {
            title: heroTitle,
            subtitle: heroSubtitle,
            ctaText: heroCtaText,
            backgroundImage: heroBackgroundImage,
            alignment: heroAlignment
          },
          theme: {
            primaryColor: primaryColor,
            accentColor: accentColor,
            backgroundColor: backgroundColor,
            textColor: textColor,
            fontFamily: fontFamily
          },
          about: {
            show: showAbout,
            title: aboutTitle,
            content: aboutContent
          },
          footer: {
            text: footerText,
            showPoweredBy: showPoweredBy
          },
          sectionOrder: sectionOrder,
          templateId: templateId
        },
        hasCustomizedStore: true
      });

      success('Website settings saved successfully!');
    } catch (err) {
      console.error('Error saving website settings:', err);
      error('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newOrder.length) {
      return;
    }

    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setSectionOrder(newOrder);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (loading) {
    return (
      <PageLoader message="Loading website settings..." primaryColor="#000000" backgroundColor="#f1f1f1" />
    );
  }

  const storeUrl = storeName ? `/store/${storeName}` : '#';

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'hero':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Welcome to your store"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Subtitle
                </label>
                <textarea
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Discover amazing products"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call to Action Text
                </label>
                <input
                  type="text"
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  placeholder="Shop Now"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={heroBackgroundImage}
                  onChange={(e) => setHeroBackgroundImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Alignment
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setHeroAlignment('left')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      heroAlignment === 'left'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Left
                  </button>
                  <button
                    onClick={() => setHeroAlignment('center')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      heroAlignment === 'center'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Center
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'about':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">About Section</h2>
              </div>
              <button
                onClick={() => setShowAbout(!showAbout)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  showAbout
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showAbout ? 'Visible' : 'Hidden'}
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  placeholder="About Us"
                  disabled={!showAbout}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={aboutContent}
                  onChange={(e) => setAboutContent(e.target.value)}
                  placeholder="Tell your customers about your store..."
                  rows={4}
                  disabled={!showAbout}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm resize-none disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#f1f1f1] min-h-screen">
      {ToastComponent}
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-700" />
          <h1 className="text-xl font-semibold text-gray-900">Website</h1>
        </div>
        <div className="flex items-center gap-3">
          {websiteEnabled && storeName && (
            <Link
              href={storeUrl}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Site
            </Link>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Enable Website Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Enable Your Store Website</h2>
              <p className="text-sm text-gray-600 mb-4">
                {hasProducts 
                  ? 'Make your store accessible to customers with a custom website'
                  : 'Add at least one product before enabling your website'}
              </p>
              {websiteEnabled && storeName && (
                <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                  <span>Your website:</span>
                  <Link href={storeUrl} target="_blank" className="font-medium text-gray-900 hover:underline break-all">
                    {typeof window !== 'undefined' ? window.location.origin : ''}/store/{storeName}
                  </Link>
                </div>
              )}
            </div>
            <button
              onClick={() => setWebsiteEnabled(!websiteEnabled)}
              disabled={!hasProducts}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                websiteEnabled
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {websiteEnabled ? (
                <>
                  <Eye className="w-4 h-4" />
                  Enabled
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  Enable
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logo & Branding */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Logo & Branding</h2>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Logo
                </label>
                <div className="flex items-center gap-4">
                  {logoUrl ? (
                    <div className="relative">
                      <img src={logoUrl} alt="Logo" className="h-16 object-contain border border-gray-200 rounded-lg p-2" />
                      <button
                        onClick={() => setLogoUrl('')}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-16 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                      No logo
                    </div>
                  )}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={uploadingLogo}
                    />
                    <div className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                    </div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">Recommended: 200x60px, PNG or SVG</p>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                >
                  <option value="inter">Inter (Modern)</option>
                  <option value="system">System Default</option>
                  <option value="serif">Serif (Classic)</option>
                  <option value="mono">Monospace</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="lg:col-span-2 space-y-6">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sectionOrder}
                strategy={verticalListSortingStrategy}
              >
                {sectionOrder.map((sectionKey) => (
                  <DraggableSection key={sectionKey} id={sectionKey}>
                    {renderSection(sectionKey)}
                  </DraggableSection>
                ))}
              </SortableContext>
            </DndContext>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layout className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Templates</h2>
              </div>
              <div className="relative grid grid-cols-2 gap-4">
                {installingTemplate && <InstallingAnimation />}
                {Object.keys(templates).map((id) => (
                  <TemplatePreview
                    key={id}
                    templateId={id as keyof typeof templates}
                    isSelected={templateId === id}
                    onClick={() => {
                      setInstallingTemplate(true);
                      setTimeout(() => {
                        setTemplateId(id);
                        const template = templates[id as keyof typeof templates];
                        setPrimaryColor(template.theme.primaryColor);
                        setAccentColor(template.theme.accentColor);
                        setBackgroundColor(template.theme.backgroundColor);
                        setTextColor(template.theme.textColor);
                        setFontFamily(template.theme.fontFamily);
                        setHeroTitle(template.hero.title);
                        setHeroSubtitle(template.hero.subtitle);
                        setHeroCtaText(template.hero.ctaText);
                        setHeroBackgroundImage(template.hero.backgroundImage);
                        setHeroAlignment(template.hero.alignment as 'left' | 'center');
                        setInstallingTemplate(false);
                      }, 1000);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Theme Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Theme Colors</h2>
              </div>
            
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-xs"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-4 p-3 border border-gray-200 rounded-lg" style={{ backgroundColor: backgroundColor }}>
                  <p className="text-xs font-medium mb-2" style={{ color: textColor }}>Preview</p>
                  <div className="space-y-2">
                    <button
                      className="w-full px-3 py-2 rounded-lg text-xs font-medium text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="w-full px-3 py-2 rounded-lg text-xs font-medium text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      Accent Button
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layout className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Footer</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Footer Text
                  </label>
                  <input
                    type="text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    placeholder="© 2025 Your Store"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Show "Powered by Koopi"
                  </label>
                  <button
                    onClick={() => setShowPoweredBy(!showPoweredBy)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showPoweredBy ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showPoweredBy ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="p-12"
              style={{ 
                backgroundColor: heroBackgroundImage ? 'transparent' : '#f9fafb',
                backgroundImage: heroBackgroundImage ? `url(${heroBackgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className={heroBackgroundImage ? 'bg-white/90 backdrop-blur-sm rounded-xl p-8' : ''}>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{heroTitle || 'Hero Title'}</h1>
                <p className="text-lg text-gray-600 mb-6">{heroSubtitle || 'Hero subtitle goes here'}</p>
                <button 
                  className="px-6 py-3 rounded-lg font-medium text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {heroCtaText || 'Shop Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}