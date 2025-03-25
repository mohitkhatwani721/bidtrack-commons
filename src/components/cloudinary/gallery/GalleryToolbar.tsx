
import { Search, RefreshCw, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GalleryToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRefresh: () => void;
  productView: boolean;
  setProductView: (view: boolean) => void;
}

const GalleryToolbar = ({
  searchTerm,
  setSearchTerm,
  onRefresh,
  productView,
  setProductView
}: GalleryToolbarProps) => {
  return (
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
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          className="mr-2"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
        
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
  );
};

export default GalleryToolbar;
