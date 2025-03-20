
import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ProductImageGalleryProps {
  product: Product;
}

const ProductImageGallery = ({ product }: ProductImageGalleryProps) => {
  // Get relevant placeholder based on product name
  const getRelevantPlaceholder = (productName: string): string => {
    const lowerName = productName.toLowerCase();
    
    if (lowerName.includes("refrigerator") || lowerName.includes("fridge")) {
      return "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=1000&auto=format&fit=crop";
    } else if (lowerName.includes("tv") || lowerName.includes("frame")) {
      return "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1000&auto=format&fit=crop";
    } else if (lowerName.includes("buds") || lowerName.includes("earphone")) {
      return "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1000&auto=format&fit=crop";
    } else if (lowerName.includes("vacuum") || lowerName.includes("cleaner")) {
      return "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=1000&auto=format&fit=crop";
    } else if (lowerName.includes("microwave") || lowerName.includes("oven")) {
      return "https://images.unsplash.com/photo-1585659722983-3a681849dc8e?q=80&w=1000&auto=format&fit=crop";
    } else if (lowerName.includes("soundbar") || lowerName.includes("music") || lowerName.includes("speaker")) {
      return "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop";
    } else if (lowerName.includes("ac") || lowerName.includes("air conditioner") || lowerName.includes("windfree")) {
      return "https://images.unsplash.com/photo-1581275288547-1c3bc1edcb7b?q=80&w=1000&auto=format&fit=crop";
    } else {
      // Default electronics image
      return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop";
    }
  };

  // Generate additional relevant images for thumbnails based on product type
  const generateAdditionalImages = (product: Product): string[] => {
    const mainImage = product.imageUrl || getRelevantPlaceholder(product.name);
    const additionalImages = [];
    const lowerName = product.name.toLowerCase();
    
    // Always include the main image first
    additionalImages.push(mainImage);
    
    // Add category-specific additional images
    if (lowerName.includes("refrigerator") || lowerName.includes("fridge")) {
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=1000&auto=format&fit=crop");
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1601599963565-b7f49d6cf386?q=80&w=1000&auto=format&fit=crop");
    } else if (lowerName.includes("tv") || lowerName.includes("frame")) {
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1000&auto=format&fit=crop");
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1577979749830-f1d742b96791?q=80&w=1000&auto=format&fit=crop");
    } else if (lowerName.includes("buds") || lowerName.includes("earphone")) {
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop");
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1548378329-437e1ef34263?q=80&w=1000&auto=format&fit=crop");
    } else if (lowerName.includes("vacuum") || lowerName.includes("cleaner")) {
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1620096906384-7eb3ea11bced?q=80&w=1000&auto=format&fit=crop");
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1528740096961-d519b3f91f5a?q=80&w=1000&auto=format&fit=crop");
    } else if (lowerName.includes("microwave") || lowerName.includes("oven")) {
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=1000&auto=format&fit=crop");
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1585659722983-3a681849dc8e?q=80&w=1000&auto=format&fit=crop");
    } else if (lowerName.includes("soundbar") || lowerName.includes("music") || lowerName.includes("speaker")) {
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop");
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1000&auto=format&fit=crop");
    } else if (lowerName.includes("ac") || lowerName.includes("air conditioner") || lowerName.includes("windfree")) {
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1617784625140-430eaff5b161?q=80&w=1000&auto=format&fit=crop");
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1000&auto=format&fit=crop");
    } else {
      // For other products, add generic electronics images
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop");
      if (additionalImages.length < 3) additionalImages.push("https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop");
    }
    
    return additionalImages;
  };
  
  const productImages = generateAdditionalImages(product);
  const fallbackImage = getRelevantPlaceholder(product.name);
  const [activeImage, setActiveImage] = useState<string>(productImages[0]);
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="relative aspect-square rounded-lg overflow-hidden bg-white border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={activeImage}
          alt={product.name}
          className="h-full w-full object-contain p-6"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
            setActiveImage(fallbackImage);
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
            onClick={() => setActiveImage(image)}
          >
            <img 
              src={image}
              alt={`${product.name} view ${i + 1}`}
              className="h-full w-full object-contain p-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackImage;
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
