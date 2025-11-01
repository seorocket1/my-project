import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { AuthModal } from './components/AuthModal';
import { SignUpModal } from './components/SignUpModal';
import { supabase, isSupabaseConfigured, signIn as supabaseSignIn, signUp as supabaseSignUp } from './lib/supabase';

const AuthApp: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthError('Supabase is not configured. Please check your environment variables.');
    }
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    setAuthError('');
    try {
      const result = await supabaseSignIn(email, password);
      if (result.user) {
        // Redirect the top-level window to the main app after successful sign-in
        if (window.top) {
          window.top.location.href = '/';
        }
        return { success: true };
      } else {
        return { success: false, error: 'Sign in failed. Please check your credentials.' };
      }
    } catch (error: any) {
      setAuthError(error.message || 'An unexpected error occurred during sign in.');
      return { success: false, error: error.message || 'An unexpected error occurred.' };
    }
  };

  const handleSignUp = async (userData: any) => {
    setAuthError('');
    try {
      await supabaseSignUp(userData.email, userData.password, userData);
      // After successful sign-up, show success message and close modal
      // User will need to confirm email, then can sign in
      setShowSignUpModal(false);
      setShowAuthModal(true); // Optionally show sign-in modal after successful sign-up
      return true;
    } catch (error: any) {
      setAuthError(error.message || 'An unexpected error occurred during sign up.');
      return false;
    }
  };

  return (
    <>
      {authError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white p-3 rounded-md shadow-lg z-[100]">
          {authError}
        </div>
      )}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignInWithEmail={handleSignIn}
        onSignInAnonymously={async () => {
          setAuthError('Please create an account to use the service and get 100 free credits!');
          return false;
        }}
        onOpenSignUp={() => {
          setShowAuthModal(false);
          setShowSignUpModal(true);
        }}
      />
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSignUp={handleSignUp}
      />
    </>
  );
};

const container = document.getElementById('auth-root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <AuthApp />
    </React.StrictMode>
  );
}