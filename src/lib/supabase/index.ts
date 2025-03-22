
// Re-export Supabase client
export { supabase } from './client';

// Re-export utility functions
export { 
  isSupabaseConfigured,
  testSupabaseConnection,
  handleSupabaseError
} from './utils';

// Re-export bid related functions
export {
  getBidsForProduct,
  getUserBids,
  getHighestBidForProduct,
  placeBidToSupabase
} from './bids';

// Re-export profile related functions
export {
  getProfileById,
  upsertProfile,
  deleteProfile,
  ensureProfilesTable
} from './profiles';
