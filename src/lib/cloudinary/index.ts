
// Re-export all Cloudinary utilities from this central file

// Configuration
export { 
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_BASE_URL,
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_API_SECRET,
  isCloudinaryConfigured
} from './config';

// URL Building
export {
  buildCloudinaryUrl as getCloudinaryUrl, // Export buildCloudinaryUrl as getCloudinaryUrl for backward compatibility
  buildCloudinaryUrl,
  isCloudinaryUrl,
  fetchViaCloudinary
} from './urlBuilder';

// Image Optimization
export {
  getOptimizedImageUrl,
  sanitizeSamsungUrl,
  convertToCloudinary
} from './optimizer';

// Upload Service
export {
  uploadToCloudinary
} from './uploader';
