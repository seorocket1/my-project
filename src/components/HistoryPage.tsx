import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Download, Trash2, Eye, Calendar, Image as ImageIcon } from 'lucide-react';
import { HistoryImage } from '../types/history';
import { ImagePreviewModal } from './ImagePreviewModal';

interface HistoryPageProps {
  history: HistoryImage[];
  onRemoveImage: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ history, onRemoveImage, onClearAll }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'blog' | 'infographic'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewImage, setPreviewImage] = useState<HistoryImage | null>(null);

  const filteredHistory = useMemo(() => {
    let filtered = [...history];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(image =>
        image.title?.toLowerCase().includes(query) ||
        image.content?.toLowerCase().includes(query) ||
        image.style?.toLowerCase().includes(query) ||
        image.colour?.toLowerCase().includes(query)
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(image => image.type === filterType);
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }, [history, searchQuery, filterType]);

  const downloadImage = async (image: HistoryImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const title = image.title || image.content?.substring(0, 30) || 'image';
      const safeTitle = title.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '-').toLowerCase();
      link.download = `seo-engine-${image.type}-${safeTitle}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Image History
          </h1>
          <p className="text-gray-600">Browse and manage your generated images</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, content, style, or color..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="blog">Blog Images</option>
                <option value="infographic">Infographics</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-5 h-5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {filteredHistory.length === history.length ? (
                <span>Showing <strong>{history.length}</strong> {history.length === 1 ? 'image' : 'images'}</span>
              ) : (
                <span>Showing <strong>{filteredHistory.length}</strong> of <strong>{history.length}</strong> images</span>
              )}
            </p>
            {history.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete all images? This action cannot be undone.')) {
                    onClearAll();
                  }
                }}
                className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
              >
                Clear All History
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200/50 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              {history.length === 0 ? (
                <ImageIcon className="w-12 h-12 text-gray-400" />
              ) : (
                <Search className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {history.length === 0 ? 'No Images Yet' : 'No Results Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {history.length === 0
                ? 'Start creating images to see them here'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHistory.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="relative aspect-video cursor-pointer" onClick={() => setPreviewImage(image)}>
                  <img
                    src={image.url}
                    alt={image.title || image.content}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">
                    {image.title || (image.content?.substring(0, 30) + '...')}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      image.type === 'blog'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {image.type === 'blog' ? 'Blog' : 'Infographic'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(image.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadImage(image)}
                      className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                      title="Download"
                    >
                      <Download className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this image?')) {
                          onRemoveImage(image.id);
                        }
                      }}
                      className="flex-1 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex items-start gap-6">
                  <div
                    className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden cursor-pointer group-hover:scale-105 transition-transform"
                    onClick={() => setPreviewImage(image)}
                  >
                    <img
                      src={image.url}
                      alt={image.title || image.content}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 truncate">
                        {image.title || (image.content?.substring(0, 50) + '...')}
                      </h3>
                      <span className={`ml-4 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                        image.type === 'blog'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {image.type === 'blog' ? 'Blog Image' : 'Infographic'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {image.content}
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(image.timestamp)}
                      </span>
                      {image.style && (
                        <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
                          Style: {image.style}
                        </span>
                      )}
                      {image.colour && (
                        <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
                          Color: {image.colour}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewImage(image)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => downloadImage(image)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this image?')) {
                            onRemoveImage(image.id);
                          }
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
          imageUrl={previewImage.url}
          imageType={previewImage.type}
          title={previewImage.title}
        />
      )}
    </div>
  );
};
