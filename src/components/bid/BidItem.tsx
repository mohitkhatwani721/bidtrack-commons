
import { motion } from "framer-motion";
import { Bid } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface BidItemProps {
  bid: Bid;
  index: number;
  isAdmin: boolean;
  isHighestBid: boolean;
}

const BidItem = ({ bid, index, isAdmin, isHighestBid }: BidItemProps) => {
  return (
    <motion.div
      key={bid.id}
      className="bg-white rounded-lg border p-3 flex justify-between"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.05 * index }}
    >
      <div>
        <p className="font-medium">AED {bid.amount.toLocaleString()}</p>
        {isAdmin ? (
          <p className="text-xs text-gray-500">
            {bid.userEmail}
          </p>
        ) : (
          <p className="text-xs text-gray-500">
            {bid.userEmail.substring(0, 3)}***{bid.userEmail.split('@')[0].substring(bid.userEmail.split('@')[0].length - 2)}@{bid.userEmail.split('@')[1]}
          </p>
        )}
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">
          {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
        </p>
        {isHighestBid && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
            Highest bid
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default BidItem;
