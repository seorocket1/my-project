import React, { useEffect, useRef, useState } from 'react';
import './LandingPage.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles, Zap, TrendingUp, DollarSign, Users, Clock,
  Image as ImageIcon, BarChart3, Instagram, Linkedin, Facebook,
  Check, ArrowRight, Star, Award, Target, Rocket, Shield
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

      ScrollTrigger.batch('.fade-in-up', {
        onEnter: batch => gsap.from(batch, {
          y: 60,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out'
        })
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
    <div ref={mainRef} className="antialiased bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <a href="#" className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                ImageGen AI
              </a>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={onSignInClick}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="hero-animate inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-white">Replace Your Entire Design Team with AI</span>
          </div>

          <h1 className="hero-animate text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Stop Paying Designers
            </span>
            <br />
            <span className="text-white">Start Using AI</span>
          </h1>

          <p className="hero-animate text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Create stunning blog images, infographics, and social media content in 30 seconds.
            <span className="font-bold text-white"> Save 85% on design costs</span> and
            <span className="font-bold text-white"> 99% of your time</span>.
          </p>

          <div className="hero-animate flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onSignInClick}
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300">
              See How It Works
            </button>
          </div>

          <div className="hero-animate flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <p className="text-4xl font-black text-white mb-1">₹70,000+</p>
              <p className="text-sm text-gray-400">Saved Monthly</p>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div>
              <p className="text-4xl font-black text-white mb-1">30 sec</p>
              <p className="text-sm text-gray-400">Generation Time</p>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div>
              <p className="text-4xl font-black text-white mb-1">10,000+</p>
              <p className="text-sm text-gray-400">Images Generated</p>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div>
              <p className="text-4xl font-black text-white mb-1">85%</p>
              <p className="text-sm text-gray-400">Cost Reduction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Comparison Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              The Math is Simple
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how much you'll save by replacing traditional design workflows with AI
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10">
              <div className="bg-gray-900 p-6">
                <p className="text-sm font-semibold text-gray-400 uppercase mb-2">Cost Item</p>
              </div>
              <div className="bg-gray-900 p-6">
                <p className="text-sm font-semibold text-gray-400 uppercase mb-2">Traditional Cost</p>
              </div>
              <div className="bg-gray-900 p-6">
                <p className="text-sm font-semibold text-gray-400 uppercase mb-2">With ImageGen AI</p>
              </div>
              <div className="bg-gray-900 p-6">
                <p className="text-sm font-semibold text-gray-400 uppercase mb-2">Your Savings</p>
              </div>
            </div>

            {costComparison.map((row, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10">
                <div className="bg-gray-900 p-6">
                  <p className="font-bold text-white">{row.item}</p>
                </div>
                <div className="bg-gray-900 p-6">
                  <p className="text-red-400 font-semibold">{row.traditional}</p>
                </div>
                <div className="bg-gray-900 p-6">
                  <p className="text-green-400 font-semibold">{row.withUs}</p>
                </div>
                <div className="bg-gray-900 p-6">
                  <p className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {row.savings}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center fade-in-up">
            <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 rounded-3xl">
              <p className="text-6xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                ₹70,000+ Saved Every Month
              </p>
              <p className="text-xl text-gray-300">That's ₹8,40,000+ saved per year!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Why Teams Choose ImageGen AI
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From startups to enterprises, businesses are replacing design teams with AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="fade-in-up group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>
                    <p className="text-gray-400 mb-4">{benefit.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Every Visual You'll Ever Need
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From blog images to social media content, create everything in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {imageTypes.map((type, i) => (
              <div
                key={i}
                className={`fade-in-up relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 ${
                  type.comingSoon ? 'opacity-75' : 'hover:scale-105'
                }`}
              >
                {type.comingSoon && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full">
                    Coming Soon
                  </div>
                )}

                <div className={`w-16 h-16 bg-gradient-to-br ${type.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                  <type.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">{type.title}</h3>
                <p className="text-gray-400 mb-6">{type.description}</p>

                <div className="space-y-2">
                  {type.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Powerful Features, Simple Interface
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to create professional visuals without any design skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="fade-in-up bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Replace Your Design Team Today
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the plan that matches your content needs. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="fade-in-up bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Graphic Intern AI</h3>
                <p className="text-gray-400 mb-6">Perfect for small teams and startups</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">₹5,000</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-sm text-green-400 font-semibold mt-2">Save ₹35,000+ monthly</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">300 Credits/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Blog & Infographic Generation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Custom Image Upload</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Basic Support</span>
                </li>
              </ul>

              <button
                onClick={() => onSubscribeClick('Graphic Intern AI')}
                className="w-full px-6 py-4 bg-white/10 border-2 border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="fade-in-up relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500 rounded-3xl p-8 scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full">
                MOST POPULAR
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Graphic Designer Expert</h3>
                <p className="text-gray-400 mb-6">For growing teams and agencies</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">₹7,500</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-sm text-green-400 font-semibold mt-2">Save ₹60,000+ monthly</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">600 Credits/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">All Basic features</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Custom Branding</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Priority Support</span>
                </li>
              </ul>

              <button
                onClick={() => onSubscribeClick('Graphic Designer Expert')}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="fade-in-up bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Whole Graphic Team!</h3>
                <p className="text-gray-400 mb-6">Replace your entire design department</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">₹12,500</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-sm text-green-400 font-semibold mt-2">Save ₹1,50,000+ monthly</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">1200 Credits/month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">All Pro features</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Bulk Processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Dedicated Support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">Early Access to New Features</span>
                </li>
              </ul>

              <button
                onClick={() => onSubscribeClick('Whole Graphic Team!')}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-green-500/50 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center fade-in-up">
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Fire Your Design Team?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of businesses saving time and money with AI-powered design
            </p>
            <button
              onClick={onSignInClick}
              className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
            >
              Start Free Trial
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-sm text-gray-400 mt-4">100 free credits • No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-2">
              ImageGen AI
            </h3>
            <p className="text-gray-400">Replace designers. Save money. Create faster.</p>
          </div>
          <div className="flex space-x-6 mt-8 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-12 border-t border-white/10 pt-8">
          © 2024 ImageGen AI. All Rights Reserved.
        </div>
      </footer>

      <EarlyAccessModal
        isOpen={showEarlyAccessModal}
        onClose={() => setShowEarlyAccessModal(false)}
      />
    </div>
  );
};
