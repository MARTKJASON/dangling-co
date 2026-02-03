import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
}

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in (on mount)
  useEffect(() => {
const checkAuth = async () => {
  try {
    setLoading(true);
    setError(null);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;

    if (!session?.user || !session.user.email) {
      setUser(null);
      return;
    }

    const email = session.user.email;

    // 🔐 CHECK IF EMAIL IS WHITELISTED
    const { data: allowed, error: allowError } = await supabase
      .from('allowed_emails')
      .select('email')
      .eq('email', email)
      .single();

    if (allowError || !allowed) {
      // ❌ Not allowed
      await supabase.auth.signOut();
      setUser(null);
      setError('This email is not authorized to access this website');
      return;
    }

    // ✅ Allowed user
    setUser({
      id: session.user.id,
      email,
      name: session.user.user_metadata?.full_name || 'User',
      avatar_url: session.user.user_metadata?.avatar_url || '',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Authentication failed';
    setError(message);
    setUser(null);
  } finally {
    setLoading(false);
  }
};


    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || 'User',
          avatar_url: session.user.user_metadata?.avatar_url || '',
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/merchant`,
        },
      });

      if (signInError) throw signInError;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in';
      setError(message);
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign out';
      setError(message);
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    isAuthenticated: user !== null,
  };
};