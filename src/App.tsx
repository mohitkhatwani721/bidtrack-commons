
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import UserBids from "@/pages/UserBids";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import ImageUploadDemo from "@/pages/ImageUploadDemo";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/user-bids" element={<UserBids />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/upload" element={<ImageUploadDemo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <SonnerToaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
