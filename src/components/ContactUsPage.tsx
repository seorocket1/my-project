import React from 'react';
import { Helmet } from 'react-helmet-async';
import { GlobalHeader } from './GlobalHeader';
import { GlobalFooter } from './GlobalFooter';
import { Mail, Phone, MapPin } from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - SEO Engine</title>
        <meta name="description" content="Get in touch with SEO Engine AI support and sales." />
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-gray-700 mb-4">
          We're here to help! Whether you have a question about our services, need technical support,
          or want to discuss a partnership, feel free to reach out to us using the information below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4">
            <Mail className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Support</h2>
              <p className="text-gray-700">For general inquiries and technical support:</p>
              <a href="mailto:support@seoengine.agency" className="text-blue-600 hover:underline font-medium">
                support@seoengine.agency
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4">
            <Phone className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Phone</h2>
              <p className="text-gray-700">Reach us during business hours:</p>
              <p className="text-gray-700 font-medium">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-4 col-span-full">
            <MapPin className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Our Office</h2>
              <p className="text-gray-700">Visit us at:</p>
              <address className="text-gray-700 not-italic">
                123 AI Innovation Drive,<br />
                Suite 400,<br />
                Tech City, TX 78701,<br />
                USA
              </address>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            We aim to respond to all inquiries within 24-48 business hours.
          </p>
        </div>
      </main>
      <GlobalFooter />
    </>
  );
};