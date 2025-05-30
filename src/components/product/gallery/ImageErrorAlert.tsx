
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCcw, ImagePlus, RotateCw, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageErrorAlertProps {
  onRetryClick: () => void;
  onUploadClick: () => void;
  retryCount: number;
  isSamsungImage?: boolean;
  isCloudinaryImage?: boolean;
}

const ImageErrorAlert = ({ 
  onRetryClick, 
  onUploadClick, 
  retryCount,
  isSamsungImage = false,
  isCloudinaryImage = false
}: ImageErrorAlertProps) => {
  // Function to open Cloudinary documentation
  const openCloudinaryDocs = () => {
    window.open('https://cloudinary.com/documentation/upload_images', '_blank');
  };
  
  // Function to open Cloudinary Media Library
  const openCloudinaryMediaLibrary = () => {
    window.open('https://console.cloudinary.com/console/media_library', '_blank');
  };
  
  // Function to open Cloudinary upload presets page
  const openCloudinaryUploadPresets = () => {
    window.open('https://console.cloudinary.com/settings/c-b22a53e7eeb22d5bd250aa8e8d2c4d/upload', '_blank');
  };
  
  return (
    <Alert variant="default" className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
      <AlertTitle className="text-amber-800 flex items-center gap-2">
        <RotateCw className="h-4 w-4" />
        Image Loading Issue
      </AlertTitle>
      <AlertDescription className="flex flex-col space-y-2">
        <p>
          {isSamsungImage 
            ? "We're having trouble loading Samsung product images." 
            : isCloudinaryImage
              ? "We're having trouble loading your uploaded image from Cloudinary. This could be due to processing delays, incorrect URL formatting, or the image may have been deleted."
              : "We're having trouble loading some product images."}
          {" "}You can try reloading or upload a relevant image instead.
        </p>
        
        {isCloudinaryImage && (
          <div className="text-sm bg-amber-100 p-2 rounded">
            <p className="font-medium flex items-center">
              <Info className="h-4 w-4 mr-1 text-amber-800" />
              Cloudinary troubleshooting tips:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Check if the image is uploaded correctly in your Cloudinary dashboard</li>
              <li>Verify that your upload preset allows public access to uploaded images</li>
              <li>Make sure the public_id is correct and the image hasn't been deleted</li>
              <li><strong>Common 404 Error:</strong> If you get a "page can't be found" error, the URL format might be incorrect</li>
              <li>If the image shows as a blank page, it may still be processing on Cloudinary's servers</li>
              <li>Try viewing the URL without any transformations by using the direct URL format</li>
              <li>Try checking your Cloudinary Media Library to verify if the image exists</li>
            </ul>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={openCloudinaryDocs}
                className="text-xs bg-white border-amber-300 text-amber-800 hover:bg-amber-50"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Documentation
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={openCloudinaryMediaLibrary}
                className="text-xs bg-white border-amber-300 text-amber-800 hover:bg-amber-50"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Check Media Library
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={openCloudinaryUploadPresets}
                className="text-xs bg-white border-amber-300 text-amber-800 hover:bg-amber-50"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Check Upload Presets
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={onRetryClick}
            className="flex items-center justify-center space-x-2 bg-amber-100 text-amber-800 hover:bg-amber-200 py-1 px-2 rounded text-sm w-fit"
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            Retry Loading {retryCount > 0 ? `(${retryCount})` : ''}
          </button>
          
          <button 
            onClick={onUploadClick}
            className="flex items-center justify-center space-x-2 bg-green-100 text-green-800 hover:bg-green-200 py-1 px-2 rounded text-sm w-fit"
          >
            <ImagePlus className="h-4 w-4 mr-1" />
            Upload Relevant Image
          </button>
          
          {isCloudinaryImage && (
            <button 
              onClick={openCloudinaryMediaLibrary}
              className="flex items-center justify-center space-x-2 bg-blue-100 text-blue-800 hover:bg-blue-200 py-1 px-2 rounded text-sm w-fit"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Open Cloudinary Dashboard
            </button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ImageErrorAlert;
