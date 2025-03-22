
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The page at <span className="font-mono bg-gray-200 px-2 py-1 rounded">{location.pathname}</span> couldn't be found.
        </p>
        <Button asChild>
          <Link to="/" className="text-white">
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
