
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetailComponent from "@/components/product/ProductDetail";
import { sanitizeSamsungUrl } from "@/utils/imageUtils";
import { toast } from "sonner";

const ProductDetail = () => {
  useEffect(() => {
    // Ensure we scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    // Set up global handler for Samsung image errors
    const handleImageErrors = () => {
      const processedUrls = new Set(); // Track processed URLs to avoid loops
      
      window.addEventListener('error', (event) => {
        // Check if the error is from an image
        if (event.target instanceof HTMLImageElement) {
          const img = event.target as HTMLImageElement;
          const originalSrc = img.src;
          
          // Skip if we've already processed this URL
          if (processedUrls.has(originalSrc)) {
            return;
          }
          
          console.log(`Global image error handler triggered for: ${originalSrc}`);
          
          // Check if it's a Samsung URL
          if (originalSrc.includes('samsung.com')) {
            event.preventDefault(); // Prevent default error handling
            
            // Try to fix the Samsung URL by removing query parameters
            const sanitizedUrl = sanitizeSamsungUrl(originalSrc);
            console.log(`Sanitizing Samsung URL globally: ${originalSrc} -> ${sanitizedUrl}`);
            
            // Only retry if the URL actually changed
            if (sanitizedUrl !== originalSrc) {
              processedUrls.add(originalSrc); // Mark as processed
              img.src = sanitizedUrl; // Set the sanitized URL
              
              toast.info("Fixing Samsung image URL", {
                id: "samsung-image-fix",
                duration: 2000
              });
              
              console.log("Applied Samsung URL fix");
            }
          }
        }
      }, true);
    };
    
    handleImageErrors();
    
    // Print the current route for debugging
    console.log("Product Detail Page mounted, current path:", window.location.pathname);
    console.log("Global image error handler installed");
    
    return () => {
      // Cleanup function - we can't remove the anonymous event listener,
      // but we can log that we're unmounting
      console.log("Product Detail Page unmounting");
    };
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
