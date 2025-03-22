
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuctionTimer from "@/components/ui/AuctionTimer";
import BidForm from "@/components/bid/BidForm";
import { Product } from "@/lib/types";
import { getAuctionSettings } from "@/lib/supabase";
import { AlertCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductBidSectionProps {
  product: Product;
}

const ProductBidSection = ({ product }: ProductBidSectionProps) => {
  return (
    <>
      <div className="py-4">
        <AuctionTimer />
      </div>
      
      <BidForm productId={product.id} startingPrice={product.pricePerUnit} />
      
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link to="/bids" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            View All Your Bids
          </Link>
        </Button>
      </div>
    </>
  );
};

export default ProductBidSection;
