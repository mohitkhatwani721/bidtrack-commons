
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Copy, ArrowUpRight, ExternalLink, Link2, Images, InfoIcon } from "lucide-react";
import { toast } from "sonner";

interface UploadSuccessCardProps {
  uploadedImageInfo: { publicId: string; url: string };
  selectedProductId: string;
  onViewInGallery: () => void;
}

const UploadSuccessCard = ({ uploadedImageInfo, selectedProductId, onViewInGallery }: UploadSuccessCardProps) => {
  const copyUrlToClipboard = () => {
    if (uploadedImageInfo?.url) {
      navigator.clipboard.writeText(uploadedImageInfo.url);
      toast.success("URL copied to clipboard");
    }
  };

  const openImageInNewTab = () => {
    if (uploadedImageInfo?.url) {
      window.open(uploadedImageInfo.url, '_blank');
    }
  };

  return (
    <div className="mt-6 p-4 bg-muted/30 rounded-md border border-green-200">
      <h3 className="text-lg font-medium mb-2 flex items-center text-green-700">
        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
        Upload Successful
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label className="font-medium">Public ID:</Label>
          <div className="mt-1 p-2 bg-muted rounded text-sm font-mono break-all">
            {uploadedImageInfo.publicId}
          </div>
        </div>
        
        <div>
          <Label htmlFor="cloudinary-url" className="font-medium flex items-center">
            <Link2 className="h-4 w-4 mr-1 text-blue-500" />
            Cloudinary Testing URL:
          </Label>
          <div className="flex mt-1 gap-2">
            <Input 
              id="cloudinary-url"
              value={uploadedImageInfo.url} 
              readOnly 
              className="font-mono text-sm flex-1 bg-blue-50 border-blue-200"
            />
            <Button size="icon" variant="outline" onClick={copyUrlToClipboard} title="Copy URL">
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={openImageInNewTab} title="Open in new tab">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            onClick={copyUrlToClipboard}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy URL
          </Button>
          
          <Button 
            onClick={openImageInNewTab}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Test Image in New Tab
          </Button>
          
          <Button
            onClick={onViewInGallery}
            variant="default"
            className="flex items-center gap-2"
          >
            <Images className="h-4 w-4" />
            View in Gallery
          </Button>
        </div>
        
        <div className="bg-blue-50 p-3 rounded border border-blue-200 text-blue-800">
          <h4 className="text-sm font-medium flex items-center">
            <InfoIcon className="h-4 w-4 mr-1" />
            How to use this URL
          </h4>
          <p className="text-xs mt-1">
            This URL can be used to verify that your image was uploaded correctly and is accessible from Cloudinary.
            You can use it directly in an <code>&lt;img&gt;</code> tag or in API calls.
          </p>
        </div>
        
        {selectedProductId && selectedProductId !== "none" && (
          <div>
            <Label className="font-medium">Associated with Product:</Label>
            <div className="mt-1 p-2 bg-muted rounded text-sm">
              <span className="font-mono">{selectedProductId}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSuccessCard;
