
import { useState, useEffect } from "react";
import { 
  uploadToCloudinary, 
  buildCloudinaryUrl, 
  CLOUDINARY_UPLOAD_PRESET, 
  CLOUDINARY_CLOUD_NAME,
  isCloudinaryConfigured,
  getOptimizedImageUrl
} from "@/lib/cloudinary/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Upload, Image as ImageIcon, AlertCircle, CheckCircle, XCircle, ExternalLink, Copy, ArrowUpRight } from "lucide-react";
import { updateProductImage } from "@/lib/supabase/products";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Spinner from "@/components/ui/loading/Spinner";

interface ImageUploaderProps {
  onImageUploaded?: (publicId: string, url: string) => void;
  buttonText?: string;
  className?: string;
  productId?: string;
}

const ImageUploader = ({ 
  onImageUploaded, 
  buttonText = "Upload Image", 
  className = "",
  productId
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isConfigValid, setIsConfigValid] = useState<boolean | null>(null);
  const [isPresetError, setIsPresetError] = useState(false);
  const [rawPublicId, setRawPublicId] = useState<string | null>(null);
  const [directCloudinaryUrl, setDirectCloudinaryUrl] = useState<string | null>(null);
  
  // Check configuration on mount
  useEffect(() => {
    // Check if Cloudinary is configured properly
    const checkConfig = () => {
      try {
        const isValid = isCloudinaryConfigured();
        setIsConfigValid(isValid);
        if (!isValid) {
          setUploadError('Cloudinary is not configured correctly. Please check your environment variables.');
        }
      } catch (error) {
        console.error("Error checking Cloudinary configuration:", error);
        setIsConfigValid(false);
        setUploadError('Failed to verify Cloudinary configuration.');
      }
    };
    
    checkConfig();
  }, []);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Clear previous errors and states
    setUploadError(null);
    setIsPresetError(false);
    setRawPublicId(null);
    setDirectCloudinaryUrl(null);
    
    // Check if configuration is valid
    if (isConfigValid === false) {
      toast.error("Cloudinary is not configured correctly");
      setUploadError('Cloudinary configuration is invalid. Cannot upload images.');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    // Check file size (limit to 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      toast.error("Image must be less than 5MB");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(10); // Start progress
    
    try {
      // Simulate progress (since we can't get real progress from the fetch API easily)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress < 90 ? newProgress : 90; // Don't reach 100 until complete
        });
      }, 500);
      
      console.log("Starting upload with preset:", CLOUDINARY_UPLOAD_PRESET);
      console.log("Product ID for upload:", productId || "none");
      
      // Pass the product ID with the upload if available
      const publicId = await uploadToCloudinary(file, productId);
      
      clearInterval(progressInterval);
      
      if (!publicId) {
        throw new Error("Failed to upload image");
      }
      
      setUploadProgress(100);
      setRawPublicId(publicId);
      
      // Store the direct Cloudinary URL for testing
      const directUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v1/${publicId}`;
      setDirectCloudinaryUrl(directUrl);
      
      // Generate the full URL from public ID - with eager loading for this image
      const imageUrl = buildCloudinaryUrl(publicId, {
        width: 800,
        height: 600,
        crop: 'fill',
        loading: 'eager'
      });
      
      setUploadedImage(imageUrl);
      
      // If we have a product ID, update the product with the new image URL
      if (productId) {
        await updateProductImage(productId, imageUrl);
        toast.success("Product image updated successfully");
      } else {
        toast.success("Image uploaded successfully");
      }
      
      // Notify parent component if callback is provided
      if (onImageUploaded) {
        onImageUploaded(publicId, imageUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      
      if (error instanceof Error) {
        // Check if this is a preset configuration error
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('preset') && 
            (errorMessage.includes('whitelist') || errorMessage.includes('unsigned'))) {
          setIsPresetError(true);
        }
        
        setUploadError(error.message);
        toast.error(`Upload failed: ${error.message}`);
      } else {
        setUploadError("Unknown error occurred during upload");
        toast.error("Failed to upload image. Please try again.");
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0); // Reset progress
    }
  };
  
  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.click();
  };
  
  const openCloudinaryDashboard = () => {
    window.open('https://console.cloudinary.com/console/media_library', '_blank');
  };
  
  const copyUrlToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };
  
  const openUrlInNewTab = (url: string) => {
    window.open(url, '_blank');
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {isConfigValid === false && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            Cloudinary is not configured correctly. Please check your environment variables.
          </AlertDescription>
        </Alert>
      )}
      
      {isPresetError && (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-800" />
          <AlertTitle className="text-amber-800 font-medium">Upload Preset Configuration Error</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p className="mb-2">Your upload preset <code className="bg-amber-100 px-1 rounded">{CLOUDINARY_UPLOAD_PRESET}</code> is not properly configured for unsigned uploads.</p>
            <p className="mb-2 font-medium">To fix this:</p>
            <ol className="list-decimal pl-5 space-y-1 mb-3">
              <li>Log in to your Cloudinary dashboard</li>
              <li>Go to Settings &gt; Upload &gt; Upload presets</li>
              <li>Find the preset named <code className="bg-amber-100 px-1 rounded">{CLOUDINARY_UPLOAD_PRESET}</code> or create a new one</li>
              <li>Set "Signing Mode" to "Unsigned"</li>
              <li>Save your changes</li>
            </ol>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 border-amber-300 text-amber-800 hover:bg-amber-100"
              onClick={openCloudinaryDashboard}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open Cloudinary Dashboard
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isConfigValid === true && !isPresetError && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700">Cloudinary Configuration Valid</AlertTitle>
          <AlertDescription className="text-green-600">
            Ready to upload images.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full">
        <div className="flex-1 w-full">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading || isConfigValid === false}
            className="cursor-pointer"
            id="file-upload"
            style={{ display: 'none' }} // Hide the default file input
          />
          <Button
            type="button"
            disabled={isUploading || isConfigValid === false}
            className="w-full"
            onClick={triggerFileInput}
          >
            {isUploading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Uploading... {uploadProgress.toFixed(0)}%
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {buttonText}
              </>
            )}
          </Button>
        </div>
      </div>
      
      {uploadError && !isPresetError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>
            {uploadError}
          </AlertDescription>
        </Alert>
      )}
      
      {isUploading && (
        <div className="w-full bg-muted rounded-full h-2.5 mt-2">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
      
      {/* Test URLs section - Display Direct Cloudinary URL */}
      {rawPublicId && directCloudinaryUrl && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-blue-800 font-medium mb-2">Cloudinary Testing URLs</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-blue-700 mb-1">Direct Cloudinary URL (Without Transformations):</p>
              <div className="flex gap-2">
                <Input 
                  value={directCloudinaryUrl} 
                  readOnly 
                  className="text-xs font-mono flex-1 bg-white border-blue-200"
                />
                <Button size="icon" variant="outline" className="shrink-0" onClick={() => copyUrlToClipboard(directCloudinaryUrl)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="shrink-0" onClick={() => openUrlInNewTab(directCloudinaryUrl)}>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-blue-700 mb-1">Transformed URL (With Image Optimizations):</p>
              <div className="flex gap-2">
                <Input 
                  value={uploadedImage || ''} 
                  readOnly 
                  className="text-xs font-mono flex-1 bg-white border-blue-200"
                />
                <Button size="icon" variant="outline" className="shrink-0" onClick={() => copyUrlToClipboard(uploadedImage || '')}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="shrink-0" onClick={() => openUrlInNewTab(uploadedImage || '')}>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-blue-700 mb-1">Public ID:</p>
              <div className="p-2 bg-white rounded border border-blue-100 text-xs font-mono break-all">
                {rawPublicId}
              </div>
            </div>
            
            <Alert className="bg-white border-blue-100 mt-2">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700 text-sm">Troubleshooting Tip</AlertTitle>
              <AlertDescription className="text-xs text-blue-600">
                If the transformed URL doesn't work, try the direct URL. If neither works, your image may not have been properly uploaded to Cloudinary.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
      
      {uploadedImage && (
        <div className="mt-4 rounded-md border border-border overflow-hidden">
          <div className="p-2 bg-muted/30 border-b flex justify-between items-center">
            <span className="text-sm font-medium">Uploaded Image Preview</span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openUrlInNewTab(uploadedImage)}>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <img 
            src={uploadedImage} 
            alt="Uploaded image" 
            className="w-full h-auto max-h-[300px] object-contain"
            onError={() => {
              toast.error("Failed to load image preview. The upload might have failed.");
            }}
          />
        </div>
      )}
      
      {!uploadedImage && !isUploading && (
        <div className="flex items-center justify-center h-[200px] bg-muted/30 rounded-md border border-dashed border-border">
          <div className="flex flex-col items-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-2" />
            <p>No image uploaded yet</p>
            <p className="text-xs mt-2 max-w-xs text-center">
              Using upload preset: <span className="font-mono">{CLOUDINARY_UPLOAD_PRESET}</span>
            </p>
            <p className="text-xs mt-1 text-center">
              Cloud name: <span className="font-mono">{CLOUDINARY_CLOUD_NAME}</span>
            </p>
            <p className="text-xs mt-1 text-center">
              Mode: <span className="font-mono">Unsigned Upload</span>
            </p>
            <p className="text-xs mt-1 text-center">
              Configuration: <span className={`font-mono ${isConfigValid === true ? 'text-green-600' : isConfigValid === false ? 'text-red-600' : 'text-yellow-600'}`}>
                {isConfigValid === true ? 'VALID' : isConfigValid === false ? 'INVALID' : 'CHECKING...'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
