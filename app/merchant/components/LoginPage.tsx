import React, { FC } from 'react';
import { Loader, LogIn } from 'lucide-react';

interface LoginPageProps {
  onGoogleSignIn: () => void;
  loading: boolean;
  error?: string | null;
}

export const LoginPage: FC<LoginPageProps> = ({ onGoogleSignIn, loading, error }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center gap-1 mb-4">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-300 shadow-md" />
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 shadow-md" />
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-300 shadow-md" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent mb-2">
            Merchant Dashboard
          </h1>
          <p className="text-gray-600">Manage your beaded jewelry collection</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border-2 border-purple-200 p-8 shadow-lg space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in with your Google account to get started</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            onClick={onGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-purple-200 hover:border-purple-500 text-gray-800 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                <span className="text-purple-600 font-bold text-xs">✓</span>
              </div>
              <p>Secure login with Google authentication</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                <span className="text-purple-600 font-bold text-xs">✓</span>
              </div>
              <p>Your data is encrypted and secure</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                <span className="text-purple-600 font-bold text-xs">✓</span>
              </div>
              <p>No password needed - sign in instantly</p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};