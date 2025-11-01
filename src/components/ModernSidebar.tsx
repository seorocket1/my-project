import React from 'react';
import { Home, Sparkles, History, Settings, LogOut, CreditCard, User as UserIcon, Menu, X, Shield, Package } from 'lucide-react';
import { User } from '../lib/supabase';

interface ModernSidebarProps {
  user: User | null;
  currentView: 'dashboard' | 'generate' | 'history' | 'account' | 'admin' | 'bulk';
  onNavigate: (view: 'dashboard' | 'generate' | 'history' | 'account' | 'admin' | 'bulk') => void;
  onSignOut: () => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  user,
  currentView,
  onNavigate,
  onSignOut,
  isMobileOpen,
  onMobileToggle
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'generate', label: 'Create', icon: Sparkles },
    { id: 'bulk', label: 'Bulk Process', icon: Package },
    { id: 'history', label: 'History', icon: History },
    { id: 'account', label: 'Account', icon: Settings },
  ];

  if (user?.is_admin) {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: Shield });
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ImageGen AI
              </h1>
            </div>
          </div>
          <button
            onClick={onMobileToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Credits Display */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Available Credits</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.credits || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as any);
                  if (isMobileOpen) onMobileToggle();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};
