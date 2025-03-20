
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { products } from "@/lib/data";
import ProductCard from "@/components/product/ProductCard";

const FeaturedProducts = () => {
  // Get 4 featured products (most expensive)
  const featuredProducts = [...products]
    .sort((a, b) => b.pricePerUnit - a.pricePerUnit)
    .slice(0, 4);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full"
          >
            Featured Items
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-bold"
          >
            Premium Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-gray-600 max-w-2xl mx-auto"
          >
            Discover our handpicked selection of premium products currently available for auction.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <ProductCard product={product} featured />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
