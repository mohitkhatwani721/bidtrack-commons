
import { 
  CLOUDINARY_CLOUD_NAME, 
  buildCloudinaryUrl, 
  isCloudinaryUrl as isCloudinaryUrlCheck,
  fetchViaCloudinary,
  uploadToCloudinary as uploadToCloudinaryClient
} from '@/lib/cloudinary';

// Re-export Cloudinary utility functions
export const isCloudinaryUrl = isCloudinaryUrlCheck;
export const getCloudinaryUrl = buildCloudinaryUrl;

/**
 * Uploads an image to Cloudinary (client-side)
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

  // Avoid Samsung URLs entirely
  if (url.includes('samsung.com')) {
    return getCloudinaryUrl('sample', { 
      width: options.width || 400, 
      height: options.height || 300,
      quality: options.quality || 80,
      crop: 'fill'
    });
  }

  return fetchViaCloudinary(url, options);
};

/**
 * Optimizes image URLs for better performance
 */
export const optimizeImageUrl = (url: string, isHighPriority: boolean = false): string => {
  // Early return for blank URLs
  if (!url) return getCloudinaryUrl('sample', { width: 400, height: 300 });
  
  // Avoid Samsung URLs entirely
  if (url.includes('samsung.com')) {
    return getCloudinaryUrl('sample', { 
      width: isHighPriority ? 800 : 400, 
      height: isHighPriority ? 800 : 400,
      quality: isHighPriority ? 90 : 80,
      crop: 'fill'
    });
  }
  
  // Use Cloudinary URL if already a Cloudinary URL
  if (isCloudinaryUrl(url)) {
    // For direct Cloudinary uploads, ensure proper URL format
    if (url.includes('/upload/')) {
      try {
        const parts = url.split('/upload/');
        if (parts.length === 2 && !parts[1].startsWith('v1/') && !parts[1].match(/^v\d+\//)) {
          return `${parts[0]}/upload/v1/${parts[1]}`;
        }
      } catch (error) {
        console.error("Error fixing Cloudinary URL format:", error);
      }
    }
    
    return url;
  }
  
  // For other external images, use Cloudinary's fetch capability
  return fetchViaCloudinary(url, {
    width: isHighPriority ? 800 : 400,
    height: isHighPriority ? 800 : 400,
    quality: isHighPriority ? 90 : 80
  });
};
