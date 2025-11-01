import React, { useState, useMemo } from 'react';
import { X, History, Download, Trash2, Image as ImageIcon, RefreshCw, Eye, Search, Filter, Grid, List } from 'lucide-react';
import { HistoryImage } from '../types/history';
import { ImagePreviewModal } from './ImagePreviewModal';

interface ImageHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryImage[];
  isLoading: boolean;
  clearHistory: () => void;
  removeImage: (id: string) => void;
  forceRefresh: () => void;
  onSelectImage: (image: HistoryImage) => void; // Add this prop
}

export const ImageHistorySidebar: React.FC<ImageHistorySidebarProps> = ({
  isOpen,
  onClose,
  history,
  isLoading,
  clearHistory,
  removeImage,
  forceRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewImage, setPreviewImage] = useState<HistoryImage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'blog' | 'infographic'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await forceRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

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

    return filtered.reverse();
  }, [history, searchQuery, filterType]);

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

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 mr-3">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Image History</h3>
                <p className="text-sm text-gray-600">
                  {isLoading ? 'Loading...' : `${history.length} images generated`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                title="Refresh History"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, content, style..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'blog' | 'infographic')}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="blog">Blog Images</option>
                  <option value="infographic">Infographics</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>

            {(searchQuery || filterType !== 'all') && (
              <div className="text-xs text-gray-500">
                Showing {filteredHistory.length} of {history.length} images
              </div>
            )}
          </div>

          {/* History List */}
          <div className={`flex-1 overflow-y-auto p-4 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-4'}`}>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center text-gray-500 py-12 col-span-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Images Yet</h4>
                <p className="text-sm">Start creating to see your history here!</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center text-gray-500 py-12 col-span-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h4>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredHistory.map((image) => (
                viewMode === 'grid' ? (
                  <div key={image.id} className="bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                    <div className="relative pb-[60%]">
                      <img
                        src={image.url}
                        alt={image.title || image.content}
                        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                        onClick={() => setPreviewImage(image)}
                      />
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {image.title || (image.content?.substring(0, 25) + '...')}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        image.type === 'blog'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {image.type === 'blog' ? 'Blog' : 'Infographic'}
                      </span>
                      <div className="flex items-center gap-1 pt-1">
                        <button
                          onClick={() => setPreviewImage(image)}
                          className="flex-1 p-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-3 h-3 mx-auto" />
                        </button>
                        <button
                          onClick={() => downloadImage(image)}
                          className="flex-1 p-1.5 text-xs font-medium text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Download"
                        >
                          <Download className="w-3 h-3 mx-auto" />
                        </button>
                        <button
                          onClick={() => removeImage(image.id)}
                          className="flex-1 p-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3 h-3 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={image.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="flex-shrink-0 cursor-pointer" onClick={() => setPreviewImage(image)}>
                        <img
                          src={image.url}
                          alt={image.title || image.content}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                          {image.title || (image.content?.substring(0, 40) + '...')}
                        </p>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            image.type === 'blog'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {image.type === 'blog' ? 'Blog Image' : 'Infographic'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDate(image.timestamp)}
                        </p>
                        {(image.style || image.colour) && (
                          <div className="flex items-center space-x-2 mt-1">
                            {image.style && (
                              <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                                {image.style}
                              </span>
                            )}
                            {image.colour && (
                              <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                                {image.colour}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setPreviewImage(image)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Preview Image"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </button>
                      <button
                        onClick={() => downloadImage(image)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download Image"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                      <button
                        onClick={() => removeImage(image.id)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove from History"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                )
              ))
            )}
          </div>

          {/* Footer */}
          {history.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
                    clearHistory();
                  }
                }}
                className="w-full py-3 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center font-medium"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All History
              </button>
            </div>
          )}
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
