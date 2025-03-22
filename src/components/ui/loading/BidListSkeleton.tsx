
import { Skeleton } from "@/components/ui/skeleton";

interface BidListSkeletonProps {
  count?: number;
}

const BidListSkeleton = ({ count = 3 }: BidListSkeletonProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
      
      <div className="space-y-3">
        {Array(count).fill(0).map((_, index) => (
          <div key={index} className="p-3 border rounded-md">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidListSkeleton;
