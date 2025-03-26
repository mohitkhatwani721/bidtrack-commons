
import { buildCloudinaryUrl, isCloudinaryUrl } from "@/lib/cloudinary";

/**
 * Processes a product image URL and returns optimized versions
 */
export const processProductImage = (product: any) => {
  // Get the main image from the product or use a placeholder
  const mainImage = product.imageUrl || '';
  console.log("Processing product image:", mainImage);
  
  // Create multiple views of the image for the gallery
  const productImages = [mainImage];
  
  // Use a default Cloudinary image as fallback
  const fallbackImage = buildCloudinaryUrl('sample', { width: 800, height: 600, quality: 90 });
  
  console.log("Processed image:", {
    original: mainImage,
    isCloudinaryUrl: isCloudinaryUrl(mainImage),
    fallbackImage
  });
  
  return {
    cloudinaryMainImage: mainImage,
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
    if (url.includes('/upload/')) {
      try {
        const parts = url.split('/upload/');
        if (parts.length === 2 && !parts[1].startsWith('v1/') && !parts[1].match(/^v\d+\//)) {
          const fixedUrl = `${parts[0]}/upload/v1/${parts[1]}`;
          console.log("Fixed direct Cloudinary URL format:", fixedUrl);
          return fixedUrl;
        }
      } catch (error) {
        console.error("Error fixing Cloudinary URL format:", error);
        return fallbackImage;
      }
    }
  }
  
  // If not a Cloudinary URL, use the fallback
  if (!isCloudinaryUrl(url)) {
    console.log("Non-Cloudinary URL, using fallback:", url);
    return fallbackImage;
  }
  
  return url;
};
