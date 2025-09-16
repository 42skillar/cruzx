export interface Province {
  id: string;
  name: string;
  code: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'leader' | 'operator';
  province_id: string;
  province?: Province;
  created_at: string;
  updated_at: string;
  first_login: boolean;
}

export interface Donor {
  id: string;
  name: string;
  email?: string;
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
  province?: Province;
  
  // Medical information
  is_eligible: boolean;
  medical_conditions?: string;
  medications?: string;
  last_donation_date?: string;
  
  // Availability
  available_days: string[]; // ['monday', 'tuesday', ...]
  preferred_time: 'morning' | 'afternoon' | 'evening';
  
  // Metadata
  created_by: string;
  created_by_profile?: Profile;
  created_at: string;
  updated_at: string;
  synced?: boolean; // For offline functionality
}

export interface Donation {
  id: string;
  donor_id: string;
  donor?: Donor;
  donation_date: string;
  location: string;
  volume_ml: number;
  donation_type: 'whole_blood' | 'plasma' | 'platelets' | 'red_cells';
  notes?: string;
  province_id: string;
  created_by: string;
  created_by_profile?: Profile;
  created_at: string;
}

export interface DashboardStats {
  total_donors: number;
  total_donations: number;
  eligible_donors: number;
  donations_this_month: number;
  donors_by_blood_type: Record<string, number>;
  donors_by_age_group: Record<string, number>;
  donations_by_month: Record<string, number>;
}

export interface SearchFilters {
  name?: string;
  gender?: 'M' | 'F';
  blood_type?: string;
  age_min?: number;
  age_max?: number;
  municipality?: string;
  is_eligible?: boolean;
  province_id?: string;
}