
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
