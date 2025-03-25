
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/lib/supabase/products";
import { Loader2 } from "lucide-react";

interface ProductSelectorProps {
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
}

const ProductSelector = ({ selectedProductId, setSelectedProductId }: ProductSelectorProps) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });

  return (
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
  );
};

export default ProductSelector;
