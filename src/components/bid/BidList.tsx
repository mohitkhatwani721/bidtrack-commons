
import { Button } from "@/components/ui/button";
import { Bid } from "@/lib/types";
import BidItem from "./BidItem";

interface BidListProps {
  bids: Bid[];
  isAdmin: boolean;
  onLogout: () => void;
}

const BidList = ({ bids, isAdmin, onLogout }: BidListProps) => {
  if (bids.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {isAdmin
            ? "No bids have been placed yet for this product."
            : "You haven't placed any bids on this product yet."}
        </p>
        {isAdmin && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="mt-4"
          >
            Logout from Admin
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {isAdmin 
            ? `${bids.length} ${bids.length === 1 ? 'bid' : 'bids'} placed (Admin View)`
            : `Your ${bids.length} ${bids.length === 1 ? 'bid' : 'bids'} for this product`}
        </p>
        
        {isAdmin && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
          >
            Logout
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {bids.map((bid, index) => (
          <BidItem 
            key={bid.id}
            bid={bid}
            index={index}
            isAdmin={isAdmin}
            isHighestBid={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default BidList;
