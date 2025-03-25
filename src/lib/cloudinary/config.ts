
// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'di8rdvt2y';
export const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '293774813922618';
export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Preset for uploads (create this in your Cloudinary dashboard)
// Make sure this preset is whitelisted for unsigned uploads in your Cloudinary dashboard
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

// Add Cloudinary API Secret - this should NEVER be exposed in frontend code in production
// For demo purposes, we're including it here, but in a real app this should be handled server-side
export const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

/**
 * Check if Cloudinary configuration is valid
 */
export const isCloudinaryConfigured = (): boolean => {
  const isConfigured = Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);
  console.log(`Cloudinary configuration check: ${isConfigured ? 'VALID' : 'INVALID'}`);
  console.log(`- Cloud name: ${CLOUDINARY_CLOUD_NAME || 'MISSING'}`);
  console.log(`- Upload preset: ${CLOUDINARY_UPLOAD_PRESET || 'MISSING'}`);
  return isConfigured;
};
