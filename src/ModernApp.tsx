import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Menu } from 'lucide-react';
import { ModernSidebar } from './components/ModernSidebar';
import { Dashboard } from './components/Dashboard';
import { CreatePage } from './components/CreatePage';
import { HistoryPage } from './components/HistoryPage';
import { AccountPage } from './components/AccountPage';
import { BulkProcessPage } from './components/BulkProcessPage';
import { AdminPanel } from './components/AdminPanel';
import { SuccessNotification } from './components/SuccessNotification';
import { AuthModal } from './components/AuthModal';
import { SignUpModal } from './components/SignUpModal';
import { LandingPage } from './components/LandingPage';
import { SubscriptionModal } from './components/SubscriptionModal';
import {
  supabase,
  isSupabaseConfigured,
  User,
  ImageGeneration,
  signIn as supabaseSignIn,
  signUp as supabaseSignUp,
  signOut as supabaseSignOut,
  deductCredits,
  saveImageGeneration
} from './lib/supabase';
import { HistoryImage } from './types/history';

const WEBHOOK_URL = 'https://n8n.seoengine.agency/webhook/6e9e3b30-cb55-4d74-aa9d-68691983455f';

const mapHistory = (history: ImageGeneration[]): HistoryImage[] => {
  return history.map(item => ({
    id: item.id,
    type: item.image_type as 'blog' | 'infographic',
    title: item.title,
    content: item.content,
    url: item.image_data,
    timestamp: new Date(item.created_at).getTime(),
    style: item.style,
    colour: item.colour,
  }));
};

