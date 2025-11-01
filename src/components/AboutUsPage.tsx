import React from 'react';
import { Helmet } from 'react-helmet-async';
import { GlobalHeader } from './GlobalHeader';
import { GlobalFooter } from './GlobalFooter';

export const AboutUsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us - SEO Engine</title>
        <meta name="description" content="Learn more about SEO Engine AI and our mission." />
      </Helmet>
      <GlobalHeader
        user={null}
        isAuthenticated={false}
        isSupabaseConfigured={false}
        isProcessing={false}
        isBulkProcessing={false}
        history={[]}
        setShowHistorySidebar={() => {}}
        setShowAdminPanel={() => {}}
        setShowAccountPanel={() => {}}
        signOut={() => {}}
      />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About SEO Engine AI</h1>
        <p className="text-gray-700 mb-4">
          SEO Engine AI is dedicated to empowering content creators, marketers, and businesses
          with cutting-edge artificial intelligence tools for visual content generation.
          Our mission is to simplify the creation of stunning blog featured images and infographics,
          making high-quality visual content accessible to everyone.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Vision</h2>
        <p className="text-gray-700 mb-4">
          We envision a world where visual content creation is no longer a barrier but a seamless,
          creative process. By leveraging the latest advancements in AI, we aim to provide intuitive,
          efficient, and powerful tools that transform ideas into captivating visuals in minutes.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">What We Offer</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>AI-powered generation of unique blog featured images.</li>
          <li>Intelligent creation of data-rich infographics from your content.</li>
          <li>Customization options for style, color, and integration of your own images.</li>
          <li>A user-friendly platform designed for speed and ease of use.</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Commitment</h2>
        <p className="text-gray-700 mb-4">
          We are committed to continuous innovation, ensuring our AI models are always learning
          and improving to deliver the best possible results. Your feedback drives our development,
          and we are always striving to enhance your experience and expand our capabilities.
        </p>
        <p className="text-gray-700">
          Thank you for choosing SEO Engine AI. We're excited to help you create impactful visual content!
        </p>
      </main>
      <GlobalFooter />
    </>
  );
};