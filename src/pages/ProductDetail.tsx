
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetailComponent from "@/components/product/ProductDetail";

const ProductDetail = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <ProductDetailComponent />
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
