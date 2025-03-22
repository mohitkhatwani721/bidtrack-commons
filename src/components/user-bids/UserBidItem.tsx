
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bid } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getRelevantPlaceholder } from "@/utils/imageUtils";

interface UserBidItemProps {
  bid: Bid;
  index: number;
}

const UserBidItem = ({ bid, index }: UserBidItemProps) => {
  const imageToDisplay = bid.product?.imageUrl || getRelevantPlaceholder(bid.product?.name || "product");

  return (
    <motion.div 
      className="bg-white rounded-lg border overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 aspect-square md:aspect-auto flex items-center justify-center p-2">
          <img
            src={imageToDisplay}
            alt={bid.product?.name || "Product"}
            className="h-24 w-24 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getRelevantPlaceholder(bid.product?.name || "product");
            }}
          />
        </div>
        
        <div className="p-4 md:col-span-2">
          <h3 className="font-medium text-lg mb-1">{bid.product?.name || "Unknown Product"}</h3>
          <p className="text-sm text-gray-500 mb-2">{bid.product?.modelCode || "N/A"}</p>
          <p className="text-xs text-gray-500">
            Bid placed on {bid.timestamp.toLocaleDateString()}
          </p>
        </div>
        
        <div className="p-4 flex flex-col justify-between">
          <div>
            <p className="text-sm text-gray-500">Your bid</p>
            <p className="text-lg font-bold">AED {bid.amount.toLocaleString()}</p>
          </div>
          
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link to={`/products/${bid.productId}`}>
              View Product
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserBidItem;
