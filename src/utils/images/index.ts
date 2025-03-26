
// Main export file for image utilities

// Cloudinary utilities
export {
  isCloudinaryUrl,
  getCloudinaryUrl,
  uploadToCloudinary,
  getRelevantPlaceholder,
  convertToCloudinary
} from './cloudinaryUtils';

// Samsung URL fixes
export {
  sanitizeSamsungUrl
} from './samsungUrlFix';

// Image optimization
export {
  optimizeImageUrl
} from './imageOptimizer';

// Image preloading
export {
  preloadImages
} from './imagePreloader';

// Placeholder generation
export {
  generateAdditionalImages,
  generateLowQualityImagePlaceholder
} from './placeholders';
