
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

// Helper function to handle Supabase errors consistently
const handleSupabaseError = (error: any, message: string) => {
  console.error(`${message}:`, error);
  if (error.message === 'Failed to fetch') {
    toast.error('Cannot connect to Supabase. Please check your internet connection or Supabase status.');
  } else {
    toast.error(message);
  }
  return [];
};

// Supabase functions for bids
export const getBidsForProduct = async (productId: string) => {
  if (!isSupabaseConfigured()) return [];
  
  try {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('product_id', productId)
      .order('amount', { ascending: false });
      
    if (error) throw error;
    
    // Transform to match our Bid interface
    return data.map(bid => ({
      id: bid.id,
      productId: bid.product_id,
      userEmail: bid.user_email,
      amount: bid.amount,
      timestamp: new Date(bid.created_at)
    }));
  } catch (error) {
    return handleSupabaseError(error, 'Failed to load bids');
  }
};

export const getUserBids = async (userEmail: string) => {
  if (!isSupabaseConfigured()) return [];
  
  try {
    const { data, error } = await supabase
      .from('bids')
      .select('*, products(*)')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Transform to match our Bid interface with product details
    return data.map(bid => ({
      id: bid.id,
      productId: bid.product_id,
      userEmail: bid.user_email,
      amount: bid.amount,
      timestamp: new Date(bid.created_at),
      product: bid.products ? {
        id: bid.products.id,
        name: bid.products.name,
        modelCode: bid.products.model_code || '',
        zone: bid.products.zone || '',
        quantity: bid.products.quantity || 1,
        pricePerUnit: bid.products.price_per_unit || 0,
        totalPrice: bid.products.total_price || 0,
        imageUrl: bid.products.image_url,
        description: bid.products.description
      } : null
    }));
  } catch (error) {
    return handleSupabaseError(error, 'Failed to load your bids');
  }
};

export const getHighestBidForProduct = async (productId: string) => {
  if (!isSupabaseConfigured()) return null;
  
  try {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('product_id', productId)
      .order('amount', { ascending: false })
      .limit(1);
      
    if (error) throw error;
    if (!data || data.length === 0) return null;
    
    return {
      id: data[0].id,
      productId: data[0].product_id,
      userEmail: data[0].user_email,
      amount: data[0].amount,
      timestamp: new Date(data[0].created_at)
    };
  } catch (error) {
    handleSupabaseError(error, 'Failed to load highest bid');
    return null;
  }
};

export const placeBidToSupabase = async (productId: string, userEmail: string, amount: number) => {
  if (!isSupabaseConfigured()) return null;
  
  try {
    // Check if user has already bid on this product
    const { data: existingBids, error: checkError } = await supabase
      .from('bids')
      .select('id')
      .eq('product_id', productId)
      .eq('user_email', userEmail);
      
    if (checkError) throw { message: 'Error checking existing bids', error: checkError };
    
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
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      toast.error('Failed to place bid');
      return null;
    }
    
    toast.success('Bid placed successfully!');
    return {
      id: data[0].id,
      productId: data[0].product_id,
      userEmail: data[0].user_email,
      amount: data[0].amount,
      timestamp: new Date(data[0].created_at)
    };
  } catch (error) {
    console.error('Error placing bid:', error);
    
    if (typeof error === 'object' && error !== null && 'message' in error) {
      if (error.message === 'Failed to fetch') {
        toast.error('Cannot connect to Supabase. Please check your internet connection.');
      } else {
        toast.error('Failed to place bid: ' + (error.message || 'Unknown error'));
      }
    } else {
      toast.error('Failed to place bid due to an unknown error');
    }
    
    return null;
  }
};
