
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { sanitizeSamsungUrl } from './samsungUrlFix';
import { getFromCache, storeInCache } from './imageCache';

/**
 * Optimizes image URLs for better performance with caching
 */
export const optimizeImageUrl = (url: string, isHighPriority: boolean = false): string => {
  // Early return for blank URLs
  if (!url) return url;
  
  // Create a cache key including priority flag
  const cacheKey = `optimize:${url}:${isHighPriority ? 'high' : 'low'}`;
  
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    // Initialize optimizedUrl with the original URL
    let optimizedUrl = url;
    
    // Handle Samsung URLs first - most important fix
    if (url.includes('samsung.com')) {
      optimizedUrl = sanitizeSamsungUrl(url);
      storeInCache(cacheKey, optimizedUrl);
      return optimizedUrl;
    }
    
    // Use the centralized optimization function
    optimizedUrl = getOptimizedImageUrl(url, {
      width: isHighPriority ? 800 : 400,
      height: isHighPriority ? 800 : 400,
      quality: isHighPriority ? 85 : 70,
      isHighPriority
    });
    
    // Cache the result
    storeInCache(cacheKey, optimizedUrl);
    return optimizedUrl;
  } catch (error) {
    console.error(`Error optimizing URL: ${url}`, error);
    return url; // Return original URL on error
  }
};
