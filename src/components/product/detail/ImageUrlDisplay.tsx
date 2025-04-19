
import { useEffect } from "react";
import { toast } from "sonner";

interface ImageUrlDisplayProps {
  imageUrl: string | undefined;
}

const ImageUrlDisplay = ({ imageUrl }: ImageUrlDisplayProps) => {
  useEffect(() => {
    console.log("🔍 ImageUrlDisplay - Current URL:", imageUrl);
  }, [imageUrl]);

  if (!imageUrl) return null;
  
  // Helper function to handle Cloudinary URL issues
  const getDisplayUrl = (url: string): string => {
    if (!url) return 'https://res.cloudinary.com/di8rdvt2y/image/upload/v1/sample';
    
    // Avoid Samsung URLs entirely
    if (url.includes('samsung.com')) {
      return 'https://res.cloudinary.com/di8rdvt2y/image/upload/v1/sample';
    }
    
    // For Cloudinary URLs, ensure proper format
    if (url.includes('cloudinary.com')) {
      try {
        const parts = url.split('/upload/');
        if (parts.length === 2 && !parts[1].startsWith('v1/') && !parts[1].match(/^v\d+\//)) {
          return `${parts[0]}/upload/v1/${parts[1]}`;
        }
      } catch (err) {
        console.error("Error fixing Cloudinary URL:", err);
      }
    }
    
    return url;
  };
  
  const displayUrl = getDisplayUrl(imageUrl);
  
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
          src={displayUrl} 
          alt="URL preview" 
          className="h-20 object-contain mx-auto" 
          onLoad={() => console.log("🟢 Image preview loaded successfully")}
          onError={(e) => {
            console.error("🔴 Image preview failed to load:", {
              src: imageUrl,
              displayUrl,
              error: e
            });
            
            // Use a default Cloudinary fallback
            const img = e.target as HTMLImageElement;
            img.src = 'https://res.cloudinary.com/di8rdvt2y/image/upload/v1/sample';
          }}
        />
      </div>
    </div>
  );
};

export default ImageUrlDisplay;
