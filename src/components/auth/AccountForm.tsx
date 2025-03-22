
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { register, login } from "@/lib/auth";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface AccountFormProps {
  onSuccess?: () => void;
}

const AccountForm = ({ onSuccess }: AccountFormProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      // Clear any existing user data before login
      localStorage.removeItem("currentUser");
      
      const user = await login(loginEmail, loginPassword);
      
      if (user && onSuccess) {
        onSuccess();
      }
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    
    // Validate password strength
    if (registerPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setIsRegistering(false);
      return;
    }
    
    try {
      // Clear any existing user data before register
      localStorage.removeItem("currentUser");
      
      const user = await register(registerEmail, registerName, registerPassword);
      
      if (user) {
        // Switch to login tab after successful registration
        setActiveTab("login");
        setLoginEmail(registerEmail);
        toast.info("Registration successful! Now you can login with your credentials.");
      }
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <motion.div
      className="bg-white rounded-lg border p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="your.email@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <span className="flex items-center">
                  Logging in
                  <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <Alert className="mb-4 bg-blue-50 text-blue-700 border-blue-100">
            <Info className="h-4 w-4" />
            <AlertDescription>
              After registering, you'll be able to login immediately with your new credentials.
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="register-name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="register-name"
                type="text"
                placeholder="John Doe"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="register-email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="register-email"
                type="email"
                placeholder="your.email@example.com"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="register-password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white" 
              disabled={isRegistering}
            >
              {isRegistering ? (
                <span className="flex items-center">
                  Creating account
                  <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AccountForm;
