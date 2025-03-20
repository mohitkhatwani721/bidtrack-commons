
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { useBidForm } from "@/hooks/useBidForm";

interface BidFormProps {
  productId: string;
  startingPrice: number;
}

const BidForm = ({ productId, startingPrice }: BidFormProps) => {
  const {
    email,
    setEmail,
    amount,
    setAmount,
    isSubmitting,
    minBidAmount,
    handleSubmit
  } = useBidForm({ productId, startingPrice });
  
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
