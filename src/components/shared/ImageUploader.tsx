
import { useState } from "react";
import { uploadToCloudinary, buildCloudinaryUrl } from "@/lib/cloudinary/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { updateProductImage } from "@/lib/supabase/products";

interface ImageUploaderProps {
  onImageUploaded?: (publicId: string, url: string) => void;
  buttonText?: string;
  className?: string;
  productId?: string; // Add product ID prop
}

const ImageUploader = ({ 
  onImageUploaded, 
  buttonText = "Upload Image", 
  className = "",
  productId
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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
    
    try {
      // Pass the product ID with the upload if available
      const publicId = await uploadToCloudinary(file, productId);
      
      if (!publicId) {
        throw new Error("Failed to upload image");
      }
      
      // Generate the full URL from public ID
      const imageUrl = buildCloudinaryUrl(publicId, {
        width: 800,
        height: 600,
        crop: 'fill'
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
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.click();
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full">
        <div className="flex-1 w-full">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="cursor-pointer"
            id="file-upload"
            style={{ display: 'none' }} // Hide the default file input
          />
          <Button
            type="button"
            disabled={isUploading}
            className="w-full"
            onClick={triggerFileInput}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
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
      
      {uploadedImage && (
        <div className="mt-4 rounded-md border border-border overflow-hidden">
          <img 
            src={uploadedImage} 
            alt="Uploaded image" 
            className="w-full h-auto max-h-[300px] object-contain"
          />
        </div>
      )}
      
      {!uploadedImage && !isUploading && (
        <div className="flex items-center justify-center h-[200px] bg-muted/30 rounded-md border border-dashed border-border">
          <div className="flex flex-col items-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-2" />
            <p>No image uploaded yet</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
