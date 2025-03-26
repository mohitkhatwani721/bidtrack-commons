
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Product } from "@/lib/types";
import { getProductById } from "@/lib/supabase";
import ProductDetailSkeleton from "@/components/ui/loading/ProductDetailSkeleton";
import { toast } from "sonner";
import { products } from "@/lib/data"; // Fallback to local data if Supabase fails
import BackButton from "./detail/BackButton";
import ProductErrorState from "./detail/ProductErrorState";
import ImageSection from "./detail/ImageSection";
import ProductContent from "./detail/ProductContent";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("No product ID provided");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching product with ID:", id);
        
        // Try to fetch from Supabase first
        let fetchedProduct = await getProductById(id);
        
        // If not found in Supabase, try local data as fallback
        if (!fetchedProduct) {
          console.log("Product not found in Supabase, checking local data");
          fetchedProduct = products.find(p => p.id === id) || null;
        }
        
        if (fetchedProduct) {
          console.log("Product found:", fetchedProduct);
          console.log("Product image URL:", fetchedProduct.imageUrl);
          setProduct(fetchedProduct);
        } else {
          console.error("Product not found with ID:", id);
          setError("Product not found");
          toast.error("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, refreshTrigger]);

  const handleForceRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.info("Refreshing product data...");
  };

  // If we're still loading, show a skeleton
  if (loading) {
    return <ProductDetailSkeleton />;
  }

  // If there was an error or product not found
  if (error || !product) {
    return <ProductErrorState error={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-16 mt-8">
      <BackButton />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ImageSection 
          product={product} 
          onRefresh={handleForceRefresh} 
          setProduct={setProduct} 
        />
        <ProductContent product={product} />
      </div>
    </div>
  );
};

export default ProductDetail;
