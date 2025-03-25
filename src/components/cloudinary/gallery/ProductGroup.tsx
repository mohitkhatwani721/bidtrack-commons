
import { ShoppingBag, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import ImageCard from "./ImageCard";

interface CloudinaryImage {
  id: string;
  publicId: string;
  url: string;
  createdAt: string;
  productId?: string;
  product?: {
    name: string;
    id: string;
  };
}

interface ProductGroupProps {
  productId: string;
  productName: string;
  images: CloudinaryImage[];
  onImageClick: (url: string) => void;
  onProductClick: (productId: string) => void;
}

const ProductGroup = ({
  productId,
  productName,
  images,
  onImageClick,
  onProductClick
}: ProductGroupProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          {productId !== 'unassociated' && <ShoppingBag className="h-4 w-4 mr-2 text-primary" />}
          {productName}
          <Badge className="ml-2" variant="outline">{images.length}</Badge>
        </h3>
        {productId !== 'unassociated' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onProductClick(productId)}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            View Product
          </Button>
        )}
      </div>
      <Separator />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image) => (
          <Card 
            key={image.id} 
            className="overflow-hidden hover:shadow-md transition-shadow"
            onClick={() => onImageClick(image.url)}
          >
            <div className="aspect-square relative">
              <img 
                src={image.url} 
                alt={`Cloudinary image ${image.publicId}`}
                className="object-cover w-full h-full hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
            <div className="p-2">
              <div className="text-xs font-mono truncate">{image.publicId}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductGroup;
