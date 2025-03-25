
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { getProductById } from "@/lib/supabase/products";
import { isCloudinaryUrl } from "@/utils/imageUtils";

export interface CloudinaryImage {
  publicId: string;
  url: string;
  uploadedAt: string;
  productId?: string;
  productName?: string;
}

export const useImageGallery = () => {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [productView, setProductView] = useState(false);
  const [cloudinaryImagesCount, setCloudinaryImagesCount] = useState(0);

  const fetchImagesFromCloudinary = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch products that have Cloudinary image URLs
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, image_url');
      
      if (error) {
        throw new Error(`Error fetching products: ${error.message}`);
      }
      
      // Filter products with Cloudinary URLs
      const productsWithCloudinaryImages = products.filter(p => 
        p.image_url && isCloudinaryUrl(p.image_url)
      );
      
      setCloudinaryImagesCount(productsWithCloudinaryImages.length);
      
      // Convert to the required format with publicId extracted from the URL
      const cloudinaryImages: CloudinaryImage[] = productsWithCloudinaryImages.map(product => {
        // Extract the public ID from the Cloudinary URL
        let publicId = "";
        
        try {
          // Handle URLs with different formats
          if (product.image_url.includes('/upload/')) {
            const parts = product.image_url.split('/upload/');
            if (parts.length > 1) {
              // Get everything after /upload/ and remove any transformation params
              const afterUpload = parts[1];
              
              // Check if there's a version (v1) in the URL
              if (afterUpload.includes('/v1/')) {
                publicId = afterUpload.split('/v1/')[1];
              } else {
                // If no version, just take everything after the transformations
                const transformSplit = afterUpload.split('/');
                publicId = transformSplit[transformSplit.length - 1];
              }
              
              // Clean up any query parameters
              if (publicId.includes('?')) {
                publicId = publicId.split('?')[0];
              }
            }
          }
        } catch (err) {
          console.error("Error extracting publicId from URL:", err);
          publicId = "unknown";
        }
        
        return {
          publicId,
          url: product.image_url,
          uploadedAt: new Date().toISOString(), // We don't have the actual date, so using current time
          productId: product.id,
          productName: product.name
        };
      });
      
      // Sort by uploadedAt (newest first) - in a real app this would use the actual upload date
      cloudinaryImages.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      
      setImages(cloudinaryImages);
    } catch (error) {
      console.error("Error in fetchImagesFromCloudinary:", error);
      toast.error("Failed to load images from products");
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch images when component mounts
  useEffect(() => {
    fetchImagesFromCloudinary();
  }, [fetchImagesFromCloudinary]);
  
  // Handle refresh
  const handleRefresh = () => {
    toast.info("Refreshing image gallery...");
    fetchImagesFromCloudinary();
  };
  
  // Filter images based on search term
  const filteredImages = images.filter(image => {
    const searchLower = searchTerm.toLowerCase();
    return (
      image.publicId.toLowerCase().includes(searchLower) ||
      (image.productName && image.productName.toLowerCase().includes(searchLower))
    );
  });
  
  // Group images by product for the product view
  const imagesByProduct = filteredImages.reduce((groups, image) => {
    const productId = image.productId || 'unknown';
    const productName = image.productName || 'Unknown Product';
    
    if (!groups[productId]) {
      groups[productId] = {
        productId,
        productName,
        images: []
      };
    }
    
    groups[productId].images.push(image);
    return groups;
  }, {} as Record<string, { productId: string; productName: string; images: CloudinaryImage[] }>);
  
  // Handle opening image in new tab
  const openImageInNewTab = (url: string) => {
    window.open(url, '_blank');
  };
  
  // Navigate to product detail
  const navigateToProduct = async (productId: string) => {
    try {
      const product = await getProductById(productId);
      if (product) {
        window.open(`/products/${productId}`, '_blank');
      } else {
        toast.error("Product not found");
      }
    } catch (error) {
      console.error("Error navigating to product:", error);
      toast.error("Could not open product page");
    }
  };
  
  return {
    loading,
    images,
    searchTerm,
    setSearchTerm,
    productView,
    setProductView,
    handleRefresh,
    filteredImages,
    imagesByProduct,
    openImageInNewTab,
    navigateToProduct,
    cloudinaryImagesCount
  };
};