export default function ModernApp() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryImage[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'generate' | 'history' | 'account' | 'admin' | 'bulk'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ completed: number, total: number } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<{ url: string; type: 'blog' | 'infographic' } | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showAccountPanel, setShowAccountPanel] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const refreshUser = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    const { data: { user: authUser } = {} } = await supabase.auth.getUser();
    if (authUser) {
      const { data: profile } = await supabase.from('users').select('*, history:image_generations(*)').eq('id', authUser.id).single();
      setUser(profile);
      if (profile?.history) {
        setHistory(mapHistory(profile.history));
      }
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      return;
    }

    const getInitialUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await refreshUser();
        setIsAuthenticated(true);
      }
      setAuthLoading(false);
    };

    getInitialUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        refreshUser();
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
        setHistory([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshUser]);

  const signIn = async (email: string, password: string) => {
    const { profile } = await supabaseSignIn(email, password);
    setUser(profile);
    setIsAuthenticated(true);
    if (profile?.history) {
      setHistory(mapHistory(profile.history));
    }
    return { success: true };
  };

  const signUp = async (userData: any) => {
    await supabaseSignUp(userData.email, userData.password, userData);
    await refreshUser();
    return true;
  };

  const signOut = async () => {
    await supabaseSignOut();
    setUser(null);
    setIsAuthenticated(false);
    setHistory([]);
    setCurrentView('dashboard');
  };

  const handleFormSubmit = async (data: any) => {
    console.log('\n=== FORM SUBMISSION DEBUG ===');
    console.log('📝 Submitted data:', data);
    console.log('📝 data.image_url:', data.image_url);
    console.log('📝 data.use_brand:', data.use_brand);

    const imageType = data.title ? 'blog' : 'infographic';
    let requiredCredits = imageType === 'infographic' ? 10 : 5;

    console.log('💰 Base credits:', requiredCredits);

    if (imageType === 'blog' && data.image_url) {
      requiredCredits += 5;
      console.log('💰 Added +5 for product image. New total:', requiredCredits);
    }

    console.log('💰 Final required credits:', requiredCredits);
    console.log('================================\n');

    if (user && isSupabaseConfigured) {
      if (user.credits < requiredCredits) {
        setError(`Insufficient credits. You need ${requiredCredits} credits but have ${user.credits}.`);
        return;
      }
    }

    const controller = new AbortController();
    const requestTimeout = setTimeout(() => controller.abort(), 120000);

    setIsProcessing(true);
    setFormData(data);
    setError(null);

    try {
      const { title, content, intro, style, colour } = data;

      let imageDetail = imageType === 'blog' ? `Blog post title: '${title}', Content: ${intro || content}` : content;
      if (style) imageDetail += `, Style: ${style}`;
      if (colour) imageDetail += `, Colour: ${colour}`;

      // COMPLETELY REWRITTEN IMAGE TYPE LOGIC
      console.log('\n=== IMAGE TYPE LOGIC v4.0 (REWRITTEN) ===');
      console.log('Input values:');
      console.log('  - imageType:', imageType);
      console.log('  - data.image_url:', data.image_url);
      console.log('  - data.use_brand:', data.use_brand);
      console.log('  - user exists:', !!user);
      console.log('  - Full data object:', data);

      let finalImageType: string;

      // BLOG IMAGE TYPES
      if (imageType === 'blog') {
        const hasProductImage = !!data.image_url;
        const hasBranding = data.use_brand === true && !!user;

        console.log('\n📝 BLOG IMAGE - Determining type...');
        console.log('  hasProductImage:', hasProductImage);
        console.log('  hasBranding:', hasBranding);

        if (hasBranding && hasProductImage) {
          finalImageType = 'Featured Image with product image with branding';
          console.log('  ✅ Result: Featured Image with product image with branding');
        } else if (hasBranding && !hasProductImage) {
          finalImageType = 'Featured Image with branding';
          console.log('  ✅ Result: Featured Image with branding');
        } else if (!hasBranding && hasProductImage) {
          finalImageType = 'Featured Image with product image';
          console.log('  ✅ Result: Featured Image with product image');
        } else {
          finalImageType = 'Featured Image';
          console.log('  ✅ Result: Featured Image');
        }
      }
      // INFOGRAPHIC IMAGE TYPES
      else if (imageType === 'infographic') {
        const hasBranding = data.use_brand === true && !!user;

        console.log('\n📊 INFOGRAPHIC - Determining type...');
        console.log('  hasBranding:', hasBranding);

        if (hasBranding) {
          finalImageType = 'Infographic with branding';
          console.log('  ✅ Result: Infographic with branding');
        } else {
          finalImageType = 'Infographic';
          console.log('  ✅ Result: Infographic');
        }
      }
      // FALLBACK
      else {
        finalImageType = 'Featured Image';
        console.log('\n⚠️ UNKNOWN imageType, defaulting to: Featured Image');
      }

      console.log('\n🎯 FINAL IMAGE TYPE:', finalImageType);
      console.log('=====================================\n');

      const payload: { [key: string]: any } = {
        image_type: finalImageType,
        image_detail: imageDetail,
      };

      if (data.image_url) {
        payload.image_url = data.image_url;
        console.log('✅ Added image_url to payload:', data.image_url);
      }

      if (data.image_size && data.image_size !== 'auto') {
        payload.image_size = data.image_size;
        console.log('✅ Added image_size to payload:', data.image_size);
      }

      if (data.use_brand && user) {
        payload.brand_logo = user.brand_logo_url;
        payload.brand_website = user.website_url;
        payload.brand_guidelines = user.brand_guidelines;
        console.log('✅ Added branding data to payload');
      }

      console.log('\n📦 COMPLETE PAYLOAD BEING SENT TO N8N:');
      console.log(JSON.stringify(payload, null, 2));
      console.log('Webhook URL:', WEBHOOK_URL);
      console.log('=====================================\n');

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain, */*' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(requestTimeout);

      if (!response.ok) throw new Error(`Service error (${response.status})`);

      const responseText = await response.text();
      const result = JSON.parse(responseText);
      const imageBase64 = result.image;

      if (!imageBase64) throw new Error('No image data in response.');

      if (!user) {
        setError('You must be logged in to save an image.');
        return;
      }

      if (user && isSupabaseConfigured) {
        try {
          await deductCredits(user.id, requiredCredits);
        } catch (error) {
          console.error('Failed to deduct credits:', error);
          setError('Failed to deduct credits. Please contact support.');
          return;
        }
      }

      const newImageRecord = await saveImageGeneration({
        user_id: user.id,
        image_type: imageType,
        title: title,
        content: content,
        style: style,
        colour: colour,
        credits_used: requiredCredits,
        image_data: imageBase64,
      });

      const newImage = {
        url: newImageRecord.publicUrl,
        type: imageType,
      };

      setGeneratedImage(newImage);
      setShowSuccessNotification(true);

      if (user && isSupabaseConfigured) {
        if (newImageRecord) {
          const newHistoryItem = mapHistory([newImageRecord])[0];
          setHistory(prev => [newHistoryItem, ...prev]);
        }
        await refreshUser();
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateNew = () => {
    setGeneratedImage(null);
    setFormData(null);
    setError(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          onSignInClick={() => setShowAuthModal(true)}
          onSubscribeClick={(plan) => {
            setShowSubscriptionModal(true);
          }}
        />
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSignInWithEmail={signIn}
            onSignInAnonymously={async () => false}
            onOpenSignUp={() => {
              setShowAuthModal(false);
              setShowSignUpModal(true);
            }}
          />
        )}
        {showSignUpModal && (
          <SignUpModal
            isOpen={showSignUpModal}
            onClose={() => setShowSignUpModal(false)}
            onSignUp={signUp}
          />
        )}
        {showSubscriptionModal && (
          <SubscriptionModal
            isOpen={showSubscriptionModal}
            onClose={() => setShowSubscriptionModal(false)}
            selectedPlan=""
          />
        )}
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Helmet>
        <title>AI Image Generator - SEO Engine</title>
        <meta name="description" content="Create stunning blog featured images and infographics with AI" />
      </Helmet>

      {/* Sidebar */}
      <ModernSidebar
        user={user}
        currentView={currentView}
        onNavigate={setCurrentView}
        onSignOut={signOut}
        isMobileOpen={isMobileSidebarOpen}
        onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ImageGen AI
          </h1>
          <div className="w-10" />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <Dashboard
              user={user}
              history={history}
              onNavigate={(view) => {
                if (view === 'generate') setCurrentView('generate');
                else if (view === 'history') setCurrentView('history');
              }}
            />
          )}

          {currentView === 'generate' && (
            <CreatePage
              user={user}
              onSubmit={handleFormSubmit}
              isProcessing={isProcessing}
              generatedImage={generatedImage}
              onGenerateNew={handleGenerateNew}
              onOpenBulkModal={() => setShowBulkModal(true)}
              setShowAccountPanel={setShowAccountPanel}
              formData={formData}
              isBulkProcessing={isBulkProcessing}
              bulkProgress={bulkProgress}
            />
          )}

          {currentView === 'history' && (
            <HistoryPage
              history={history}
              onRemoveImage={(id) => setHistory(prev => prev.filter(img => img.id !== id))}
              onClearAll={() => setHistory([])}
            />
          )}

          {currentView === 'account' && user && (
            <AccountPage
              user={user}
              onRefresh={refreshUser}
            />
          )}

          {currentView === 'bulk' && (
            <BulkProcessPage
              user={user}
              onBulkProcess={async (data) => {}}
            />
          )}

          {currentView === 'admin' && user && user.is_admin && (
            <div className="p-6">
              <AdminPanel
                isOpen={true}
                onClose={() => setCurrentView('dashboard')}
                currentUser={user}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showBulkModal && (
        <BulkProcessingModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          imageType={'blog'}
          onProcessingStateChange={setIsBulkProcessing}
          onProgressUpdate={setBulkProgress}
          onImageGenerated={(img) => setHistory(prev => [img, ...prev])}
          onBulkCompleted={() => {}}
          user={user}
          onRefreshUser={refreshUser}
          deductCredits={deductCredits}
          getCreditCost={(type) => type === 'blog' ? 5 : 10}
          setShowAccountPanel={setShowAccountPanel}
        />
      )}

      <SuccessNotification
        isVisible={showSuccessNotification}
        onClose={() => setShowSuccessNotification(false)}
        imageType={generatedImage?.type || 'blog'}
        onDownload={() => {}}
        onPreview={() => setShowSuccessNotification(false)}
      />
    </div>
  );
}
