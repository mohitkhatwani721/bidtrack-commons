
import { RefreshCw, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface EmptyGalleryStateProps {
  onRefresh: () => void;
}

const EmptyGalleryState = ({ onRefresh }: EmptyGalleryStateProps) => {
  return (
    <Alert className="bg-blue-50 border-blue-200 text-blue-800">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-700">
        <p className="font-medium">No Cloudinary images found</p>
        <p className="text-sm mt-1">
          Upload some images using the upload tab to see them here.
          Make sure your images include "cloudinary.com" in their URLs.
        </p>
        <Button
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          className="mt-3 text-blue-700 border-blue-300 hover:bg-blue-100"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh Gallery
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default EmptyGalleryState;
