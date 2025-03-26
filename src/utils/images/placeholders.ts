
import { isCloudinaryUrl } from './cloudinaryUtils';
import { getJsonFromCache, storeJsonInCache, storeInCache, getFromCache } from './imageCache';

/**
 * Generates additional relevant images for thumbnails based on product type.
 */
export const generateAdditionalImages = (
  productName: string, 
  mainImageUrl: string,
  getCloudinaryUrl: (publicId: string, options: any) => string
): string[] => {
  // Cache key to prevent regenerating the same images
  const cacheKey = `additionalImages:${productName}:${mainImageUrl}`;
  
  const cached = getJsonFromCache(cacheKey);
  if (cached) {
    return cached;
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
  storeJsonInCache(cacheKey, additionalImages);
  
  return additionalImages;
};

/**
 * Generates a low-quality image placeholder (LQIP) using a data URL.
 */
export const generateLowQualityImagePlaceholder = async (imageUrl: string): Promise<string | undefined> => {
  // Skip if not a Cloudinary URL - we'll only generate LQIPs for Cloudinary images
  if (!isCloudinaryUrl(imageUrl)) {
    return undefined;
  }
  
  // Cache key for this operation
  const cacheKey = `lqip:${imageUrl}`;
  
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    // For Cloudinary URLs, create a low-quality version
    const parts = imageUrl.split('/upload/');
    if (parts.length === 2) {
      const lqipUrl = `${parts[0]}/upload/w_50,h_50,q_10,e_blur:1000/${parts[1]}`;
      storeInCache(cacheKey, lqipUrl);
      return lqipUrl;
    }
  } catch (error) {
    console.error("Error generating LQIP:", error);
  }
  
  return undefined;
};
