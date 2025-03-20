
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { placeBid, getHighestBidForProduct } from "@/lib/data";
import { ArrowRight } from "lucide-react";

interface BidFormProps {
  productId: string;
  startingPrice: number;
}

const BidForm = ({ productId, startingPrice }: BidFormProps) => {
  const [email, setEmail] = useState("");
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
  
  return (
    <motion.div
      className="bg-white rounded-lg border p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-medium mb-4">Place Your Bid</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="amount">Bid Amount (AED)</Label>
          <Input
            id="amount"
            type="number"
            min={minBidAmount}
            step="0.01"
            placeholder={`Minimum bid: AED ${minBidAmount.toLocaleString()}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum bid: AED {minBidAmount.toLocaleString()}
          </p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              Processing
              <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </span>
          ) : (
            <span className="flex items-center">
              Place Bid
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </form>
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500">
          By placing a bid, you agree to our terms and conditions. The highest bid at the end of the auction will win.
        </p>
      </div>
    </motion.div>
  );
};

export default BidForm;
