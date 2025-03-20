
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock } from "lucide-react";
import { useBidForm } from "@/hooks/useBidForm";
import { getCurrentUser } from "@/lib/auth";
import AccountForm from "@/components/auth/AccountForm";

interface BidFormProps {
  productId: string;
  startingPrice: number;
}

const BidForm = ({ productId, startingPrice }: BidFormProps) => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const currentUser = getCurrentUser();
  
  const {
    email,
    setEmail,
    amount,
    setAmount,
    isSubmitting,
    minBidAmount,
    handleSubmit
  } = useBidForm({ 
    productId, 
    startingPrice, 
    initialEmail: currentUser?.email || "" 
  });
  
  const handleAuthSuccess = () => {
    setShowAuthForm(false);
    const user = getCurrentUser();
    if (user) {
      setEmail(user.email);
    }
  };
  
  const handleBidClick = (e: React.FormEvent) => {
    if (!currentUser) {
      e.preventDefault();
      setShowAuthForm(true);
      return;
    }
    
    handleSubmit(e);
  };
  
  if (showAuthForm) {
    return (
      <motion.div
        className="bg-white rounded-lg border p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-medium mb-4">Login or Create Account to Place Bid</h3>
        <AccountForm onSuccess={handleAuthSuccess} />
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAuthForm(false)}
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className="bg-white rounded-lg border p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-medium mb-4">Place Your Bid</h3>
      
      <form onSubmit={handleBidClick} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly={!!currentUser}
            className={currentUser ? "bg-gray-100" : ""}
          />
          {currentUser && (
            <p className="text-xs text-gray-500 mt-1">
              Logged in as {currentUser.name}
            </p>
          )}
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
          className="w-full font-bold text-base py-6 bg-blue-500 hover:bg-blue-600 text-white" 
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              Processing
              <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </span>
          ) : (
            <span className="flex items-center justify-center">
              {!currentUser && <Lock className="mr-2 h-4 w-4" />}
              Place Bid
              <ArrowRight className="ml-2 h-5 w-5" />
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
