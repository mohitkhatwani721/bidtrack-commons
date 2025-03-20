
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Initialize the Supabase client with your project credentials
const supabaseUrl = 'https://tkknfvvthafcajjnqksp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRra25mdnZ0aGFmY2Fqam5xa3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE3MjM1OTIsImV4cCI6MjAzNzI5OTU5Mn0.8R1TiIQUHPF38lbYGe6RFtQw-dPEp4iasqGhfkQKkAg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  if (
    supabaseUrl === 'https://tkknfvvthafcajjnqksp.supabase.co' &&
    supabaseAnonKey.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
  ) {
    return true;
  }
  
  toast.error('Supabase is not configured properly. Please check your credentials.');
  console.error('Supabase is not configured properly. Please check your credentials.');
  return false;
};
