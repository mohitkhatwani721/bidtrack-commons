
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/types";
import { getHighestBidForProduct, getTotalBidsForProduct } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import AuctionTimer from "@/components/ui/AuctionTimer";
import { Tag, Users } from "lucide-react";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const highestBid = getHighestBidForProduct(product.id);
  const totalBids = getTotalBidsForProduct(product.id);
  
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
  
  // Use the product's imageUrl first, or the relevant placeholder if no imageUrl exists
  const imageToDisplay = product.imageUrl || getRelevantPlaceholder(product.name);

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-lg border transition-all duration-300",
        featured ? "shadow-md hover:shadow-xl" : "hover:shadow-md"
      )}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageToDisplay}
            alt={product.name}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500",
              isHovered ? "scale-110" : "scale-100"
            )}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getRelevantPlaceholder(product.name);
            }}
          />
          
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge variant="secondary" className="glass">
              {product.zone}
            </Badge>
            
            {product.quantity > 1 && (
              <Badge variant="secondary" className="glass">
                Qty: {product.quantity}
              </Badge>
            )}
          </div>
          
          <div className="absolute top-2 right-2">
            <AuctionTimer compact />
          </div>
          
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )} />
        </div>
        
        <div className="p-4 bg-white">
          <h3 className="font-medium text-lg line-clamp-1 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-1 mb-3">{product.modelCode}</p>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Starting price</p>
              <p className="font-semibold">AED {product.pricePerUnit.toLocaleString()}</p>
            </div>
            
            {highestBid ? (
              <div className="text-right">
                <p className="text-xs text-gray-500">Highest bid</p>
                <p className="font-semibold text-green-600">AED {highestBid.amount.toLocaleString()}</p>
              </div>
            ) : (
              <div className="text-right text-gray-500">
                <p className="text-xs">No bids yet</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              <span>{product.name.split(' ')[0]}</span>
            </div>
            
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{totalBids} {totalBids === 1 ? 'bid' : 'bids'}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
