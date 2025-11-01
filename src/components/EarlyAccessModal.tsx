import React from 'react';
import { X, Rocket, Sparkles, Image, Share2 } from 'lucide-react';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EarlyAccessModal: React.FC<EarlyAccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 mr-4">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Early Access Features</h2>
              <p className="text-purple-100">Get a sneak peek at what's coming!</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-700">
            As an Enterprise user, you'll get exclusive early access to powerful new features designed to supercharge your content creation workflow.
          </p>
          <ul className="space-y-4 text-gray-800">
            <li className="flex items-center">
              <Sparkles className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
              <span>Advanced AI Models for even higher quality images.</span>
            </li>
            <li className="flex items-center">
              <Image className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
              <span>Direct Image Upload to your website/CMS.</span>
            </li>
            <li className="flex items-center">
              <Share2 className="w-5 h-5 text-pink-500 mr-3 flex-shrink-0" />
              <span>Social Media Post Creation with integrated visuals.</span>
            </li>
          </ul>
          <button
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};