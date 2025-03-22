
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ImageUploader from "@/components/shared/ImageUploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/lib/supabase/products";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, HelpCircle, CheckCircle } from "lucide-react";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_UPLOAD_PRESET } from "@/lib/cloudinary/client";

const ImageUploadDemo = () => {
  const [uploadedImageInfo, setUploadedImageInfo] = useState<{publicId: string, url: string} | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [configStatus, setConfigStatus] = useState<"checking" | "valid" | "invalid" | "incomplete">("checking");
  
  // Check Cloudinary configuration on load
  useEffect(() => {
    const checkConfig = () => {
      const hasCloudName = !!CLOUDINARY_CLOUD_NAME;
      const hasApiKey = !!CLOUDINARY_API_KEY;
      const hasUploadPreset = !!CLOUDINARY_UPLOAD_PRESET;
      
      if (hasCloudName && hasApiKey && hasUploadPreset) {
        setConfigStatus("valid");
        console.log("Cloudinary configuration appears valid");
      } else if (hasCloudName && hasApiKey) {
        setConfigStatus("incomplete");
        console.warn("Cloudinary configuration is incomplete - missing upload preset");
      } else {
        setConfigStatus("invalid");
        console.error("Missing Cloudinary configuration");
      }
    };
    
    checkConfig();
  }, []);
  
  // Fetch products for the dropdown
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });
  
  const handleImageUploaded = (publicId: string, url: string) => {
    console.log("Image upload successful:", { publicId, url });
    setUploadedImageInfo({ publicId, url });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Image Upload Demo</CardTitle>
              <CardDescription>
                Upload an image to Cloudinary and associate it with a product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className={configStatus === "valid" ? "bg-green-50 border-green-200" : configStatus === "invalid" ? "bg-red-50 border-red-200" : "mb-4"}>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Cloudinary Configuration</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>Status:</strong> {
                      configStatus === "valid" ? (
                        <span className="text-green-600 font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" /> Valid
                        </span>
                      ) : configStatus === "invalid" ? (
                        <span className="text-red-600 font-medium">Invalid</span>
                      ) : (
                        <span className="text-amber-600 font-medium">Incomplete</span>
                      )
                    }</p>
                    <p><strong>Cloud Name:</strong> <code className="bg-muted px-1 rounded">{CLOUDINARY_CLOUD_NAME || "Not set"}</code></p>
                    <p><strong>API Key:</strong> <code className="bg-muted px-1 rounded">{CLOUDINARY_API_KEY ? `${CLOUDINARY_API_KEY.substring(0, 6)}...` : "Not set"}</code></p>
                    <p><strong>Upload Preset:</strong> <code className="bg-muted px-1 rounded">{CLOUDINARY_UPLOAD_PRESET || "Not set"}</code> (Signed mode)</p>
                    <p><strong>Destination Folder:</strong> <code className="bg-muted px-1 rounded">asset/bid</code></p>
                  </div>
                </AlertDescription>
              </Alert>
              
              {configStatus === "invalid" && (
                <Alert variant="destructive">
                  <HelpCircle className="h-4 w-4" />
                  <AlertTitle>Configuration Issue</AlertTitle>
                  <AlertDescription>
                    Your Cloudinary configuration appears to be incomplete. Please ensure you have set 
                    CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_UPLOAD_PRESET properly.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product-select">Select a product (optional)</Label>
                  <Select
                    value={selectedProductId}
                    onValueChange={setSelectedProductId}
                  >
                    <SelectTrigger id="product-select" className="w-full">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (generic upload)</SelectItem>
                      {isLoading ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading products...
                        </div>
                      ) : (
                        products?.map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    If selected, the uploaded image will be associated with this product
                  </p>
                </div>
                
                <ImageUploader 
                  onImageUploaded={handleImageUploaded} 
                  productId={selectedProductId || undefined}
                />
              </div>
              
              {uploadedImageInfo && (
                <div className="mt-6 p-4 bg-muted/30 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Upload Information</h3>
                  <p><strong>Public ID:</strong> {uploadedImageInfo.publicId}</p>
                  <p className="mt-1"><strong>URL:</strong> <span className="text-sm break-all">{uploadedImageInfo.url}</span></p>
                  {selectedProductId && (
                    <p className="mt-1"><strong>Associated with Product ID:</strong> <span className="text-sm">{selectedProductId}</span></p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ImageUploadDemo;
