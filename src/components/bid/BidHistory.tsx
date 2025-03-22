
import { useEffect, useState } from "react";
import { Bid } from "@/lib/types";
import { getCurrentUser, User } from "@/lib/auth";
import BidLoginPrompt from "./BidLoginPrompt";
import BidList from "./BidList";
import { getBidsForProduct } from "@/lib/supabase";
import { toast } from "sonner";
import BidListSkeleton from "@/components/ui/loading/BidListSkeleton";

interface BidHistoryProps {
  productId: string;
}

const BidHistory = ({ productId }: BidHistoryProps) => {
  const [productBids, setProductBids] = useState<Bid[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Fetch the current user when component mounts
  useEffect(() => {
    const loadUser = async () => {
      // Clear any stale user data in localStorage
      localStorage.removeItem("currentUser");
      
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    
    loadUser();
  }, []);
  
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
  
  const handleAuthSuccess = async () => {
    // Clear any existing session data
    localStorage.removeItem("currentUser");
    
    const user = await getCurrentUser();
    setCurrentUser(user);
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
  
  if (loading) {
    return <BidListSkeleton count={3} />;
  }
  
  return (
    <BidList 
      bids={productBids} 
      isAdmin={isAdmin} 
      onLogout={handleLogout}
      isLoading={false}
    />
  );
};

export default BidHistory;
