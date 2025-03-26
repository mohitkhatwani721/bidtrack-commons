
import { useState } from "react";
import ImageCard from "./ImageCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

// Update the CloudinaryImage interface to match useImageGallery.ts
interface CloudinaryImage {
  publicId: string;
  url: string;
  uploadedAt: string;  // This replaces createdAt
  productId?: string;
  productName?: string;
}

interface GridViewProps {
  images: CloudinaryImage[];
  onImageClick: (url: string) => void;
  onProductClick: (productId: string) => void;
}

const GridView = ({ images, onImageClick, onProductClick }: GridViewProps) => {
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  if (images.length === 0) {
    return (
      <Alert className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          No images to display in grid view. Try uploading new images or refreshing the gallery.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {images.map((image) => (
          <ImageCard
            key={image.publicId}  // Using publicId instead of id
            url={image.url}
            publicId={image.publicId}
            productId={image.productId}
            productName={image.productName}
            onImageClick={onImageClick}
            onProductClick={onProductClick}
          />
        ))}
      </div>
      
      {showDebugInfo && (
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-md text-sm">
          <h3 className="font-medium mb-2">Debug Information</h3>
          <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-60">
            {JSON.stringify(images.slice(0, 2), null, 2)}
          </pre>
        </div>
      )}
      
      <div className="text-right">
        <button 
          onClick={() => setShowDebugInfo(!showDebugInfo)} 
          className="text-xs text-gray-500 hover:underline"
        >
          {showDebugInfo ? 'Hide' : 'Show'} Debug Info
        </button>
      </div>
    </div>
  );
};

export default GridView;
