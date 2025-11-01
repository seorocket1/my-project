import React from 'react';
import { User } from '../lib/supabase';

interface BrandingToggleProps {
  user: User | null;
  useBrand: boolean;
  setUseBrand: (useBrand: boolean) => void;
  setShowAccountPanel: (show: boolean) => void;
}

export const BrandingToggle: React.FC<BrandingToggleProps> = ({
  user,
  useBrand,
  setUseBrand,
  setShowAccountPanel,
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      {user?.brand_name ? (
        <div className="flex items-center justify-between">
          <label htmlFor="use-brand" className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                id="use-brand"
                className="sr-only peer"
                checked={useBrand}
                onChange={(e) => setUseBrand(e.target.checked)}
              />
              <div className="block bg-gray-600 peer-checked:bg-blue-600 w-14 h-8 rounded-full transition"></div>
              <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition peer-checked:translate-x-full"></div>
            </div>
            <div className="ml-3 text-gray-700 font-medium">
              Use My Brand: {user.brand_name}
            </div>
          </label>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-gray-600">Create and save your branding to generate consistent, branded images every time.</p>
          <button
            type="button"
            onClick={() => setShowAccountPanel(true)}
            className="mt-2 text-sm font-semibold text-blue-600 hover:underline"
          >
            Create Your Branding
          </button>
        </div>
      )}
    </div>
  );
};