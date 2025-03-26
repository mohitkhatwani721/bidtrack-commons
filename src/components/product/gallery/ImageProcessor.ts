
import { sanitizeSamsungUrl } from "@/utils/images/samsungUrlFix";
import { buildCloudinaryUrl, isCloudinaryUrl } from "@/lib/cloudinary";

/**
 * Processes a product image URL and returns optimized versions
 */
export const processProductImage = (product: any) => {
  // Get the main image from the product or use a placeholder
  const mainImage = product.imageUrl || '';
  console.log("Processing product image:", mainImage);
  
  // Use Cloudinary URL if available
  const cloudinaryMainImage = mainImage;
  
  // Create multiple views of the image for the gallery
  const productImages = [cloudinaryMainImage];
  
  // Use a different fallback image for products without images
  const fallbackImage = buildCloudinaryUrl('sample', { width: 800, height: 600, quality: 90 });
  
  console.log("Processed image:", {
    original: mainImage,
    cloudinaryMainImage,
    isCloudinaryUrl: isCloudinaryUrl(mainImage),
    fallbackImage
  });
  
  return {
    cloudinaryMainImage,
    productImages,
    fallbackImage
  };
};

/**
 * Determines the appropriate image source based on error state
 */
export const getImageSource = (url: string, imageErrors: Record<string, boolean>, fallbackImage: string): string => {
  if (!url) return fallbackImage;
  
  // Always check if there's an error with this URL first
  if (imageErrors[url]) {
    console.log(`Using fallback for image with error: ${url} -> ${fallbackImage}`);
    return fallbackImage;
  }
  
  // Special handling for direct Cloudinary uploads
  if (url.includes('cloudinary.com')) {
    // Ensure v1 is in the URL for direct uploads
    if (url.includes('/upload/') && !url.includes('/upload/v1/')) {
      try {
        const parts = url.split('/upload/');
        if (parts.length === 2 && !parts[1].startsWith('v1/')) {
          const fixedUrl = `${parts[0]}/upload/v1/${parts[1]}`;
          console.log("Fixed direct Cloudinary URL format:", fixedUrl);
          return fixedUrl;
        }
      } catch (error) {
        console.error("Error fixing Cloudinary URL format:", error);
      }
    }
  }
  
  // For Samsung URLs, try to sanitize them automatically
  if (url.includes('samsung.com')) {
    try {
      const sanitizedUrl = sanitizeSamsungUrl(url);
      console.log(`Sanitized Samsung URL for display: ${sanitizedUrl}`);
      return sanitizedUrl;
    } catch (error) {
      console.error("Error sanitizing Samsung URL:", error);
    }
  }
  
  // For Cloudinary fetch URLs that contain Samsung URLs
  if (isCloudinaryUrl(url) && url.includes('/fetch/') && url.includes('samsung.com')) {
    try {
      const sanitizedUrl = sanitizeSamsungUrl(url);
      console.log(`Sanitized Cloudinary+Samsung URL: ${sanitizedUrl}`);
      return sanitizedUrl;
    } catch (error) {
      console.error("Error sanitizing Cloudinary+Samsung URL:", error);
    }
  }
  
  return url;
};
