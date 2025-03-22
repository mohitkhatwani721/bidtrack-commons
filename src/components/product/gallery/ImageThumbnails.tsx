
import { motion } from "framer-motion";
import { Product } from "@/lib/types";

interface ImageThumbnailsProps {
  images: string[];
  activeImage: string;
  placeholders: Record<string, string>;
  imagesLoaded: Record<string, boolean>;
  imageErrors: Record<string, boolean>;
  onSelectImage: (image: string) => void;
  getImageSource: (url: string) => string;
  handleImageError: (url: string) => void;
}

const ImageThumbnails = ({
  images,
  activeImage,
  placeholders,
  imagesLoaded,
  imageErrors,
  onSelectImage,
  getImageSource,
  handleImageError
}: ImageThumbnailsProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {images.map((image, i) => (
        <motion.div 
          key={i}
          className={`aspect-square rounded-md overflow-hidden bg-white cursor-pointer ${
            activeImage === image ? "ring-2 ring-primary" : "border"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * i }}
          onClick={() => !imageErrors[image] && onSelectImage(image)}
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
            alt={`Product view ${i + 1}`}
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
  );
};

export default ImageThumbnails;
