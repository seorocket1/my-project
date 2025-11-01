import React, { useState } from 'react';
import { Sparkles, Wand2, Image as ImageIcon, BarChart3, Upload, Palette, Ruler, Zap, Package, CheckCircle2 } from 'lucide-react';
import { UnifiedImageForm } from './UnifiedImageForm';
import { ImagePreview } from './ImagePreview';
import { User } from '../lib/supabase';

interface ModernGeneratePageProps {
  user: User | null;
  onSubmit: (data: any) => void;
  isProcessing: boolean;
  generatedImage: { url: string; type: 'blog' | 'infographic' } | null;
  onGenerateNew: () => void;
  onOpenBulkModal: () => void;
  setShowAccountPanel: (show: boolean) => void;
  formData: any;
  isBulkProcessing: boolean;
  bulkProgress: { completed: number; total: number } | null;
}

export const ModernGeneratePage: React.FC<ModernGeneratePageProps> = ({
  user,
  onSubmit,
  isProcessing,
  generatedImage,
  onGenerateNew,
  onOpenBulkModal,
  setShowAccountPanel,
  formData,
  isBulkProcessing,
  bulkProgress
}) => {
  const [selectedType, setSelectedType] = useState<'blog' | 'infographic'>('blog');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create AI Images
          </h1>
          <p className="text-gray-600">Generate stunning blog images and infographics with AI</p>
        </div>

        {/* Image Type Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelectedType('blog')}
            className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 ${
              selectedType === 'blog'
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-500/30 scale-105'
                : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl'
            }`}
          >
            <div className="relative z-10">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                selectedType === 'blog'
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600'
              }`}>
                <ImageIcon className={`w-8 h-8 ${selectedType === 'blog' ? 'text-white' : 'text-white'}`} />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${selectedType === 'blog' ? 'text-white' : 'text-gray-900'}`}>
                Blog Images
              </h3>
              <p className={`text-sm mb-4 ${selectedType === 'blog' ? 'text-blue-100' : 'text-gray-600'}`}>
                Create stunning featured images for your blog posts
              </p>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedType === 'blog'
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  5 credits
                </span>
                {selectedType === 'blog' && (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                )}
              </div>
            </div>
            {selectedType === 'blog' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-transparent" />
            )}
          </button>

          <button
            onClick={() => setSelectedType('infographic')}
            className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 ${
              selectedType === 'infographic'
                ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-2xl shadow-purple-500/30 scale-105'
                : 'bg-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl'
            }`}
          >
            <div className="relative z-10">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                selectedType === 'infographic'
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-purple-500 to-pink-600'
              }`}>
                <BarChart3 className={`w-8 h-8 ${selectedType === 'infographic' ? 'text-white' : 'text-white'}`} />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${selectedType === 'infographic' ? 'text-white' : 'text-gray-900'}`}>
                Infographics
              </h3>
              <p className={`text-sm mb-4 ${selectedType === 'infographic' ? 'text-purple-100' : 'text-gray-600'}`}>
                Transform data into beautiful visual stories
              </p>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedType === 'infographic'
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  10 credits
                </span>
                {selectedType === 'infographic' && (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                )}
              </div>
            </div>
            {selectedType === 'infographic' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/20 to-transparent" />
            )}
          </button>
        </div>

        {/* Form and Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedType === 'blog' ? 'Blog Image Details' : 'Infographic Details'}
              </h2>
              <p className="text-gray-600 mt-1">Fill in the details to generate your image</p>
            </div>
            <div className="p-8">
              <UnifiedImageForm
                imageType={selectedType}
                onSubmit={onSubmit}
                isLoading={isProcessing}
                disabled={isProcessing || isBulkProcessing}
                onOpenBulkModal={onOpenBulkModal}
                user={user}
                setShowAccountPanel={setShowAccountPanel}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden sticky top-6 h-fit">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Preview</h2>
              <p className="text-gray-600 mt-1">Your generated image will appear here</p>
            </div>
            <div className="p-8">
              <ImagePreview
                generatedImage={generatedImage}
                isLoading={isProcessing}
                formData={formData}
                imageType={selectedType}
                onGenerateNew={onGenerateNew}
                isBulkProcessing={isBulkProcessing}
                bulkProgress={bulkProgress}
                onOpenBulkModal={onOpenBulkModal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
