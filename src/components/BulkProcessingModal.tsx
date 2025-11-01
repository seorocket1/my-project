import React, { useState, useEffect } from 'react';
import { X, Package, Plus, Trash2, Download, AlertCircle, CheckCircle, Clock, Wand2, Eye, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { sanitizeFormData } from '../utils/textSanitizer';
import { HistoryImage } from '../types/history';
import { User, saveImageGeneration, supabase } from '../lib/supabase';
import JSZip from 'jszip';
import { ImageUpload } from './ImageUpload';
import { BrandingToggle } from './BrandingToggle';
import { CustomSelect } from './CustomSelect';

interface BulkProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageType: 'blog' | 'infographic';
  onProcessingStateChange: (isProcessing: boolean) => void;
  onProgressUpdate: (progress: { completed: number; total: number }) => void;
  onImageGenerated: (image: HistoryImage) => void;
  onBulkCompleted: (completedCount: number, totalCount: number) => void;
  user: User | null;
  onRefreshUser: () => Promise<void>;
  deductCredits: (userId: string, amount: number) => Promise<number>;
  getCreditCost: (imageType: 'blog' | 'infographic') => number;
  setShowAccountPanel: (show: boolean) => void;
}

interface BulkItem {
  id: string;
  title?: string;
  content: string;
  style?: string;
  customStyle?: string;
  colour?: string;
  customColour?: string;
  imageUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  imageData?: string;
  error?: string;
  useBrand?: boolean;
  dimensions?: string;
  customDimensions?: string;
}

const WEBHOOK_URL = 'https://n8n.seoengine.agency/webhook/6e9e3b30-cb55-4d74-aa9d-68691983455f';

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

