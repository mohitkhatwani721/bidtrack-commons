
import { useEffect, useState } from "react";
import { Bid } from "@/lib/types";
import { getCurrentUser } from "@/lib/auth";
import BidLoginPrompt from "./BidLoginPrompt";
import BidList from "./BidList";
import { getBidsForProduct } from "@/lib/supabase";
import { toast } from "sonner";

interface BidHistoryProps {
  productId: string;
}

const BidHistory = ({ productId }: BidHistoryProps) => {
  const [productBids, setProductBids] = useState<Bid[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const currentUser = getCurrentUser();
  
  // Fetch bids from Supabase
  const fetchBids = async () => {
    setLoading(true);
    try {
      const bids = await getBidsForProduct(productId);
      
      // For regular users, filter to only show their bids
      if (!isAdmin && currentUser) {
        const userBids = bids.filter(bid => bid.userEmail === currentUser.email);
        setProductBids(userBids);
      } else {
        setProductBids(bids);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
      toast.error("Failed to load bids");
    } finally {
      setLoading(false);
    }
  };
  
  // Update bids when component mounts or when user/admin status changes
  useEffect(() => {
    if (currentUser || isAdmin) {
      fetchBids();
    }
  }, [productId, isAdmin, currentUser]);
  
  const handleAdminLogin = (adminLoggedIn: boolean) => {
    setIsAdmin(adminLoggedIn);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };
  
  const handleAuthSuccess = () => {
    // This will trigger the useEffect to fetch bids based on the now logged-in user
    fetchBids();
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
      isLoading={loading}
    />
  );
};

export default BidHistory;
