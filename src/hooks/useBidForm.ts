
import { useState, useEffect } from "react";
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
  
  // Load current user email
  useEffect(() => {
    const loadCurrentUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setEmail(user.email);
      }
    };
    
    loadCurrentUser();
  }, []);
  
  // Get the highest bid when the component mounts
  useEffect(() => {
    const fetchHighestBid = async () => {
      const highestBid = await getHighestBidForProduct(productId);
      if (highestBid) {
        // Set minimum bid amount to highest bid amount + 10% or starting price, whichever is higher
        const minimumIncrease = highestBid.amount * 0.01; // 1% increase
        const newMinBid = Math.max(highestBid.amount + minimumIncrease, startingPrice);
        setMinBidAmount(newMinBid);
        setAmount(newMinBid.toString());
      } else {
        setMinBidAmount(startingPrice);
        setAmount(startingPrice.toString());
      }
    };
    
    fetchHighestBid();
  }, [productId, startingPrice]);
  
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
    const currentUser = await getCurrentUser();
    const userEmail = currentUser ? currentUser.email : email;
    
    try {
      // Place bid using Supabase
      const bid = await placeBidToSupabase({
        productId,
        userEmail,
        amount: bidAmount
      });
      
      if (bid) {
        toast.success("Your bid has been placed successfully!");
        
        // Refresh minimum bid after successful bid
        const newMinBid = bidAmount * 1.01; // 1% increase
        setMinBidAmount(newMinBid);
        setAmount(newMinBid.toString());
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      toast.error("Failed to place bid. Please try again.");
    } finally {
      setIsSubmitting(false);
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
