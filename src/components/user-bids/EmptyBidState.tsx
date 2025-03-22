
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PackageOpen } from "lucide-react";

const EmptyBidState = () => {
  return (
    <motion.div 
      className="text-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PackageOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h2 className="text-xl font-medium mb-2">No Bids Found</h2>
      <p className="text-gray-600 mb-6">
        You haven't placed any bids yet.
      </p>
      <Button asChild>
        <Link to="/products">Browse Products</Link>
      </Button>
    </motion.div>
  );
};

export default EmptyBidState;
