
import { useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import UserBids from "./pages/UserBids";
import Admin from "./pages/Admin";
import ImageUploadDemo from "./pages/ImageUploadDemo";
import { Toaster } from "./components/ui/sonner";
import { initializeTables } from "./lib/supabase";

function App() {
  useEffect(() => {
    // Initialize all necessary tables when the app starts
    initializeTables();
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
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
