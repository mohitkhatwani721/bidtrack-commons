
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PackageOpen } from "lucide-react";

interface UserBidsHeaderProps {
  isLoggedIn: boolean;
  hasBids: boolean;
}

const UserBidsHeader = ({ isLoggedIn, hasBids }: UserBidsHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <motion.h1 
        className="text-3xl font-bold mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Bids
      </motion.h1>
      <motion.p 
        className="text-gray-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        View and track all your active bids. Login to see all the products you've bid on.
      </motion.p>
      
      {!isLoggedIn || (isLoggedIn && hasBids === false) ? null : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-xl font-medium mb-4">Your Bids</h2>
        </motion.div>
      )}
    </div>
  );
};

export default UserBidsHeader;
