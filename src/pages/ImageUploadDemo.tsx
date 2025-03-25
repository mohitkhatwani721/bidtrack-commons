
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageGalleryTabs, ImageGalleryTabsList, ImageGalleryTabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Images, Upload } from "lucide-react";
import UploadTab from "@/components/cloudinary/upload/UploadTab";
import GalleryTab from "@/components/cloudinary/upload/GalleryTab";

const ImageUploadDemo = () => {
  const [uploadedImageInfo, setUploadedImageInfo] = useState<{publicId: string, url: string} | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [galleryRefreshTrigger, setGalleryRefreshTrigger] = useState(0);
  
  const handleImageUploaded = (publicId: string, url: string) => {
    console.log("Image upload successful:", { publicId, url });
    setUploadedImageInfo({ publicId, url });
    
    setGalleryRefreshTrigger(prev => prev + 1);
    setTimeout(() => {
      setActiveTab("gallery");
    }, 1500);
  };

  const handleViewInGallery = () => {
    setActiveTab("gallery");
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
                <strong>Important:</strong> Make sure your upload preset is 
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
              <UploadTab 
                onImageUploaded={handleImageUploaded}
                uploadedImageInfo={uploadedImageInfo}
                onViewInGallery={handleViewInGallery}
              />
            </TabsContent>
            
            <TabsContent value="gallery" className="pt-4">
              <GalleryTab galleryRefreshTrigger={galleryRefreshTrigger} />
            </TabsContent>
          </ImageGalleryTabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ImageUploadDemo;
