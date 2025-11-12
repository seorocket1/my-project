import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Zap, LogOut, User as UserIcon, History, Settings, CreditCard, AlertCircle, Brain, Cpu, Palette, Layers } from 'lucide-react';
import { ImageTypeSelector } from './components/ImageTypeSelector';
import { UnifiedImageForm } from './components/UnifiedImageForm';
import { ImagePreview } from './components/ImagePreview';
import { ProgressSteps } from './components/ProgressSteps';
import { QuickNavigation } from './components/QuickNavigation';
import { AuthModal } from './components/AuthModal';
import { SignUpModal } from './components/SignUpModal';
import { AdminPanel } from './components/AdminPanel';
import { AccountPanel } from './components/AccountPanel';
import { ImageHistorySidebar } from './components/ImageHistorySidebar';
import { BulkProcessingModal } from './components/BulkProcessingModal';
import { SuccessNotification } from './components/SuccessNotification';
import { GlobalHeader } from './components/GlobalHeader';
import { GlobalFooter } from './components/GlobalFooter';
import { sanitizeFormData, sanitizeText } from './utils/textSanitizer';
import { supabase, isSupabaseConfigured, User, ImageGeneration, signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut, deductCredits, saveImageGeneration } from './lib/supabase';
import { HistoryImage } from './types/history';
import { LandingPage } from './components/LandingPage';
import { SubscriptionModal } from './components/SubscriptionModal';
import { RefundPolicyPage } from './components/RefundPolicyPage';
import { AboutUsPage } from './components/AboutUsPage';
import { ContactUsPage } from './components/ContactUsPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsAndConditionsPage } from './components/TermsAndConditionsPage';

type Step = 'select' | 'form' | 'result';
type ImageType = 'blog' | 'infographic' | null;

interface GeneratedImage {
  url: string;
  type: 'blog' | 'infographic';
}

const WEBHOOK_URL = 'https://n8n.seoengine.agency/webhook/6e9e3b30-cb55-4d74-aa9d-68691983455f';

