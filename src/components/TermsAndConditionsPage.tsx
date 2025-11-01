import React from 'react';
import { Helmet } from 'react-helmet-async';
import { GlobalHeader } from './GlobalHeader';
import { GlobalFooter } from './GlobalFooter';

export const TermsAndConditionsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions - SEO Engine</title>
        <meta name="description" content="Read the terms and conditions for using SEO Engine AI services." />
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
        <p className="text-gray-700 mb-4">
          Welcome to SEO Engine AI! These terms and conditions outline the rules and regulations
          for the use of SEO Engine AI's Website and services.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
        <p className="text-gray-700 mb-4">
          By accessing this website and using our services, we assume you accept these terms and conditions.
          Do not continue to use SEO Engine AI if you do not agree to take all of the terms and conditions
          stated on this page.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. License</h2>
        <p className="text-gray-700 mb-4">
          Unless otherwise stated, SEO Engine AI and/or its licensors own the intellectual property rights
          for all material on SEO Engine AI. All intellectual property rights are reserved. You may access
          this from SEO Engine AI for your own personal use subjected to restrictions set in these terms
          and conditions.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. User Content</h2>
        <p className="text-gray-700 mb-4">
          Our service allows you to submit content for AI image generation. You retain all rights in,
          and are solely responsible for, the content you submit. By submitting content, you grant
          SEO Engine AI a worldwide, non-exclusive, royalty-free license to use, reproduce, modify,
          publish, and distribute such content on and through the Service.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Prohibited Uses</h2>
        <p className="text-gray-700 mb-4">
          You are expressly prohibited from:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Using the service for any unlawful purpose.</li>
          <li>Soliciting others to perform or participate in any unlawful acts.</li>
          <li>Violating any international, federal, provincial or state regulations, rules, laws, or local ordinances.</li>
          <li>Infringing upon or violating our intellectual property rights or the intellectual property rights of others.</li>
          <li>Harassing, abusing, insulting, harming, defaming, slandering, disparaging, intimidating, or discriminating based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability.</li>
          <li>Submitting false or misleading information.</li>
          <li>Uploading or transmitting viruses or any other type of malicious code.</li>
          <li>Collecting or tracking the personal information of others.</li>
          <li>Spamming, phishing, pharming, pretexting, spidering, crawling, or scraping.</li>
          <li>For any obscene or immoral purpose.</li>
          <li>Interfering with or circumvent the security features of the Service.</li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Disclaimer of Warranties; Limitation of Liability</h2>
        <p className="text-gray-700 mb-4">
          We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free.
          We do not warrant that the results that may be obtained from the use of the service will be accurate or reliable.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Changes to Terms and Conditions</h2>
        <p className="text-gray-700 mb-4">
          We reserve the right, at our sole discretion, to update, change or replace any part of these
          Terms and Conditions by posting updates and changes to our website. It is your responsibility
          to check our website periodically for changes.
        </p>
        <p className="text-gray-700">
          These terms and conditions are effective as of July 18, 2025.
        </p>
      </main>
      <GlobalFooter />
    </>
  );
};