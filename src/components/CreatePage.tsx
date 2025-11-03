import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, BarChart3, Instagram, Linkedin, Facebook, Lock, ChevronRight, Zap } from 'lucide-react';
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
    description: 'Perfect header images for blog posts',
    icon: ImageIcon,
    gradient: 'from-blue-500 to-cyan-500',
    credits: 5,
    available: true,
    category: 'blog'
  },
  {
    id: 'infographic',
    title: 'Infographic',
    description: 'Transform data into visual stories',
    icon: BarChart3,
    gradient: 'from-purple-500 to-pink-500',
    credits: 10,
    available: true,
    category: 'infographic'
  },
  {
    id: 'instagram-post',
    title: 'Instagram Post',
    description: 'Square posts for Instagram feed',
    icon: Instagram,
    gradient: 'from-pink-500 to-rose-500',
    credits: 5,
    available: false,
    category: 'social'
  },
  {
    id: 'instagram-story',
    title: 'Instagram Story',
    description: 'Vertical stories for Instagram',
    icon: Instagram,
    gradient: 'from-purple-500 to-pink-500',
    credits: 5,
    available: false,
    category: 'social'
  },
  {
    id: 'instagram-carousel',
    title: 'Instagram Carousel',
    description: 'Multi-image carousel posts',
    icon: Instagram,
    gradient: 'from-orange-500 to-pink-500',
    credits: 8,
    available: false,
    category: 'social'
  },
  {
    id: 'instagram-reel-cover',
    title: 'Instagram Reel Cover',
    description: 'Thumbnail for Instagram Reels',
    icon: Instagram,
    gradient: 'from-red-500 to-pink-500',
    credits: 5,
    available: false,
    category: 'social'
  },
  {
    id: 'linkedin-post',
    title: 'LinkedIn Post',
    description: 'Professional posts for LinkedIn',
    icon: Linkedin,
    gradient: 'from-blue-600 to-blue-700',
    credits: 5,
    available: false,
    category: 'social'
  },
  {
    id: 'linkedin-carousel',
    title: 'LinkedIn Carousel',
    description: 'Document-style carousel posts',
    icon: Linkedin,
    gradient: 'from-blue-500 to-indigo-600',
    credits: 10,
    available: false,
    category: 'social'
  },
  {
    id: 'linkedin-article',
    title: 'LinkedIn Article Header',
    description: 'Headers for LinkedIn articles',
    icon: Linkedin,
    gradient: 'from-indigo-500 to-blue-600',
    credits: 5,
    available: false,
    category: 'social'
  },
  {
    id: 'facebook-post',
    title: 'Facebook Post',
    description: 'Engaging Facebook feed posts',
    icon: Facebook,
    gradient: 'from-blue-500 to-blue-600',
    credits: 5,
    available: false,
    category: 'social'
  },
  {
    id: 'facebook-cover',
    title: 'Facebook Cover Photo',
    description: 'Wide cover photos for profiles',
    icon: Facebook,
    gradient: 'from-blue-600 to-indigo-600',
    credits: 7,
    available: false,
    category: 'social'
  },
  {
    id: 'facebook-story',
    title: 'Facebook Story',
    description: 'Vertical stories for Facebook',
    icon: Facebook,
    gradient: 'from-indigo-500 to-purple-600',
    credits: 5,
    available: false,
    category: 'social'
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
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'blog' | 'infographic' | 'instagram' | 'linkedin' | 'facebook'>('all');

  const categories = [
    { id: 'all', label: 'All Types', icon: Sparkles, count: imageTypes.length },
    { id: 'blog', label: 'Blog', icon: ImageIcon, count: imageTypes.filter(t => t.category === 'blog').length },
    { id: 'infographic', label: 'Infographic', icon: BarChart3, count: imageTypes.filter(t => t.category === 'infographic').length },
    { id: 'instagram', label: 'Instagram', icon: Instagram, count: imageTypes.filter(t => t.id.startsWith('instagram')).length },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, count: imageTypes.filter(t => t.id.startsWith('linkedin')).length },
    { id: 'facebook', label: 'Facebook', icon: Facebook, count: imageTypes.filter(t => t.id.startsWith('facebook')).length },
  ];

  const filteredTypes = selectedCategory === 'all'
    ? imageTypes
    : selectedCategory === 'instagram'
    ? imageTypes.filter(t => t.id.startsWith('instagram'))
    : selectedCategory === 'linkedin'
    ? imageTypes.filter(t => t.id.startsWith('linkedin'))
    : selectedCategory === 'facebook'
    ? imageTypes.filter(t => t.id.startsWith('facebook'))
    : imageTypes.filter(t => t.category === selectedCategory);

  const availableTypes = filteredTypes.filter(t => t.available);
  const upcomingTypes = filteredTypes.filter(t => !t.available);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create AI Images
          </h1>
          <p className="text-gray-600">Select an image type to get started</p>
        </div>

        {!selectedType ? (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-10">
              {categories.map((cat) => {
                const CategoryIcon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2.5 ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl scale-105'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-400 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    <CategoryIcon className="w-5 h-5" />
                    {cat.label} <span className={`ml-1 text-sm ${
                      selectedCategory === cat.id ? 'opacity-90' : 'opacity-60'
                    }`}>({cat.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Available Types */}
            {availableTypes.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Now</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableTypes.map((type) => {
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
              </div>
            )}

            {/* Coming Soon Types */}
            {upcomingTypes.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
                  <span className="px-4 py-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
                    Next Update
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-lg border-2 border-gray-300 text-left overflow-hidden group"
                      >
                        {/* Enhanced overlay with better visibility */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/70 to-gray-100/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10">
                          <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                              <Lock className="w-10 h-10 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-1">Coming Soon</p>
                            <p className="text-sm text-gray-600 font-medium">Stay tuned for updates</p>
                          </div>
                        </div>

                        {/* Background content */}
                        <div className="relative opacity-60">
                          <div className="flex items-start justify-between mb-6">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center shadow-lg`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <span className={`px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${type.gradient} text-white shadow-md`}>
                              {type.credits} credits
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {type.title}
                          </h3>
                          <p className="text-gray-700">{type.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
