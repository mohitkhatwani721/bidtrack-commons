
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import ProductHeader from "../ProductHeader";
import ProductStats from "../ProductStats";
import ProductBidSection from "../ProductBidSection";
import ProductTabs from "../ProductTabs";

interface ProductContentProps {
  product: Product;
}

const ProductContent = ({ product }: ProductContentProps) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <ProductHeader product={product} />
      <ProductStats product={product} />
      <ProductBidSection product={product} />
      <ProductTabs product={product} />
    </motion.div>
  );
};

export default ProductContent;
