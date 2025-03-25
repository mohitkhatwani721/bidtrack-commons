
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2, ExternalLink, LinkIcon, ShoppingBag, Search, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getProductById } from "@/lib/supabase/products";
import { CLOUDINARY_CLOUD_NAME } from "@/lib/cloudinary/client";

interface CloudinaryImage {
  id: string;
  publicId: string;
  url: string;
  createdAt: string;
  productId?: string;
  product?: {
    name: string;
    id: string;
  };
}

const ImageGallery = () => {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [productView, setProductView] = useState(false);

  // Fetch images that have been uploaded
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        
        // This is a simplified approach - in a real app, you would have a table in your database
        // to store the Cloudinary images with their product associations
        // For this demo, we'll extract product images from the products table
        
        const { data: products, error } = await supabase
          .from('products')
          .select('id, name, image_url')
          .not('image_url', 'is', null)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching products with images:", error);
          return;
        }
        
        // Process the results
        const cloudinaryImages: CloudinaryImage[] = [];
        
        for (const product of products) {
          if (product.image_url && product.image_url.includes('cloudinary.com')) {
            // Extract public ID from Cloudinary URL
            const urlParts = product.image_url.split('/');
            const publicIdWithTransformations = urlParts.slice(urlParts.indexOf('upload') + 1).join('/');
            
            // Clean up the public ID by removing any transformations
            const publicId = publicIdWithTransformations.replace(/^v\d+\//, '');
            
            // Generate a direct URL without transformations
            const directUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v1/${publicId}`;
            
            cloudinaryImages.push({
              id: `img_${product.id}`,
              publicId,
              url: directUrl,
              createdAt: new Date().toISOString(), // We don't have the actual upload date
              productId: product.id,
              product: {
                name: product.name,
                id: product.id
              }
            });
          }
        }
        
        setImages(cloudinaryImages);
      } catch (error) {
        console.error("Error processing images:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, []);
  
  // Filter images based on search term
  const filteredImages = images.filter(image => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      image.publicId.toLowerCase().includes(searchLower) ||
      image.product?.name.toLowerCase().includes(searchLower) ||
      image.productId?.toLowerCase().includes(searchLower)
    );
  });
  
  // Group images by product for product view
  const imagesByProduct = filteredImages.reduce((acc, image) => {
    const productId = image.productId || 'unassociated';
    if (!acc[productId]) {
      acc[productId] = {
        productId,
        productName: image.product?.name || 'Unassociated Images',
        images: []
      };
    }
    acc[productId].images.push(image);
    return acc;
  }, {} as Record<string, { productId: string, productName: string, images: CloudinaryImage[] }>);
  
  // Handle opening image in new tab
  const openImageInNewTab = (url: string) => {
    window.open(url, '_blank');
  };
  
  // Handle navigating to product detail
  const navigateToProduct = (productId: string) => {
    window.open(`/products/${productId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading images...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <Alert className="bg-blue-50 border-blue-200 text-blue-800 my-8">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          <p className="font-medium">No Cloudinary images found</p>
          <p className="text-sm mt-1">Upload some images using the upload tab to see them here.</p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, ID or product..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 self-end">
          <Button
            variant={!productView ? "default" : "outline"}
            size="sm"
            onClick={() => setProductView(false)}
          >
            Grid View
          </Button>
          <Button
            variant={productView ? "default" : "outline"}
            size="sm"
            onClick={() => setProductView(true)}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Group by Product
          </Button>
        </div>
      </div>
      
      {filteredImages.length === 0 ? (
        <Alert className="bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            No images found matching your search criteria.
          </AlertDescription>
        </Alert>
      ) : productView ? (
        // Product view grouping
        <div className="space-y-10">
          {Object.values(imagesByProduct).map((group) => (
            <div key={group.productId} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  {group.productId !== 'unassociated' && <ShoppingBag className="h-4 w-4 mr-2 text-primary" />}
                  {group.productName}
                  <Badge className="ml-2" variant="outline">{group.images.length}</Badge>
                </h3>
                {group.productId !== 'unassociated' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigateToProduct(group.productId)}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    View Product
                  </Button>
                )}
              </div>
              <Separator />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {group.images.map((image) => (
                  <Card 
                    key={image.id} 
                    className="overflow-hidden hover:shadow-md transition-shadow"
                    onClick={() => openImageInNewTab(image.url)}
                  >
                    <div className="aspect-square relative">
                      <img 
                        src={image.url} 
                        alt={`Cloudinary image ${image.publicId}`}
                        className="object-cover w-full h-full hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <CardContent className="p-2">
                      <div className="text-xs font-mono truncate">{image.publicId}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Grid view
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div 
                className="aspect-square relative cursor-pointer"
                onClick={() => openImageInNewTab(image.url)}
              >
                <img 
                  src={image.url} 
                  alt={`Cloudinary image ${image.publicId}`}
                  className="object-cover w-full h-full hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                {image.product && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2">
                    <div className="text-xs truncate">{image.product.name}</div>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <div className="text-xs font-mono truncate mb-2">{image.publicId}</div>
                {image.productId && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full h-7 text-xs"
                    onClick={() => navigateToProduct(image.productId!)}
                  >
                    <LinkIcon className="h-3 w-3 mr-1" />
                    View Product
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
