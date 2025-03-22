
import { supabase } from './client';
import { toast } from 'sonner';

// Function to create the auction_settings table if it doesn't exist
export const ensureAuctionSettingsTable = async (): Promise<boolean> => {
  try {
    // Check if the table exists
    const { data, error } = await supabase
      .from('auction_settings')
      .select('id')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('Creating auction_settings table...');
      
      // Execute raw SQL to create the table
      const { error: createError } = await supabase.rpc('create_auction_settings_table');
      
      if (createError) {
        console.error('Error creating auction_settings table:', createError);
        return false;
      }
      
      // Insert default settings
      const now = new Date();
      const { error: insertError } = await supabase
        .from('auction_settings')
        .insert([{
          start_date: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // Started yesterday
          end_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Ends in 7 days
          is_active: true
        }]);
      
      if (insertError) {
        console.error('Error inserting default auction settings:', insertError);
        return false;
      }
      
      console.log('auction_settings table created and populated');
      return true;
    }
    
    // Table already exists
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
  } catch (error) {
    console.error('Error initializing tables:', error);
    toast.error('Failed to initialize database tables');
  }
};
