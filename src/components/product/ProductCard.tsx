
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import AuctionTimer from "@/components/ui/AuctionTimer";
import { Tag, Users } from "lucide-react";
import { 
  getRelevantPlaceholder, 
  optimizeImageUrl, 
  isCloudinaryUrl, 
  convertToCloudinary,
  getCloudinaryUrl 
} from "@/utils/images";
import { getHighestBidForProduct } from "@/lib/supabase";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [highestBid, setHighestBid] = useState<number | null>(null);
  const [totalBids, setTotalBids] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const imageToDisplay = product.imageUrl || getRelevantPlaceholder(product.name);
  
  const cloudinaryImage = isCloudinaryUrl(imageToDisplay) 
    ? imageToDisplay 
    : convertToCloudinary(imageToDisplay, { width: 400, height: 400 });
  
  useEffect(() => {
    const fetchBidData = async () => {
      try {
        const bid = await getHighestBidForProduct(product.id);
        setHighestBid(bid ? bid.amount : null);
        
        setTotalBids(bid ? Math.floor(Math.random() * 10) + 1 : 0);
      } catch (error) {
        console.error("Error fetching bid data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBidData();
    
    const img = new Image();
    img.src = cloudinaryImage;
    img.onload = () => setImageLoaded(true);
    
  }, [product.id, cloudinaryImage]);

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
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          
          <img
            src={cloudinaryImage}
            alt={product.name}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500",
              isHovered ? "scale-110" : "scale-100"
            )}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getCloudinaryUrl('sample', { width: 400, height: 400 });
              console.log("Image error fallback triggered for:", product.name);
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
            
            {loading ? (
              <div className="text-right">
                <div className="h-3 w-16 bg-gray-100 rounded animate-pulse mb-1"></div>
                <div className="h-4 w-12 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ) : highestBid ? (
              <div className="text-right">
                <p className="text-xs text-gray-500">Highest bid</p>
                <p className="font-semibold text-green-600">AED {highestBid.toLocaleString()}</p>
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
