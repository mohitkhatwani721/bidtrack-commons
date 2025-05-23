
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
      
      // Add a navigation error handler
      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
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
        
        {/* Handle common redirect cases */}
        <Route path="/product/:id" element={<ProductRedirect />} />
        <Route path="/my-bids" element={<Navigate to="/bids" replace />} />
        
        {/* Dedicated 404 route that renders the NotFound component */}
        <Route path="/404" element={<NotFound />} />
        
        {/* Catch all other routes and redirect to products instead of 404 */}
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
