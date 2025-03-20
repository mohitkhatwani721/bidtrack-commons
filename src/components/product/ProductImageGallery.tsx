
import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ProductImageGalleryProps {
  product: Product;
}

const ProductImageGallery = ({ product }: ProductImageGalleryProps) => {
  const fallbackImage = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000&auto=format&fit=crop";
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="relative aspect-square rounded-lg overflow-hidden bg-white border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={product.imageUrl || fallbackImage}
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
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i}
            className="aspect-square rounded-md border overflow-hidden bg-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * i }}
          >
            <img 
              src={product.imageUrl || fallbackImage}
              alt={`${product.name} view ${i}`}
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
