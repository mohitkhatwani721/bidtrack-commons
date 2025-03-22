
import { toast } from 'sonner';
import { supabase } from './client';
import { isSupabaseConfigured, testSupabaseConnection, handleSupabaseError } from './utils';

export const getBidsForProduct = async (productId: string) => {
  if (!isSupabaseConfigured()) {
    toast.error('Supabase is not configured. Please connect your Supabase project first.');
    return [];
  }
  
  try {
    // Test connection first
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      return [];
    }
    
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
  if (!isSupabaseConfigured()) {
    toast.error('Supabase is not configured. Please connect your Supabase project first.');
    return [];
  }
  
  try {
    // Test connection first
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      return [];
    }
    
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
  if (!isSupabaseConfigured()) {
    toast.error('Supabase is not configured. Please connect your Supabase project first.');
    return null;
  }
  
  try {
    // Test connection first
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      return null;
    }
    
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
  if (!isSupabaseConfigured()) {
    toast.error('Supabase is not configured. Please connect your Supabase project first.');
    return null;
  }
  
  try {
    // Test connection first
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      return null;
    }
    
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
      if (error.message === 'Failed to fetch' || error.code === 'NETWORK_ERROR') {
        toast.error('Cannot connect to Supabase. Please ensure you have connected your Supabase project and have internet connection.');
      } else if (error.code === 'PGRST301') {
        toast.error('Supabase schema missing. Please set up your database tables.');
      } else {
        toast.error('Failed to place bid: ' + (error.message || 'Unknown error'));
      }
    } else {
      toast.error('Failed to place bid due to an unknown error');
    }
    
    return null;
  }
};
