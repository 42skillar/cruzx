import { supabase } from './supabase';
import type { Profile } from '@/types';

export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
      return null;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        *,
        province:provinces(*)
      `)
      .eq('id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('relation "public.profiles" does not exist')) {
        return null;
      }
      return null;
    }

    return profile as Profile;
  } catch (error) {
    return null;
  }
}

export async function signIn(email: string, password: string) {
  // Check if Supabase is properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
    return { 
      data: null, 
      error: { message: 'Supabase não configurado. Entre em contato com o administrador.' } 
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  return { error };
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password,
  });
  return { error };
}

export function hasPermission(
  userRole: Profile['role'],
  action: 'create' | 'read' | 'update' | 'delete',
  resource: 'donor' | 'donation' | 'report' | 'user',
  isOwner: boolean = false
): boolean {
  const permissions = {
    admin: {
      donor: { create: true, read: true, update: true, delete: true },
      donation: { create: true, read: true, update: true, delete: true },
      report: { create: true, read: true, update: true, delete: true },
      user: { create: true, read: true, update: true, delete: true },
    },
    leader: {
      donor: { create: true, read: true, update: 'owner', delete: false },
      donation: { create: true, read: true, update: 'owner', delete: false },
      report: { create: true, read: 'owner', update: false, delete: false },
      user: { create: false, read: 'self', update: 'self', delete: false },
    },
    operator: {
      donor: { create: false, read: true, update: false, delete: false },
      donation: { create: true, read: true, update: false, delete: false },
      report: { create: false, read: false, update: false, delete: false },
      user: { create: false, read: 'self', update: 'self', delete: false },
    },
  };

  const userPermissions = permissions[userRole];
  if (!userPermissions) return false;

  const resourcePermissions = userPermissions[resource];
  if (!resourcePermissions) return false;

  const permission = resourcePermissions[action];

  if (permission === true) return true;
  if (permission === false) return false;
  if (permission === 'owner') return isOwner;
  if (permission === 'self') return isOwner;

  return false;
}