
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ImagePlus } from "lucide-react";
import ProductImageGallery from "./ProductImageGallery";
import ProductHeader from "./ProductHeader";
import ProductStats from "./ProductStats";
import ProductBidSection from "./ProductBidSection";
import ProductTabs from "./ProductTabs";
import { getProductById } from "@/lib/supabase";
import ProductDetailSkeleton from "@/components/ui/loading/ProductDetailSkeleton";
import { toast } from "sonner";
import { products } from "@/lib/data"; // Fallback to local data if Supabase fails
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageUploader from "@/components/shared/ImageUploader";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

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
  }, [id]);

  const handleImageUploaded = (publicId: string, url: string) => {
    // Close the dialog
    setIsUploadDialogOpen(false);
    
    // Update the product in local state to show the new image immediately
    if (product) {
      setProduct({
        ...product,
        imageUrl: url
      });
      
      // Notify the user
      toast.success("Product image updated successfully");
    }
  };

  // If we're still loading, show a skeleton
  if (loading) {
    return <ProductDetailSkeleton />;
  }

  // If there was an error or product not found
  if (error || !product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">{error || "Product Not Found"}</h2>
        <p className="text-gray-600 mb-8">
          {error || "The product you're looking for doesn't exist or has been removed."}
        </p>
        <Button onClick={() => navigate("/products")}>Browse Products</Button>
      </div>
    );
  }

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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <ProductImageGallery product={product} />
          
          <div className="mt-4 flex justify-end">
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Update Product Image
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update Product Image</DialogTitle>
                </DialogHeader>
                <ImageUploader 
                  productId={product.id} 
                  onImageUploaded={handleImageUploaded}
                  buttonText="Upload New Image"
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
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
    </div>
  );
};

export default ProductDetail;
