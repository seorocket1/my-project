import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageType: 'blog' | 'infographic';
  title?: string;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageType,
  title,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.25));
  const resetZoom = () => setZoomLevel(1);

  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `seo-engine-${imageType}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">{title || 'Image Preview'}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={handleZoomOut} disabled={zoomLevel <= 0.25} className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50" title="Zoom Out"><ZoomOut className="w-5 h-5" /></button>
            <button onClick={resetZoom} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Reset Zoom"><RotateCcw className="w-5 h-5" /></button>
            <button onClick={handleZoomIn} disabled={zoomLevel >= 3} className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50" title="Zoom In"><ZoomIn className="w-5 h-5" /></button>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          <div className="flex items-center justify-center min-h-full">
            <img
              src={imageUrl}
              alt={title || 'Preview'}
              className="max-w-none rounded-lg shadow-lg transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            />
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Use zoom controls to inspect details</div>
            <div className="flex items-center space-x-3">
              <button onClick={downloadImage} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300"><Download className="w-4 h-4 mr-2 inline" />Download PNG</button>
              <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
