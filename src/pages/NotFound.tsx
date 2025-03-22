
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Log to help with debugging
    console.log("Current route that caused 404:", location);
  }, [location]);

  // Check if the path looks like a product details page with wrong format
  const isLikelyProductPage = location.pathname.includes('/product/');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        
        <p className="text-gray-500 mb-6">
          The page at <span className="font-mono bg-gray-200 px-2 py-1 rounded text-sm">{location.pathname}</span> couldn't be found.
        </p>
        
        {isLikelyProductPage && (
          <div className="mb-6 p-4 bg-blue-50 rounded-md text-left">
            <p className="text-blue-700 mb-2 font-medium">Looking for a product?</p>
            <p className="text-blue-600 text-sm mb-4">
              It looks like you might be trying to access a product page. Try visiting our products page instead.
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate('/products')}>
              <Search className="mr-2 h-4 w-4" />
              Browse Products
            </Button>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          
          <Button asChild>
            <Link to="/" className="text-white">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
