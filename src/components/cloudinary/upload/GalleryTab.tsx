
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageGallery from "@/components/cloudinary/ImageGallery";

interface GalleryTabProps {
  galleryRefreshTrigger: number;
}

const GalleryTab = ({ galleryRefreshTrigger }: GalleryTabProps) => {
  return (
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
  );
};

export default GalleryTab;
