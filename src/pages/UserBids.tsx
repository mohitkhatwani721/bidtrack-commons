
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBidsByUser, products } from "@/lib/data";
import { Bid, Product } from "@/lib/types";
import { ArrowRight, PackageOpen } from "lucide-react";
import AuctionTimer from "@/components/ui/AuctionTimer";

const UserBids = () => {
  const [email, setEmail] = useState("");
  const [userBids, setUserBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      const bids = getBidsByUser(email);
      setUserBids(bids);
      setIsLoading(false);
      setHasSearched(true);
    }, 1000);
  };

  const getProductById = (productId: string): Product | undefined => {
    return products.find(product => product.id === productId);
  };

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
                View and track all your active bids. Enter your email address to see all the products you've bid on.
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
            
            <motion.div 
              className="mb-8 bg-white rounded-lg border p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <form onSubmit={handleSearch} className="space-y-4">
                <h2 className="text-xl font-medium mb-4">Find Your Bids</h2>
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-grow"
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        Searching
                        <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      </span>
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
            
            {hasSearched && (
              <div className="space-y-6">
                {userBids.length === 0 ? (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <PackageOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-medium mb-2">No Bids Found</h2>
                    <p className="text-gray-600 mb-6">
                      We couldn't find any bids associated with this email address.
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
                        const product = getProductById(bid.productId);
                        if (!product) return null;
                        
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
                                {product.imageUrl ? (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="h-24 w-24 object-contain"
                                  />
                                ) : (
                                  <div className="h-24 w-24 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 text-sm">No image</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="p-4 md:col-span-2">
                                <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{product.modelCode}</p>
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
                                  <Link to={`/product/${product.id}`}>
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
