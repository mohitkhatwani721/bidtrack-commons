
import { toast } from "sonner";
import { supabase } from "./client";
import type { Product } from "@/lib/types";
import { 
  getRelevantPlaceholder, 
  getCloudinaryUrl, 
  isCloudinaryUrl, 
  convertToCloudinary,
  optimizeImageUrl
} from "@/utils/imageUtils";

// Image optimization cache
const productCache: Record<string, {data: Product, timestamp: number}> = {};
let productListCache: {data: Product[], timestamp: number} | null = null;
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache

// Get all products from Supabase with caching
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const now = Date.now();
    
    // Check cache first
    if (productListCache && now - productListCache.timestamp < CACHE_EXPIRY) {
      console.log("Using cached product list");
      return productListCache.data;
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) {
      throw error;
    }
    
    const products = data.map(item => {
      // Use product image or Cloudinary fallback
      let imageUrl = item.image_url;
      
      // Use placeholder if no image
      if (!imageUrl) {
        imageUrl = getRelevantPlaceholder(item.name);
      } 
      // Convert non-Cloudinary images to Cloudinary for optimization
      else if (!isCloudinaryUrl(imageUrl)) {
        imageUrl = convertToCloudinary(imageUrl, {
          width: 600,
          height: 600,
          quality: 80
        });
        console.log(`Product ${item.name} optimized with Cloudinary: ${imageUrl}`);
      }
      
      return {
        id: item.id,
        name: item.name,
        modelCode: item.model_code || '',
        pricePerUnit: item.starting_price,
        totalPrice: item.starting_price, // Default to starting price
        quantity: 1, // Default quantity
        imageUrl,
        description: item.description || '',
        zone: 'Zone 1' // Default zone since we don't have this in the DB yet
      };
    });
    
    // Update cache
    productListCache = {
      data: products,
      timestamp: now
    };
    
    return products;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    toast.error("Failed to load products");
    return [];
  }
};

// Get a single product by ID with caching
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    console.log("Fetching product with ID:", id);
    
    const now = Date.now();
    
    // Check cache first
    if (productCache[id] && now - productCache[id].timestamp < CACHE_EXPIRY) {
      console.log("Using cached product data for:", id);
      return productCache[id].data;
    }
    
    // First try to fetch from Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    if (!data) {
      console.log("No product found in Supabase with ID:", id);
      return null;
    }
    
    console.log("Raw product data from Supabase:", data);
    
    // Get image URL or fallback to Cloudinary
    let imageUrl = data.image_url;
    console.log("Original image URL:", imageUrl);
    
    // Use placeholder if no image or as fallback
    if (!imageUrl) {
      imageUrl = getRelevantPlaceholder(data.name);
      console.log("Using placeholder image:", imageUrl);
    } 
    // Optimize external images with Cloudinary - with high quality for product detail
    else if (!isCloudinaryUrl(imageUrl)) {
      imageUrl = convertToCloudinary(imageUrl, {
        width: 800,
        height: 800,
        quality: 90
      });
      console.log("Using Cloudinary optimized image:", imageUrl);
    }
    // If already a Cloudinary URL, ensure it's using high quality settings for product detail
    else {
      imageUrl = optimizeImageUrl(imageUrl, true);
    }
    
    const product = {
      id: data.id,
      name: data.name,
      modelCode: data.model_code || '',
      pricePerUnit: data.starting_price,
      totalPrice: data.starting_price, // Default to starting price
      quantity: 1, // Default quantity
      imageUrl,
      description: data.description || '',
      zone: 'Zone 1' // Default zone since we don't have this in the DB yet
    };
    
    // Update cache
    productCache[id] = {
      data: product,
      timestamp: now
    };
    
    console.log("Processed product object:", product);
    return product;
  } catch (error: any) {
    console.error("Error fetching product:", error);
    toast.error("Failed to load product details");
    return null;
  }
};

/**
 * Updates a product's image URL in the database
 */
export const updateProductImage = async (productId: string, imageUrl: string): Promise<boolean> => {
  try {
    console.log(`Updating product ${productId} with image URL: ${imageUrl}`);
    
    // Clear caches when updating an image
    delete productCache[productId];
    productListCache = null;
    
    const { data, error } = await supabase
      .from('products')
      .update({ image_url: imageUrl })
      .eq('id', productId);
    
    if (error) {
      console.error("Error updating product image:", error);
      toast.error("Failed to associate image with product");
      return false;
    }
    
    console.log("Product image updated successfully:", data);
    return true;
  } catch (error) {
    console.error("Error updating product image:", error);
    toast.error("Failed to associate image with product");
    return false;
  }
};
