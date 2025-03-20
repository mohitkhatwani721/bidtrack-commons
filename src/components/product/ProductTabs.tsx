
import { useState } from "react";
import BidHistory from "@/components/bid/BidHistory";
import ProductDetailsTab from "./ProductDetailsTab";
import { Product } from "@/lib/types";

interface ProductTabsProps {
  product: Product;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<"details" | "bids">("details");
  
  return (
    <div className="mt-8">
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "details" 
              ? "text-gray-900 border-b-2 border-gray-900" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "bids" 
              ? "text-gray-900 border-b-2 border-gray-900" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("bids")}
        >
          Bid History
        </button>
      </div>
      
      <div className="py-4">
        {activeTab === "details" ? (
          <ProductDetailsTab product={product} />
        ) : (
          <BidHistory productId={product.id} />
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
