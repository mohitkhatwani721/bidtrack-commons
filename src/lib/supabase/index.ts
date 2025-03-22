
// Re-export Supabase client
export { supabase } from './client';

// Re-export utility functions
export { 
  isSupabaseConfigured,
  testSupabaseConnection,
  handleSupabaseError
} from './utils';

// Re-export product related functions
export {
  getAllProducts,
  getProductById,
  updateProductImage
} from './products';

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

// Re-export admin related functions
export {
  getAllBids,
  getAuctionSettings,
  updateAuctionSettings,
  getWinners,
  isWinningBid
} from './admin';

// Re-export table initialization functions
export {
  ensureAuctionSettingsTable,
  initializeTables
} from './createTables';
