
// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
export const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '293774813922618';
export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Preset for unsigned uploads (create this in your Cloudinary dashboard)
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

/**
 * Builds a Cloudinary URL with transformations
 */
export const buildCloudinaryUrl = (
  publicId: string,
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
  return `${CLOUDINARY_BASE_URL}/${transformations}/${publicId}`;
};

/**
 * Uploads an image to Cloudinary (client-side)
 */
export const uploadToCloudinary = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', CLOUDINARY_API_KEY);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    if (data.secure_url) {
      return data.public_id; // Return the public_id for use with buildCloudinaryUrl
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
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
  if (!externalUrl) return externalUrl;

  try {
    // For external images, we can use Cloudinary's fetch capability
    const fetchUrl = encodeURIComponent(externalUrl);
    
    const { width = 600, height = 400, quality = 80 } = options;
    const transformations = `w_${width},h_${height},q_${quality},c_fill,f_auto`;
    
    return `${CLOUDINARY_BASE_URL}/${transformations}/fetch/${fetchUrl}`;
  } catch (error) {
    console.error("Error creating fetch URL:", error);
    return externalUrl; // Fall back to the original URL
  }
};

/**
 * Checks if a URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url: string): boolean => {
  return url && url.includes('cloudinary.com');
};
