
import { useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetailComponent from "@/components/product/ProductDetail";
import { sanitizeSamsungUrl } from "@/utils/imageUtils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const ProductDetail = () => {
  const retryCount = useRef(0);
  
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

  const handleGlobalRetry = () => {
    // Force reload all images by changing their URLs slightly
    retryCount.current += 1;
    
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      const currentSrc = img.src;
      if (currentSrc) {
        // For Cloudinary URLs, we can force a reload by adding a cachebuster
        if (currentSrc.includes('cloudinary.com')) {
          const newSrc = currentSrc.includes('?') 
            ? `${currentSrc}&_retry=${retryCount.current}` 
            : `${currentSrc}?_retry=${retryCount.current}`;
            
          img.src = newSrc;
        }
      }
    });
    
    toast.info("Reloading all images...", {
      id: "global-image-retry",
      duration: 2000
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 flex justify-end mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGlobalRetry}
            className="text-xs"
          >
            <RefreshCcw className="h-3 w-3 mr-1" />
            Reload All Images
          </Button>
        </div>
        <ProductDetailComponent />
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
