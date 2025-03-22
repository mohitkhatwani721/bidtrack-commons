
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Image gallery skeleton */}
      <div className="space-y-6">
        <Skeleton className="aspect-square rounded-lg w-full" />
        
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-md w-full" />
          ))}
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 py-4 border-y">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="rounded-lg h-64 w-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
