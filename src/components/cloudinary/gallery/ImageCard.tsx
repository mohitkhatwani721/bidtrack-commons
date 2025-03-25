
import { ExternalLink, LinkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ImageCardProps {
  id: string;
  url: string;
  publicId: string;
  productId?: string;
  productName?: string;
  onImageClick: (url: string) => void;
  onProductClick: (productId: string) => void;
}

const ImageCard = ({
  id,
  url,
  publicId,
  productId,
  productName,
  onImageClick,
  onProductClick
}: ImageCardProps) => {
  return (
    <Card key={id} className="overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="aspect-square relative cursor-pointer"
        onClick={() => onImageClick(url)}
      >
        <img 
          src={url} 
          alt={`Cloudinary image ${publicId}`}
          className="object-cover w-full h-full hover:scale-105 transition-transform"
          onError={(e) => {
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
