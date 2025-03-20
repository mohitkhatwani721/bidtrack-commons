
import { useEffect, useState } from "react";
import { Bid } from "@/lib/types";
import { bids } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import BidLoginPrompt from "./BidLoginPrompt";
import BidList from "./BidList";

interface BidHistoryProps {
  productId: string;
}

const BidHistory = ({ productId }: BidHistoryProps) => {
  const [productBids, setProductBids] = useState<Bid[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const currentUser = getCurrentUser();
  
  // Update bids when they change or when user/admin status changes
  useEffect(() => {
    // Get bids for this product and sort by timestamp (newest first)
    const filteredBids = bids
      .filter(bid => {
        // For admin, show all bids for this product
        if (isAdmin) {
          return bid.productId === productId;
        }
        // For user, only show their own bids for this product
        return bid.productId === productId && (currentUser ? bid.userEmail === currentUser.email : false);
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setProductBids(filteredBids);
  }, [productId, isAdmin, currentUser]);
  
  const handleAdminLogin = (adminLoggedIn: boolean) => {
    setIsAdmin(adminLoggedIn);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };
  
  const handleAuthSuccess = () => {
    // This will trigger the useEffect to update bids based on the now logged-in user
  };
  
  if (!currentUser && !isAdmin) {
    return (
      <BidLoginPrompt 
        onAdminLogin={handleAdminLogin} 
        onAuthSuccess={handleAuthSuccess} 
      />
    );
  }
  
  return (
    <BidList 
      bids={productBids} 
      isAdmin={isAdmin} 
      onLogout={handleLogout} 
    />
  );
};

export default BidHistory;
