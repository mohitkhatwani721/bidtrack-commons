
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
          
          // Special handling for Cloudinary+Samsung URLs
          if (originalSrc.includes('cloudinary.com') && originalSrc.includes('samsung.com')) {
            event.preventDefault(); // Prevent default error handling
            
            // Try to fix the Samsung URL
            try {
              // If it's a cloudinary fetch URL with Samsung content
              if (originalSrc.includes('/fetch/')) {
                const parts = originalSrc.split('/fetch/');
                if (parts.length === 2) {
                  // Get the transformations part
                  const transformations = parts[0];
                  
                  // Get and decode the fetched URL
                  const fetchedUrl = decodeURIComponent(parts[1]);
                  
                  // Sanitize the Samsung URL directly
                  if (fetchedUrl.includes('samsung.com')) {
                    const parsedUrl = new URL(fetchedUrl);
                    const sanitizedSamsungUrl = `${parsedUrl.origin}${parsedUrl.pathname}`;
                    
                    // Reconstruct the Cloudinary URL with sanitized Samsung URL
                    const newSrc = `${transformations}/fetch/${encodeURIComponent(sanitizedSamsungUrl)}`;
                    
                    console.log(`Fixed Cloudinary+Samsung URL: ${newSrc}`);
                    processedUrls.add(originalSrc);
                    img.src = newSrc;
                    
                    toast.info("Fixing Samsung image", {
                      id: "samsung-image-fix",
                      duration: 2000
                    });
                  }
                }
              } else {
                // For directly embedded Samsung URLs
                const sanitizedUrl = sanitizeSamsungUrl(originalSrc);
                if (sanitizedUrl !== originalSrc) {
                  processedUrls.add(originalSrc);
                  img.src = sanitizedUrl;
                  
                  toast.info("Fixing Samsung image URL", {
                    id: "samsung-image-fix",
                    duration: 2000
                  });
                }
              }
            } catch (error) {
              console.error("Error sanitizing Samsung URL:", error);
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
          // Special handling for Samsung images
          if (currentSrc.includes('samsung.com')) {
            try {
              const sanitized = sanitizeSamsungUrl(currentSrc);
              img.src = `${sanitized}${sanitized.includes('?') ? '&' : '?'}_retry=${retryCount.current}`;
            } catch (e) {
              // If that fails, just add cachebuster to original
              const newSrc = currentSrc.includes('?') 
                ? `${currentSrc}&_retry=${retryCount.current}` 
                : `${currentSrc}?_retry=${retryCount.current}`;
              img.src = newSrc;
            }
          } else {
            // Regular Cloudinary images
            const newSrc = currentSrc.includes('?') 
              ? `${currentSrc}&_retry=${retryCount.current}` 
              : `${currentSrc}?_retry=${retryCount.current}`;
            img.src = newSrc;
          }
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
