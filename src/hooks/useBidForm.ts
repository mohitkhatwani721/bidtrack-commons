
import { useState } from "react";
import { toast } from "sonner";
import { getHighestBidForProduct, placeBidToSupabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

interface UseBidFormProps {
  productId: string;
  startingPrice: number;
  initialEmail?: string;
}

export function useBidForm({ productId, startingPrice, initialEmail = "" }: UseBidFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [amount, setAmount] = useState(startingPrice.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minBidAmount, setMinBidAmount] = useState(startingPrice);
  
  // Get the highest bid when the component mounts
  useState(() => {
    const fetchHighestBid = async () => {
      const highestBid = await getHighestBidForProduct(productId);
      if (highestBid) {
        setMinBidAmount(highestBid.amount > startingPrice ? highestBid.amount : startingPrice);
      }
    };
    
    fetchHighestBid();
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    setIsSubmitting(true);
    
    // Get current user or use email from form
    const currentUser = getCurrentUser();
    const userEmail = currentUser ? currentUser.email : email;
    
    // Place bid using Supabase
    const bid = await placeBidToSupabase(productId, userEmail, bidAmount);
    
    setIsSubmitting(false);
    
    if (bid) {
      toast.success("Your bid has been placed successfully!");
      setAmount(bidAmount.toString());
    }
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
