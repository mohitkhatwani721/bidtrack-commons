
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ImageUploader from "@/components/shared/ImageUploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ImageUploadDemo = () => {
  const [uploadedImageInfo, setUploadedImageInfo] = useState<{publicId: string, url: string} | null>(null);
  
  const handleImageUploaded = (publicId: string, url: string) => {
    console.log("Image uploaded:", { publicId, url });
    setUploadedImageInfo({ publicId, url });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 container">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Image Upload Demo</CardTitle>
              <CardDescription>
                Upload an image to Cloudinary and see the result
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUploader onImageUploaded={handleImageUploaded} />
              
              {uploadedImageInfo && (
                <div className="mt-6 p-4 bg-muted/30 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Upload Information</h3>
                  <p><strong>Public ID:</strong> {uploadedImageInfo.publicId}</p>
                  <p className="mt-1"><strong>URL:</strong> <span className="text-sm break-all">{uploadedImageInfo.url}</span></p>
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
