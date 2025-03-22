
import { supabase } from './client';
import { toast } from 'sonner';

// Function to create the auction_settings table if it doesn't exist
export const ensureAuctionSettingsTable = async (): Promise<boolean> => {
  try {
    // Check if the table exists first by trying to select from it
    const { data, error } = await supabase
      .from('auction_settings')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('Checking auction_settings table status:', error.message);
      
      // If the error is that the table doesn't exist, create it using our RPC function
      if (error.code === 'PGRST116') {
        console.log('Creating auction_settings table...');
        
        // Call the RPC function we created in the SQL migration
        const { error: createError } = await supabase.rpc('create_auction_settings_table');
        
        if (createError) {
          console.error('Error creating auction_settings table:', createError);
          toast.error('Failed to create auction settings table');
          return false;
        }
        
        console.log('auction_settings table created successfully');
        toast.success('Auction settings initialized');
        return true;
      }
      
      // If it's another error, report it
      console.error('Error checking auction_settings table:', error);
      return false;
    }
    
    // Table exists and we could query it
    console.log('auction_settings table exists');
    return true;
  } catch (err) {
    console.error('Error ensuring auction_settings table:', err);
    return false;
  }
};

// Function to initialize all necessary tables
export const initializeTables = async (): Promise<void> => {
  try {
    await ensureAuctionSettingsTable();
    // Add other table initialization functions here in the future
  } catch (error) {
    console.error('Error initializing tables:', error);
    toast.error('Failed to initialize database tables');
  }
};
