
// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'di8rdvt2y';
export const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '293774813922618';
export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Preset for uploads (create this in your Cloudinary dashboard)
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

// Add Cloudinary API Secret - this should NEVER be exposed in frontend code in production
// For demo purposes, we're including it here, but in a real app this should be handled server-side
export const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

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
export const uploadToCloudinary = async (file: File, productId?: string): Promise<string | null> => {
  try {
    console.log(`Starting upload to Cloudinary with preset: ${CLOUDINARY_UPLOAD_PRESET}`);
    console.log(`Using cloud name: ${CLOUDINARY_CLOUD_NAME}`);
    console.log(`Using API key: ${CLOUDINARY_API_KEY.substring(0, 5)}...`);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('api_key', CLOUDINARY_API_KEY);
    
    // If we have a product ID, use it in the public_id to create an association
    if (productId) {
      // Create a folder structure based on product ID
      formData.append('public_id', `products/${productId}/${Date.now()}`);
      console.log(`Associating image with product ID: ${productId}`);
    } else {
      // Use the asset/bid folder as specified in your preset settings
      formData.append('folder', 'asset/bid');
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    console.log(`Uploading to: ${uploadUrl}`);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Upload failed with status ${response.status}: ${errorText}`);
      throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Upload successful:', data);
    
    if (data.public_id) {
      return data.public_id; // Return the public_id for use with buildCloudinaryUrl
    } else {
      throw new Error('Upload succeeded but no public_id was returned');
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