export const BulkProcessingModal: React.FC<BulkProcessingModalProps> = ({
  isOpen,
  onClose,
  imageType,
  onProcessingStateChange,
  onProgressUpdate,
  onImageGenerated,
  onBulkCompleted,
  user,
  onRefreshUser,
  deductCredits,
  getCreditCost,
  setShowAccountPanel,
}) => {
  const [bulkItems, setBulkItems] = useState<BulkItem[]>([]);
  const [globalStyle, setGlobalStyle] = useState('');
  const [globalColour, setGlobalColour] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(-1);
  const [previewImage, setPreviewImage] = useState<{ base64: string; title: string } | null>(null);

  useEffect(() => {
    onProcessingStateChange(isProcessing);
    if (isProcessing && bulkItems.length > 0) {
      const completed = bulkItems.filter(item => item.status === 'completed').length;
      onProgressUpdate({ completed, total: bulkItems.length });
    }
  }, [isProcessing, bulkItems, onProcessingStateChange, onProgressUpdate]);

  const addNewItem = () => {
    const newItem: BulkItem = {
      id: `bulk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: imageType === 'blog' ? '' : undefined,
      content: '',
      style: globalStyle || undefined,
      colour: globalColour || undefined,
      status: 'pending',
    };
    setBulkItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, field: keyof BulkItem, value: any) => {
    setBulkItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    setBulkItems(prev => prev.filter(item => item.id !== id));
  };

  const clearAllItems = () => {
    setBulkItems([]);
    setIsProcessing(false);
    setCurrentProcessingIndex(-1);
  };

  const processItem = async (item: BulkItem, index: number): Promise<boolean> => {
    try {
      setBulkItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'processing' } : i));
      setCurrentProcessingIndex(index);

      const finalStyle = item.style === 'custom' ? item.customStyle?.trim() : item.style;
      const finalColour = item.colour === 'custom' ? item.customColour?.trim() : item.colour;
      const finalDimensions = item.dimensions === 'custom' ? item.customDimensions?.trim() : item.dimensions;

      const sanitizedData = sanitizeFormData({
        title: item.title,
        content: item.content,
        style: finalStyle,
        colour: finalColour,
      });

      let imageDetail = imageType === 'blog'
        ? `Blog post title: '${sanitizedData.title}', Content: ${sanitizedData.content}`
        : sanitizedData.content;
      if (sanitizedData.style) imageDetail += `, Style: ${sanitizedData.style}`;
      if (sanitizedData.colour) imageDetail += `, Colour: ${sanitizedData.colour}`;

      const payload = {
        image_type: imageType === 'blog' ? (item.imageUrl ? 'Featured Image with product image' : 'Featured Image') : 'Infographic',
        image_detail: imageDetail,
        ...(item.imageUrl && { image_url: item.imageUrl }),
        ...(item.useBrand && user && {
          use_brand: item.useBrand,
          brand_logo: user.brand_logo_url,
          brand_website: user.website_url,
          brand_guidelines: user.brand_guidelines,
        }),
        ...(finalDimensions && finalDimensions !== 'auto' && { image_size: finalDimensions }),
      };

      const controller = new AbortController();
      const requestTimeout = setTimeout(() => controller.abort(), 120000);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain, */*' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(requestTimeout);

      if (!response.ok) throw new Error(`Service error (${response.status})`);

      const result = await response.json();
      const imageBase64 = result.image;
      if (!imageBase64) throw new Error('No image data in response.');

      const newImageRecord = await saveImageGeneration({
        user_id: user!.id,
        image_type: imageType,
        title: sanitizedData.title,
        content: sanitizedData.content,
        style: sanitizedData.style,
        colour: sanitizedData.colour,
        credits_used: getCreditCost(imageType),
        image_data: imageBase64,
      });

      setBulkItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'completed', imageData: newImageRecord.publicUrl } : i));
      onImageGenerated({
        id: newImageRecord.id,
        type: newImageRecord.image_type as 'blog' | 'infographic',
        title: newImageRecord.title,
        content: newImageRecord.content,
        url: newImageRecord.publicUrl,
        timestamp: new Date(newImageRecord.created_at).getTime(),
        style: newImageRecord.style,
        colour: newImageRecord.colour,
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
      setBulkItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'failed', error: errorMessage } : i));
      return false;
    }
  };

  const startBulkProcessing = async () => {
    const invalidItems = bulkItems.filter(item => !item.content?.trim() || (imageType === 'blog' && !item.title?.trim()));
    if (invalidItems.length > 0) {
      alert('Please fill in all required fields for all items.');
      return;
    }

    if (user) {
      let creditsPerItem = getCreditCost(imageType);
      bulkItems.forEach(item => {
        if (imageType === 'blog' && item.imageUrl) {
          creditsPerItem += 5;
        }
      });
      const estimatedCredits = bulkItems.length * creditsPerItem;
      if (user.credits < estimatedCredits) {
        alert(`Insufficient credits. You may need up to ${estimatedCredits} credits but have ${user.credits}.`);
        return;
      }
    }

    setIsProcessing(true);
    let successCount = 0;
    let totalCreditsUsed = 0;

    for (let i = 0; i < bulkItems.length; i++) {
      const item = bulkItems[i];
      let itemCreditCost = getCreditCost(imageType);
      if (imageType === 'blog' && item.imageUrl) {
        itemCreditCost += 5;
      }

      if (await processItem(bulkItems[i], i)) {
        if (user) {
          try {
            await deductCredits(user.id, itemCreditCost);
            totalCreditsUsed += itemCreditCost;
          } catch (error) {
            console.error('Failed to deduct credits for item:', item.id);
          }
        }
        successCount++;
      }
      if (i < bulkItems.length - 1) await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (user && totalCreditsUsed > 0) {
      await onRefreshUser();
    }

    setIsProcessing(false);
    onBulkCompleted(successCount, bulkItems.length);
  };

  const downloadAllImages = async () => {
    const completedItems = bulkItems.filter(item => item.status === 'completed' && item.imageData);
    if (completedItems.length === 0) return;

    const zip = new JSZip();
    await Promise.all(completedItems.map(async (item) => {
      const response = await fetch(item.imageData!);
      const blob = await response.blob();
      const safeTitle = (item.title || 'image').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      zip.file(`${safeTitle}.png`, blob);
    }));

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `seo-engine-bulk-images.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (!isOpen) return null;

  const completedCount = bulkItems.filter(item => item.status === 'completed').length;
  const totalCreditsNeeded = bulkItems.length * getCreditCost(imageType);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Bulk Image Generation</h2>
                <p className="text-gray-500">Create multiple {imageType} images efficiently.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {bulkItems.map((item, index) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <h4 className="font-semibold text-gray-800">Blog Post {index + 1}</h4>
                  <span className="text-sm text-gray-500 ml-3">Cost: {getCreditCost(imageType)} credits</span>
                </div>
                <button onClick={() => removeItem(item.id)} disabled={isProcessing} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Title *</label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                      disabled={isProcessing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="e.g., The Future of AI in Marketing"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Blog Content / Keywords *</label>
                    <textarea
                      value={item.content}
                      onChange={(e) => updateItem(item.id, 'content', e.target.value)}
                      disabled={isProcessing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      rows={8}
                      placeholder="Enter a summary of your blog post or relevant keywords..."
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image <span className="text-gray-400">(Optional)</span></label>
                    <ImageUpload
                      onUpload={async (file) => {
                        if (!supabase) return;
                        const fileName = `${Date.now()}-${file.name}`;
                        const { data, error } = await supabase.storage.from('temp-images').upload(fileName, file);
                        if (error) { console.error('Error uploading image:', error); return; }
                        const { data: { publicUrl } } = supabase.storage.from('temp-images').getPublicUrl(fileName);
                        updateItem(item.id, 'imageUrl', publicUrl);
                      }}
                      onRemove={() => updateItem(item.id, 'imageUrl', '')}
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Style</label>
                      <CustomSelect label="" options={STYLE_OPTIONS} value={item.style || ''} onChange={(v) => updateItem(item.id, 'style', v)} disabled={isProcessing} />
                      {item.style === 'custom' && (
                        <input
                          type="text"
                          value={item.customStyle || ''}
                          onChange={(e) => updateItem(item.id, 'customStyle', e.target.value)}
                          disabled={isProcessing}
                          className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., futuristic tech..."
                          maxLength={50}
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                      <CustomSelect label="" options={COLOUR_OPTIONS} value={item.colour || ''} onChange={(v) => updateItem(item.id, 'colour', v)} disabled={isProcessing} />
                      {item.colour === 'custom' && (
                        <div className="mt-2 flex gap-2">
                          <input
                            type="color"
                            value={item.customColour?.startsWith('#') ? item.customColour : '#3B82F6'}
                            onChange={(e) => updateItem(item.id, 'customColour', e.target.value)}
                            disabled={isProcessing}
                            className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={item.customColour || ''}
                            onChange={(e) => updateItem(item.id, 'customColour', e.target.value)}
                            disabled={isProcessing}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="#3B82F6 or blue tones..."
                            maxLength={50}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Dimensions</label>
                      <CustomSelect label="" options={DIMENSION_OPTIONS} value={item.dimensions || 'auto'} onChange={(v) => updateItem(item.id, 'dimensions', v)} disabled={isProcessing} />
                      {item.dimensions === 'custom' && (
                        <input
                          type="text"
                          value={item.customDimensions || ''}
                          onChange={(e) => updateItem(item.id, 'customDimensions', e.target.value)}
                          disabled={isProcessing}
                          className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 1600x900"
                          maxLength={20}
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Branding</label>
                      <BrandingToggle user={user} useBrand={item.useBrand || false} setUseBrand={(v) => updateItem(item.id, 'useBrand', v)} setShowAccountPanel={setShowAccountPanel} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addNewItem} disabled={isProcessing} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <Plus className="w-5 h-5 mr-2 inline" /> Add Another Blog Post
          </button>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Cost: {totalCreditsNeeded} Credits</h3>
              <p className="text-sm text-gray-500">{bulkItems.length} images to be generated.</p>
            </div>
            <div className="flex items-center space-x-4">
              {completedCount > 0 && (
                <button onClick={downloadAllImages} disabled={isProcessing} className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                  <Download className="w-5 h-5 mr-2 inline" /> Download ({completedCount})
                </button>
              )}
              <button onClick={startBulkProcessing} disabled={isProcessing || bulkItems.length === 0} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50">
                <Wand2 className="w-5 h-5 mr-2 inline" /> Process All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
