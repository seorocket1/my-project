import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  onRemove: () => void;
  imageUrl?: string;
  isUploading?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, onRemove, imageUrl, isUploading }) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    // If an imageUrl is passed from the parent, use it for the preview.
    // This is useful for showing an already uploaded image.
    if (imageUrl) {
      setPreview(imageUrl);
    } else {
      setPreview(null);
    }
  }, [imageUrl]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const localPreviewUrl = URL.createObjectURL(file);
      setPreview(localPreviewUrl);
      onUpload(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
    },
    multiple: false,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the dropzone click
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onRemove();
  };

  return (
    <div>
       <label className="block text-sm font-semibold text-gray-900 mb-3">
          Featured Image <span className="text-gray-500 font-normal">(Optional)</span>
        </label>
      {preview ? (
        <div className="relative group w-full h-48 rounded-xl overflow-hidden">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : (
              <button
                onClick={handleRemove}
                className="p-2 bg-white rounded-full text-gray-800 hover:bg-red-500 hover:text-white transition-all duration-300 transform scale-0 group-hover:scale-100"
                aria-label="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-all duration-300
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'}`}
        >
          <input {...getInputProps()} />
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-sm font-semibold text-gray-700">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, or GIF</p>
        </div>
      )}
    </div>
  );
};
