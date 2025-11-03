import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, TrendingUp, Zap, Calendar, Award, ArrowUp, ArrowDown, Package, BarChart3, Clock, Star } from 'lucide-react';
import { User } from '../lib/supabase';
import { HistoryImage } from '../types/history';

interface DashboardProps {
  user: User | null;
  history: HistoryImage[];
  onNavigate: (view: 'generate' | 'history' | 'bulk') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, history, onNavigate }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('month');

  const now = new Date();
  const thisMonthCount = history.filter(img => {
    const imgDate = new Date(img.timestamp);
    return imgDate.getMonth() === now.getMonth() && imgDate.getFullYear() === now.getFullYear();
  }).length;

  const lastMonthCount = history.filter(img => {
    const imgDate = new Date(img.timestamp);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return imgDate.getMonth() === lastMonth.getMonth() && imgDate.getFullYear() === lastMonth.getFullYear();
  }).length;

  const thisWeekCount = history.filter(img => {
    const imgDate = new Date(img.timestamp);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return imgDate >= weekAgo;
  }).length;

  const blogCount = history.filter(img => img.type === 'blog').length;
  const infographicCount = history.filter(img => img.type === 'infographic').length;

  const monthGrowth = lastMonthCount > 0 ? ((thisMonthCount - lastMonthCount) / lastMonthCount * 100).toFixed(0) : 0;
  const isGrowthPositive = Number(monthGrowth) >= 0;

  const totalCreditsUsed = history.reduce((sum, img) => sum + (img.creditsUsed || 0), 0);
  const averageCreditsPerImage = history.length > 0 ? (totalCreditsUsed / history.length).toFixed(1) : 0;

  const stats = [
    {
      title: 'Available Credits',
      value: user?.credits || 0,
      icon: Zap,
      gradient: 'from-amber-400 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      description: 'Ready to use',
      trend: null
    },
    {
      title: 'Total Images',
      value: history.length,
      icon: ImageIcon,
      gradient: 'from-blue-400 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      description: 'All time',
      trend: null
    },
    {
      title: 'This Month',
      value: thisMonthCount,
      icon: TrendingUp,
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      description: `${Math.abs(Number(monthGrowth))}% ${isGrowthPositive ? 'increase' : 'decrease'}`,
      trend: isGrowthPositive ? 'up' : 'down'
    },
    {
      title: 'This Week',
      value: thisWeekCount,
      icon: Clock,
      gradient: 'from-purple-400 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      description: 'Recent activity',
      trend: null
    }
  ];

  const quickActions = [
    {
      title: 'Blog Featured Image',
      description: 'Perfect headers for blog posts',
      icon: ImageIcon,
      gradient: 'from-blue-500 to-indigo-600',
      credits: 5,
      action: () => onNavigate('generate')
    },
    {
      title: 'Infographic',
      description: 'Transform data into visuals',
      icon: BarChart3,
      gradient: 'from-purple-500 to-pink-600',
      credits: 10,
      action: () => onNavigate('generate')
    },
    {
      title: 'Bulk Processing',
      description: 'Create multiple images at once',
      icon: Package,
      gradient: 'from-emerald-500 to-teal-600',
      credits: 'Varies',
      action: () => onNavigate('bulk')
    }
  ];

  const recentImages = history.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Create stunning visuals with AI-powered image generation</p>
          </div>
          <button
            onClick={() => onNavigate('generate')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-6 h-6" />
            Create New Image
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`bg-white rounded-3xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden group`}
              >
                {/* Subtle gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-30 group-hover:opacity-40 transition-opacity duration-300`}></div>

                {/* Decorative circle */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-full"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    {stat.trend && (
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md ${
                        stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {stat.trend === 'up' ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowDown className="w-4 h-4" />
                        )}
                        <span className="text-sm font-bold">{Math.abs(Number(monthGrowth))}%</span>
                      </div>
                    )}
                  </div>
                  <div className="text-5xl font-bold text-gray-900 mb-3">{stat.value}</div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1.5 text-lg">{stat.title}</p>
                    <p className="text-sm text-gray-600 font-medium">{stat.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Type Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-7 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <ImageIcon className="w-7 h-7 text-white" />
              </div>
              <span className="text-4xl font-bold text-gray-900">{blogCount}</span>
            </div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">Blog Images</h3>
            <p className="text-sm text-gray-600 mb-4">Featured images created</p>
            <div className="bg-blue-50 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: history.length > 0 ? `${(blogCount / history.length) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <span className="text-4xl font-bold text-gray-900">{infographicCount}</span>
            </div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">Infographics</h3>
            <p className="text-sm text-gray-600 mb-4">Data visualizations</p>
            <div className="bg-purple-50 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500"
                style={{ width: history.length > 0 ? `${(infographicCount / history.length) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Star className="w-7 h-7 text-white" />
              </div>
              <span className="text-4xl font-bold text-gray-900">{averageCreditsPerImage}</span>
            </div>
            <h3 className="font-bold text-gray-900 text-xl mb-2">Avg Credits</h3>
            <p className="text-sm text-gray-600 mb-4">Per image generated</p>
            <div className="bg-orange-50 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full w-3/4 transition-all duration-500"></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quick Actions</h2>
            <p className="text-gray-600 text-lg">Jump into creating with these popular options</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className={`bg-gradient-to-br ${action.gradient} rounded-3xl p-8 text-white text-left hover:shadow-2xl transition-all duration-300 hover:scale-105 group relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{action.title}</h3>
                    <p className="text-white/90 mb-4">{action.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl font-bold text-sm">
                        {typeof action.credits === 'number' ? `${action.credits} credits` : action.credits}
                      </span>
                      <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Creations */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200/50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Creations</h2>
              <p className="text-gray-600 text-lg">Your latest generated images</p>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => onNavigate('history')}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all hover:scale-105"
              >
                View All
              </button>
            )}
          </div>

          {recentImages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No images yet</h3>
              <p className="text-gray-600 mb-8 text-lg">Start creating your first AI-generated image</p>
              <button
                onClick={() => onNavigate('generate')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Create First Image
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <img
                    src={image.url}
                    alt={image.title || image.content}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          image.type === 'blog' ? 'bg-blue-500' : 'bg-purple-500'
                        } text-white shadow-lg`}>
                          {image.type === 'blog' ? 'Blog' : 'Infographic'}
                        </span>
                        <span className="text-white text-xs font-semibold">
                          {image.creditsUsed || 0} credits
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
