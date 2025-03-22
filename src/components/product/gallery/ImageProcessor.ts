
import { 
  getRelevantPlaceholder, 
  generateAdditionalImages, 
  isCloudinaryUrl,
  convertToCloudinary,
  getCloudinaryUrl
} from "@/utils/imageUtils";
import { Product } from "@/lib/types";

export const processProductImage = (product: Product) => {
  // Process the main image URL first
  const mainImageRaw = product.imageUrl;
  console.log("Original main image:", mainImageRaw);
  
  // If we have a product image, use it, otherwise get a cloudinary placeholder
  const mainImage = mainImageRaw || getRelevantPlaceholder(product.name);
  console.log("Processed main image:", mainImage);
  
  // Check if the main image is already a Cloudinary URL
  const isMainImageCloudinary = isCloudinaryUrl(mainImage);
  console.log("Is main image Cloudinary?", isMainImageCloudinary);
  
  // Convert main image to Cloudinary if it's not already
  const cloudinaryMainImage = isMainImageCloudinary 
    ? mainImage 
    : convertToCloudinary(mainImage, { width: 800, height: 800 });
  console.log("Cloudinary main image:", cloudinaryMainImage);
  
  // Generate additional relevant images for thumbnails based on product type
  const productImages = generateAdditionalImages(product.name, cloudinaryMainImage);
  console.log("Generated product images:", productImages);
  
  // Generate fallback image
  const fallbackImage = getCloudinaryUrl('sample', { width: 400, height: 300 });
  
  return {
    cloudinaryMainImage,
    productImages,
    fallbackImage
  };
};

export const getImageSource = (url: string, imageErrors: Record<string, boolean>, fallbackImage: string) => {
  // Always check if there's an error with this URL first
  if (imageErrors[url]) {
    console.log(`Using fallback for image with error: ${url} -> ${fallbackImage}`);
    return fallbackImage;
  }
  
  // If it's already a Cloudinary URL, just return it
  if (isCloudinaryUrl(url)) {
    return url;
  }
  
  // For other URLs, use Cloudinary conversion
  return convertToCloudinary(url, { 
    width: 800,
    height: 800,
    quality: 90
  });
};
