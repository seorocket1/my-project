import React, { useState } from 'react';
import { X, User, CreditCard, History, Download, Eye, Image as ImageIcon } from 'lucide-react';
import { User as UserType, supabase } from '../lib/supabase';
import { HistoryImage } from '../types/history';
import { ImagePreviewModal } from './ImagePreviewModal';

interface AccountPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  history: HistoryImage[];
  refreshUser: () => Promise<void>; // Add this prop
}

export const AccountPanel: React.FC<AccountPanelProps> = ({
  isOpen,
  onClose,
  user,
  history,
  refreshUser,
}) => {
  const [previewImage, setPreviewImage] = useState<HistoryImage | null>(null);
  const [activeTab, setActiveTab] = useState<'account' | 'history' | 'branding'>('account');
  const [brandName, setBrandName] = useState(user?.brand_name || '');
  const [brandWebsite, setBrandWebsite] = useState(user?.website_url || '');
  const [brandGuidelines, setBrandGuidelines] = useState(user?.brand_guidelines || '');
  const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const downloadImage = async (image: HistoryImage) => {
    try {
      const response = await fetch(image.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const title = image.title || image.content?.substring(0, 30) || 'image';
      const safeTitle = title.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '-').toLowerCase();
      link.download = `seo-engine-${image.type}-${safeTitle}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const renderAccountDetails = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <p className="text-lg font-semibold text-gray-900">{user?.username}</p>
      </div>
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center">
          <CreditCard className="w-6 h-6 mr-3 text-green-500" />
          <span className="text-lg font-semibold text-gray-900">Credits</span>
        </div>
        <span className="text-2xl font-bold text-green-500">{user?.credits}</span>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
      {history.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-300" />
          <p className="mt-2 text-sm">No images generated yet.</p>
        </div>
      ) : (
        [...history].reverse().map((image) => (
          <div key={image.id} className="bg-gray-50 rounded-lg p-3 border">
            <div className="flex items-center space-x-3">
              <img
                src={image.url}
                alt={image.title || 'Generated image'}
                className="w-12 h-12 object-cover rounded-md border"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{image.title || 'Untitled'}</p>
                <p className="text-xs text-gray-500">{formatDate(image.timestamp)}</p>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => setPreviewImage(image)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => downloadImage(image)} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const handleBrandingSubmit = async () => {
    if (!user || !supabase) return;
    setIsSaving(true);

    let logoUrl = user.brand_logo_url;

    if (brandLogoFile) {
      const { data, error } = await supabase.storage
        .from('brand-logos')
        .upload(`${user.id}/${brandLogoFile.name}`, brandLogoFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Error uploading logo:', error);
        setIsSaving(false);
        return;
      }

      logoUrl = supabase.storage.from('brand-logos').getPublicUrl(data.path).data.publicUrl;
    }

    const { error } = await supabase
      .from('users')
      .update({
        brand_name: brandName,
        website_url: brandWebsite,
        brand_guidelines: brandGuidelines,
        brand_logo_url: logoUrl,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error saving branding:', error);
    } else {
      await refreshUser();
    }

    setIsSaving(false);
  };

  const renderBranding = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Branding Name *</label>
        <input
          type="text"
          className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Brand Website *</label>
        <input
          type="text"
          className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900"
          value={brandWebsite}
          onChange={(e) => setBrandWebsite(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Custom Guidelines *</label>
        <textarea
          className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900"
          value={brandGuidelines}
          onChange={(e) => setBrandGuidelines(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="e.g., Use a professional tone, avoid using stock photos, etc."
          required
        />
        <p className="text-sm text-gray-500 mt-2 text-right">{brandGuidelines.length} / 500</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Brand Logo *</label>
        <input
          type="file"
          className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(e) => setBrandLogoFile(e.target.files ? e.target.files[0] : null)}
          required={!user?.brand_logo_url}
        />
        {user?.brand_logo_url && (
          <img src={user.brand_logo_url} alt="Brand Logo" className="mt-4 w-24 h-24 object-contain rounded-md border" />
        )}
      </div>
      <button
        onClick={handleBrandingSubmit}
        disabled={isSaving}
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : user?.brand_name ? 'Save Changes' : 'Save Branding'}
      </button>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 mr-4">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">My Account</h2>
                <p className="text-blue-100">View your account details and history</p>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6 px-6">
              <button
                onClick={() => setActiveTab('account')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'account'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Account Details
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Image History
              </button>
              <button
                onClick={() => setActiveTab('branding')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'branding'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Branding
              </button>
            </nav>
          </div>
          <div className="p-6 overflow-y-auto">
            {activeTab === 'account' && renderAccountDetails()}
            {activeTab === 'history' && renderHistory()}
            {activeTab === 'branding' && renderBranding()}
          </div>
        </div>
      </div>
      {previewImage && (
        <ImagePreviewModal
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
          imageUrl={previewImage.url}
          imageType={previewImage.type}
          title={previewImage.title}
        />
      )}
    </>
  );
};
