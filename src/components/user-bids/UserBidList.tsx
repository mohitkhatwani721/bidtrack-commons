
import { motion } from "framer-motion";
import { Bid } from "@/lib/types";
import { User } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import UserBidItem from "./UserBidItem";
import EmptyBidState from "./EmptyBidState";
import { Skeleton } from "@/components/ui/skeleton";

interface UserBidListProps {
  userBids: Bid[];
  isLoading: boolean;
  refetch: () => void;
  currentUser: User | null;
}

const UserBidList = ({ userBids, isLoading, refetch, currentUser }: UserBidListProps) => {
  // Render loading skeletons
  const renderSkeletons = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="bg-white rounded-lg border overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="bg-gray-100 h-24 w-full" />
            <div className="p-4 md:col-span-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <div className="p-4">
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-8 w-full mt-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return renderSkeletons();
  }

  if (userBids.length === 0) {
    return <EmptyBidState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4">
        {userBids.map((bid, index) => (
          <UserBidItem 
            key={bid.id}
            bid={bid} 
            index={index} 
          />
        ))}
      </div>
    </motion.div>
  );
};

export default UserBidList;
