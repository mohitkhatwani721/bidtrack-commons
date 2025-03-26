
import { ExternalLink, LinkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  // Fix Samsung URLs directly in the component
  const fixSamsungUrls = (originalUrl: string) => {
    if (originalUrl.includes('samsung.com') && originalUrl.includes('?')) {
      try {
        // For Cloudinary fetch URLs containing Samsung URLs
        if (originalUrl.includes('/fetch/')) {
          const [baseUrl, fetchPart] = originalUrl.split('/fetch/');
          if (fetchPart) {
            const decodedUrl = decodeURIComponent(fetchPart);
            const parsedUrl = new URL(decodedUrl);
            const sanitizedPath = `${parsedUrl.origin}${parsedUrl.pathname}`;
            return `${baseUrl}/fetch/${encodeURIComponent(sanitizedPath)}`;
          }
        } else if (originalUrl.includes('samsung.com')) {
          // Direct Samsung URL
          const parsedUrl = new URL(originalUrl);
          return `${parsedUrl.origin}${parsedUrl.pathname}`;
        }
      } catch (e) {
        console.error("Error fixing Samsung URL in ImageCard:", e);
      }
    }
    return originalUrl;
  };

  // Process URL to fix any Samsung issues
  const processedUrl = fixSamsungUrls(url);

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
            // Add direct Samsung URL fixing on error
            if (url.includes('samsung.com')) {
              try {
                const imgElement = e.target as HTMLImageElement;
                const currentSrc = imgElement.src;
                if (currentSrc.includes('?')) {
                  const newSrc = currentSrc.split('?')[0];
                  imgElement.src = newSrc;
                  return;
                }
              } catch (err) {
                console.error("Error fixing Samsung URL on error:", err);
              }
            }
            (e.target as HTMLImageElement).src = '/placeholder.svg';
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
