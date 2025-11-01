import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Sparkles, ZoomIn, Lightbulb, Brush, Palette, Zap, Package, Eye, Clock } from 'lucide-react';
import { ImageDownload } from './ImageDownload';
import { ImagePreviewModal } from './ImagePreviewModal';

interface ImagePreviewProps {
  isLoading: boolean;
  generatedImage: { url: string; type: 'blog' | 'infographic' } | null;
  formData: any;
  imageType: 'blog' | 'infographic' | null;
  onGenerateNew: () => void;
  isBulkProcessing?: boolean;
  bulkProgress?: { completed: number; total: number } | null;
  onOpenBulkModal?: () => void;
  // Add these props as they are passed from App.tsx
  onDownload?: () => void;
  onBack?: () => void;
  currentStep?: 'select' | 'form' | 'result';
  selectedType?: 'blog' | 'infographic' | null;
}

const LOADING_STEPS = [
  { text: "Understanding your creative vision...", icon: Lightbulb, color: "text-yellow-500", bgColor: "bg-yellow-50" },
  { text: "Ideating stunning concepts...", icon: Sparkles, color: "text-purple-500", bgColor: "bg-purple-50" },
  { text: "Dipping the digital brush...", icon: Brush, color: "text-blue-500", bgColor: "bg-blue-50" },
  { text: "Opening the creative canvas...", icon: Palette, color: "text-green-500", bgColor: "bg-green-50" },
  { text: "Painting your masterpiece...", icon: ImageIcon, color: "text-pink-500", bgColor: "bg-pink-50" },
  { text: "Adding final touches...", icon: Zap, color: "text-orange-500", bgColor: "bg-orange-50" },
];

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  isLoading,
  generatedImage,
  formData,
  imageType,
  onGenerateNew,
  isBulkProcessing = false,
  bulkProgress,
  onOpenBulkModal,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFullPreview, setShowFullPreview] = useState(false);

  useEffect(() => {
    if (generatedImage) {
      console.log('ImagePreview.tsx received generatedImage:', generatedImage);
    }
  }, [generatedImage]);

  // Cycle through loading steps every 10 seconds
  useEffect(() => {
    if (!isLoading && !isBulkProcessing) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % LOADING_STEPS.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [isLoading, isBulkProcessing]);

  // Reset step when loading starts
  useEffect(() => {
    if (isLoading || isBulkProcessing) {
      setCurrentStep(0);
    }
  }, [isLoading, isBulkProcessing]);

  const renderBulkProcessingContent = () => {
    const currentLoadingStep = LOADING_STEPS[currentStep];
    const StepIcon = currentLoadingStep.icon;
    const progressPercentage = bulkProgress ? (bulkProgress.completed / bulkProgress.total) * 100 : 0;
    
    // Check if bulk processing is actually complete
    const isBulkComplete = bulkProgress && bulkProgress.completed === bulkProgress.total && bulkProgress.total > 0;

    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        {/* Show completion state if bulk is done */}
        {isBulkComplete ? (
          <>
            {/* Completion Animation */}
            <div className="relative mb-8 p-6 rounded-2xl bg-green-50 border border-green-200">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <Package className="w-10 h-10 text-green-600" />
                </div>
              </div>
            </div>

            {/* Completion Information */}
            <div className="space-y-4 max-w-md">
              <h3 className="text-2xl font-bold text-gray-900">Bulk Processing Complete!</h3>
              
              {/* Final Results */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-green-700">Final Results</span>
                  <span className="text-sm text-green-600">
                    {bulkProgress.completed}/{bulkProgress.total} completed
                  </span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full w-full" />
                </div>
                <p className="text-xs text-green-600 mt-2">100% complete</p>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                {onOpenBulkModal && (
                  <button
                    onClick={onOpenBulkModal}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    <div className="flex items-center justify-center">
                      <Eye className="w-5 h-5 mr-2" />
                      View & Download Results
                    </div>
                  </button>
                )}
                
                <button
                  onClick={onGenerateNew}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  Generate New Images
                </button>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  All images saved to history
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Processing Animation */}
            <div className={`relative mb-8 p-6 rounded-2xl ${currentLoadingStep.bgColor} border border-opacity-20 transition-all duration-1000`}>
              <div className="relative">
                {/* Pulsing Background Circle */}
                <div className={`w-20 h-20 rounded-full ${currentLoadingStep.color.replace('text-', 'bg-')} opacity-20 animate-pulse absolute inset-0`}></div>
                
                {/* Main Icon */}
                <div className="relative w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <Package className={`w-10 h-10 ${currentLoadingStep.color} animate-pulse`} />
                </div>
                
                {/* Rotating Border */}
                <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-current animate-spin opacity-30" style={{ color: currentLoadingStep.color.replace('text-', '') }}></div>
              </div>
            </div>

            {/* Bulk Processing Information */}
            <div className="space-y-4 max-w-md">
              <h3 className="text-2xl font-bold text-gray-900">Bulk Processing Active</h3>
              
              {/* Progress Display */}
              {bulkProgress && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-700">Progress</span>
                    <span className="text-sm text-blue-600">
                      {bulkProgress.completed}/{bulkProgress.total} completed
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    {Math.round(progressPercentage)}% complete
                  </p>
                </div>
              )}
              
              {/* Current Step Display */}
              <div className={`p-4 rounded-xl ${currentLoadingStep.bgColor} border border-opacity-20`}>
                <div className="flex items-center justify-center mb-2">
                  <StepIcon className={`w-5 h-5 mr-3 ${currentLoadingStep.color} animate-pulse`} />
                  <p className={`font-semibold ${currentLoadingStep.color}`}>
                    Step {currentStep + 1} of {LOADING_STEPS.length}
                  </p>
                </div>
                <p className="text-gray-700 font-medium animate-pulse">
                  {currentLoadingStep.text}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${currentLoadingStep.color.replace('text-', 'bg-')}`}
                  style={{ width: `${((currentStep + 1) / LOADING_STEPS.length) * 100}%` }}
                />
              </div>

              {/* View Details Button */}
              {onOpenBulkModal && (
                <button
                  onClick={onOpenBulkModal}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  <div className="flex items-center justify-center">
                    <Eye className="w-5 h-5 mr-2" />
                    View Processing Details
                  </div>
                </button>
              )}

              {/* Additional Info */}
              <div className="flex items-center justify-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  SEO Engine AI at work
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Processing in background
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderPreviewContent = () => {
    // Show bulk processing state if bulk is active
    if (isBulkProcessing) {
      return renderBulkProcessingContent();
    }

    if (isLoading) {
      const currentLoadingStep = LOADING_STEPS[currentStep];
      const StepIcon = currentLoadingStep.icon;

      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          {/* Animated Loading Container */}
          <div className={`relative mb-8 p-6 rounded-2xl ${currentLoadingStep.bgColor} border border-opacity-20 transition-all duration-1000`}>
            <div className="relative">
              {/* Pulsing Background Circle */}
              <div className={`w-20 h-20 rounded-full ${currentLoadingStep.color.replace('text-', 'bg-')} opacity-20 animate-pulse absolute inset-0`}></div>
              
              {/* Main Icon */}
              <div className="relative w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center">
                <StepIcon className={`w-10 h-10 ${currentLoadingStep.color} animate-pulse`} />
              </div>
              
              {/* Rotating Border */}
              <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-current animate-spin opacity-30" style={{ color: currentLoadingStep.color.replace('text-', '') }}></div>
            </div>
          </div>

          {/* Step Information */}
          <div className="space-y-4 max-w-md">
            <h3 className="text-2xl font-bold text-gray-900">Generating Your Image</h3>
            
            {/* Current Step Display */}
            <div className={`p-4 rounded-xl ${currentLoadingStep.bgColor} border border-opacity-20`}>
              <div className="flex items-center justify-center mb-2">
                <StepIcon className={`w-5 h-5 mr-3 ${currentLoadingStep.color} animate-pulse`} />
                <p className={`font-semibold ${currentLoadingStep.color}`}>
                  Step {currentStep + 1} of {LOADING_STEPS.length}
                </p>
              </div>
              <p className="text-gray-700 font-medium animate-pulse">
                {currentLoadingStep.text}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${currentLoadingStep.color.replace('text-', 'bg-')}`}
                style={{ width: `${((currentStep + 1) / LOADING_STEPS.length) * 100}%` }}
              />
            </div>

            {/* Additional Info */}
            <div className="flex items-center justify-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                SEO Engine AI at work
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div>Usually takes 30-60 seconds</div>
            </div>
          </div>
        </div>
      );
    }

    if (generatedImage) {
      return (
        <div className="h-full flex flex-col">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Your {generatedImage.type === 'blog' ? 'Featured' : 'Infographic'} Image
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">Choose format and download your image</p>
              </div>
              <button
                onClick={() => setShowFullPreview(true)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
              >
                <ZoomIn className="w-4 h-4 mr-2" />
                Full Preview
              </button>
            </div>
            <div className="flex items-center text-xs text-gray-500 mt-2">
              <Sparkles className="w-3 h-3 mr-1" />
              Generated by SEO Engine AI
            </div>
          </div>
          
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {/* Quick Preview */}
            <div className="mb-6">
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-inner cursor-pointer" onClick={() => setShowFullPreview(true)}>
            <img
              src={generatedImage.url}
              alt={`Generated ${generatedImage.type} image`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
              <p className="text-sm text-gray-500 text-center mt-2">Click to view full size</p>
            </div>

            <ImageDownload
              imageUrl={generatedImage.url}
              imageType={generatedImage.type}
            />
            
            <div className="mt-6">
              <button
                onClick={onGenerateNew}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                Generate Another Image
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (formData) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Generate</h3>
          <p className="text-gray-600 mb-4">Click the generate button to create your image with SEO Engine AI</p>
          <div className="bg-gray-50 rounded-xl p-4 max-w-sm">
            <p className="text-sm text-gray-600">
              {imageType === 'blog' 
                ? `Title: "${formData.title}"`
                : `Content: "${formData.content?.substring(0, 50)}..."`
              }
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Image Preview</h3>
        <p className="text-gray-600 mb-4">Fill out the form to see your generated image here</p>
        <div className="flex items-center text-sm text-gray-500">
          <Sparkles className="w-4 h-4 mr-2" />
          Powered by SEO Engine AI
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="flex-1">
          {renderPreviewContent()}
        </div>
      </div>

      {generatedImage && (
        <ImagePreviewModal
          isOpen={showFullPreview}
          onClose={() => setShowFullPreview(false)}
          imageUrl={generatedImage.url}
          imageType={generatedImage.type}
          title={formData?.title}
        />
      )}
    </>
  );
};
