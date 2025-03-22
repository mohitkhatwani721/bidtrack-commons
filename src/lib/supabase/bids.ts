
import { toast } from 'sonner';
import { supabase } from './client';
import { isSupabaseConfigured, testSupabaseConnection, handleSupabaseError } from './utils';
import { getAuctionSettings } from './admin';
import { Bid } from '@/lib/types';

// Get all bids for a specific product from Supabase
export const getBidsForProduct = async (productId: string) => {
  if (!isSupabaseConfigured()) {
    toast.error('Supabase is not configured. Please connect your Supabase project first.');
    return [];
  }
  
  try {
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

// Get all bids for a specific user from Supabase
export const getUserBids = async (userEmail: string) => {
  if (!isSupabaseConfigured()) {
    toast.error('Supabase is not configured. Please connect your Supabase project first.');
    return [];
  }
  
  try {
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
    
    // Transform data to match our Bid interface with product details
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

// Get the highest bid for a product from Supabase
export const getHighestBidForProduct = async (productId: string) => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  
  try {
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
    
    if (data && data.length > 0) {
      return {
        id: data[0].id,
        productId: data[0].product_id,
        userEmail: data[0].user_email,
        amount: data[0].amount,
        timestamp: new Date(data[0].created_at)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching highest bid:', error);
    return null;
  }
};

// Place a bid to Supabase
export const placeBidToSupabase = async ({ productId, userEmail, amount }: Omit<Bid, 'id' | 'timestamp'>) => {
  if (!isSupabaseConfigured()) {
    toast.error('Supabase is not configured. Please connect your Supabase project first.');
    return null;
  }
  
  try {
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      return null;
    }
    
    // Check if auction is still active
    const auctionSettings = await getAuctionSettings();
    if (!auctionSettings) {
      toast.error('Could not retrieve auction settings');
      return null;
    }
    
    const now = new Date();
    if (now < auctionSettings.startDate) {
      toast.error('The auction has not started yet');
      return null;
    }
    
    if (now > auctionSettings.endDate) {
      toast.error('The auction has ended. No more bids can be placed.');
      return null;
    }
    
    // Continue with placing the bid since auction is active
    const { data, error } = await supabase
      .from('bids')
      .insert([
        {
          product_id: productId,
          user_email: userEmail,
          amount: amount
        }
      ])
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      id: data.id,
      productId: data.product_id,
      userEmail: data.user_email,
      amount: data.amount,
      timestamp: new Date(data.created_at)
    };
  } catch (error) {
    return handleSupabaseError(error, 'Failed to place bid');
  }
};
