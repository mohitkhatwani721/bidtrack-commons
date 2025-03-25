
import { AlertCircle, AlertTriangle, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SearchResultProps {
  noResults: boolean;
  cloudinaryImagesCount?: number;
}

const SearchResult = ({ noResults, cloudinaryImagesCount = 0 }: SearchResultProps) => {
  if (!noResults) return null;
  
  return (
    <Alert className="bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 font-medium">No Cloudinary images found</AlertTitle>
      <AlertDescription className="text-amber-700">
        <p>Upload some images using the upload tab to see them here. Make sure your images include "cloudinary.com" in their URLs.</p>
        
        {cloudinaryImagesCount === 0 && (
          <div className="mt-2 text-sm bg-amber-100 p-2 rounded border border-amber-200">
            <p className="flex items-center">
              <InfoIcon className="h-4 w-4 mr-1 text-amber-700" /> 
              If you've already uploaded images but don't see them here, check that:
            </p>
            <ul className="list-disc ml-6 mt-1 space-y-1">
              <li>The Cloudinary upload was successful</li>
              <li>The product was updated with the Cloudinary URL</li>
              <li>The URL includes "cloudinary.com" or "res.cloudinary.com"</li>
            </ul>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default SearchResult;
