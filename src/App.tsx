import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';

import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";
import UserBids from "./pages/UserBids";
import NotFound from "./pages/NotFound";
import ImageUploadDemo from "./pages/ImageUploadDemo";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user-bids" element={<UserBids />} />
          <Route path="/upload" element={<ImageUploadDemo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
