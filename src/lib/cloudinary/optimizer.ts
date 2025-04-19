
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
  
  // First check if it's a Samsung URL that needs sanitizing
  if (url.includes('samsung.com')) {
    url = sanitizeSamsungUrl(url);
  }
  
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
    
    // For Cloudinary fetch URLs that wrap Samsung images, fix the fetch URL directly
    if (url.includes('/fetch/') && url.includes('samsung.com')) {
      // Get everything after /fetch/
      const fetchUrlMatch = url.match(/\/fetch\/(.+)$/);
      if (fetchUrlMatch && fetchUrlMatch[1]) {
        // Decode the encoded URL
        const encodedUrl = fetchUrlMatch[1];
        try {
          const decodedUrl = decodeURIComponent(encodedUrl);
          // Remove query params from Samsung URL
          const sanitizedSamsungUrl = sanitizeSamsungUrl(decodedUrl);
          // Replace the old fetch URL with sanitized one
          const transformations = url.split('/fetch/')[0];
          return `${transformations}/fetch/${encodeURIComponent(sanitizedSamsungUrl)}`;
        } catch (error) {
          console.error("Error decoding fetch URL:", error);
        }
      }
    }
    
    return url;
  }
  
  // For external images, use Cloudinary's fetch capability
  return fetchViaCloudinary(url, { width, height, quality });
};

/**
 * Sanitizes Samsung URLs by removing query parameters that might cause issues
 * This is a more aggressive implementation that always strips away anything after
 * a question mark to ensure image loading works reliably
 */
export const sanitizeSamsungUrl = (url: string): string => {
  if (!url) return url;
  
  try {
    // First, simplified approach: just remove query parameters for any Samsung URL
    if (url.includes('samsung.com')) {
      console.log(`Sanitizing Samsung URL: ${url}`);
      
      // Most reliable method: simply remove everything after the question mark
      const simplifiedUrl = url.split('?')[0];
      
      console.log(`Simplified Samsung URL: ${simplifiedUrl}`);
      return simplifiedUrl;
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
  
  // Fix Samsung URLs before converting to Cloudinary
  if (url.includes('samsung.com')) {
    url = sanitizeSamsungUrl(url);
  }

  const result = fetchViaCloudinary(url, options);
  optimizationCache[cacheKey] = result;
  return result;
};
