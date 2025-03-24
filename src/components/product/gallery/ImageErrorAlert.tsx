
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCcw, ImagePlus } from "lucide-react";

interface ImageErrorAlertProps {
  onRetryClick: () => void;
  onUploadClick: () => void;
}

const ImageErrorAlert = ({ onRetryClick, onUploadClick }: ImageErrorAlertProps) => {
  return (
    <Alert variant="default" className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
      <AlertTitle className="text-amber-800">Image Loading Issue</AlertTitle>
      <AlertDescription className="flex flex-col space-y-2">
        <p>We're having trouble loading some product images. You can try reloading or upload a relevant image instead.</p>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={onRetryClick}
            className="flex items-center justify-center space-x-2 bg-amber-100 text-amber-800 hover:bg-amber-200 py-1 px-2 rounded text-sm w-fit"
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            Retry Loading
          </button>
          
          <button 
            onClick={onUploadClick}
            className="flex items-center justify-center space-x-2 bg-green-100 text-green-800 hover:bg-green-200 py-1 px-2 rounded text-sm w-fit"
          >
            <ImagePlus className="h-4 w-4 mr-1" />
            Upload Relevant Image
          </button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ImageErrorAlert;
