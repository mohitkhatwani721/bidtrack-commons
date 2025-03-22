
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProductImageGallery from "./ProductImageGallery";
import ProductHeader from "./ProductHeader";
import ProductStats from "./ProductStats";
import ProductBidSection from "./ProductBidSection";
import ProductTabs from "./ProductTabs";
import { getProductById } from "@/lib/supabase";
import ProductDetailSkeleton from "@/components/ui/loading/ProductDetailSkeleton";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      const fetchedProduct = await getProductById(id);
      setProduct(fetchedProduct);
      setLoading(false);
    };
    
    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-16 mt-8">
      <Button 
        variant="outline" 
        size="sm" 
        className="mb-6"
        onClick={() => navigate("/products")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to products
      </Button>
      
      {loading ? (
        <ProductDetailSkeleton />
      ) : !product ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImageGallery product={product} />
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProductHeader product={product} />
            <ProductStats product={product} />
            <ProductBidSection product={product} />
            <ProductTabs product={product} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
