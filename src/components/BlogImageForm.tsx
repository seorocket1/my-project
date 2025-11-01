import React, { useState } from 'react';
import { BrandingToggle } from './BrandingToggle';
import { FileText, Wand2, Package, ChevronDown } from 'lucide-react';
import { sanitizeFormData } from '../utils/textSanitizer';
import { ImageUpload } from './ImageUpload';
import { supabase } from '../lib/supabase';
import { CustomSelect } from './CustomSelect';

interface BlogImageFormProps {
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
  { value: 'custom', label: 'Custom (specify below)' },
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
  { value: 'custom', label: 'Custom (specify below)' },
];

const DIMENSION_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: '1280x855', label: 'Landscape (1280x855)' },
  { value: '1920x1080', label: 'Full HD (1920x1080)' },
  { value: '1080x1080', label: 'Square (1080x1080)' },
];

export const BlogImageForm: React.FC<BlogImageFormProps> = ({ 
  onSubmit, 
  isLoading, 
  disabled = false,
  onOpenBulkModal,
  user,
  setShowAccountPanel
}) => {
  const [title, setTitle] = useState('');
  const [intro, setIntro] = useState('');
  const [style, setStyle] = useState('');
  const [customStyle, setCustomStyle] = useState('');
  const [colour, setColour] = useState('');
  const [customColour, setCustomColour] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [useBrand, setUseBrand] = useState(false);
  const [dimensions, setDimensions] = useState('auto');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && intro.trim()) {
      onSubmit({
        title: title.trim(),
        intro: intro.trim(),
        content: intro.trim(),
        style: style === 'custom' ? customStyle : style,
        colour: colour === 'custom' ? customColour : colour,
        image_url: imageUrl,
        use_brand: useBrand,
        image_size: dimensions,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
      <div className="space-y-6 flex-1">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
            Blog Title
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

        <div className="flex-1 flex flex-col">
          <label htmlFor="intro" className="block text-sm font-semibold text-gray-900 mb-3">
            Blog Content / Keywords
          </label>
          <textarea
            id="intro"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            disabled={disabled}
            className="w-full flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none min-h-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter your blog content, summary, or keywords that should influence the visual design..."
            required
            maxLength={2000}
          />
          <p className="text-sm text-gray-500 mt-2">
            Provide blog content, theme, keywords, or any details that should influence the featured image design. ({intro.length} / 2000)
          </p>
        </div>

        <BrandingToggle
          user={user}
          useBrand={useBrand}
          setUseBrand={setUseBrand}
          setShowAccountPanel={setShowAccountPanel}
        />

        <ImageUpload
          onUpload={handleImageUpload}
          onRemove={() => setImageUrl('')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CustomSelect
            label="Style"
            options={STYLE_OPTIONS}
            value={style}
            onChange={setStyle}
            disabled={disabled}
          />
          <CustomSelect
            label="Colour"
            options={COLOUR_OPTIONS}
            value={colour}
            onChange={setColour}
            disabled={disabled}
          />
          <CustomSelect
            label="Dimensions"
            options={DIMENSION_OPTIONS}
            value={dimensions}
            onChange={setDimensions}
            disabled={disabled}
          />
        </div>

      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={!title.trim() || !intro.trim() || isLoading || disabled}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Generating Image...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Featured Image
            </div>
          )}
        </button>

        {onOpenBulkModal && (
          <button
            type="button"
            onClick={onOpenBulkModal}
            disabled={isLoading || disabled}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100"
          >
            <div className="flex items-center justify-center">
              <Package className="w-5 h-5 mr-2" />
              Bulk Process Multiple Blogs
            </div>
          </button>
        )}
      </div>
    </form>
  );
};
