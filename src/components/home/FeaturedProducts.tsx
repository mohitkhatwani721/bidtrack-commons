import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import { getAllProducts } from "@/lib/supabase";
import { toast } from "sonner";
import ProductCardSkeleton from "@/components/ui/loading/ProductCardSkeleton";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchFeaturedProducts();
  }, []);
  
  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await getAllProducts();
      
      // Get 4 featured products (most expensive)
      const featured = [...allProducts]
        .sort((a, b) => b.pricePerUnit - a.pricePerUnit)
        .slice(0, 4);
        
      setFeaturedProducts(featured);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      toast.error("Failed to load featured products");
    } finally {
      setLoading(false);
    }
  };

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
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, index) => (
              <ProductCardSkeleton key={index} featured />
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
