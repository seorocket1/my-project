import React from 'react';
import { Helmet } from 'react-helmet-async';
import { GlobalHeader } from './GlobalHeader';
import { GlobalFooter } from './GlobalFooter';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - SEO Engine</title>
        <meta name="description" content="Understand how SEO Engine AI collects, uses, and protects your data." />
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">
          At SEO Engine AI, we are committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information when you
          use our AI image generation services.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
        <p className="text-gray-700 mb-4">
          We collect information that you provide directly to us, such as when you create an account,
          submit content for image generation, or contact us for support. This may include your name,
          email address, and any content you input into our AI tools.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
        <p className="text-gray-700 mb-4">
          We use the information we collect to:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Provide, operate, and maintain our services.</li>
          <li>Improve, personalize, and expand our services.</li>
          <li>Understand and analyze how you use our services.</li>
          <li>Develop new products, services, features, and functionality.</li>
          <li>Communicate with you, either directly or through one of our partners, including for customer service,
              to provide you with updates and other information relating to the service, and for marketing and promotional purposes.</li>
          <li>Process your transactions and manage your orders.</li>
          <li>Send you emails.</li>
          <li>Find and prevent fraud.</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. How We Share Your Information</h2>
        <p className="text-gray-700 mb-4">
          We may share your information with third-party service providers to perform services on our behalf,
          such as hosting, data analysis, payment processing, and email delivery. We do not sell your personal data.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Data Security</h2>
        <p className="text-gray-700 mb-4">
          We implement a variety of security measures to maintain the safety of your personal information.
          However, no electronic transmission over the Internet or information storage technology can be
          guaranteed to be 100% secure.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Your Data Protection Rights</h2>
        <p className="text-gray-700 mb-4">
          Depending on your location, you may have certain rights regarding your personal data,
          including the right to access, correct, or delete your data.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Changes to This Privacy Policy</h2>
        <p className="text-gray-700 mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting
          the new Privacy Policy on this page.
        </p>
        <p className="text-gray-700">
          This policy is effective as of July 18, 2025.
        </p>
      </main>
      <GlobalFooter />
    </>
  );
};