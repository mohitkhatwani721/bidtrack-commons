
import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ProductImageGalleryProps {
  product: Product;
}

const ProductImageGallery = ({ product }: ProductImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState<string>(product.imageUrl || "");
  
  // Generate more relevant placeholder images based on product category
  const getRelevantPlaceholder = (productName: string): string => {
    const lowerName = productName.toLowerCase();
    
    if (lowerName.includes("refrigerator") || lowerName.includes("fridge")) {
      return "https://images.unsplash.com/photo-1556909114-44e3e9399891?q=80&w=1000&auto=format&fit=crop";
    } else if (lowerName.includes("tv") || lowerName.includes("frame")) {
      return "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1000&auto=format&fit=crop";
    } else if (lowerName.includes("buds") || lowerName.includes("earphone")) {
      return "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1000&auto=format&fit=crop";
    } else if (lowerName.includes("vacuum") || lowerName.includes("cleaner")) {
      return "https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=1000&auto=format&fit=crop";
    } else if (lowerName.includes("microwave") || lowerName.includes("oven")) {
      return "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=1000&auto=format&fit=crop";
    } else if (lowerName.includes("soundbar") || lowerName.includes("music") || lowerName.includes("speaker")) {
      return "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop";
    } else if (lowerName.includes("ac") || lowerName.includes("air conditioner") || lowerName.includes("windfree")) {
      return "https://images.unsplash.com/photo-1581275288547-1c3bc1edcb7b?q=80&w=1000&auto=format&fit=crop";
    } else {
      // Default electronics image
      return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop";
    }
  };

  const fallbackImage = getRelevantPlaceholder(product.name);
  
  // Generate additional relevant images for thumbnails
  const generateAdditionalImages = (): string[] => {
    const mainImage = product.imageUrl || fallbackImage;
    const additionalImages = [];
    
    // Always include the main image
    additionalImages.push(mainImage);
    
    // Add category-specific additional images if needed
    const lowerName = product.name.toLowerCase();
    
    if (lowerName.includes("refrigerator")) {
      additionalImages.push("https://images.unsplash.com/photo-1601599963565-b7f49d6cf386?q=80&w=1000&auto=format&fit=crop");
      additionalImages.push("https://images.unsplash.com/photo-1626202373152-8db1760c8f61?q=80&w=1000&auto=format&fit=crop");
    } else if (lowerName.includes("tv") || lowerName.includes("frame")) {
      additionalImages.push("https://images.unsplash.com/photo-1577979749830-f1d742b96791?q=80&w=1000&auto=format&fit=crop");
      additionalImages.push("https://images.unsplash.com/photo-1461151304267-38535e780c79?q=80&w=1000&auto=format&fit=crop");
    } else {
      // For other products, just duplicate the main image for thumbnails
      additionalImages.push(mainImage);
      additionalImages.push(mainImage);
    }
    
    return additionalImages;
  };
  
  const productImages = generateAdditionalImages();
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="relative aspect-square rounded-lg overflow-hidden bg-white border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={activeImage || fallbackImage}
          alt={product.name}
          className="h-full w-full object-contain p-6"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
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
