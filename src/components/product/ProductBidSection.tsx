
import AuctionTimer from "@/components/ui/AuctionTimer";
import BidForm from "@/components/bid/BidForm";
import { isAuctionActive } from "@/lib/data";
import { Product } from "@/lib/types";

interface ProductBidSectionProps {
  product: Product;
}

const ProductBidSection = ({ product }: ProductBidSectionProps) => {
  return (
    <>
      <div className="py-4">
        <AuctionTimer />
      </div>
      
      {isAuctionActive() ? (
        <BidForm productId={product.id} startingPrice={product.pricePerUnit} />
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-gray-600">
            The auction is not currently active. Please check back during the auction period.
          </p>
        </div>
      )}
    </>
  );
};

export default ProductBidSection;
