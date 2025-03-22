
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client based on environment
const isProd = import.meta.env.PROD; // True in production, false in development

// Production environment credentials
const prodSupabaseUrl = 'https://utpvrfvfbbjadiyajwon.supabase.co';
const prodSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0cHZyZnZmYmJqYWRpeWFqd29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzUxMTYsImV4cCI6MjA1ODA1MTExNn0.G-l2scaIXAQIH4jA94jKvBKqitRLu5gKTCq-RxTaylM';

// Staging environment credentials - can be updated as needed
const stagingSupabaseUrl = 'https://utpvrfvfbbjadiyajwon.supabase.co'; // Same for now, update when staging is created
const stagingSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0cHZyZnZmYmJqYWRpeWFqd29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzUxMTYsImV4cCI6MjA1ODA1MTExNn0.G-l2scaIXAQIH4jA94jKvBKqitRLu5gKTCq-RxTaylM'; // Same for now, update when staging is created

// Select the appropriate credentials based on environment
export const supabaseUrl = isProd ? prodSupabaseUrl : stagingSupabaseUrl;
export const supabaseAnonKey = isProd ? prodSupabaseAnonKey : stagingSupabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log which environment is being used (helpful for debugging)
console.log(`Using Supabase in ${isProd ? 'PRODUCTION' : 'STAGING'} environment`);
