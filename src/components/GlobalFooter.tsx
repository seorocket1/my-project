import React from 'react';
import { Sparkles } from 'lucide-react';

interface GlobalFooterProps {}

export const GlobalFooter: React.FC<GlobalFooterProps> = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 mr-3">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <a href="https://seoengine.agency/" target="_blank" rel="noopener noreferrer" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">SEO Engine</a>
          </div>
          <p className="text-gray-600 mb-2">Empowering content creators with AI-driven visual solutions</p>
          <div className="flex justify-center space-x-4 my-4">
              <a href="/terms-and-conditions.html" className="text-sm text-gray-500 hover:text-gray-700">Terms & Conditions</a>
              <a href="/privacy-policy.html" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a>
              <a href="/refund-policy.html" className="text-sm text-gray-500 hover:text-gray-700">Refund Policy</a>
              <a href="/about-us.html" className="text-sm text-gray-500 hover:text-gray-700">About Us</a>
              <a href="/contact-us.html" className="text-sm text-gray-500 hover:text-gray-700">Contact Us</a>
          </div>
          <p className="text-sm text-gray-500">© 2025 <a href="https://seoengine.agency/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">SEO Engine</a>. All rights reserved. | Transforming ideas into stunning visuals.</p>
        </div>
      </div>
    </footer>
  );
};