const mapHistory = (history: ImageGeneration[]): HistoryImage[] => {
  return history.map(item => ({
    id: item.id,
    type: item.image_type as 'blog' | 'infographic',
    title: item.title,
    content: item.content,
    url: item.image_data, // Correctly assign the URL
    timestamp: new Date(item.created_at).getTime(),
    style: item.style,
    colour: item.colour,
  }));
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryImage[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | undefined>();
  const [showLanding, setShowLanding] = useState(window.location.pathname === '/landing');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ completed: number, total: number } | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAccountPanel, setShowAccountPanel] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [bulkCompletionNotification, setBulkCompletionNotification] = useState<{
    show: boolean;
    completed: number;
    total: number;
  }>({ show: false, completed: 0, total: 0 });
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [selectedType, setSelectedType] = useState<ImageType>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
    const handlePopState = () => {
      setShowLanding(window.location.pathname === '/landing');
    };

    window.addEventListener('popstate', handlePopState);

    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      setAuthError('Database connection not configured. Please click "Connect to Supabase" in the top right corner.');
      return;
    }

    const getInitialUser = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await refreshUser();
        setIsAuthenticated(true);
        console.log('Initial user session found. isAuthenticated:', true, 'user:', user);
      } else {
        console.log('No initial user session found.');
      }
      setAuthLoading(false);
    };

    getInitialUser();

    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        refreshUser();
        console.log('Auth state changed: SIGNED_IN. isAuthenticated:', true);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
        setHistory([]);
        console.log('Auth state changed: SIGNED_OUT. isAuthenticated:', false);
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, [refreshUser]);

  const signIn = async (email: string, password: string) => {
    const { profile } = await supabaseSignIn(email, password);
    setUser(profile);
    setIsAuthenticated(true);
    if (profile?.history) {
      setHistory(mapHistory(profile.history));
    }
    console.log('Sign in successful. isAuthenticated:', true, 'user profile:', profile);
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
  };

  const steps = ['Select Type', 'Provide Content', 'Generate Image'];
  const getStepIndex = () => {
    switch (currentStep) {
      case 'select': return 0;
      case 'form': return 1;
      case 'result': return 2;
      default: return 0;
    }
  };

  const handleTypeSelect = (type: 'blog' | 'infographic') => {
    setSelectedType(type);
    setCurrentStep('form');
    setGeneratedImage(null);
    setFormData(null);
    setError(null);
  };

  const handleQuickNavigation = (type: 'blog' | 'infographic') => {
    if (currentStep !== 'select') {
      setSelectedType(type);
      setCurrentStep('form');
      setGeneratedImage(null);
      setFormData(null);
      setError(null);
    } else {
      handleTypeSelect(type);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (!selectedType) return;

    let requiredCredits = selectedType === 'infographic' ? 10 : 5;
    if (selectedType === 'blog' && data.image_url) {
      requiredCredits += 5;
    }

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

      let imageDetail = selectedType === 'blog' ? `Blog post title: '${title}', Content: ${intro || content}` : content;
      if (style) imageDetail += `, Style: ${style}`;
      if (colour) imageDetail += `, Colour: ${colour}`;

      // Determine the base image type
      let baseImageType = selectedType === 'blog'
        ? (data.image_url ? 'Featured Image with product image' : 'Featured Image')
        : 'Infographic';

      // Apply branding if enabled
      if (data.use_brand && user && selectedType === 'blog') {
        if (data.image_url) {
          baseImageType = 'Featured Image with product image with branding';
        } else {
          baseImageType = 'Featured Image with branding';
        }
      } else if (data.use_brand && user && selectedType === 'infographic') {
        baseImageType = 'Infographic with branding';
      }

      const payload: { [key: string]: any } = {
        image_type: baseImageType,
        image_detail: imageDetail,
      };

      if (data.image_url) {
        payload.image_url = data.image_url;
      }

      if (data.image_size && data.image_size !== 'auto') {
        payload.image_size = data.image_size;
      }

      if (data.use_brand && user) {
        payload.brand_logo = user.brand_logo_url;
        payload.brand_website = user.website_url;
        payload.brand_guidelines = user.brand_guidelines;
      }

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
        image_type: selectedType,
        title: title,
        content: content,
        style: style,
        colour: colour,
        credits_used: requiredCredits,
        image_data: imageBase64,
      });

      const newImage = {
        url: newImageRecord.publicUrl,
        type: selectedType,
      };

      console.log('Setting generated image in App.tsx:', newImage);
      setGeneratedImage(newImage);
      setCurrentStep('result');
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
    setCurrentStep('form');
    setGeneratedImage(null);
    setFormData(null);
    setError(null);
  };

  const handleBack = () => {
    if (currentStep === 'form') {
      setCurrentStep('select');
    } else if (currentStep === 'result') {
      setCurrentStep('form');
    }
    setGeneratedImage(null);
    setError(null);
  };

  const downloadCurrentImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    // The response is a URL, not base64 data
    link.href = generatedImage.url;
    const title = formData?.title || 'image';
    const safeTitle = title.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '-').toLowerCase();
    link.download = `seo-engine-${generatedImage.type}-${safeTitle}-${Date.now()}.png`;
    link.click();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            <a 
              href="https://seoengine.agency/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              SEO Engine
            </a>
          </h2>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{authError}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>To fix this:</strong> Please click the "Connect to Supabase" button in the top right corner to set up your database connection.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
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
            setCurrentSubscriptionPlan(plan);
            setShowSubscriptionModal(true);
          }}
        />
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSignInWithEmail={signIn}
            onSignInAnonymously={async () => {
              // This is a placeholder. You might want to implement anonymous sign-in.
              return false;
            }}
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
            selectedPlan={currentSubscriptionPlan}
          />
        )}
      </>
    );
  }

  return (
    <Router>
      <Helmet>
        <title>AI Image Generator - SEO Engine</title>
        <meta name="description" content="Create stunning blog featured images and infographics with the power of AI. Fast, easy, and visually appealing." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <GlobalHeader
          user={user}
          isAuthenticated={isAuthenticated}
          isSupabaseConfigured={isSupabaseConfigured}
          isProcessing={isProcessing}
          isBulkProcessing={isBulkProcessing}
          history={history}
          setShowHistorySidebar={setShowHistorySidebar}
          setShowAdminPanel={setShowAdminPanel}
          setShowAccountPanel={setShowAccountPanel}
          signOut={signOut}
        />

        {(isProcessing || isBulkProcessing) && (
          <div className="bg-blue-50 border-b border-blue-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <div className="flex items-center justify-center">
                <div className="flex items-center text-blue-700">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-sm font-medium">
                    {isBulkProcessing 
                      ? `Bulk processing is currently active. Please wait... (${bulkProgress ? `${bulkProgress.completed}/${bulkProgress.total}` : ''})`
                      : 'Single image generation is currently active. Please wait...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <QuickNavigation
          currentType={selectedType}
          onTypeSelect={handleQuickNavigation}
          isVisible={currentStep !== 'select'}
          disabled={isProcessing || isBulkProcessing}
        />

        <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <ProgressSteps currentStep={getStepIndex()} steps={steps} />
          </div>
        </div>

        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-600 text-sm font-medium mb-1">Image Generation Failed</p>
                  <p className="text-red-600 text-sm">{error}</p>
                  <div className="mt-3 flex items-center space-x-3">
                    <button onClick={() => setError(null)} className="text-sm text-red-600 hover:text-red-700 font-medium">Dismiss</button>
                    <button onClick={() => { setError(null); if (formData) { handleFormSubmit(formData); } }} className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">Try Again</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              {currentStep === 'select' ? (
                <div className="max-w-4xl mx-auto">
                  <ImageTypeSelector selectedType={selectedType} onTypeSelect={handleTypeSelect} disabled={isProcessing || isBulkProcessing} />
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 min-h-[calc(100vh-300px)]">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                    <div className="h-full flex flex-col">
                      <div className="p-4 sm:p-8 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedType === 'blog' ? 'Blog Featured Image' : 'Infographic Image'}</h2>
                          <button onClick={handleBack} disabled={isProcessing || isBulkProcessing} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">← Back</button>
                        </div>
                        <p className="text-gray-600 mt-2 text-sm sm:text-base">
                          {selectedType === 'blog' 
                            ? `Provide your blog details to generate a stunning featured image (5 credits)`
                            : `Provide your content to create a visual infographic (10 credits)`}
                        </p>
                      </div>
                      <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
                        {selectedType && (
                          <UnifiedImageForm
                            imageType={selectedType}
                            onSubmit={handleFormSubmit}
                            isLoading={isProcessing}
                            disabled={isProcessing || isBulkProcessing}
                            onOpenBulkModal={() => setShowBulkModal(true)}
                            user={user}
                            setShowAccountPanel={setShowAccountPanel}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden" data-preview>
                    <ImagePreview
                      generatedImage={generatedImage}
                      isLoading={isProcessing}
                      formData={formData}
                      imageType={selectedType}
                      onGenerateNew={handleGenerateNew}
                      isBulkProcessing={isBulkProcessing}
                      bulkProgress={bulkProgress}
                      onOpenBulkModal={() => setShowBulkModal(true)}
                    />
                  </div>
                </div>
              )}
            </main>
          } />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/landing" element={
            <LandingPage
              onSignInClick={() => setShowAuthModal(true)}
              onSubscribeClick={(plan) => {
                setCurrentSubscriptionPlan(plan);
                setShowSubscriptionModal(true);
              }}
            />
          } />
        </Routes>

        <GlobalFooter />

        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSignInWithEmail={signIn}
            onSignInAnonymously={async () => {
              // This is a placeholder. You might want to implement anonymous sign-in.
              return false;
            }}
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
            selectedPlan={currentSubscriptionPlan}
          />
        )}
        <ImageHistorySidebar
          isOpen={showHistorySidebar}
          onClose={() => setShowHistorySidebar(false)}
          history={history}
          isLoading={authLoading}
          clearHistory={() => setHistory([])} // Placeholder for actual clear history logic
          removeImage={(id) => setHistory(prev => prev.filter(img => img.id !== id))} // Placeholder
          forceRefresh={refreshUser}
          onSelectImage={(image) => {
            setGeneratedImage({ url: image.url, type: image.type });
            setSelectedType(image.type);
            setFormData({ title: image.title, content: image.content, style: image.style, colour: image.colour });
            setCurrentStep('result');
            setShowHistorySidebar(false);
          }}
        />
        {user && (
          <AccountPanel
            isOpen={showAccountPanel}
            onClose={() => setShowAccountPanel(false)}
            user={user}
            history={history}
            refreshUser={refreshUser}
          />
        )}
        {selectedType && (
          <BulkProcessingModal
            isOpen={showBulkModal}
            onClose={() => setShowBulkModal(false)}
            imageType={selectedType}
            onProcessingStateChange={setIsBulkProcessing}
            onProgressUpdate={setBulkProgress}
            onImageGenerated={(img) => {
              setHistory(prev => [img, ...prev]); // img is already HistoryImage
            }}
            onBulkCompleted={(completed, total) => setBulkCompletionNotification({ show: true, completed, total })}
            user={user}
            onRefreshUser={refreshUser}
            deductCredits={deductCredits}
            getCreditCost={(type) => type === 'blog' ? 5 : 10} // Assuming default costs
            setShowAccountPanel={setShowAccountPanel}
          />
        )}
        {user && user.is_admin && (
          <AdminPanel
            isOpen={showAdminPanel}
            onClose={() => setShowAdminPanel(false)}
            currentUser={user} // Pass as currentUser
          />
        )}
        <SuccessNotification
          isVisible={showSuccessNotification}
          onClose={() => setShowSuccessNotification(false)}
          imageType={generatedImage?.type || 'blog'} // Default to 'blog' if type is null
          onDownload={downloadCurrentImage}
          onPreview={() => {
            // Logic to show the generated image in a preview modal if needed
            setShowSuccessNotification(false);
          }}
        />
        <SuccessNotification
          isVisible={bulkCompletionNotification.show}
          onClose={() => setBulkCompletionNotification({ show: false, completed: 0, total: 0 })}
          imageType={'blog'} // Default image type for bulk completion notification
          isBulkCompletion={true}
          completedCount={bulkCompletionNotification.completed}
          totalCount={bulkCompletionNotification.total}
          onPreview={() => {
            setShowHistorySidebar(true); // Open history sidebar to view bulk images
            setBulkCompletionNotification({ show: false, completed: 0, total: 0 });
          }}
        />
      </div>
    </Router>
  );
}
