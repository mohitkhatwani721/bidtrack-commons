
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bid } from "@/lib/types";
import { bids } from "@/lib/data";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import AccountForm from "@/components/auth/AccountForm";

interface BidHistoryProps {
  productId: string;
}

const BidHistory = ({ productId }: BidHistoryProps) => {
  const [productBids, setProductBids] = useState<Bid[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [showAuthForm, setShowAuthForm] = useState(false);
  
  const currentUser = getCurrentUser();
  
  // Update bids when they change or when user/admin status changes
  useEffect(() => {
    // Get bids for this product and sort by timestamp (newest first)
    const filteredBids = bids
      .filter(bid => {
        // For admin, show all bids for this product
        if (isAdmin) {
          return bid.productId === productId;
        }
        // For user, only show their own bids for this product
        return bid.productId === productId && (currentUser ? bid.userEmail === currentUser.email : false);
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setProductBids(filteredBids);
  }, [productId, bids, isAdmin, currentUser]);
  
  // Admin verification
  const verifyAdmin = () => {
    setIsVerifying(true);
    setError("");
    
    // Simple admin password check (in a real app, this would be handled by a server)
    setTimeout(() => {
      if (adminPassword === "admin123") {
        setIsAdmin(true);
        setError("");
      } else {
        setIsAdmin(false);
        setError("Invalid password");
      }
      setIsVerifying(false);
    }, 1000);
  };
  
  const handleAuthSuccess = () => {
    setShowAuthForm(false);
  };
  
  if (!currentUser && !isAdmin) {
    return (
      <div className="space-y-4">
        {showAuthForm ? (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">Login to View Bid History</h3>
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
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Bid History Access
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Please log in to view your bid history for this product.
                </p>
                <Button onClick={() => setShowAuthForm(true)}>
                  Login to View Bids
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">
                  Admin access (to view all bids):
                </p>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                  <Button 
                    onClick={verifyAdmin}
                    disabled={isVerifying}
                  >
                    {isVerifying ? "Verifying..." : "Login"}
                  </Button>
                </div>
              </div>
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  if (productBids.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {isAdmin
            ? "No bids have been placed yet for this product."
            : "You haven't placed any bids on this product yet."}
        </p>
        {isAdmin && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setIsAdmin(false);
              setAdminPassword("");
            }}
            className="mt-4"
          >
            Logout from Admin
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {isAdmin 
            ? `${productBids.length} ${productBids.length === 1 ? 'bid' : 'bids'} placed (Admin View)`
            : `Your ${productBids.length} ${productBids.length === 1 ? 'bid' : 'bids'} for this product`}
        </p>
        
        {isAdmin && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setIsAdmin(false);
              setAdminPassword("");
            }}
          >
            Logout
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {productBids.map((bid, index) => (
          <motion.div
            key={bid.id}
            className="bg-white rounded-lg border p-3 flex justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 * index }}
          >
            <div>
              <p className="font-medium">AED {bid.amount.toLocaleString()}</p>
              {isAdmin ? (
                <p className="text-xs text-gray-500">
                  {bid.userEmail}
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  {bid.userEmail.substring(0, 3)}***{bid.userEmail.split('@')[0].substring(bid.userEmail.split('@')[0].length - 2)}@{bid.userEmail.split('@')[1]}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
              </p>
              {index === 0 && productBids.length > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                  Highest bid
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BidHistory;
