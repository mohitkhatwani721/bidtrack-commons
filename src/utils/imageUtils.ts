
import randomWords from 'random-words';
import { 
  CLOUDINARY_CLOUD_NAME, 
  CLOUDINARY_BASE_URL, 
  buildCloudinaryUrl, 
  isCloudinaryUrl as isCloudinaryUrlCheck,
  fetchViaCloudinary,
  uploadToCloudinary as uploadToCloudinaryClient,
  getOptimizedImageUrl
} from '@/lib/cloudinary/client';

// Re-export Cloudinary utility functions
export const isCloudinaryUrl = isCloudinaryUrlCheck;
export const getCloudinaryUrl = buildCloudinaryUrl;

// Image optimization cache to prevent duplicate processing
const optimizationCache: Record<string, string> = {};

/**
 * Uploads an image to Cloudinary (client-side)
 * Note: This should only be used for small images as it's client-side
 */
export const uploadToCloudinary = async (file: File): Promise<string | null> => {
  if (!CLOUDINARY_CLOUD_NAME) {
    console.error('Cloudinary cloud name not configured');
    return null;
  }

  try {
    return await uploadToCloudinaryClient(file);
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};

/**
 * Generates a relevant placeholder image URL based on the product name.
 */
export const getRelevantPlaceholder = (productName: string): string => {
  // Using Cloudinary's sample images as fallbacks
  return getCloudinaryUrl('sample', { 
    width: 400, 
    height: 300,
    crop: 'fill'
  });
};

/**
 * Generates additional relevant images for thumbnails based on product type.
 */
export const generateAdditionalImages = (productName: string, mainImageUrl: string): string[] => {
  // Cache key to prevent regenerating the same images
  const cacheKey = `additionalImages:${productName}:${mainImageUrl}`;
  
  if (optimizationCache[cacheKey]) {
    return JSON.parse(optimizationCache[cacheKey]);
  }
  
  const additionalImageCount = 3;
  const additionalImages: string[] = [];
  
  // Use Cloudinary sample images with different crops/effects
  const cloudinarySamples = ['sample', 'shoes', 'ecommerce', 'accessories'];
  
  for (let i = 0; i < additionalImageCount; i++) {
    // Get a sample image or use a different transformation of the main one
    const sampleIndex = i % cloudinarySamples.length;
    
    // Generate a different looking sample for each position
    const imageUrl = getCloudinaryUrl(cloudinarySamples[sampleIndex], {
      width: 400,
      height: 300,
      crop: i % 2 === 0 ? 'fill' : 'pad'
    });
    
    additionalImages.push(imageUrl);
  }
  
  // Ensure the main image is always included
  if (!additionalImages.includes(mainImageUrl)) {
    additionalImages[0] = mainImageUrl;
  }
  
  // Cache the results
  optimizationCache[cacheKey] = JSON.stringify(additionalImages);
  
  return additionalImages;
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
 * Optimizes image URLs for better performance with caching
 */
export const optimizeImageUrl = (url: string, isHighPriority: boolean = false): string => {
  // Early return for blank URLs
  if (!url) return url;
  
  // Create a cache key including priority flag
  const cacheKey = `optimize:${url}:${isHighPriority ? 'high' : 'low'}`;
  
  // Check cache first
  if (optimizationCache[cacheKey]) {
    return optimizationCache[cacheKey];
  }
  
  try {
    // Initialize optimizedUrl with the original URL
    let optimizedUrl = url;
    
    // Handle Samsung URLs first - most important fix
    if (url.includes('samsung.com')) {
      optimizedUrl = sanitizeSamsungUrl(url);
      optimizationCache[cacheKey] = optimizedUrl;
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
    optimizationCache[cacheKey] = optimizedUrl;
    return optimizedUrl;
  } catch (error) {
    console.error(`Error optimizing URL: ${url}`, error);
    return url; // Return original URL on error
  }
};

/**
 * Preloads images to improve user experience
 */
export const preloadImages = async (urls: string[]): Promise<Record<string, boolean>> => {
  const results: Record<string, boolean> = {};
  
  // Create a cache key for this preload operation
  const cacheKey = `preload:${urls.join(',')}`;
  
  // Check if we've already preloaded these images
  if (optimizationCache[cacheKey]) {
    return JSON.parse(optimizationCache[cacheKey]);
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
  optimizationCache[cacheKey] = JSON.stringify(results);
  
  return results;
};

/**
 * Generates a low-quality image placeholder (LQIP) using a data URL.
 */
export const generateLowQualityImagePlaceholder = async (imageUrl: string): Promise<string | undefined> => {
  // Skip if not a Cloudinary URL - we'll only generate LQIPs for Cloudinary images
  if (!isCloudinaryUrl(imageUrl)) {
    return undefined;
  }
  
  try {
    // For Cloudinary URLs, create a low-quality version
    const parts = imageUrl.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_50,h_50,q_10,e_blur:1000/${parts[1]}`;
    }
  } catch (error) {
    console.error("Error generating LQIP:", error);
  }
  
  return undefined;
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
