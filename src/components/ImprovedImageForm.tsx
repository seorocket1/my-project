import React, { useState } from 'react';
import { Wand2, Upload, Palette, Ruler, Sparkles, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { BrandingToggle } from './BrandingToggle';
import { supabase } from '../lib/supabase';

interface ImprovedImageFormProps {
  imageType: 'blog' | 'infographic';
  onSubmit: (data: any) => void;
  isLoading: boolean;
  disabled?: boolean;
  user: any;
  setShowAccountPanel: (show: boolean) => void;
}

export const ImprovedImageForm: React.FC<ImprovedImageFormProps> = ({
  imageType,
  onSubmit,
  isLoading,
  disabled = false,
  user,
  setShowAccountPanel
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    style: '',
    colour: '',
    customColour: '',
    dimensions: 'auto',
    customWidth: '',
    customHeight: '',
    imageUrl: '',
    useBrand: false
  });
  const [isUploading, setIsUploading] = useState(false);

  const isBlog = imageType === 'blog';

  const handleImageUpload = async (file: File) => {
    if (!supabase) return;
    setIsUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('temp-images')
      .upload(fileName, file);

    if (!error) {
      const { data: { publicUrl } } = supabase.storage
        .from('temp-images')
        .getPublicUrl(fileName);
      setFormData({ ...formData, imageUrl: publicUrl });
    }
    setIsUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: any = {
      content: formData.content,
      style: formData.style,
      colour: formData.colour === 'custom' ? formData.customColour : formData.colour,
      use_brand: formData.useBrand
    };

    if (isBlog) {
      submitData.title = formData.title;
      submitData.intro = '';
    }

    if (formData.imageUrl) {
      submitData.image_url = formData.imageUrl;
    }

    if (formData.dimensions === 'custom' && formData.customWidth && formData.customHeight) {
      submitData.image_size = `${formData.customWidth}x${formData.customHeight}`;
    } else if (formData.dimensions !== 'auto') {
      submitData.image_size = formData.dimensions;
    }

    onSubmit(submitData);
  };

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const colorOptions = [
    { value: '', label: 'Default Colors' },
    { value: 'blue', label: 'Blue Tones' },
    { value: 'red', label: 'Red Tones' },
    { value: 'green', label: 'Green Tones' },
    { value: 'purple', label: 'Purple Tones' },
    { value: 'orange', label: 'Orange Tones' },
    { value: 'yellow', label: 'Yellow Tones' },
    { value: 'pink', label: 'Pink Tones' },
    { value: 'teal', label: 'Teal Tones' },
    { value: 'custom', label: 'Custom Color' },
  ];

  const dimensionOptions = [
    { value: 'auto', label: 'Auto (Recommended)' },
    { value: '1280x855', label: 'Landscape - 1280x855' },
    { value: '1920x1080', label: 'Full HD - 1920x1080' },
    { value: '1080x1080', label: 'Square - 1080x1080' },
    { value: 'custom', label: 'Custom Size' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Content Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-blue-100">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h4 className="font-bold text-gray-900 text-lg">Content</h4>
        </div>

        {isBlog && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter your blog post title..."
              required
              disabled={disabled}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {isBlog ? 'Content / Description' : 'Infographic Content'} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => updateField('content', e.target.value)}
            placeholder={
              isBlog
                ? 'Describe what your blog post is about...'
                : 'Enter the data points and information for your infographic...'
            }
            required
            rows={6}
            disabled={disabled}
            maxLength={isBlog ? 2000 : 4000}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
          />
          <p className="text-xs text-gray-500 mt-2">
            {formData.content.length} / {isBlog ? 2000 : 4000} characters
          </p>
        </div>
      </div>

      {/* Product Image Upload (Blog only) */}
      {isBlog && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-purple-100">
            <Upload className="w-5 h-5 text-purple-600" />
            <h4 className="font-bold text-gray-900 text-lg">Product Image (Optional)</h4>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <p className="text-sm text-purple-900 mb-3">
              Upload a product image to include in your featured image (+5 credits)
            </p>
            <ImageUpload
              onImageUpload={handleImageUpload}
              isUploading={isUploading}
              uploadedImageUrl={formData.imageUrl}
              disabled={disabled || isUploading}
            />
          </div>
        </div>
      )}

      {/* Style Customization */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-green-100">
          <Palette className="w-5 h-5 text-green-600" />
          <h4 className="font-bold text-gray-900 text-lg">Style & Colors</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image Style
            </label>
            <input
              type="text"
              value={formData.style}
              onChange={(e) => updateField('style', e.target.value)}
              placeholder="e.g., modern, minimalist, professional..."
              disabled={disabled}
              maxLength={50}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">2-3 words describing the style</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Color Scheme
            </label>
            <div className="relative">
              <select
                value={formData.colour}
                onChange={(e) => updateField('colour', e.target.value)}
                disabled={disabled}
                className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 bg-white cursor-pointer transition-all appearance-none"
                style={{ backgroundImage: 'none' }}
              >
                {colorOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {formData.colour === 'custom' && (
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Custom Color
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={formData.customColour}
                onChange={(e) => updateField('customColour', e.target.value)}
                placeholder="#3B82F6 or blue tones"
                disabled={disabled}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
              />
              <input
                type="color"
                value={formData.customColour.startsWith('#') ? formData.customColour : '#3B82F6'}
                onChange={(e) => updateField('customColour', e.target.value)}
                disabled={disabled}
                className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer disabled:opacity-50"
              />
            </div>
          </div>
        )}
      </div>

      {/* Dimensions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-orange-100">
          <Ruler className="w-5 h-5 text-orange-600" />
          <h4 className="font-bold text-gray-900 text-lg">Dimensions</h4>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Image Size
          </label>
          <div className="relative">
            <select
              value={formData.dimensions}
              onChange={(e) => updateField('dimensions', e.target.value)}
              disabled={disabled}
              className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 bg-white cursor-pointer transition-all appearance-none"
              style={{ backgroundImage: 'none' }}
            >
              {dimensionOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {formData.dimensions === 'custom' && (
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Enter Custom Dimensions
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={formData.customWidth}
                onChange={(e) => updateField('customWidth', e.target.value)}
                placeholder="Width"
                min="100"
                max="4096"
                disabled={disabled}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
              />
              <span className="text-gray-500 font-bold">×</span>
              <input
                type="number"
                value={formData.customHeight}
                onChange={(e) => updateField('customHeight', e.target.value)}
                placeholder="Height"
                min="100"
                max="4096"
                disabled={disabled}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Pixels (min: 100, max: 4096)</p>
          </div>
        )}
      </div>

      {/* Branding */}
      {user && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b-2 border-indigo-100">
            <ImageIcon className="w-5 h-5 text-indigo-600" />
            <h4 className="font-bold text-gray-900 text-lg">Branding</h4>
          </div>

          <BrandingToggle
            user={user}
            useBrand={formData.useBrand}
            setUseBrand={(value) => updateField('useBrand', value)}
            setShowAccountPanel={setShowAccountPanel}
          />
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={disabled || isLoading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-6 h-6" />
              Generate {isBlog ? 'Blog Image' : 'Infographic'}
            </>
          )}
        </button>

        <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-900 font-semibold">
            Credit Cost: {isBlog ? 5 : 10} credits
            {formData.imageUrl && isBlog && ' + 5 credits for product image'}
          </p>
        </div>
      </div>
    </form>
  );
};
