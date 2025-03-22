
import { useEffect } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuctionTimer from "@/components/ui/AuctionTimer";

const Products = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">All Products</h1>
            <p className="text-gray-600 max-w-3xl">
              Browse our complete collection of premium products available for auction. Place your bids on the items you desire.
            </p>
          </div>
          
          <div className="mb-8">
            <AuctionTimer />
          </div>
          
          <ProductGrid />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
