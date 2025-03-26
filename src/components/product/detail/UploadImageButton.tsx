
import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageUploader from "@/components/shared/ImageUploader";

interface UploadImageButtonProps {
  productId: string;
  onImageUploaded: (publicId: string, url: string) => void;
}

const UploadImageButton = ({ productId, onImageUploaded }: UploadImageButtonProps) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleImageUploaded = (publicId: string, url: string) => {
    setIsUploadDialogOpen(false);
    onImageUploaded(publicId, url);
  };

  return (
    <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <ImagePlus className="h-4 w-4 mr-2" />
          Upload Product Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Product Image</DialogTitle>
        </DialogHeader>
        <ImageUploader 
          productId={productId} 
          onImageUploaded={handleImageUploaded}
          buttonText="Upload New Image"
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadImageButton;
