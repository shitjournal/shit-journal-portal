import React, { createContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  display_name: string;
  institution: string | null;
  social_media: string | null;
  role: 'author' | 'reviewer' | 'editor';
  created_at: string;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, needsConfirmation: false }),
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error) setProfile(data);
    } catch { /* network error */ }
  };

  // Link old anonymous submissions to this user by email (uses SECURITY DEFINER function to bypass RLS)
  const linkOldSubmissions = async () => {
    try { await supabase.rpc('link_submissions_by_email'); } catch { /* RPC may fail */ }
  };

  useEffect(() => {
    // Listen for auth changes (fires INITIAL_SESSION on setup)
    // IMPORTANT: Must not await Supabase calls inside callback
    // due to known deadlock bug in supabase-js (Web Locks API).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setTimeout(async () => {
        if (event === 'SIGNED_IN') {
          // First login: link old submissions + fetch profile
          setUser(currentUser);
          if (currentUser) {
            await linkOldSubmissions();
            await fetchProfile(currentUser.id);
          }
          setLoading(false);
        } else if (event === 'INITIAL_SESSION') {
          // Page load session restore: fetch profile only (no RPC)
          setUser(currentUser);
          if (currentUser) await fetchProfile(currentUser.id);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setLoading(false);
        } else {
          // TOKEN_REFRESHED etc: update user object only, no DB queries
          setUser(currentUser);
        }
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) return { error: error.message, needsConfirmation: false };
    // If user exists but identities is empty, email already registered
    if (data.user && data.user.identities?.length === 0) {
      return { error: 'This email is already registered / 该邮箱已注册', needsConfirmation: false };
    }
    return { error: null, needsConfirmation: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
