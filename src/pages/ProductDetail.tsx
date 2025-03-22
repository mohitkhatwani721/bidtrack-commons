
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetailComponent from "@/components/product/ProductDetail";

const ProductDetail = () => {
  useEffect(() => {
    // Ensure we scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    // Set up global handler for Samsung image errors
    const handleImageErrors = () => {
      window.addEventListener('error', (event) => {
        // Check if the error is from an image
        if (event.target instanceof HTMLImageElement) {
          const img = event.target;
          console.log(`Global image error handler: ${img.src}`);
          
          // Only prevent default for Samsung URLs to avoid showing the browser's error UI
          if (img.src.includes('samsung.com')) {
            event.preventDefault();
          }
        }
      }, true);
    };
    
    handleImageErrors();
    
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
