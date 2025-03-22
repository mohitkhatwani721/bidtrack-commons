import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getUserBids } from "@/lib/supabase";
import { Bid } from "@/lib/types";
import { ArrowRight, PackageOpen } from "lucide-react";
import AuctionTimer from "@/components/ui/AuctionTimer";
import { getRelevantPlaceholder } from "@/utils/imageUtils";
import AccountForm from "@/components/auth/AccountForm";
import { getCurrentUser, User } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
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
            </div>
            
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
            )}
            
            {hasSearched && isLoggedIn && (
              <div className="space-y-6">
                {isLoading ? (
                  renderSkeletons()
                ) : userBids.length === 0 ? (
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
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-xl font-medium mb-4">Your Bids</h2>
                    <div className="space-y-4">
                      {userBids.map((bid, index) => {
                        // Get image URL or fallback to relevant placeholder
                        const imageToDisplay = bid.product?.imageUrl || getRelevantPlaceholder(bid.product?.name || "product");
                        
                        return (
                          <motion.div 
                            key={bid.id}
                            className="bg-white rounded-lg border overflow-hidden"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.05 * index }}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="bg-gray-50 aspect-square md:aspect-auto flex items-center justify-center p-2">
                                <img
                                  src={imageToDisplay}
                                  alt={bid.product?.name || "Product"}
                                  className="h-24 w-24 object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = getRelevantPlaceholder(bid.product?.name || "product");
                                  }}
                                />
                              </div>
                              
                              <div className="p-4 md:col-span-2">
                                <h3 className="font-medium text-lg mb-1">{bid.product?.name || "Unknown Product"}</h3>
                                <p className="text-sm text-gray-500 mb-2">{bid.product?.modelCode || "N/A"}</p>
                                <p className="text-xs text-gray-500">
                                  Bid placed on {bid.timestamp.toLocaleDateString()}
                                </p>
                              </div>
                              
                              <div className="p-4 flex flex-col justify-between">
                                <div>
                                  <p className="text-sm text-gray-500">Your bid</p>
                                  <p className="text-lg font-bold">AED {bid.amount.toLocaleString()}</p>
                                </div>
                                
                                <Button asChild variant="outline" size="sm" className="mt-2">
                                  <Link to={`/products/${bid.productId}`}>
                                    View Product
                                    <ArrowRight className="ml-2 h-3 w-3" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserBids;
