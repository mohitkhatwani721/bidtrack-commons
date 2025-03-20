
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import { products, getHighestBidForProduct, isAuctionActive, getTotalBidsForProduct } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AuctionTimer from "@/components/ui/AuctionTimer";
import BidForm from "@/components/bid/BidForm";
import BidHistory from "@/components/bid/BidHistory";
import { ArrowLeft, Shield, Package, Award, Truck } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "bids">("details");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoading(true);
    
    // Find product by id
    const foundProduct = products.find(p => p.id === id);
    setProduct(foundProduct || null);
    
    setLoading(false);
  }, [id]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const highestBid = getHighestBidForProduct(product.id);
  const totalBids = getTotalBidsForProduct(product.id);
  
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
        <div className="space-y-6">
          <motion.div 
            className="relative aspect-square rounded-lg overflow-hidden bg-white border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-contain p-6"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-100">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
            
            <div className="absolute top-4 left-4">
              <Badge className="glass">{product.zone}</Badge>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                className="aspect-square rounded-md border overflow-hidden bg-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * i }}
              >
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={`${product.name} view ${i}`}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-sm">View {i}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline">{product.modelCode}</Badge>
              <Badge variant={totalBids > 0 ? "default" : "secondary"}>
                {totalBids} {totalBids === 1 ? 'bid' : 'bids'}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>
          
          <div className="grid grid-cols-2 gap-4 py-4 border-y">
            <div>
              <p className="text-sm text-gray-500">Starting price</p>
              <p className="text-2xl font-bold">AED {product.pricePerUnit.toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Quantity available</p>
              <p className="text-2xl font-bold">{product.quantity}</p>
            </div>
          </div>
          
          <div className="py-4">
            <AuctionTimer />
          </div>
          
          {isAuctionActive() ? (
            <BidForm productId={product.id} startingPrice={product.pricePerUnit} />
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600">
                The auction is not currently active. Please check back during the auction period.
              </p>
            </div>
          )}
          
          <div className="mt-8">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === "details" 
                    ? "text-gray-900 border-b-2 border-gray-900" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === "bids" 
                    ? "text-gray-900 border-b-2 border-gray-900" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("bids")}
              >
                Bid History
              </button>
            </div>
            
            <div className="py-4">
              {activeTab === "details" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="text-gray-600 mt-2">
                      {product.description || "No description available."}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-gray-700 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Guaranteed Authenticity</h4>
                        <p className="text-sm text-gray-600">All products are original and authentic.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Package className="h-5 w-5 text-gray-700 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Factory Sealed</h4>
                        <p className="text-sm text-gray-600">Products are new and factory sealed.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Award className="h-5 w-5 text-gray-700 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Warranty Included</h4>
                        <p className="text-sm text-gray-600">Standard manufacturer warranty applies.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Truck className="h-5 w-5 text-gray-700 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Fast Delivery</h4>
                        <p className="text-sm text-gray-600">Quick delivery after auction ends.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <BidHistory productId={product.id} />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
