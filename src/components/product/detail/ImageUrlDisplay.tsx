
import { useEffect } from "react";
import { toast } from "sonner";

interface ImageUrlDisplayProps {
  imageUrl: string | undefined;
}

const ImageUrlDisplay = ({ imageUrl }: ImageUrlDisplayProps) => {
  useEffect(() => {
    console.log("🔍 ImageUrlDisplay - Current URL:", imageUrl);
    
    // Extra validation for Cloudinary URLs
    if (imageUrl?.includes('cloudinary.com')) {
      const urlParts = imageUrl.split('/upload/');
      if (urlParts.length === 2) {
        console.log("🔍 Cloudinary URL Parts:", {
          base: urlParts[0],
          publicId: urlParts[1]
        });
      }
    }
  }, [imageUrl]);

  if (!imageUrl) return null;
  
  // Helper function to fix Cloudinary URL format if needed
  const getFixedCloudinaryUrl = (url: string): string => {
    if (!url.includes('cloudinary.com')) return url;
    
    try {
      // For direct Cloudinary uploads, ensure we're using the proper URL structure
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        // If missing version, insert v1
        if (!parts[1].startsWith('v1/') && !parts[1].match(/^v\d+\//)) {
          return `${parts[0]}/upload/v1/${parts[1]}`;
        }
      }
    } catch (err) {
      console.error("Error fixing Cloudinary URL:", err);
    }
    return url;
  };
  
  return (
    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono overflow-hidden">
      <p className="text-slate-500 mb-1">Current image URL:</p>
      <div className="overflow-x-auto">
        <p className="whitespace-nowrap hover:text-blue-600 cursor-pointer" 
           onClick={() => {
             navigator.clipboard.writeText(imageUrl);
             toast.success("URL copied to clipboard");
           }}
           title="Click to copy URL">
          {imageUrl}
        </p>
      </div>
      
      <div className="mt-2 p-2 border border-slate-200 rounded bg-white">
        <p className="text-slate-500 mb-1 text-xs">Image preview:</p>
        <img 
          src={getFixedCloudinaryUrl(imageUrl)} 
          alt="URL preview" 
          className="h-20 object-contain mx-auto" 
          onLoad={() => console.log("🟢 Image preview loaded successfully")}
          onError={(e) => {
            console.error("🔴 Image preview failed to load:", {
              src: imageUrl,
              error: e
            });
            
            // Use a default Cloudinary fallback
            const img = e.target as HTMLImageElement;
            const cloudName = 'di8rdvt2y';  // Your Cloudinary cloud name
            
            try {
              // Use a simple Cloudinary sample image as fallback
              const fallbackUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v1/sample`;
              console.log("🔍 Using Cloudinary fallback URL:", fallbackUrl);
              img.src = fallbackUrl;
            } catch (err) {
              console.error("Failed to use fallback image", err);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ImageUrlDisplay;
