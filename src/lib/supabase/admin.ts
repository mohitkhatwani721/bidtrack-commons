
import { toast } from 'sonner';
import { supabase } from './client';
import { isSupabaseConfigured, testSupabaseConnection, handleSupabaseError } from './utils';
import { AuctionSettings } from '@/lib/types';

// Get all bids from Supabase, including their related products
export const getAllBids = async () => {
  if (!isSupabaseConfigured()) {
    toast.error('Supabase is not configured. Please connect your Supabase project first.');
    return [];
  }
  
  try {
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      return [];
    }
    
    // Optimize query to fetch all data in a single request
    const { data, error } = await supabase
      .from('bids')
      .select('*, products(*)')
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
    return handleSupabaseError(error, 'Failed to load bids');
  }
};

// Get auction settings from Supabase
export const getAuctionSettings = async (): Promise<AuctionSettings | null> => {
  if (!isSupabaseConfigured()) {
    toast.error('Supabase is not configured. Please connect your Supabase project first.');
    return null;
  }
  
  try {
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('auction_settings')
      .select('*')
      .maybeSingle();
      
    if (error) {
      // If the error is that the table doesn't exist, return default settings
      if (error.code === 'PGRST116') {
        return {
          startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Started yesterday
          endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Ends in 7 days
          isActive: true
        };
      }
      throw error;
    }
    
    if (!data) {
      // No settings found, return default
      return {
        startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Started yesterday
        endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Ends in 7 days
        isActive: true
      };
    }
    
    return {
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      isActive: data.is_active
    };
  } catch (error) {
    console.error('Error fetching auction settings:', error);
    return null;
  }
};

// Update auction settings in Supabase
export const updateAuctionSettings = async (startDate: Date, endDate: Date): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    toast.error('Supabase is not configured. Please connect your Supabase project first.');
    return false;
  }
  
  try {
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      return false;
    }
    
    // Check if auction_settings table has any records
    const { data: existingSettings, error: checkError } = await supabase
      .from('auction_settings')
      .select('id')
      .limit(1);
      
    if (checkError) throw checkError;
    
    let result;
    
    if (existingSettings && existingSettings.length > 0) {
      // Update existing record
      result = await supabase
        .from('auction_settings')
        .update({
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings[0].id);
    } else {
      // Insert new record
      result = await supabase
        .from('auction_settings')
        .insert([{
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          is_active: true
        }]);
    }
    
    if (result.error) throw result.error;
    
    return true;
  } catch (error) {
    console.error('Error updating auction settings:', error);
    toast.error('Failed to update auction settings');
    return false;
  }
};

// Get winners (highest bidders for each product)
export const getWinners = async () => {
  const bids = await getAllBids();
  const winners = new Map();
  
  // Group bids by product
  const bidsByProduct = bids.reduce((acc, bid) => {
    if (!acc[bid.productId]) {
      acc[bid.productId] = [];
    }
    acc[bid.productId].push(bid);
    return acc;
  }, {});
  
  // Find highest bid for each product
  Object.keys(bidsByProduct).forEach(productId => {
    const productBids = bidsByProduct[productId];
    if (productBids.length > 0) {
      const highestBid = productBids.reduce((prev, current) => {
        return (prev.amount > current.amount) ? prev : current;
      });
      winners.set(productId, highestBid);
    }
  });
  
  return winners;
};

// Is this bid the highest for its product?
export const isWinningBid = async (bid) => {
  try {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .eq('product_id', bid.productId)
      .order('amount', { ascending: false })
      .limit(1);
      
    if (error || !data || data.length === 0) return false;
    
    return data[0].id === bid.id;
  } catch (error) {
    console.error('Error checking winning bid:', error);
    return false;
  }
};
