
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from './config';
import { buildCloudinaryUrl } from './urlBuilder';

/**
 * Check if the Cloudinary response contains a preset configuration error
 */
const isPresetConfigurationError = (error: any): boolean => {
  if (!error || !error.message) return false;
  
  const errorMsg = error.message.toLowerCase();
  return (
    errorMsg.includes('preset') && 
    (errorMsg.includes('whitelist') || errorMsg.includes('unsigned'))
  );
};

/**
 * Provides guidance for resolving upload preset configuration issues
 */
const getPresetErrorGuidance = (preset: string): string => {
  return `Your upload preset "${preset}" is not configured for unsigned uploads. Please:
1. Log in to your Cloudinary dashboard
2. Go to Settings > Upload > Upload presets
3. Edit "${preset}" or create a new preset
4. Set "Signing Mode" to "Unsigned"
5. Save changes and update your .env file if needed`;
};

/**
 * Uploads an image to Cloudinary (client-side) with product association
 */
export const uploadToCloudinary = async (file: File, productId?: string): Promise<string | null> => {
  try {
    // Debug logs to help diagnose issues
    console.log(`Starting upload to Cloudinary with preset: ${CLOUDINARY_UPLOAD_PRESET}`);
    console.log(`Using cloud name: ${CLOUDINARY_CLOUD_NAME}`);
    console.log(`Product ID for association: ${productId || 'none'}`);
    
    // Validate configuration
    if (!CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary cloud name is not configured');
    }
    
    if (!CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary upload preset is not configured');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Use upload preset for unsigned uploads - MUST be whitelisted in Cloudinary dashboard
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Set the folder path - make sure this is allowed in your upload preset settings
    formData.append('folder', 'asset/bid');
    
    // If we have a product ID, use it in the public_id to create an association
    if (productId) {
      // Create a unique filename based on product ID
      const uniqueFilename = `product_${productId}_${Date.now()}`;
      formData.append('public_id', uniqueFilename);
      console.log(`Associating image with product ID: ${productId}`);
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
    console.log("Cloudinary raw response:", responseText.substring(0, 500));
    
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
        // Special handling for preset configuration errors
        if (isPresetConfigurationError(data.error)) {
          const guidance = getPresetErrorGuidance(CLOUDINARY_UPLOAD_PRESET);
          throw new Error(`${data.error.message}\n\n${guidance}`);
        }
        throw new Error(`Cloudinary error: ${data.error.message}`);
      } else {
        throw new Error(`Upload failed with status ${response.status}`);
      }
    }

    console.log('Upload successful:', data);
    
    if (data.public_id) {
      // Log the raw public_id received from Cloudinary
      console.log('Received public_id:', data.public_id);
      console.log('Received secure_url:', data.secure_url);
      
      // If the product ID is provided, update the product with the new image URL
      if (productId) {
        // Import is intentionally inside the function to avoid circular dependencies
        const { updateProductImage } = await import('@/lib/supabase/products');
        
        // Generate a direct URL for the product that will work reliably
        // Use the secure_url directly from Cloudinary response instead of building our own
        // If that's not available, construct a direct URL without transformations
        const imageUrl = data.secure_url || 
          `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v1/${data.public_id}`;
        
        console.log('Using URL for product update:', imageUrl);
        
        // Update the product with the image URL
        const updated = await updateProductImage(productId, imageUrl);
        console.log(`Product image update result: ${updated ? 'success' : 'failed'}`);
      }
      
      return data.public_id;
    } else {
      throw new Error('Upload succeeded but no public_id was returned');
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error; // Re-throw to let caller handle the error
  }
};
