
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";

interface UserStatusBarProps {
  currentUser: User | null;
  isLoading: boolean;
  refetch: () => void;
}

const UserStatusBar = ({ currentUser, isLoading, refetch }: UserStatusBarProps) => {
  return (
    <motion.div 
      className="mb-8 bg-white rounded-lg border p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="space-y-4">
        <h2 className="text-xl font-medium mb-4">Your Bids</h2>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Logged in as <span className="font-medium">{currentUser?.email}</span>
          </p>
          <Button onClick={() => refetch()} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                Loading
                <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </span>
            ) : (
              "Refresh Bids"
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserStatusBar;
