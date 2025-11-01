import React from 'react';
import { Sparkles, Image as ImageIcon, TrendingUp, Zap, Calendar, Award } from 'lucide-react';
import { User } from '../lib/supabase';
import { HistoryImage } from '../types/history';

interface DashboardProps {
  user: User | null;
  history: HistoryImage[];
  onNavigate: (view: 'generate' | 'history') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, history, onNavigate }) => {
  const thisMonthCount = history.filter(img => {
    const imgDate = new Date(img.timestamp);
    const now = new Date();
    return imgDate.getMonth() === now.getMonth() && imgDate.getFullYear() === now.getFullYear();
  }).length;

  const blogCount = history.filter(img => img.type === 'blog').length;
  const infographicCount = history.filter(img => img.type === 'infographic').length;

  const stats = [
    {
      title: 'Total Credits',
      value: user?.credits || 0,
      icon: Zap,
      gradient: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50',
      description: 'Available for use'
    },
    {
      title: 'Total Images',
      value: history.length,
      icon: ImageIcon,
      gradient: 'from-blue-400 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      description: 'Created all time'
    },
    {
      title: 'This Month',
      value: thisMonthCount,
      icon: Calendar,
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      description: 'Images generated'
    },
    {
      title: 'Blog Images',
      value: blogCount,
      icon: TrendingUp,
      gradient: 'from-purple-400 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      description: 'Featured images'
    }
  ];

  const recentImages = history.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-600 mt-2">Create stunning visuals with AI-powered image generation</p>
          </div>
          <button
            onClick={() => onNavigate('generate')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Create New
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.bgGradient} rounded-3xl p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{stat.title}</p>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-200/50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Creations</h2>
              <p className="text-gray-600 mt-1">Your latest generated images</p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          {recentImages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No images yet</h3>
              <p className="text-gray-600 mb-6">Start creating your first AI-generated image</p>
              <button
                onClick={() => onNavigate('generate')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Create First Image
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <img
                    src={image.url}
                    alt={image.title || image.content}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${
                        image.type === 'blog' ? 'bg-blue-500' : 'bg-purple-500'
                      } text-white`}>
                        {image.type === 'blog' ? 'Blog' : 'Infographic'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-2">Quick Generate</h3>
            <p className="text-blue-100 mb-6">Create blog images instantly</p>
            <button
              onClick={() => onNavigate('generate')}
              className="w-full py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Blog Image
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-2">Infographics</h3>
            <p className="text-purple-100 mb-6">Visualize your data beautifully</p>
            <button
              onClick={() => onNavigate('generate')}
              className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Create Infographic
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-2">Bulk Processing</h3>
            <p className="text-emerald-100 mb-6">Generate multiple images at once</p>
            <button
              onClick={() => onNavigate('generate')}
              className="w-full py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Bulk Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
