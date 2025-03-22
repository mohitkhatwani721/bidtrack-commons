
import { supabase } from './client';
import { handleSupabaseError } from './utils';

interface Profile {
  id: string;
  email: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// Get a user profile by ID
export const getProfileById = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, 'Failed to fetch user profile');
    return null;
  }
};

// Create or update a user profile
export const upsertProfile = async (profile: Partial<Profile> & { id: string }): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile, { onConflict: 'id' })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, 'Failed to update user profile');
    return null;
  }
};

// Delete a user profile
export const deleteProfile = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    handleSupabaseError(error, 'Failed to delete user profile');
    return false;
  }
};

// This function ensures that the profiles table exists in the database
export const ensureProfilesTable = async (): Promise<boolean> => {
  try {
    // Check if the profiles table exists
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
      
    if (error && error.message.includes('does not exist')) {
      console.log('Profiles table does not exist, consider creating it from the Supabase dashboard');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking profiles table:', error);
    return false;
  }
};
