
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/shared/ImageUploader";
import CloudinaryConfig from "./CloudinaryConfig";
import ProductSelector from "./ProductSelector";
import UploadSuccessCard from "./UploadSuccessCard";

interface UploadTabProps {
  onImageUploaded: (publicId: string, url: string) => void;
  uploadedImageInfo: { publicId: string; url: string } | null;
  onViewInGallery: () => void;
}

const UploadTab = ({ onImageUploaded, uploadedImageInfo, onViewInGallery }: UploadTabProps) => {
  const [selectedProductId, setSelectedProductId] = useState<string>("none");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Image</CardTitle>
        <CardDescription>
          Upload an image to Cloudinary and associate it with a product
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CloudinaryConfig />
        
        <div className="space-y-4">
          <ProductSelector 
            selectedProductId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
          />
          
          <ImageUploader 
            onImageUploaded={onImageUploaded} 
            productId={selectedProductId !== "none" ? selectedProductId : undefined}
          />
        </div>
        
        {uploadedImageInfo && (
          <UploadSuccessCard 
            uploadedImageInfo={uploadedImageInfo}
            selectedProductId={selectedProductId}
            onViewInGallery={onViewInGallery}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default UploadTab;
