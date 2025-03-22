
// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'di8rdvt2y';
export const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '293774813922618';
export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Preset for uploads (create this in your Cloudinary dashboard)
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

// Add Cloudinary API Secret - this should NEVER be exposed in frontend code in production
// For demo purposes, we're including it here, but in a real app this should be handled server-side
export const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

// Cache for optimized transformations
const transformationCache: Record<string, string> = {};

/**
 * Builds a Cloudinary URL with transformations and caching
 */
export const buildCloudinaryUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    crop?: string;
    format?: string;
    fetchFormat?: string;
    loading?: 'lazy' | 'eager';
  } = {}
): string => {
  if (!publicId) {
    console.warn('No publicId provided to buildCloudinaryUrl');
    return '';
  }

  try {
    // Default options
    const {
      width = 400,
      height = 300,
      quality = 80,
      crop = 'fill',
      format = 'auto',
      fetchFormat = 'auto',
      loading = 'lazy'
    } = options;

    // Create a cache key from the options
    const cacheKey = `${publicId}:${width}x${height}:q${quality}:${crop}:${format}:${fetchFormat}:${loading}`;
    
    // Check cache first
    if (transformationCache[cacheKey]) {
      return transformationCache[cacheKey];
    }
    
    // Build transformation string with performance optimizations
    let transformations = `w_${width},h_${height},q_${quality},c_${crop},f_${format},fl_progressive`;
    
    // Add fetch format for browser-optimized delivery
    if (fetchFormat) {
      transformations += `,fetch_format_${fetchFormat}`;
    }
    
    // Add loading strategy
    if (loading === 'eager') {
      transformations += ',loading_eager';
    } else {
      transformations += ',loading_lazy';
    }
    
    // Return full URL
    const url = `${CLOUDINARY_BASE_URL}/${transformations}/${publicId}`;
    
    // Cache the result
    transformationCache[cacheKey] = url;
    
    return url;
  } catch (error) {
    console.error('Error building Cloudinary URL:', error);
    return '';
  }
};

/**
 * Uploads an image to Cloudinary (client-side) with product association
 */
export const uploadToCloudinary = async (file: File, productId?: string): Promise<string | null> => {
  try {
    // Debug logs to help diagnose issues
    console.log(`Starting upload to Cloudinary with preset: ${CLOUDINARY_UPLOAD_PRESET}`);
    console.log(`Using cloud name: ${CLOUDINARY_CLOUD_NAME}`);
    
    // Validate configuration
    if (!CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary cloud name is not configured');
    }
    
    if (!CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary upload preset is not configured');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Use upload preset for unsigned uploads
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Set the folder path
    formData.append('folder', 'asset/bid');
    
    // If we have a product ID, use it in the public_id to create an association
    if (productId) {
      // Create a unique filename based on product ID
      const uniqueFilename = `product_${productId}_${Date.now()}`;
      formData.append('public_id', uniqueFilename);
      console.log(`Associating image with product ID: ${productId}`);
      
      // Request eager transformations to pre-generate common sizes
      // This reduces latency for first-time viewers
      formData.append('eager', 'w_400,h_300,c_fill|w_800,h_600,c_fill');
      formData.append('eager_async', 'true');
    }

    // Define the upload URL
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    console.log(`Uploading to: ${uploadUrl}`);
    
    // Send the upload request to Cloudinary
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    const responseText = await response.text();
    let data;
    
    try {
      // Try to parse as JSON
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Cloudinary response as JSON:', responseText);
      throw new Error(`Cloudinary returned non-JSON response: ${responseText.substring(0, 100)}...`);
    }
    
    if (!response.ok) {
      console.error(`Upload failed with status ${response.status}:`, data);
      
      if (data && data.error && data.error.message) {
        throw new Error(`Cloudinary error: ${data.error.message}`);
      } else {
        throw new Error(`Upload failed with status ${response.status}`);
      }
    }

    console.log('Upload successful:', data);
    
    if (data.public_id) {
      return data.public_id; // Return the public_id for use with buildCloudinaryUrl
    } else {
      throw new Error('Upload succeeded but no public_id was returned');
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error; // Re-throw to let caller handle the error
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
  if (!externalUrl) return '';

  try {
    // For external images, we can use Cloudinary's fetch capability
    const fetchUrl = encodeURIComponent(externalUrl);
    
    const { width = 600, height = 400, quality = 80 } = options;
    
    // Enhanced transformations for better performance
    const transformations = `w_${width},h_${height},q_${quality},c_fill,f_auto,fl_progressive`;
    
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

/**
 * Check if Cloudinary configuration is valid
 */
export const isCloudinaryConfigured = (): boolean => {
  const isConfigured = Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);
  console.log(`Cloudinary configuration check: ${isConfigured ? 'VALID' : 'INVALID'}`);
  console.log(`- Cloud name: ${CLOUDINARY_CLOUD_NAME || 'MISSING'}`);
  console.log(`- Upload preset: ${CLOUDINARY_UPLOAD_PRESET || 'MISSING'}`);
  return isConfigured;
};

/**
 * Generates an optimized image URL with performance in mind
 */
export const getOptimizedImageUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    isHighPriority?: boolean;
  } = {}
): string => {
  if (!url) return '';
  
  const { width = 400, height = 300, quality = 80, isHighPriority = false } = options;
  
  // If already a Cloudinary URL, just ensure it has optimized transformations
  if (isCloudinaryUrl(url)) {
    // Extract the public ID from the URL
    const publicIdMatch = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (publicIdMatch && publicIdMatch[1]) {
      const publicId = publicIdMatch[1];
      return buildCloudinaryUrl(publicId, {
        width,
        height,
        quality,
        loading: isHighPriority ? 'eager' : 'lazy'
      });
    }
    return url;
  }
  
  // For external images, use Cloudinary's fetch capability
  return fetchViaCloudinary(url, { width, height, quality });
};
