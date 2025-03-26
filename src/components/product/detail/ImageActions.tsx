
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import RefreshButton from "./RefreshButton";
import UploadImageButton from "./UploadImageButton";

interface ImageActionsProps {
  productId: string;
  onRefresh: () => void;
  onImageUploaded: (publicId: string, url: string) => void;
}

const ImageActions = ({ productId, onRefresh, onImageUploaded }: ImageActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="mt-4 flex justify-between">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate("/upload")}
        className="text-gray-600"
      >
        <Camera className="h-4 w-4 mr-2" />
        Go to Upload Demo
      </Button>

      <div className="flex space-x-2">
        <RefreshButton onRefresh={onRefresh} />
        <UploadImageButton 
          productId={productId} 
          onImageUploaded={onImageUploaded} 
        />
      </div>
    </div>
  );
};

export default ImageActions;
