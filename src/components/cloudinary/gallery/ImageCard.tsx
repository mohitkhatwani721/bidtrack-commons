
import { ExternalLink, LinkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sanitizeSamsungUrl } from "@/utils/images/samsungUrlFix";

interface ImageCardProps {
  url: string;
  publicId: string;
  productId?: string;
  productName?: string;
  onImageClick: (url: string) => void;
  onProductClick: (productId: string) => void;
}

const ImageCard = ({
  url,
  publicId,
  productId,
  productName,
  onImageClick,
  onProductClick
}: ImageCardProps) => {
  // Process URL to avoid any Samsung URLs and ensure Cloudinary format is correct
  const processImageUrl = (originalUrl: string) => {
    // First check if it's a Samsung URL, if so return a default image
    if (originalUrl.includes('samsung.com')) {
      return 'https://res.cloudinary.com/di8rdvt2y/image/upload/v1/sample';
    }
    
    // Ensure Cloudinary URLs have the correct format
    if (originalUrl.includes('cloudinary.com') && originalUrl.includes('/upload/')) {
      try {
        const parts = originalUrl.split('/upload/');
        if (parts.length === 2 && !parts[1].startsWith('v1/') && !parts[1].match(/^v\d+\//)) {
          return `${parts[0]}/upload/v1/${parts[1]}`;
        }
      } catch (error) {
        console.error("Error fixing Cloudinary URL format:", error);
      }
    }
    
    return originalUrl;
  };

  // Process URL to fix any issues
  const processedUrl = processImageUrl(url);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="aspect-square relative cursor-pointer"
        onClick={() => onImageClick(processedUrl)}
      >
        <img 
          src={processedUrl} 
          alt={`Cloudinary image ${publicId}`}
          className="object-cover w-full h-full hover:scale-105 transition-transform"
          onError={(e) => {
            console.error("Image error in ImageCard:", processedUrl);
            (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/di8rdvt2y/image/upload/v1/sample';
          }}
        />
        {productName && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
            <div className="text-xs truncate">{productName}</div>
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <div className="text-xs font-mono truncate mb-2">{publicId}</div>
        {productId && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full h-7 text-xs"
            onClick={() => onProductClick(productId)}
          >
            <LinkIcon className="h-3 w-3 mr-1" />
            View Product
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageCard;
