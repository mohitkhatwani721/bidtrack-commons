
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import AccountForm from "@/components/auth/AccountForm";
import AdminLogin from "./AdminLogin";

interface BidLoginPromptProps {
  onAdminLogin: (isAdmin: boolean) => void;
  onAuthSuccess: () => void;
}

const BidLoginPrompt = ({ onAdminLogin, onAuthSuccess }: BidLoginPromptProps) => {
  const [showAuthForm, setShowAuthForm] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuthForm(false);
    onAuthSuccess();
  };

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
              <Button 
                onClick={() => setShowAuthForm(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Login to View Bids
              </Button>
            </div>
            
            <AdminLogin onLogin={onAdminLogin} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BidLoginPrompt;
