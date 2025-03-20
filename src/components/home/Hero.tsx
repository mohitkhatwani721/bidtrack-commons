
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { auctionSettings, isAuctionActive } from "@/lib/data";
import AuctionTimer from "@/components/ui/AuctionTimer";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen flex items-center bg-gradient-to-b from-gray-50 to-white pt-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-50 rounded-full opacity-70 blur-3xl" />
        <div className="absolute top-40 -left-20 w-60 h-60 bg-purple-50 rounded-full opacity-70 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full">
                Limited Time Auction
              </span>
              <h1 className="mt-6 text-5xl md:text-6xl font-bold tracking-tight">
                Exclusive Products. <br />
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Premium Auctions.
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-xl">
                Discover exceptional products at competitive prices. Place your bids and secure top quality items.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button asChild size="lg" className="rounded-md">
                <Link to="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {isAuctionActive() ? (
                <Button asChild variant="outline" size="lg" className="rounded-md">
                  <Link to="/my-bids">View My Bids</Link>
                </Button>
              ) : (
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {new Date() < auctionSettings.startDate 
                      ? "Auction starts soon" 
                      : "Auction has ended"}
                  </span>
                </div>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-4"
            >
              <AuctionTimer />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative mx-auto max-w-md">
              <div className="glass rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.samsung.com/is/image/samsung/p6pim/ae/qa75ls03bauztw/gallery/ae-the-frame-ls03b-qa75ls03bauztw-532525244?$650_519_PNG$" 
                  alt="Featured Product" 
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -right-6">
                <div className="glass rounded-full p-5 shadow-lg">
                  <span className="text-gray-800 font-semibold">Starting at</span>
                  <div className="text-lg font-bold">AED 8,999</div>
                </div>
              </div>
              <div className="absolute -top-6 -left-6">
                <div className="glass rounded-full p-4 shadow-lg animate-pulse-slow">
                  <div className="text-sm font-medium text-gray-800">Premium Item</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
