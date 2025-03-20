
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bid } from "@/lib/types";
import { bids } from "@/lib/data";
import { formatDistanceToNow } from "date-fns";

interface BidHistoryProps {
  productId: string;
}

const BidHistory = ({ productId }: BidHistoryProps) => {
  const [productBids, setProductBids] = useState<Bid[]>([]);
  
  useEffect(() => {
    // Get bids for this product and sort by timestamp (newest first)
    const filteredBids = bids
      .filter(bid => bid.productId === productId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setProductBids(filteredBids);
  }, [productId, bids]);
  
  if (productBids.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No bids have been placed yet for this product.</p>
        <p className="text-sm text-gray-400 mt-2">Be the first to place a bid!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        {productBids.length} {productBids.length === 1 ? 'bid' : 'bids'} placed
      </p>
      
      <div className="space-y-3">
        {productBids.map((bid, index) => (
          <motion.div
            key={bid.id}
            className="bg-white rounded-lg border p-3 flex justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 * index }}
          >
            <div>
              <p className="font-medium">AED {bid.amount.toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                {bid.userEmail.substring(0, 3)}***{bid.userEmail.split('@')[0].substring(bid.userEmail.split('@')[0].length - 2)}@{bid.userEmail.split('@')[1]}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
              </p>
              {index === 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                  Highest bid
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BidHistory;
