
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

// Supabase functions for bids
export const getBidsForProduct = async (productId: string) => {
  if (!isSupabaseConfigured()) return [];
  
  const { data, error } = await supabase
    .from('bids')
    .select('*')
    .eq('product_id', productId)
    .order('amount', { ascending: false });
    
  if (error) {
    console.error('Error fetching bids:', error);
    toast.error('Failed to load bids');
    return [];
  }
  
  // Transform to match our Bid interface
  return data.map(bid => ({
    id: bid.id,
    productId: bid.product_id,
    userEmail: bid.user_email,
    amount: bid.amount,
    timestamp: new Date(bid.created_at)
  }));
};

export const getUserBids = async (userEmail: string) => {
  if (!isSupabaseConfigured()) return [];
  
  const { data, error } = await supabase
    .from('bids')
    .select('*, products(name, image_url, price_per_unit)')
    .eq('user_email', userEmail)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching user bids:', error);
    toast.error('Failed to load your bids');
    return [];
  }
  
  // Transform to match our Bid interface
  return data.map(bid => ({
    id: bid.id,
    productId: bid.product_id,
    userEmail: bid.user_email,
    amount: bid.amount,
    timestamp: new Date(bid.created_at),
    product: bid.products ? {
      name: bid.products.name,
      imageUrl: bid.products.image_url,
      pricePerUnit: bid.products.price_per_unit
    } : null
  }));
};

export const getHighestBidForProduct = async (productId: string) => {
  if (!isSupabaseConfigured()) return null;
  
  const { data, error } = await supabase
    .from('bids')
    .select('*')
    .eq('product_id', productId)
    .order('amount', { ascending: false })
    .limit(1);
    
  if (error || !data || data.length === 0) {
    return null;
  }
  
  return {
    id: data[0].id,
    productId: data[0].product_id,
    userEmail: data[0].user_email,
    amount: data[0].amount,
    timestamp: new Date(data[0].created_at)
  };
};

export const placeBidToSupabase = async (productId: string, userEmail: string, amount: number) => {
  if (!isSupabaseConfigured()) return null;
  
  // Check if user has already bid on this product
  const { data: existingBids, error: checkError } = await supabase
    .from('bids')
    .select('id')
    .eq('product_id', productId)
    .eq('user_email', userEmail);
    
  if (checkError) {
    console.error('Error checking existing bids:', checkError);
    toast.error('Failed to place bid');
    return null;
  }
  
  if (existingBids && existingBids.length > 0) {
    toast.error('You have already placed a bid on this product');
    return null;
  }
  
  // Insert new bid
  const { data, error } = await supabase
    .from('bids')
    .insert([
      { 
        product_id: productId, 
        user_email: userEmail, 
        amount: amount,
        created_at: new Date().toISOString()
      }
    ])
    .select();
    
  if (error) {
    console.error('Error placing bid:', error);
    toast.error('Failed to place bid');
    return null;
  }
  
  if (!data || data.length === 0) {
    toast.error('Failed to place bid');
    return null;
  }
  
  return {
    id: data[0].id,
    productId: data[0].product_id,
    userEmail: data[0].user_email,
    amount: data[0].amount,
    timestamp: new Date(data[0].created_at)
  };
};
