import React from 'react';
import { Helmet } from 'react-helmet-async';
import { GlobalHeader } from './GlobalHeader';
import { GlobalFooter } from './GlobalFooter';

export const RefundPolicyPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Refund Policy - SEO Engine</title>
        <meta name="description" content="Read our refund policy for SEO Engine AI services." />
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Refund Policy</h1>
        <p className="text-gray-700 mb-4">
          At SEO Engine AI, we strive for your satisfaction with our AI image generation services.
          This Refund Policy outlines the conditions under which refunds may be issued.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Credit Purchases</h2>
        <p className="text-gray-700 mb-4">
          All credit purchases are final and non-refundable. Credits are consumed upon successful image generation.
          We encourage users to test our service with free credits or a small purchase before committing to larger packages.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Service Unavailability</h2>
        <p className="text-gray-700 mb-4">
          In the rare event of prolonged service unavailability (more than 48 hours) due to issues on our end,
          we may offer a pro-rata refund for any unused credits or extend your subscription period.
          This will be assessed on a case-by-case basis.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Image Quality</h2>
        <p className="text-gray-700 mb-4">
          While our AI aims to produce high-quality images, results can vary based on input and AI interpretation.
          We do not offer refunds for dissatisfaction with the aesthetic quality or relevance of generated images,
          as credits are consumed for the generation process itself, regardless of the outcome.
          Users are encouraged to refine their inputs to achieve desired results.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Account Termination</h2>
        <p className="text-gray-700 mb-4">
          If your account is terminated due to a violation of our Terms and Conditions,
          any remaining credits or subscription fees will be forfeited and are non-refundable.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Contact Us</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions or concerns regarding our refund policy, please contact our support team at
          <a href="mailto:support@seoengine.agency" className="text-blue-600 hover:underline">support@seoengine.agency</a>.
        </p>
      </main>
      <GlobalFooter />
    </>
  );
};