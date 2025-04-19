
import { isCloudinaryUrl, buildCloudinaryUrl, fetchViaCloudinary } from './urlBuilder';
import { sanitizeSamsungUrl } from '@/utils/images/samsungUrlFix';

// Cache for image optimization
const optimizationCache: Record<string, string> = {};

/**
 * Generates an optimized image URL with performance in mind
 */
export const getOptimizedImageUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    isHighPriority?: boolean;
  } = {}
): string => {
  if (!url) return 'https://res.cloudinary.com/di8rdvt2y/image/upload/v1/sample';
  
  const { width = 400, height = 300, quality = 80, isHighPriority = false } = options;
  
  // Avoid Samsung URLs entirely
  if (url.includes('samsung.com')) {
    console.log(`Avoiding Samsung URL in getOptimizedImageUrl: ${url}`);
    return 'https://res.cloudinary.com/di8rdvt2y/image/upload/v1/sample';
  }
  
  // If already a Cloudinary URL, just ensure it has optimized transformations
  if (isCloudinaryUrl(url)) {
    // For direct Cloudinary uploads, ensure we're using the proper URL structure
    if (url.includes('/upload/')) {
      try {
        const parts = url.split('/upload/');
        if (parts.length === 2) {
          // Ensure URL has a version
          if (!parts[1].startsWith('v1/') && !parts[1].match(/^v\d+\//)) {
            const fixedUrl = `${parts[0]}/upload/v1/${parts[1]}`;
            console.log(`Fixed Cloudinary URL format: ${fixedUrl}`);
            return fixedUrl;
          }
        }
      } catch (error) {
        console.error("Error fixing Cloudinary URL format:", error);
      }
    }
    
    return url;
  }
  
  // For external images, use Cloudinary's fetch capability (excluding Samsung)
  return fetchViaCloudinary(url, { width, height, quality });
};

/**
 * Sanitizes problematic URLs, particularly avoiding Samsung URLs
 */
export const sanitizeSamsungUrl = (url: string): string => {
  if (!url) return url;
  
  try {
    // Avoid Samsung URLs entirely
    if (url.includes('samsung.com')) {
      console.log(`Avoiding Samsung URL in optimizer: ${url}`);
      return 'https://res.cloudinary.com/di8rdvt2y/image/upload/v1/sample';
    }
  } catch (error) {
    console.error(`Error processing URL: ${url}`, error);
  }
  
  // Return original URL if not a Samsung URL or if there was an error
  return url;
};

/**
 * Converts a non-Cloudinary URL to a Cloudinary URL for optimization
 */
export const convertToCloudinary = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
} = {}): string => {
  const cacheKey = `convert:${url}:${JSON.stringify(options)}`;
  
  // Check cache first
  if (optimizationCache[cacheKey]) {
    return optimizationCache[cacheKey];
  }
  
  // Skip if already a Cloudinary URL
  if (isCloudinaryUrl(url)) {
    optimizationCache[cacheKey] = url;
    return url;
  }
  
  // Avoid Samsung URLs entirely
  if (url.includes('samsung.com')) {
    const defaultUrl = 'https://res.cloudinary.com/di8rdvt2y/image/upload/v1/sample';
    optimizationCache[cacheKey] = defaultUrl;
    return defaultUrl;
  }

  const result = fetchViaCloudinary(url, options);
  optimizationCache[cacheKey] = result;
  return result;
};
