
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="mb-6"
      onClick={() => navigate("/products")}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to products
    </Button>
  );
};

export default BackButton;
