import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url_here' || supabaseKey === 'your_supabase_anon_key_here') {
  console.warn('Supabase environment variables not configured. Please update .env.local with your Supabase credentials.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
);

// Database types
export type Database = {
  public: {
    Tables: {
      provinces: {
        Row: {
          id: string;
          name: string;
          code: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'leader' | 'operator';
          province_id: string;
          created_at: string;
          updated_at: string;
          first_login: boolean;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'leader' | 'operator';
          province_id: string;
          created_at?: string;
          updated_at?: string;
          first_login?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'leader' | 'operator';
          province_id?: string;
          created_at?: string;
          updated_at?: string;
          first_login?: boolean;
        };
      };
      donors: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string;
          birth_date: string;
          age: number;
          gender: 'M' | 'F';
          blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
          weight: number;
          height: number;
          address: string;
          municipality: string;
          province_id: string;
          is_eligible: boolean;
          medical_conditions: string | null;
          medications: string | null;
          last_donation_date: string | null;
          available_days: string[];
          preferred_time: 'morning' | 'afternoon' | 'evening';
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone: string;
          birth_date: string;
          age: number;
          gender: 'M' | 'F';
          blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
          weight: number;
          height: number;
          address: string;
          municipality: string;
          province_id: string;
          is_eligible?: boolean;
          medical_conditions?: string | null;
          medications?: string | null;
          last_donation_date?: string | null;
          available_days: string[];
          preferred_time: 'morning' | 'afternoon' | 'evening';
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string;
          birth_date?: string;
          age?: number;
          gender?: 'M' | 'F';
          blood_type?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
          weight?: number;
          height?: number;
          address?: string;
          municipality?: string;
          province_id?: string;
          is_eligible?: boolean;
          medical_conditions?: string | null;
          medications?: string | null;
          last_donation_date?: string | null;
          available_days?: string[];
          preferred_time?: 'morning' | 'afternoon' | 'evening';
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      donations: {
        Row: {
          id: string;
          donor_id: string;
          donation_date: string;
          location: string;
          volume_ml: number;
          donation_type: 'whole_blood' | 'plasma' | 'platelets' | 'red_cells';
          notes: string | null;
          province_id: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          donor_id: string;
          donation_date: string;
          location: string;
          volume_ml: number;
          donation_type: 'whole_blood' | 'plasma' | 'platelets' | 'red_cells';
          notes?: string | null;
          province_id: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          donor_id?: string;
          donation_date?: string;
          location?: string;
          volume_ml?: number;
          donation_type?: 'whole_blood' | 'plasma' | 'platelets' | 'red_cells';
          notes?: string | null;
          province_id?: string;
          created_by?: string;
          created_at?: string;
        };
      };
    };
  };
};