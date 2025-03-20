
import { useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, Award, Clock, CheckCircle } from "lucide-react";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <FeaturedProducts />
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <motion.h2 
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                How Our Auction Works
              </motion.h2>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Our auction process is simple, transparent, and designed to give every bidder an equal opportunity.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: <ShoppingBag className="h-8 w-8" />,
                  title: "Browse Products",
                  description: "Explore our curated selection of premium products available for auction."
                },
                {
                  icon: <Award className="h-8 w-8" />,
                  title: "Place Your Bid",
                  description: "Offer a bid that equals or exceeds the starting price."
                },
                {
                  icon: <Clock className="h-8 w-8" />,
                  title: "Track The Auction",
                  description: "Monitor the auction progress and adjust your bid if needed."
                },
                {
                  icon: <CheckCircle className="h-8 w-8" />,
                  title: "Win & Collect",
                  description: "If your bid is the highest when the auction ends, you win the item."
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link to="/products">View All Products</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <motion.span
                className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                About Us
              </motion.span>
              <motion.h2 
                className="mt-4 text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Premium Auction Experience
              </motion.h2>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                We curate exceptional products and provide a seamless bidding experience, ensuring that every auction is transparent, fair, and rewarding.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Quality Assured",
                  description: "We offer only genuine, high-quality products that meet our strict standards."
                },
                {
                  title: "Transparent Process",
                  description: "Our bidding process is completely transparent, with real-time updates on auction status."
                },
                {
                  title: "Customer Support",
                  description: "Our dedicated support team is always ready to assist you with any questions or concerns."
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="rounded-lg p-6 border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
