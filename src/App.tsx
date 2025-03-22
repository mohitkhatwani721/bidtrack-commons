
import { useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import UserBids from "./pages/UserBids";
import Admin from "./pages/Admin";
import ImageUploadDemo from "./pages/ImageUploadDemo";
import { Toaster } from "./components/ui/sonner";
import { initializeTables } from "./lib/supabase";

// Create a wrapper component for handling redirects with parameters
const ProductRedirect = () => {
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  return <Navigate to={`/products/${id}`} replace />;
};

function App() {
  useEffect(() => {
    // Initialize all necessary tables when the app starts
    initializeTables();
    
    // Add a global error handler for navigation issues
    const handleErrors = () => {
      window.addEventListener('error', (event) => {
        console.error('Global error caught:', event.error);
      });
    };
    
    handleErrors();
    
    console.log('App initialized');
  }, []);

  return (
    <Router>
      <Toaster position="top-right" closeButton />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/bids" element={<UserBids />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/upload" element={<ImageUploadDemo />} />
        <Route path="/404" element={<NotFound />} />
        
        {/* Redirect /product/:id (wrong path) to /products/:id (correct path) using the wrapper component */}
        <Route path="/product/:id" element={<ProductRedirect />} />
        
        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
