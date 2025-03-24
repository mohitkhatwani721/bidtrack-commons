
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCcw } from "lucide-react";

interface ImageErrorAlertProps {
  onRetryClick: () => void;
}

const ImageErrorAlert = ({ onRetryClick }: ImageErrorAlertProps) => {
  return (
    <Alert variant="default" className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
      <AlertTitle className="text-amber-800">Image Loading Issue</AlertTitle>
      <AlertDescription className="flex flex-col space-y-2">
        <p>We're having trouble loading some product images. This won't affect your browsing experience.</p>
        <button 
          onClick={onRetryClick}
          className="flex items-center justify-center space-x-2 bg-amber-100 text-amber-800 hover:bg-amber-200 py-1 px-2 rounded text-sm w-fit"
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          Retry Loading Images
        </button>
      </AlertDescription>
    </Alert>
  );
};

export default ImageErrorAlert;
