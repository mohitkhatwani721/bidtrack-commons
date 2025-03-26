
import { getJsonFromCache, storeJsonInCache } from './imageCache';

/**
 * Preloads images to improve user experience
 */
export const preloadImages = async (urls: string[]): Promise<Record<string, boolean>> => {
  const results: Record<string, boolean> = {};
  
  // Create a cache key for this preload operation
  const cacheKey = `preload:${urls.join(',')}`;
  
  // Check if we've already preloaded these images
  const cached = getJsonFromCache(cacheKey);
  if (cached) {
    return cached;
  }
  
  const preloadPromises = urls.map((url) => {
    return new Promise<void>((resolve) => {
      // Skip invalid URLs
      if (!url) {
        results[url] = false;
        resolve();
        return;
      }
      
      const img = new Image();
      
      img.onload = () => {
        results[url] = true;
        console.log(`Successfully preloaded: ${url}`);
        resolve();
      };
      
      img.onerror = () => {
        results[url] = false;
        console.warn(`Failed to preload image: ${url}`);
        resolve();
      };
      
      // Set the src to start loading
      img.src = url;
    });
  });
  
  await Promise.all(preloadPromises);
  
  // Cache the results
  storeJsonInCache(cacheKey, results);
  
  return results;
};
