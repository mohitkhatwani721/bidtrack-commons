
import { toast } from 'sonner';
import { supabaseUrl, supabaseAnonKey, supabase } from './client';

// Environment indicator
const isProd = import.meta.env.PROD;
const currentEnvironment = isProd ? 'PRODUCTION' : 'STAGING';

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    toast.error(`Supabase is not configured properly for ${currentEnvironment} environment. Please update your credentials in src/lib/supabase/client.ts`);
    console.error(`Supabase is not configured properly for ${currentEnvironment} environment. Please update your credentials in src/lib/supabase/client.ts`);
    return false;
  }
  
  return true;
};

// Check if Supabase connection has been established
export const testSupabaseConnection = async () => {
  try {
    // Simple health check query
    const { data, error } = await supabase.from('bids').select('count').limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        toast.error(`Supabase table "bids" does not exist in ${currentEnvironment} environment. Please set up your database schema.`);
        console.error(`Supabase table "bids" does not exist in ${currentEnvironment}:`, error);
        return false;
      } else {
        throw error;
      }
    }
    
    // If we get here, connection is working
    console.log(`Successfully connected to Supabase in ${currentEnvironment} environment`);
    return true;
  } catch (error: any) {
    console.error(`Supabase connection test failed in ${currentEnvironment}:`, error);
    
    if (error.message === 'Failed to fetch' || error.code === 'NETWORK_ERROR') {
      toast.error(`Cannot connect to Supabase in ${currentEnvironment}. Please ensure you have connected your Supabase project and have internet connection.`);
    } else if (error.code === 'PGRST301') {
      toast.error(`Supabase schema missing in ${currentEnvironment}. Please set up your database tables.`);
    } else {
      toast.error(`Supabase connection error in ${currentEnvironment}: ${error.message || 'Unknown error'}`);
    }
    
    return false;
  }
};

// Helper function to handle Supabase errors consistently
export const handleSupabaseError = (error: any, message: string) => {
  console.error(`${message} in ${currentEnvironment}:`, error);
  
  if (error.message === 'Failed to fetch' || error.code === 'NETWORK_ERROR') {
    toast.error(`Cannot connect to Supabase in ${currentEnvironment}. Please ensure you have connected your Supabase project and have internet connection.`);
  } else if (error.code === 'PGRST301') {
    toast.error(`Supabase schema missing in ${currentEnvironment}. Please set up your database tables.`);
  } else {
    toast.error(`${message} in ${currentEnvironment}`);
  }
  
  return [];
};
