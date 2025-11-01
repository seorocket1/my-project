import React from 'react';
import { Sparkles, Zap, LogOut, User as UserIcon, History, Settings, CreditCard, Users } from 'lucide-react';
import { User } from '../lib/supabase';
import { HistoryImage } from '../types/history';

interface GlobalHeaderProps {
  user: User | null;
  isAuthenticated: boolean;
  isSupabaseConfigured: boolean;
  isProcessing: boolean;
  isBulkProcessing: boolean;
  history: HistoryImage[];
  setShowHistorySidebar: (show: boolean) => void;
  setShowAdminPanel: (show: boolean) => void;
  setShowAccountPanel: (show: boolean) => void;
  signOut: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  user,
  isAuthenticated,
  isSupabaseConfigured,
  isProcessing,
  isBulkProcessing,
  history,
  setShowHistorySidebar,
  setShowAdminPanel,
  setShowAccountPanel,
  signOut,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 mr-3">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Image Generator</h1>
              <p className="text-sm text-gray-600 hidden sm:block">Create stunning visuals with AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center text-sm text-gray-500">
              <Zap className="w-4 h-4 mr-2" />
              Powered by{' '}
              <a 
                href="https://seoengine.agency/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 ml-1 hover:text-blue-700 transition-colors"
              >
                SEO Engine
              </a>
            </div>
            <div className="flex items-center space-x-3">
              {user && isSupabaseConfigured && (
                <div className="flex items-center px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <CreditCard className="w-4 h-4 mr-2 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">{user.credits} Credits</span>
                </div>
              )}
              <button
                onClick={() => setShowHistorySidebar(true)}
                disabled={isProcessing || isBulkProcessing}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
                title="View History"
              >
                <History className="w-4 h-4" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {history.length > 9 ? '9+' : history.length}
                  </span>
                )}
              </button>
              {user && user.is_admin && (
                <button
                  onClick={() => setShowAdminPanel(true)}
                  disabled={isProcessing || isBulkProcessing}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Manage Users & Activity"
                >
                  <Users className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setShowAccountPanel(true)}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                title="View Account"
              >
                <UserIcon className="w-4 h-4 mr-2" />
                {user?.name || user?.email || 'User'}
              </button>
              <button
                onClick={signOut}
                disabled={isProcessing || isBulkProcessing}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
