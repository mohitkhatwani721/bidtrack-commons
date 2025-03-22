
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCcw } from "lucide-react";

interface ImageErrorAlertProps {
  onRetryClick: () => void;
}

const ImageErrorAlert = ({ onRetryClick }: ImageErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTitle>Image Loading Issue</AlertTitle>
      <AlertDescription className="flex flex-col space-y-2">
        <p>We're having trouble loading product images.</p>
        <button 
          onClick={onRetryClick}
          className="flex items-center justify-center space-x-2 bg-destructive/10 text-destructive hover:bg-destructive/20 py-1 px-2 rounded text-sm"
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          Retry Loading Images
        </button>
      </AlertDescription>
    </Alert>
  );
};

export default ImageErrorAlert;
