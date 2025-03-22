
import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardSkeletonProps {
  featured?: boolean;
}

const ProductCardSkeleton = ({ featured = false }: ProductCardSkeletonProps) => {
  return (
    <div className="border rounded-lg overflow-hidden h-full">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-100">
        <Skeleton className="h-full w-full" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        
        <div className="pt-3 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
