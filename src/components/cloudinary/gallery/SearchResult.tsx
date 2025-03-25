
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SearchResultProps {
  noResults: boolean;
}

const SearchResult = ({ noResults }: SearchResultProps) => {
  if (!noResults) return null;
  
  return (
    <Alert className="bg-amber-50 border-amber-200 text-amber-800">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-700">
        No images found matching your search criteria.
      </AlertDescription>
    </Alert>
  );
};

export default SearchResult;
