
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AccountForm from "@/components/auth/AccountForm";
import AuctionTimer from "@/components/ui/AuctionTimer";
import { Bid } from "@/lib/types";
import { getCurrentUser, User } from "@/lib/auth";
import { getUserBids } from "@/lib/supabase";
import UserBidsHeader from "@/components/user-bids/UserBidsHeader";
import UserStatusBar from "@/components/user-bids/UserStatusBar";
import UserBidList from "@/components/user-bids/UserBidList";

const UserBids = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load user on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if user is already logged in
    const loadUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      if (user) {
        setIsLoggedIn(true);
        setHasSearched(true);
      }
    };
    
    loadUser();
  }, []);

  // Use React Query to fetch user bids
  const { data: userBids = [], isLoading, refetch } = useQuery({
    queryKey: ['userBids', currentUser?.email],
    queryFn: async () => {
      if (!currentUser?.email) return [];
      return await getUserBids(currentUser.email);
    },
    enabled: !!currentUser?.email,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
  
  const handleAuthSuccess = async () => {
    setShowAuthForm(false);
    const user = await getCurrentUser();
    setCurrentUser(user);
    
    if (user) {
      setIsLoggedIn(true);
      setHasSearched(true);
      toast.success("You're now logged in");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <UserBidsHeader 
              isLoggedIn={isLoggedIn} 
              hasBids={userBids.length > 0}
            />
            
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AuctionTimer />
            </motion.div>
            
            {!isLoggedIn ? (
              <>
                <motion.div
                  className="mb-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-xl font-medium mb-2">Create an Account or Login</h2>
                  <p className="text-gray-600 mb-4">
                    To view your bids, you need to login with your account or create a new one.
                  </p>
                </motion.div>
                
                <AccountForm onSuccess={handleAuthSuccess} />
              </>
            ) : (
              <UserStatusBar 
                currentUser={currentUser} 
                isLoading={isLoading} 
                refetch={refetch} 
              />
            )}
            
            {hasSearched && isLoggedIn && (
              <UserBidList 
                userBids={userBids} 
                isLoading={isLoading} 
                refetch={refetch}
                currentUser={currentUser}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserBids;
