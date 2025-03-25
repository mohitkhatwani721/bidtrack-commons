
import { isCloudinaryUrl, buildCloudinaryUrl, fetchViaCloudinary } from './urlBuilder';

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
  if (!url) return '';
  
  const { width = 400, height = 300, quality = 80, isHighPriority = false } = options;
  
  // If already a Cloudinary URL, just ensure it has optimized transformations
  if (isCloudinaryUrl(url)) {
    // Extract the public ID from the URL
    const publicIdMatch = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (publicIdMatch && publicIdMatch[1]) {
      const publicId = publicIdMatch[1];
      return buildCloudinaryUrl(publicId, {
        width,
        height,
        quality,
        loading: isHighPriority ? 'eager' : 'lazy'
      });
    }
    return url;
  }
  
  // For external images, use Cloudinary's fetch capability
  return fetchViaCloudinary(url, { width, height, quality });
};

/**
 * Sanitizes Samsung URLs by removing query parameters that might cause issues
 */
export const sanitizeSamsungUrl = (url: string): string => {
  if (!url) return url;
  
  try {
    // Check if it's a Samsung URL
    if (url.includes('samsung.com')) {
      console.log(`Sanitizing Samsung URL: ${url}`);
      
      // Parse the URL
      const parsedUrl = new URL(url);
      
      // Recreate the URL without search params 
      // This is crucial for Samsung images that fail to load with query params
      const sanitizedUrl = `${parsedUrl.origin}${parsedUrl.pathname}`;
      
      console.log(`Sanitized Samsung URL: ${sanitizedUrl}`);
      return sanitizedUrl;
    }
  } catch (error) {
    console.error(`Error sanitizing URL: ${url}`, error);
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

  const result = fetchViaCloudinary(url, options);
  optimizationCache[cacheKey] = result;
  return result;
};
