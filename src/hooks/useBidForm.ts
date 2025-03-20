
import { useState } from "react";
import { toast } from "sonner";
import { placeBid, getHighestBidForProduct, hasUserAlreadyBid } from "@/lib/data";

interface UseBidFormProps {
  productId: string;
  startingPrice: number;
  initialEmail?: string;
}

export function useBidForm({ productId, startingPrice, initialEmail = "" }: UseBidFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [amount, setAmount] = useState(startingPrice.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const highestBid = getHighestBidForProduct(productId);
  const minBidAmount = highestBid ? highestBid.amount : startingPrice;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !amount) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Validate amount
    const bidAmount = parseFloat(amount);
    if (isNaN(bidAmount) || bidAmount < minBidAmount) {
      toast.error(`Bid amount must be at least AED ${minBidAmount.toLocaleString()}`);
      return;
    }
    
    // Check if user has already bid on this product
    if (hasUserAlreadyBid(productId, email)) {
      toast.error("You have already placed a bid on this product");
      return;
    }
    
    setIsSubmitting(true);
    
    // Place bid
    const bid = placeBid(productId, email, bidAmount);
    
    setTimeout(() => {
      setIsSubmitting(false);
      
      if (bid) {
        toast.success("Your bid has been placed successfully!");
        setAmount(bidAmount.toString());
      } else {
        toast.error("Failed to place bid. Please try again.");
      }
    }, 1000);
  };

  return {
    email,
    setEmail,
    amount,
    setAmount,
    isSubmitting,
    minBidAmount,
    handleSubmit
  };
}
