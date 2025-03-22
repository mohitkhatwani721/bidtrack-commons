
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with your project credentials
const supabaseUrl = 'https://utpvrfvfbbjadiyajwon.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0cHZyZnZmYmJqYWRpeWFqd29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzUxMTYsImV4cCI6MjA1ODA1MTExNn0.G-l2scaIXAQIH4jA94jKvBKqitRLu5gKTCq-RxTaylM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export the URL and key for validation purposes
export { supabaseUrl, supabaseAnonKey };
