import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ImageUploader from "@/components/shared/ImageUploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/lib/supabase/products";
import { Loader2, InfoIcon, HelpCircle, CheckCircle, ExternalLink, Copy, ArrowUpRight, Link2, Upload, ImageIcon, Images } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_UPLOAD_PRESET } from "@/lib/cloudinary/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageGalleryTabs, ImageGalleryTabsList, ImageGalleryTabsTrigger, TabsContent } from "@/components/ui/tabs";
import ImageGallery from "@/components/cloudinary/ImageGallery";

const ImageUploadDemo = () => {
  const [uploadedImageInfo, setUploadedImageInfo] = useState<{publicId: string, url: string} | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [configStatus, setConfigStatus] = useState<"valid" | "invalid" | "incomplete" | "checking">("checking");
  const [activeTab, setActiveTab] = useState("upload");
  const [galleryRefreshTrigger, setGalleryRefreshTrigger] = useState(0);
  
  useEffect(() => {
    console.log("ImageUploadDemo mounted");
    console.log("Cloudinary config:", {
      cloudName: CLOUDINARY_CLOUD_NAME,
      apiKey: CLOUDINARY_API_KEY ? "[REDACTED]" : undefined,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET
    });
    
    const hasCloudName = !!CLOUDINARY_CLOUD_NAME;
    const hasApiKey = !!CLOUDINARY_API_KEY;
    const hasUploadPreset = !!CLOUDINARY_UPLOAD_PRESET;
    
    if (hasCloudName && hasApiKey && hasUploadPreset) {
      setConfigStatus("valid");
      console.log("Cloudinary configuration is valid");
    } else if (hasCloudName && hasApiKey) {
      setConfigStatus("incomplete");
      console.warn("Cloudinary configuration is incomplete - missing upload preset");
    } else {
      setConfigStatus("invalid");
      console.error("Missing critical Cloudinary configuration");
    }
    
    const testUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_100/sample`;
    
    fetch(testUrl)
      .then(response => {
        if (!response.ok) {
          console.error("Cloudinary test request failed");
          toast.error("Failed to connect to Cloudinary");
        } else {
          console.log("Cloudinary test request succeeded");
        }
      })
      .catch(error => {
        console.error("Error testing Cloudinary connection:", error);
      });
  }, []);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });
  
  const handleImageUploaded = (publicId: string, url: string) => {
    console.log("Image upload successful:", { publicId, url });
    setUploadedImageInfo({ publicId, url });
    
    toast.success(
      <div className="flex flex-col">
        <span>Image uploaded successfully!</span>
        <span className="text-xs mt-1">Testing URL is available below</span>
      </div>
    );
    
    setGalleryRefreshTrigger(prev => prev + 1);
    setActiveTab("gallery");
  };

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-5xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cloudinary Image Management</CardTitle>
              <CardDescription>
                Upload images to Cloudinary and associate them with products
              </CardDescription>
              <CardDescription className="text-yellow-600 mt-2">
                <strong>Important:</strong> Make sure your upload preset (<code>{CLOUDINARY_UPLOAD_PRESET}</code>) is 
                properly configured for unsigned uploads in your Cloudinary dashboard
              </CardDescription>
            </CardHeader>
          </Card>
          
          <ImageGalleryTabs value={activeTab} onValueChange={setActiveTab}>
            <ImageGalleryTabsList>
              <ImageGalleryTabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </ImageGalleryTabsTrigger>
              <ImageGalleryTabsTrigger value="gallery">
                <Images className="h-4 w-4 mr-2" />
                Image Gallery
              </ImageGalleryTabsTrigger>
            </ImageGalleryTabsList>
            
            <TabsContent value="upload" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Image</CardTitle>
                  <CardDescription>
                    Upload an image to Cloudinary and associate it with a product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {configStatus === "checking" ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="animate-spin h-4 w-4" />
                      <span>Checking Cloudinary configuration...</span>
                    </div>
                  ) : (
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
                          <p><strong>Upload Preset:</strong> <code className="bg-muted px-1 rounded">{CLOUDINARY_UPLOAD_PRESET || "Not set"}</code></p>
                          <p><strong>Destination Folder:</strong> <code className="bg-muted px-1 rounded">asset/bid</code></p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
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
                          <SelectItem value="none">None (generic upload)</SelectItem>
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
                      productId={selectedProductId !== "none" ? selectedProductId : undefined}
                    />
                  </div>
                  
                  {uploadedImageInfo && (
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
                            onClick={() => setActiveTab("gallery")}
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="gallery" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Image Gallery</CardTitle>
                  <CardDescription>
                    Browse images uploaded to Cloudinary and their product associations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageGallery key={`gallery-${galleryRefreshTrigger}`} />
                </CardContent>
              </Card>
            </TabsContent>
          </ImageGalleryTabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ImageUploadDemo;
