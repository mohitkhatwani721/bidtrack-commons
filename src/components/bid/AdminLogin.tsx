
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminLoginProps {
  onLogin: (isAdmin: boolean) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [adminPassword, setAdminPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const verifyAdmin = () => {
    setIsVerifying(true);
    setError("");
    
    // Simple admin password check (in a real app, this would be handled by a server)
    setTimeout(() => {
      if (adminPassword === "admin123") {
        onLogin(true);
        setError("");
      } else {
        onLogin(false);
        setError("Invalid password");
      }
      setIsVerifying(false);
    }, 1000);
  };

  return (
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
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default AdminLogin;
