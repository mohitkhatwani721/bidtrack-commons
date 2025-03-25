
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { CLOUDINARY_CLOUD_NAME } from "@/lib/cloudinary/client";
import { toast } from "sonner";

interface CloudinaryImage {
  id: string;
  publicId: string;
  url: string;
  createdAt: string;
  productId?: string;
  product?: {
    name: string;
    id: string;
  };
}

interface ProductViewModel {
  productId: string;
  productName: string;
  images: CloudinaryImage[];
}

export const useImageGallery = () => {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [productView, setProductView] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [cloudinaryImagesCount, setCloudinaryImagesCount] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        
        // Improved query to fetch all products including those with Cloudinary images
        const { data: products, error } = await supabase
          .from('products')
          .select('id, name, image_url, created_at')
          .not('image_url', 'is', null)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching products with images:", error);
          toast.error("Failed to load images");
          setLoading(false);
          return;
        }

        console.log("Fetched products with images:", products?.length || 0);
        
        if (products && products.length > 0) {
          console.log("Sample image URLs:", products.slice(0, 3).map(p => p.image_url));
        }
        
        // Process the results with more robust detection
        const cloudinaryImages: CloudinaryImage[] = [];
        
        for (const product of (products || [])) {
          if (product.image_url) {
            // More inclusive check for Cloudinary URLs (fixed)
            const isCloudinaryImage = product.image_url.includes('cloudinary.com') || 
                                     product.image_url.includes('res.cloudinary.com');
            
            if (isCloudinaryImage) {
              console.log("Found Cloudinary image:", product.image_url);
              
              // Extract public ID from Cloudinary URL with improved parsing
              let publicId = '';
              
              // Try to extract public ID with different patterns
              if (product.image_url.includes('/upload/')) {
                const uploadIndex = product.image_url.indexOf('/upload/');
                if (uploadIndex !== -1) {
                  // Get everything after /upload/ and possibly after transformations
                  const afterUpload = product.image_url.substring(uploadIndex + 8);
                  
                  // Handle v1/ pattern
                  if (afterUpload.includes('/v1/')) {
                    publicId = afterUpload.substring(afterUpload.indexOf('/v1/') + 4);
                  } else if (afterUpload.startsWith('v1/')) {
                    publicId = afterUpload.substring(3);
                  } else if (afterUpload.includes('asset/bid/')) {
                    // Handle the pattern we're seeing in your uploaded images
                    const assetIndex = afterUpload.indexOf('asset/bid/');
                    if (assetIndex !== -1) {
                      publicId = 'asset/bid/' + afterUpload.substring(assetIndex + 10);
                    } else {
                      publicId = afterUpload;
                    }
                  } else {
                    // For URLs without version identifier
                    publicId = afterUpload;
                  }
                  
                  // Remove any query parameters
                  if (publicId.includes('?')) {
                    publicId = publicId.substring(0, publicId.indexOf('?'));
                  }
                  
                  // Generate a direct URL without transformations for display
                  const directUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v1/${publicId}`;
                  
                  cloudinaryImages.push({
                    id: `img_${product.id}`,
                    publicId,
                    url: directUrl,
                    createdAt: product.created_at || new Date().toISOString(),
                    productId: product.id,
                    product: {
                      name: product.name,
                      id: product.id
                    }
                  });
                  
                  console.log("Extracted public ID:", publicId);
                  console.log("Created direct URL:", directUrl);
                }
              }
            } else {
              console.log("Non-Cloudinary image URL:", product.image_url);
            }
          }
        }
        
        console.log("Total Cloudinary images found:", cloudinaryImages.length);
        setCloudinaryImagesCount(cloudinaryImages.length);
        setImages(cloudinaryImages);
      } catch (error) {
        console.error("Error processing images:", error);
        toast.error("Failed to process images");
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, [refreshTrigger]);

  // Handle refresh button click
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.info("Refreshing image gallery...");
  };
  
  // Filter images based on search term
  const filteredImages = images.filter(image => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      image.publicId.toLowerCase().includes(searchLower) ||
      (image.product?.name.toLowerCase().includes(searchLower) || false) ||
      (image.productId?.toLowerCase().includes(searchLower) || false)
    );
  });
  
  // Group images by product for product view
  const imagesByProduct = filteredImages.reduce((acc, image) => {
    const productId = image.productId || 'unassociated';
    if (!acc[productId]) {
      acc[productId] = {
        productId,
        productName: image.product?.name || 'Unassociated Images',
        images: []
      };
    }
    acc[productId].images.push(image);
    return acc;
  }, {} as Record<string, ProductViewModel>);
  
  // Handle opening image in new tab
  const openImageInNewTab = (url: string) => {
    window.open(url, '_blank');
  };
  
  // Handle navigating to product detail
  const navigateToProduct = (productId: string) => {
    window.open(`/products/${productId}`, '_blank');
  };

  return {
    images,
    loading,
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
