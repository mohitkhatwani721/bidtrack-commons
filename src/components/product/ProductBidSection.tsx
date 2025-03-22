
import { useState, useEffect } from "react";
import AuctionTimer from "@/components/ui/AuctionTimer";
import BidForm from "@/components/bid/BidForm";
import { Product } from "@/lib/types";
import { getAuctionSettings } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";

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
    </>
  );
};

export default ProductBidSection;
