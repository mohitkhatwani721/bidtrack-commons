
import { useEffect } from "react";

interface ImageUrlDisplayProps {
  imageUrl: string | undefined;
}

const ImageUrlDisplay = ({ imageUrl }: ImageUrlDisplayProps) => {
  useEffect(() => {
    console.log("Current image URL in display component:", imageUrl);
  }, [imageUrl]);

  if (!imageUrl) return null;
  
  // Format URL for display: ensure it's not too long and doesn't break layout
  const displayUrl = imageUrl.length > 100 
    ? `${imageUrl.substring(0, 50)}...${imageUrl.substring(imageUrl.length - 50)}`
    : imageUrl;
  
  return (
    <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono overflow-hidden">
      <p className="text-slate-500 mb-1">Current image URL:</p>
      <div className="overflow-x-auto">
        <p className="whitespace-nowrap hover:text-blue-600 cursor-pointer" 
           onClick={() => {
             navigator.clipboard.writeText(imageUrl);
             // Create a flash effect to indicate copy
             const el = document.activeElement as HTMLElement;
             if (el) el.blur();
           }}
           title="Click to copy URL">
          {imageUrl}
        </p>
      </div>
      
      {/* Add a preview element */}
      <div className="mt-2 p-2 border border-slate-200 rounded bg-white">
        <p className="text-slate-500 mb-1 text-xs">Image preview:</p>
        <img 
          src={imageUrl} 
          alt="URL preview" 
          className="h-20 object-contain mx-auto" 
          onError={(e) => {
            console.error("Error loading image preview:", imageUrl);
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
            
            // Try adding v1 for direct Cloudinary uploads
            if (imageUrl.includes('cloudinary.com') && imageUrl.includes('/upload/')) {
              try {
                const parts = imageUrl.split('/upload/');
                if (parts.length === 2 && !parts[1].startsWith('v1/')) {
                  const fixedUrl = `${parts[0]}/upload/v1/${parts[1]}`;
                  console.log("Trying fixed Cloudinary URL in preview:", fixedUrl);
                  img.src = fixedUrl;
                  img.style.display = 'block';
                }
              } catch (err) {
                console.error("Error fixing preview URL:", err);
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default ImageUrlDisplay;
