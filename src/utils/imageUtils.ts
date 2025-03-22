import randomWords from 'random-words';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo'; // Replace 'demo' with your cloud name
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Generates a Cloudinary URL with transformations
 */
export const getCloudinaryUrl = (
  imagePath: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    crop?: string;
    format?: string;
  } = {}
): string => {
  // Default options
  const {
    width = 400,
    height = 300,
    quality = 80,
    crop = 'fill',
    format = 'auto'
  } = options;

  // Build transformation string
  const transformations = `w_${width},h_${height},q_${quality},c_${crop},f_${format}`;
  
  // Return full URL
  return `${CLOUDINARY_BASE_URL}/${transformations}/${imagePath}`;
};

/**
 * Checks if a URL is already a Cloudinary URL
 */
export const isCloudinaryUrl = (url: string): boolean => {
  return url && url.includes('cloudinary.com');
};

/**
 * Uploads an image to Cloudinary (client-side)
 * Note: This should only be used for small images as it's client-side
 */
export const uploadToCloudinary = async (file: File): Promise<string | null> => {
  if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === 'demo') {
    console.error('Cloudinary cloud name not configured');
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Use an unsigned upload preset

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    if (data.secure_url) {
      return data.public_id; // Return the public_id for use with getCloudinaryUrl
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};

/**
 * Generates a relevant placeholder image URL based on the product name.
 */
export const getRelevantPlaceholder = (productName: string): string => {
  const keywords = productName.split(' ');
  const placeholderKeywords = keywords.length > 1 ? keywords.slice(0, 2) : keywords;
  
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

  // Skip if URL is invalid or empty
  if (!url) return url;

  try {
    // For external images, we can use Cloudinary's fetch capability
    // This allows Cloudinary to retrieve and optimize external images
    const fetchUrl = encodeURIComponent(url);
    
    const { width = 600, height = 400, quality = 80 } = options;
    const transformations = `w_${width},h_${height},q_${quality},c_fill,f_auto`;
    
    return `${CLOUDINARY_BASE_URL}/${transformations}/fetch/${fetchUrl}`;
  } catch (error) {
    console.error("Error converting to Cloudinary URL:", error);
    return url; // Fall back to the original URL
  }
};
