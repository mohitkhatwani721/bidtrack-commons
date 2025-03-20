
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [mounted, setMounted] = useState(false);

  // Get unique zones
  const zones = ["all", ...new Set(products.map(product => product.zone))];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.modelCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.zone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply zone filter
    if (selectedZone !== "all") {
      result = result.filter(product => product.zone === selectedZone);
    }
    
    // Apply sorting
    if (sortBy === "price-asc") {
      result = result.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    } else if (sortBy === "price-desc") {
      result = result.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    } else if (sortBy === "name-asc") {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name-desc") {
      result = result.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    setFilteredProducts(result);
  }, [searchTerm, selectedZone, sortBy, products]);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedZone} onValueChange={setSelectedZone}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by zone" />
          </SelectTrigger>
          <SelectContent>
            {zones.map(zone => (
              <SelectItem key={zone} value={zone}>
                {zone === "all" ? "All Zones" : zone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="price-asc">Price (Low to High)</SelectItem>
            <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            <SelectItem value="name-asc">Name (A to Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z to A)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProductGrid;
