
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

interface GridViewProps {
  images: CloudinaryImage[];
  onImageClick: (url: string) => void;
  onProductClick: (productId: string) => void;
}

const GridView = ({ images, onImageClick, onProductClick }: GridViewProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          id={image.id}
          url={image.url}
          publicId={image.publicId}
          productId={image.productId}
          productName={image.product?.name}
          onImageClick={onImageClick}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
};

export default GridView;
