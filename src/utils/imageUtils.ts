import randomWords from 'random-words';
import { 
  CLOUDINARY_CLOUD_NAME, 
  CLOUDINARY_BASE_URL, 
  buildCloudinaryUrl, 
  isCloudinaryUrl as isCloudinaryUrlCheck,
  fetchViaCloudinary,
  uploadToCloudinary as uploadToCloudinaryClient
} from '@/lib/cloudinary/client';

// Re-export Cloudinary utility functions
export const isCloudinaryUrl = isCloudinaryUrlCheck;
export const getCloudinaryUrl = buildCloudinaryUrl;

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
 * Cache for optimized image URLs
 */
const imageCache: Record<string, { optimizedUrl: string, timestamp: number }> = {};

/**
 * Optimizes image URLs for better performance
 */
export const optimizeImageUrl = (url: string, isHighPriority: boolean = false): string => {
  // Early return for blank URLs
  if (!url) return url;
  
  try {
    // Check cache first (with 24hr expiry)
    const cacheEntry = imageCache[url];
    const now = Date.now();
    if (cacheEntry && now - cacheEntry.timestamp < 24 * 60 * 60 * 1000) {
      console.log(`Cache hit for: ${url}`);
      return cacheEntry.optimizedUrl;
    }
    
    // Initialize optimizedUrl with the original URL
    let optimizedUrl = url;
    
    // Handle Samsung URLs first - most important fix
    if (url.includes('samsung.com')) {
      optimizedUrl = sanitizeSamsungUrl(url);
      
      // Cache the result
      imageCache[url] = { optimizedUrl, timestamp: now };
      return optimizedUrl;
    }
    
    // Handle Cloudinary images - reoptimize them based on priority
    if (url.includes('cloudinary.com')) {
      // Extract the base parts
      const quality = isHighPriority ? 80 : 60;
      const width = isHighPriority ? 1000 : 500;
      
      // If already a cloudinary URL, modify the transformations
      if (url.includes('/image/upload/')) {
        const parts = url.split('/image/upload/');
        if (parts.length === 2) {
          optimizedUrl = `${parts[0]}/image/upload/w_${width},q_${quality},f_auto/${parts[1].split('/').pop()}`;
        }
      }
    }
    
    // Handle Unsplash images
    if (url.includes('unsplash.com')) {
      // Extract the base URL and add quality parameters
      const quality = isHighPriority ? 80 : 60;
      const width = isHighPriority ? 1000 : 500;
      optimizedUrl = `${url.split('?')[0]}?q=${quality}&w=${width}&auto=format&fit=crop`;
    }
    
    // Cache the result
    imageCache[url] = { optimizedUrl, timestamp: now };
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
  return results;
};

/**
 * Generates a low-quality image placeholder (LQIP) using a data URL.
 */
export const generateLowQualityImagePlaceholder = async (imageUrl: string): Promise<string | undefined> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error generating LQIP:", error);
    return undefined;
  }
};

/**
 * Converts a non-Cloudinary URL to a Cloudinary URL for optimization
 */
export const convertToCloudinary = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
} = {}): string => {
  // Skip if already a Cloudinary URL
  if (isCloudinaryUrl(url)) {
    return url;
  }

  return fetchViaCloudinary(url, options);
};
