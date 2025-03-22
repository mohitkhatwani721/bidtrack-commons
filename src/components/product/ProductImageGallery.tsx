
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { 
  getRelevantPlaceholder, 
  generateAdditionalImages, 
  optimizeImageUrl, 
  preloadImages,
  generateLowQualityImagePlaceholder,
  getCloudinaryUrl,
  isCloudinaryUrl,
  convertToCloudinary
} from "@/utils/imageUtils";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCcw } from "lucide-react";

interface ProductImageGalleryProps {
  product: Product;
}

const ProductImageGallery = ({ product }: ProductImageGalleryProps) => {
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
  
  const fallbackImage = getCloudinaryUrl('sample', { width: 400, height: 300 });
  const [activeImage, setActiveImage] = useState<string>(cloudinaryMainImage); // Use main image as initial active
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [placeholders, setPlaceholders] = useState<Record<string, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [retryCount, setRetryCount] = useState(0);
  const isMounted = useRef(true);
  
  // Reset active image if product changes
  useEffect(() => {
    setActiveImage(cloudinaryMainImage);
    // Reset error state for new product
    setImageErrors({});
    console.log("Product changed, reset active image to:", cloudinaryMainImage);
  }, [product.id, cloudinaryMainImage]);
  
  // Improved error handling for image loading
  const handleImageError = (url: string) => {
    console.log(`Error loading image: ${url}`);
    
    setImageErrors(prev => ({ ...prev, [url]: true }));
    
    // If the main image failed to load, use fallback
    if (url === activeImage) {
      console.log(`Setting fallback for active image: ${url} -> ${fallbackImage}`);
      setActiveImage(fallbackImage);
      toast.error("Unable to load product image. Using placeholder instead.", {
        id: "image-error",
        duration: 3000
      });
    }
  };
  
  // Retry loading images with a different approach
  const handleRetryImages = () => {
    console.log("Manually retrying image load");
    
    // Clear error states and reset loaded states
    setImageErrors({});
    setImagesLoaded({});
    
    // Increment retry counter to trigger reloading
    setRetryCount(prev => prev + 1);
    
    toast.info("Retrying image load...", {
      id: "retry-images",
      duration: 2000
    });
  };
  
  // Get appropriate image source with fallbacks
  const getImageSource = (url: string) => {
    // Always check if there's an error with this URL first
    if (imageErrors[url]) {
      console.log(`Using fallback for image with error: ${url} -> ${fallbackImage}`);
      return fallbackImage;
    }
    
    // If it's already a Cloudinary URL, just optimize it
    if (isCloudinaryUrl(url)) {
      return url;
    }
    
    // For other URLs, use Cloudinary conversion
    return convertToCloudinary(url, { 
      width: url === activeImage ? 800 : 400,
      height: url === activeImage ? 800 : 400,
      quality: url === activeImage ? 90 : 80
    });
  };
  
  // Load low-quality placeholders first
  useEffect(() => {
    const loadPlaceholders = async () => {
      try {
        const placeholderPromises = productImages.map(async (image) => {
          try {
            // For Cloudinary images, use a lower quality version
            if (isCloudinaryUrl(image)) {
              // Extract parts of the URL and lower quality
              const parts = image.split('/upload/');
              if (parts.length === 2) {
                const lowQualityUrl = `${parts[0]}/upload/q_10,e_blur:1000/${parts[1]}`;
                setPlaceholders((prev) => ({
                  ...prev,
                  [image]: lowQualityUrl
                }));
              }
            } else {
              // For other images convert to Cloudinary with low quality
              const lowQualityUrl = convertToCloudinary(image, { quality: 10 });
              setPlaceholders((prev) => ({
                ...prev,
                [image]: lowQualityUrl
              }));
            }
          } catch (error) {
            console.error(`Error generating placeholder for ${image}:`, error);
          }
        });
        
        await Promise.all(placeholderPromises);
      } catch (error) {
        console.error("Error loading placeholders:", error);
      }
    };
    
    loadPlaceholders();
    
    return () => {
      isMounted.current = false;
    };
  }, [productImages]);
  
  // Preload all images with full quality
  useEffect(() => {
    const loadImages = async () => {
      try {
        console.log("Preloading images:", productImages);
        const loadStatus = await preloadImages(productImages);
        if (isMounted.current) {
          setImagesLoaded(loadStatus);
          console.log("Images load status:", loadStatus);
          
          // Check if main image loaded, if not switch to fallback
          if (loadStatus[activeImage] === false) {
            handleImageError(activeImage);
          }
        }
      } catch (error) {
        console.error("Error preloading images:", error);
      }
    };
    
    loadImages();
    
    return () => {
      isMounted.current = false;
    };
  }, [productImages, activeImage, retryCount]);
  
  // Check if all images have errors
  const allImagesHaveErrors = productImages.every(img => imageErrors[img]);
  
  return (
    <div className="space-y-6">
      {allImagesHaveErrors && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Image Loading Issue</AlertTitle>
          <AlertDescription className="flex flex-col space-y-2">
            <p>We're having trouble loading product images.</p>
            <button 
              onClick={handleRetryImages}
              className="flex items-center justify-center space-x-2 bg-destructive/10 text-destructive hover:bg-destructive/20 py-1 px-2 rounded text-sm"
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Retry Loading Images
            </button>
          </AlertDescription>
        </Alert>
      )}
      
      <motion.div 
        className="relative aspect-square rounded-lg overflow-hidden bg-white border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Show low-quality placeholder first */}
        {placeholders[activeImage] && !imagesLoaded[activeImage] && !imageErrors[activeImage] && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <img 
              src={placeholders[activeImage]} 
              alt="Low quality placeholder"
              className="h-full w-full object-contain blur-sm transition-opacity duration-300"
              style={{ 
                filter: 'blur(10px)',
                transform: 'scale(1.1)' 
              }}
            />
          </div>
        )}
        
        {/* Show loading skeleton if no placeholder is available */}
        {!placeholders[activeImage] && !imagesLoaded[activeImage] && !imageErrors[activeImage] && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        
        <img
          src={getImageSource(activeImage)}
          alt={product.name}
          className="h-full w-full object-contain p-6 transition-opacity duration-300"
          style={{ 
            opacity: imagesLoaded[activeImage] && !imageErrors[activeImage] ? 1 : 0 
          }}
          loading="eager" // Load main product image immediately
          onError={() => {
            console.log("Main image error, falling back to sample image");
            handleImageError(activeImage);
          }}
        />
        
        <div className="absolute top-4 left-4">
          <Badge className="glass">{product.zone}</Badge>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-3 gap-3">
        {productImages.map((image, i) => (
          <motion.div 
            key={i}
            className={`aspect-square rounded-md overflow-hidden bg-white cursor-pointer ${
              activeImage === image ? "ring-2 ring-primary" : "border"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * i }}
            onClick={() => !imageErrors[image] && setActiveImage(image)}
          >
            {/* Show low-quality placeholder first */}
            {placeholders[image] && !imagesLoaded[image] && !imageErrors[image] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={placeholders[image]} 
                  alt="Low quality placeholder"
                  className="h-full w-full object-contain blur-sm"
                  style={{ 
                    filter: 'blur(5px)',
                    transform: 'scale(1.1)' 
                  }}
                />
              </div>
            )}
            
            {/* Show loading skeleton if no placeholder is available */}
            {!placeholders[image] && !imagesLoaded[image] && !imageErrors[image] && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            
            <img 
              src={getImageSource(image)}
              alt={`${product.name} view ${i + 1}`}
              className="h-full w-full object-contain p-2 transition-opacity duration-300"
              style={{ 
                opacity: imagesLoaded[image] && !imageErrors[image] ? 1 : 0 
              }}
              loading="lazy" // Lazy load thumbnails
              onError={() => {
                console.log(`Thumbnail image ${i} error`);
                handleImageError(image);
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
