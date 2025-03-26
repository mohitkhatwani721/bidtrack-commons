
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProductErrorStateProps {
  error: string | null;
}

const ProductErrorState = ({ error }: ProductErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold mb-4">{error || "Product Not Found"}</h2>
      <p className="text-gray-600 mb-8">
        {error || "The product you're looking for doesn't exist or has been removed."}
      </p>
      <Button onClick={() => navigate("/products")}>Browse Products</Button>
    </div>
  );
};

export default ProductErrorState;
