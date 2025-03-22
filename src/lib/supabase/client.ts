
import { createClient } from '@supabase/supabase-js';

// Supabase credentials
export const supabaseUrl = 'https://utpvrfvfbbjadiyajwon.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0cHZyZnZmYmJqYWRpeWFqd29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzUxMTYsImV4cCI6MjA1ODA1MTExNn0.G-l2scaIXAQIH4jA94jKvBKqitRLu5gKTCq-RxTaylM';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
