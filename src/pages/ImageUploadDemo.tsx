
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ImageUploader from "@/components/shared/ImageUploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/lib/supabase/products";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const ImageUploadDemo = () => {
  const [uploadedImageInfo, setUploadedImageInfo] = useState<{publicId: string, url: string} | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  
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
              <Alert className="mb-4">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Cloudinary Configuration</AlertTitle>
                <AlertDescription>
                  Using Cloudinary preset: <strong>ml_default</strong> (Signed mode)<br />
                  Default folder: <strong>asset/bid</strong><br />
                  Images will be stored with unique filenames.
                </AlertDescription>
              </Alert>
              
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
