
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Initialize the Supabase client (you'll need to replace these with your actual values)
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  if (
    supabaseUrl === 'https://your-project-url.supabase.co' ||
    supabaseAnonKey === 'your-anon-key'
  ) {
    toast.error('Supabase is not configured. Please update your supabase.ts file with your project credentials.');
    console.error(
      'Supabase is not configured. Please update your supabase.ts file with your project credentials.'
    );
    return false;
  }
  return true;
};
