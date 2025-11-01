import React, { useState } from 'react';
import { Sparkles, Wand2, Image as ImageIcon, BarChart3, Zap, Package, ChevronRight } from 'lucide-react';
import { ImprovedImageForm } from './ImprovedImageForm';
import { ImagePreview } from './ImagePreview';
import { User } from '../lib/supabase';

interface CreatePageProps {
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

const imageTypes = [
  {
    id: 'blog',
    title: 'Blog Featured Image',
    description: 'Perfect header images for blog posts and articles',
    icon: ImageIcon,
    color: 'blue',
    credits: 5,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'infographic',
    title: 'Infographic',
    description: 'Transform data into beautiful visual stories',
    icon: BarChart3,
    color: 'purple',
    credits: 10,
    gradient: 'from-purple-500 to-pink-500',
  },
];

export const CreatePage: React.FC<CreatePageProps> = ({
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
  const [selectedType, setSelectedType] = useState<'blog' | 'infographic' | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create AI Images
          </h1>
          <p className="text-gray-600">Select an image type to get started</p>
        </div>

        {!selectedType ? (
          <>
            {/* Image Type Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {imageTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id as any)}
                    className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <span className={`px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${type.gradient} text-white`}>
                        {type.credits} credits
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {type.title}
                    </h3>
                    <p className="text-gray-600 mb-6">{type.description}</p>
                    <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                      <span>Get Started</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bulk Processing Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 shadow-2xl text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Bulk Processing</h3>
                  </div>
                  <p className="text-emerald-100 mb-4">
                    Generate multiple images at once. Perfect for batch creating blog images or infographics.
                  </p>
                  <button
                    onClick={onOpenBulkModal}
                    disabled={isProcessing || isBulkProcessing}
                    className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Bulk Processing
                  </button>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Package className="w-16 h-16 text-white/50" />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={() => {
                setSelectedType(null);
                onGenerateNew();
              }}
              className="mb-6 px-4 py-2 bg-white rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              Back to Selection
            </button>

            {/* Selected Type Header */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {imageTypes.map((type) => {
                    if (type.id === selectedType) {
                      const Icon = type.icon;
                      return (
                        <React.Fragment key={type.id}>
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center`}>
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">{type.title}</h2>
                            <p className="text-gray-600">{type.description}</p>
                          </div>
                        </React.Fragment>
                      );
                    }
                    return null;
                  })}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Cost per image</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {imageTypes.find(t => t.id === selectedType)?.credits} <span className="text-lg text-gray-500">credits</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Form and Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form - Takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      Image Details
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">Provide information to generate your image</p>
                  </div>
                  <div className="p-8">
                    <ImprovedImageForm
                      imageType={selectedType}
                      onSubmit={onSubmit}
                      isLoading={isProcessing}
                      disabled={isProcessing || isBulkProcessing}
                      user={user}
                      setShowAccountPanel={setShowAccountPanel}
                    />
                  </div>
                </div>
              </div>

              {/* Preview - Takes 1 column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 overflow-hidden sticky top-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-purple-600" />
                      Preview
                    </h3>
                  </div>
                  <div className="p-6">
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
          </>
        )}
      </div>
    </div>
  );
};
