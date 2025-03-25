
import { CLOUDINARY_BASE_URL, CLOUDINARY_CLOUD_NAME } from './config';

// Cache for optimized transformations
const transformationCache: Record<string, string> = {};

/**
 * Builds a Cloudinary URL with transformations and caching
 */
export const buildCloudinaryUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    crop?: string;
    format?: string;
    fetchFormat?: string;
    loading?: 'lazy' | 'eager';
  } = {}
): string => {
  if (!publicId) {
    console.warn('No publicId provided to buildCloudinaryUrl');
    return '';
  }

  try {
    // Default options
    const {
      width = 400,
      height = 300,
      quality = 80,
      crop = 'fill',
      format = 'auto',
      fetchFormat = 'auto',
      loading = 'lazy'
    } = options;

    // Create a cache key from the options
    const cacheKey = `${publicId}:${width}x${height}:q${quality}:${crop}:${format}:${fetchFormat}:${loading}`;
    
    // Check cache first
    if (transformationCache[cacheKey]) {
      return transformationCache[cacheKey];
    }
    
    // Build transformation string with performance optimizations
    const transformations = `w_${width},h_${height},q_${quality},c_${crop},f_${format},fl_progressive`;
    
    // Return full URL - FIXED FORMAT
    const url = `${CLOUDINARY_BASE_URL}/${transformations}/v1/${publicId}`;
    
    // Cache the result
    transformationCache[cacheKey] = url;
    
    return url;
  } catch (error) {
    console.error('Error building Cloudinary URL:', error);
    return '';
  }
};

/**
 * Checks if a URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    // More robust check that handles various Cloudinary URL patterns
    const isCloudinary = url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
    
    if (isCloudinary) {
      console.log(`Detected Cloudinary URL: ${url.substring(0, 50)}...`);
    }
    
    return isCloudinary;
  } catch (error) {
    console.error('Error checking if URL is Cloudinary:', error);
    return false;
  }
};

/**
 * Fetches external images through Cloudinary for optimization
 */
export const fetchViaCloudinary = (
  externalUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {}
): string => {
  // Skip if URL is invalid or empty
  if (!externalUrl) return '';

  try {
    // For external images, we can use Cloudinary's fetch capability
    const fetchUrl = encodeURIComponent(externalUrl);
    
    const { width = 600, height = 400, quality = 80 } = options;
    
    // Enhanced transformations for better performance
    const transformations = `w_${width},h_${height},q_${quality},c_fill,f_auto,fl_progressive`;
    
    // FIX: Use the correct fetch URL format
    return `${CLOUDINARY_BASE_URL}/${transformations}/fetch/${fetchUrl}`;
  } catch (error) {
    console.error("Error creating fetch URL:", error);
    return externalUrl; // Fall back to the original URL
  }
};
