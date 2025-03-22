
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetailComponent from "@/components/product/ProductDetail";

const ProductDetail = () => {
  useEffect(() => {
    // Ensure we scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    // Print the current route for debugging
    console.log("Product Detail Page mounted, current path:", window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <ProductDetailComponent />
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
