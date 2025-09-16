'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentProfile } from '@/lib/auth';
import type { Profile } from '@/types';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  selectedProvinceId: string | null;
  setSelectedProvinceId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  selectedProvinceId: null,
  setSelectedProvinceId: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await getCurrentProfile();
          setProfile(userProfile);
          
          // Set default province for non-admin users
          if (userProfile && userProfile.role !== 'admin') {
            setSelectedProvinceId(userProfile.province_id);
          }
        }
      } catch (error) {
        setUser(null);
        setProfile(null);
      }
      
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const userProfile = await getCurrentProfile();
            setProfile(userProfile);
            
            // Set default province for non-admin users
            if (userProfile && userProfile.role !== 'admin') {
              setSelectedProvinceId(userProfile.province_id);
            }
          } else {
            setProfile(null);
            setSelectedProvinceId(null);
          }
        } catch (error) {
          setProfile(null);
          setSelectedProvinceId(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Redirect logic
  useEffect(() => {
    if (loading) return;

    const pathname = window.location.pathname;
    const isAuthPage = pathname.startsWith('/auth');

    if (!user && !isAuthPage) {
      router.push('/auth/login');
      return;
    }

    // Check for first login or missing profile FIRST
    if (user && !profile && !isAuthPage && pathname !== '/auth/first-login') {
      router.push('/auth/first-login');
      return;
    }

    if (user && profile?.first_login && pathname !== '/auth/first-login') {
      router.push('/auth/first-login');
      return;
    }

    // Only redirect authenticated users from auth pages if they don't need first-login
    if (user && isAuthPage && pathname !== '/auth/first-login') {
      router.push('/dashboard');
      return;
    }

    // Province selection for admins
    if (user && profile?.role === 'admin' && !selectedProvinceId && 
        pathname !== '/province-selector' && !isAuthPage) {
      router.push('/province-selector');
      return;
    }
  }, [user, profile, loading, selectedProvinceId, router]);

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      selectedProvinceId,
      setSelectedProvinceId,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};