
import { Loader2 } from "lucide-react";
import { useImageGallery } from "./useImageGallery";
import GalleryToolbar from "./GalleryToolbar";
import EmptyGalleryState from "./EmptyGalleryState";
import SearchResult from "./SearchResult";
import GridView from "./GridView";
import ProductView from "./ProductView";

const GalleryMain = () => {
  const {
    loading,
    images,
    searchTerm,
    setSearchTerm,
    productView,
    setProductView,
    handleRefresh,
    filteredImages,
    imagesByProduct,
    openImageInNewTab,
    navigateToProduct,
    cloudinaryImagesCount
  } = useImageGallery();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading images...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GalleryToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onRefresh={handleRefresh}
        productView={productView}
        setProductView={setProductView}
      />
      
      {images.length === 0 ? (
        <EmptyGalleryState onRefresh={handleRefresh} />
      ) : filteredImages.length === 0 ? (
        <SearchResult 
          noResults={true} 
          cloudinaryImagesCount={cloudinaryImagesCount} 
        />
      ) : productView ? (
        <ProductView 
          imagesByProduct={imagesByProduct}
          onImageClick={openImageInNewTab}
          onProductClick={navigateToProduct}
        />
      ) : (
        <GridView 
          images={filteredImages}
          onImageClick={openImageInNewTab}
          onProductClick={navigateToProduct}
        />
      )}
    </div>
  );
};

export default GalleryMain;
