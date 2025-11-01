import React, { useState } from 'react';
import { BrandingToggle } from './BrandingToggle';
import { Wand2, Package, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { supabase } from '../lib/supabase';
import { CustomSelect } from './CustomSelect';

interface UnifiedImageFormProps {
  imageType: 'blog' | 'infographic';
  onSubmit: (data: { [key: string]: any }) => void;
  isLoading: boolean;
  disabled?: boolean;
  onOpenBulkModal?: () => void;
  user: any;
  setShowAccountPanel: (show: boolean) => void;
}

const STYLE_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'very simple', label: 'Very Simple' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'modern', label: 'Modern' },
  { value: 'professional', label: 'Professional' },
  { value: 'creative', label: 'Creative' },
  { value: 'elegant', label: 'Elegant' },
  { value: 'bold', label: 'Bold' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'custom', label: 'Custom Style' },
];

const COLOUR_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'pink', label: 'Pink' },
  { value: 'teal', label: 'Teal' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'gray', label: 'Gray' },
  { value: 'multicolor', label: 'Multicolor' },
  { value: 'custom', label: 'Custom Color' },
];

const DIMENSION_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: '1280x855', label: 'Landscape (1280x855)' },
  { value: '1920x1080', label: 'Full HD (1920x1080)' },
  { value: '1080x1080', label: 'Square (1080x1080)' },
  { value: 'custom', label: 'Custom Dimensions' },
];

export const UnifiedImageForm: React.FC<UnifiedImageFormProps> = ({
  imageType,
  onSubmit,
  isLoading,
  disabled = false,
  onOpenBulkModal,
  user,
  setShowAccountPanel
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [style, setStyle] = useState('');
  const [customStyle, setCustomStyle] = useState('');
  const [colour, setColour] = useState('');
  const [customColour, setCustomColour] = useState('');
  const [dimensions, setDimensions] = useState('auto');
  const [customDimensions, setCustomDimensions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [useBrand, setUseBrand] = useState(false);

  const isBlog = imageType === 'blog';
  const maxContentLength = isBlog ? 2000 : 4000;

  const handleImageUpload = async (file: File) => {
    if (!supabase) return;
    setIsUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('temp-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('temp-images')
      .getPublicUrl(fileName);

    setImageUrl(publicUrl);
    setIsUploading(false);
  };

  const calculateCreditCost = () => {
    let cost = isBlog ? 5 : 10;
    if (isBlog && imageUrl) {
      cost += 5;
    }
    return cost;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = isBlog ? (title.trim() && content.trim()) : content.trim();

    if (isValid) {
      const finalStyle = style === 'custom' ? customStyle.trim() : style;
      const finalColour = colour === 'custom' ? customColour.trim() : colour;
      const finalDimensions = dimensions === 'custom' ? customDimensions.trim() : dimensions;

      onSubmit({
        title: isBlog ? title.trim() : 'Infographic',
        intro: content.trim(),
        content: content.trim(),
        style: finalStyle,
        colour: finalColour,
        image_url: imageUrl,
        use_brand: useBrand,
        image_size: finalDimensions,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
      <div className="space-y-6 flex-1">
        {isBlog && (
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
              Blog Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={disabled}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your blog title..."
              required
              maxLength={150}
            />
            <p className="text-sm text-gray-500 mt-2 text-right">{title.length} / 150</p>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-3">
            {isBlog ? 'Blog Content / Keywords *' : 'Content to Visualize *'}
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={disabled}
            className="w-full flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none min-h-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder={
              isBlog
                ? 'Enter your blog content, summary, or keywords that should influence the visual design...'
                : 'Enter the content, data points, statistics, or key points you want to visualize as an infographic...'
            }
            required
            maxLength={maxContentLength}
          />
          <p className="text-sm text-gray-500 mt-2">
            {isBlog
              ? `Provide blog content, theme, keywords, or any details that should influence the featured image design. (${content.length} / ${maxContentLength})`
              : `Include data points, statistics, key points, processes, or any content you want to transform into a visual. (${content.length} / ${maxContentLength})`
            }
          </p>
        </div>

        <BrandingToggle
          user={user}
          useBrand={useBrand}
          setUseBrand={setUseBrand}
          setShowAccountPanel={setShowAccountPanel}
        />

        {isBlog && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Custom Product Image <span className="text-gray-500 font-normal">(Optional, +5 credits)</span>
            </label>
            <ImageUpload
              onUpload={handleImageUpload}
              onRemove={() => setImageUrl('')}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="style" className="block text-sm font-semibold text-gray-900 mb-3">
              Style <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <CustomSelect
              options={STYLE_OPTIONS}
              value={style}
              onChange={setStyle}
              disabled={disabled}
            />
            {style === 'custom' && (
              <input
                type="text"
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                disabled={disabled}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="e.g., futuristic tech, hand-drawn..."
                maxLength={50}
              />
            )}
          </div>

          <div>
            <label htmlFor="colour" className="block text-sm font-semibold text-gray-900 mb-3">
              Color <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <CustomSelect
              options={COLOUR_OPTIONS}
              value={colour}
              onChange={setColour}
              disabled={disabled}
            />
            {colour === 'custom' && (
              <div className="mt-2 flex gap-2">
                <input
                  type="color"
                  value={customColour.startsWith('#') ? customColour : '#3B82F6'}
                  onChange={(e) => setCustomColour(e.target.value)}
                  disabled={disabled}
                  className="w-16 h-11 rounded-lg border border-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <input
                  type="text"
                  value={customColour}
                  onChange={(e) => setCustomColour(e.target.value)}
                  disabled={disabled}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="#3B82F6 or blue tones..."
                  maxLength={50}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="dimensions" className="block text-sm font-semibold text-gray-900 mb-3">
              Dimensions <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <CustomSelect
              options={DIMENSION_OPTIONS}
              value={dimensions}
              onChange={setDimensions}
              disabled={disabled}
            />
            {dimensions === 'custom' && (
              <input
                type="text"
                value={customDimensions}
                onChange={(e) => setCustomDimensions(e.target.value)}
                disabled={disabled}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="e.g., 1600x900"
                maxLength={20}
              />
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Credit Cost</p>
              <p className="text-xs text-gray-600 mt-1">
                {isBlog ? 'Blog Image: 5 credits' : 'Infographic: 10 credits'}
                {isBlog && imageUrl && ' + Custom Image: 5 credits'}
              </p>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {calculateCreditCost()} credits
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={
            (isBlog ? (!title.trim() || !content.trim()) : !content.trim()) ||
            isLoading ||
            disabled
          }
          className={`w-full py-4 px-6 rounded-xl ${
            isBlog
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500'
          } text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Generating {isBlog ? 'Blog Image' : 'Infographic'}...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Wand2 className="w-5 h-5 mr-2" />
              Generate {isBlog ? 'Featured Image' : 'Infographic'}
            </div>
          )}
        </button>

        {onOpenBulkModal && (
          <button
            type="button"
            onClick={onOpenBulkModal}
            disabled={isLoading || disabled}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            <div className="flex items-center justify-center">
              <Package className="w-5 h-5 mr-2" />
              Bulk Process Multiple {isBlog ? 'Blogs' : 'Infographics'}
            </div>
          </button>
        )}
      </div>
    </form>
  );
};
