import React, { useEffect, useRef, useState } from 'react';
import './LandingPage.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles, Zap, TrendingUp, DollarSign, Users, Clock,
  Image as ImageIcon, BarChart3, Instagram, Linkedin, Facebook,
  Check, ArrowRight, Calendar, Award, Target, Rocket, Shield
} from 'lucide-react';
import { EarlyAccessModal } from './EarlyAccessModal';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  onSignInClick: () => void;
  onSubscribeClick: (plan: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSignInClick, onSubscribeClick }) => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-animate', {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3
      });

      ScrollTrigger.batch('.fade-in-section', {
        onEnter: batch => gsap.from(batch, {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out'
        }),
        start: 'top 85%'
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const imageTypes = [
    {
      icon: ImageIcon,
      title: 'Blog Featured Images',
      description: 'Stunning header images that capture attention and drive engagement',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['SEO-Optimized', 'High Resolution', 'Custom Branding']
    },
    {
      icon: BarChart3,
      title: 'Infographics',
      description: 'Transform complex data into beautiful, shareable visual stories',
      gradient: 'from-purple-500 to-pink-500',
      features: ['Data Visualization', 'Social Ready', 'Professional Quality']
    },
    {
      icon: Instagram,
      title: 'Instagram Content',
      description: 'Posts, stories, carousels, and reel covers optimized for Instagram',
      gradient: 'from-pink-500 to-rose-500',
      features: ['Perfect Sizing', 'Engagement Focused', 'Brand Consistent'],
      comingSoon: true
    },
    {
      icon: Linkedin,
      title: 'LinkedIn Posts',
      description: 'Professional visuals for posts, carousels, and article headers',
      gradient: 'from-blue-600 to-indigo-600',
      features: ['Professional', 'B2B Optimized', 'Authority Building'],
      comingSoon: true
    },
    {
      icon: Facebook,
      title: 'Facebook Graphics',
      description: 'Eye-catching posts, cover photos, and stories for Facebook',
      gradient: 'from-blue-500 to-indigo-700',
      features: ['High Engagement', 'Platform Optimized', 'Shareable'],
      comingSoon: true
    }
  ];

  const costComparison = [
    {
      item: 'Graphic Designer Salary',
      traditional: '₹40,000 - ₹80,000/month',
      withUs: '₹5,000 - ₹12,500/month',
      savings: '70-85%'
    },
    {
      item: 'Design Software Licenses',
      traditional: '₹5,000 - ₹15,000/month',
      withUs: '₹0 (Included)',
      savings: '100%'
    },
    {
      item: 'Stock Photos & Assets',
      traditional: '₹3,000 - ₹10,000/month',
      withUs: '₹0 (AI Generated)',
      savings: '100%'
    },
    {
      item: 'Revision Time',
      traditional: '2-3 days per design',
      withUs: '30 seconds',
      savings: '99%'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Save 40+ Hours Per Week',
      description: 'Generate professional visuals in 30 seconds instead of hours or days',
      stat: '99.5%',
      statLabel: 'Faster'
    },
    {
      icon: DollarSign,
      title: 'Cut Design Costs by 85%',
      description: 'Replace expensive designer salaries and software with AI efficiency',
      stat: '₹70K+',
      statLabel: 'Saved Monthly'
    },
    {
      icon: Users,
      title: 'Replace Entire Design Team',
      description: 'One subscription does the work of multiple designers and tools',
      stat: '1 vs 3-5',
      statLabel: 'Team Size'
    },
    {
      icon: TrendingUp,
      title: '10x Your Content Output',
      description: 'Create more visuals, publish faster, grow your brand exponentially',
      stat: '10x',
      statLabel: 'More Content'
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Generation',
      description: 'State-of-the-art AI creates professional-quality visuals instantly',
      color: 'text-purple-400'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate images in 30 seconds, not 30 hours',
      color: 'text-yellow-400'
    },
    {
      icon: Target,
      title: 'Custom Branding',
      description: 'Apply your brand colors, fonts, and style automatically',
      color: 'text-blue-400'
    },
    {
      icon: Rocket,
      title: 'Bulk Processing',
      description: 'Create hundreds of images at once with batch generation',
      color: 'text-orange-400'
    },
    {
      icon: Shield,
      title: 'SEO Optimized',
      description: 'Every image is optimized for search engines and performance',
      color: 'text-green-400'
    },
    {
      icon: Award,
      title: 'Professional Quality',
      description: 'Enterprise-grade visuals that rival expensive agencies',
      color: 'text-pink-400'
    }
  ];

  return (
    <div ref={mainRef} className="antialiased bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <a href="#" className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                ImageGen AI
              </a>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onSignInClick}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-purple-300/20 rounded-full blur-3xl -top-48 -left-48"></div>
          <div className="absolute w-96 h-96 bg-pink-300/20 rounded-full blur-3xl -bottom-48 -right-48"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="hero-animate inline-flex items-center gap-2 px-3 py-2 bg-white border border-purple-200 rounded-full mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-gray-700">Replace Your Entire Design Team with AI</span>
          </div>

          <h1 className="hero-animate text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 px-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Stop Paying Designers
            </span>
            <br />
            <span className="text-gray-900">Start Using AI</span>
          </h1>

          <p className="hero-animate text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed px-4">
            Create stunning blog images, infographics, and social media content in 30 seconds.
            <span className="font-bold text-gray-900"> Save 85% on design costs</span> and
            <span className="font-bold text-gray-900"> 99% of your time</span>.
          </p>

          <div className="hero-animate flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-12 px-4">
            <button
              onClick={onSignInClick}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base sm:text-lg rounded-2xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white border-2 border-gray-300 text-gray-700 font-bold text-base sm:text-lg rounded-2xl hover:bg-gray-50 hover:border-purple-400 transition-all duration-300 flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              Book Free Demo
            </button>
          </div>

          <div className="hero-animate grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-center px-4">
            <div className="col-span-2 sm:col-span-1">
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-1">₹70,000+</p>
              <p className="text-xs sm:text-sm text-gray-600">Saved Monthly</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-1">30 sec</p>
              <p className="text-xs sm:text-sm text-gray-600">Generation Time</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-1">10,000+</p>
              <p className="text-xs sm:text-sm text-gray-600">Images Generated</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-1">85%</p>
              <p className="text-xs sm:text-sm text-gray-600">Cost Reduction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Comparison Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 fade-in-section">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-6 px-4">
              The Math is Simple
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              See how much you'll save by replacing traditional design workflows with AI
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl fade-in-section">
            <div className="hidden md:grid grid-cols-4 gap-px bg-gray-200">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6">
                <p className="text-sm font-bold text-white uppercase">Cost Item</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6">
                <p className="text-sm font-bold text-white uppercase">Traditional Cost</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6">
                <p className="text-sm font-bold text-white uppercase">With ImageGen AI</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6">
                <p className="text-sm font-bold text-white uppercase">Your Savings</p>
              </div>
            </div>

            {costComparison.map((row, i) => (
              <div key={i}>
                {/* Mobile View */}
                <div className="md:hidden bg-white p-4 sm:p-6 border-b border-gray-200 last:border-b-0">
                  <p className="font-bold text-gray-900 mb-3 text-sm sm:text-base">{row.item}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">Traditional:</span>
                      <span className="text-red-600 font-semibold text-xs sm:text-sm">{row.traditional}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-600">With AI:</span>
                      <span className="text-green-600 font-semibold text-xs sm:text-sm">{row.withUs}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Savings:</span>
                      <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {row.savings}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-4 gap-px bg-gray-200">
                  <div className="bg-white p-6">
                    <p className="font-bold text-gray-900">{row.item}</p>
                  </div>
                  <div className="bg-white p-6">
                    <p className="text-red-600 font-semibold">{row.traditional}</p>
                  </div>
                  <div className="bg-white p-6">
                    <p className="text-green-600 font-semibold">{row.withUs}</p>
                  </div>
                  <div className="bg-white p-6">
                    <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {row.savings}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 text-center fade-in-section px-4">
            <div className="inline-flex flex-col items-center gap-3 sm:gap-4 p-6 sm:p-8 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-2xl sm:rounded-3xl w-full sm:w-auto">
              <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ₹70,000+ Saved Every Month
              </p>
              <p className="text-base sm:text-lg md:text-xl text-gray-700">That's ₹8,40,000+ saved per year!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 fade-in-section">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-6">
              Why Teams Choose ImageGen AI
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              From startups to enterprises, businesses are replacing design teams with AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="fade-in-section group bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-purple-400 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{benefit.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{benefit.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {benefit.stat}
                      </span>
                      <span className="text-sm font-semibold text-gray-500">{benefit.statLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Types Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 fade-in-section">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-6">
              Every Visual You'll Ever Need
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              From blog images to social media content, create everything in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {imageTypes.map((type, i) => (
              <div
                key={i}
                className="fade-in-section relative bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-purple-400 hover:shadow-xl transition-all duration-300"
              >
                {type.comingSoon && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                    Coming Soon
                  </div>
                )}

                <div className={`w-16 h-16 bg-gradient-to-br ${type.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                  <type.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{type.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{type.description}</p>

                <div className="space-y-2">
                  {type.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 fade-in-section">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-6">
              Powerful Features, Simple Interface
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Everything you need to create professional visuals without any design skills
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="fade-in-section bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-purple-400 hover:shadow-lg transition-all duration-300"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 fade-in-section">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-6">
              Replace Your Design Team Today
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Choose the plan that matches your content needs. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Basic Plan */}
            <div className="fade-in-section bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-purple-400 hover:shadow-xl transition-all duration-300">
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Graphic Intern AI</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Perfect for small teams and startups</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-gray-900">₹5,000</span>
                  <span className="text-sm sm:text-base text-gray-600">/month</span>
                </div>
                <p className="text-xs sm:text-sm text-green-600 font-semibold mt-2">Save ₹35,000+ monthly</p>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700">300 Credits/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Blog & Infographic Generation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom Image Upload</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Basic Support</span>
                </li>
              </ul>

              <button
                onClick={() => onSubscribeClick('Graphic Intern AI')}
                className="w-full px-6 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="fade-in-section relative bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:transform md:scale-105 shadow-2xl">
              <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg">
                MOST POPULAR
              </div>

              <div className="mb-6 sm:mb-8 pt-2 sm:pt-0">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Graphic Designer Expert</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">For growing teams and agencies</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-gray-900">₹7,500</span>
                  <span className="text-sm sm:text-base text-gray-600">/month</span>
                </div>
                <p className="text-xs sm:text-sm text-green-600 font-semibold mt-2">Save ₹60,000+ monthly</p>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">600 Credits/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">All Basic features</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom Branding</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority Support</span>
                </li>
              </ul>

              <button
                onClick={() => onSubscribeClick('Graphic Designer Expert')}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="fade-in-section bg-white border-2 border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-green-400 hover:shadow-xl transition-all duration-300">
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Whole Graphic Team!</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Replace your entire design department</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-gray-900">₹12,500</span>
                  <span className="text-sm sm:text-base text-gray-600">/month</span>
                </div>
                <p className="text-xs sm:text-sm text-green-600 font-semibold mt-2">Save ₹1,50,000+ monthly</p>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1200 Credits/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">All Pro features</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Bulk Processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Dedicated Support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Early Access to New Features</span>
                </li>
              </ul>

              <button
                onClick={() => onSubscribeClick('Whole Graphic Team!')}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center fade-in-section">
          <div className="bg-white border-2 border-purple-300 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6">
              Ready to Replace Your Design Team?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8">
              Join thousands of businesses saving time and money with AI-powered design
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
              <button
                onClick={onSignInClick}
                className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base sm:text-lg md:text-xl rounded-2xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-3"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-white border-2 border-gray-300 text-gray-700 font-bold text-base sm:text-lg md:text-xl rounded-2xl hover:bg-gray-50 hover:border-purple-400 transition-all duration-300 inline-flex items-center justify-center gap-3">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                Book Free Demo
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-4">100 free credits • No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-2">
              ImageGen AI
            </h3>
            <p className="text-gray-400">Replace designers. Save money. Create faster.</p>
          </div>
          <div className="flex space-x-6 mt-8 md:mt-0">
            <a href="/terms-and-conditions.html" className="text-gray-400 hover:text-white transition">Terms</a>
            <a href="/privacy-policy.html" className="text-gray-400 hover:text-white transition">Privacy</a>
            <a href="/refund-policy.html" className="text-gray-400 hover:text-white transition">Refund</a>
            <a href="/about-us.html" className="text-gray-400 hover:text-white transition">About</a>
            <a href="/contact-us.html" className="text-gray-400 hover:text-white transition">Contact</a>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-12 border-t border-gray-800 pt-8">
          © 2025 ImageGen AI. All Rights Reserved.
        </div>
      </footer>

      <EarlyAccessModal
        isOpen={showEarlyAccessModal}
        onClose={() => setShowEarlyAccessModal(false)}
      />
    </div>
  );
};
