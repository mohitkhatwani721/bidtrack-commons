import { useState, useEffect, useRef } from "react";
import { generateLowQualityImagePlaceholder, isCloudinaryUrl } from "@/utils/images";

export const usePlaceholders = (productImages: string[]) => {
  const [placeholders, setPlaceholders] = useState<Record<string, string>>({});
  const isMounted = useRef(true);
  
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
              const lowQualityUrl = await generateLowQualityImagePlaceholder(image);
              if (lowQualityUrl) {
                setPlaceholders((prev) => ({
                  ...prev,
                  [image]: lowQualityUrl
                }));
              }
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
  
  return placeholders;
};
