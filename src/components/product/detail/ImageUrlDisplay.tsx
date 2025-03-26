
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
          src={imageUrl} 
          alt="URL preview" 
          className="h-20 object-contain mx-auto" 
          onLoad={() => console.log("🟢 Image preview loaded successfully")}
          onError={(e) => {
            console.error("🔴 Image preview failed to load:", {
              src: imageUrl,
              error: e
            });
            
            // Optional: Attempt to reconstruct URL
            const img = e.target as HTMLImageElement;
            const cloudName = 'di8rdvt2y';  // Your Cloudinary cloud name
            
            try {
              const simplifiedUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v1/asset/bid/product_d6f24efa-e090-41f5-b4bb-6d5bd54f4955_1742872260379.png`;
              console.log("🔍 Attempting simplified URL:", simplifiedUrl);
              img.src = simplifiedUrl;
            } catch (err) {
              console.error("Failed to fix image URL", err);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ImageUrlDisplay;
