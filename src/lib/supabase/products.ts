
import { toast } from "sonner";
import { supabase } from "./client";
import type { Product } from "@/lib/types";
import { getRelevantPlaceholder, getCloudinaryUrl } from "@/utils/imageUtils";

// Get all products from Supabase
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) {
      throw error;
    }
    
    return data.map(item => {
      // Use product image or Cloudinary fallback
      let imageUrl = item.image_url;
      
      // Use placeholder if no image
      if (!imageUrl) {
        imageUrl = getRelevantPlaceholder(item.name);
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
  } catch (error: any) {
    console.error("Error fetching products:", error);
    toast.error("Failed to load products");
    return [];
  }
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    console.log("Fetching product with ID:", id);
    
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
    
    console.log("Processed product object:", product);
    return product;
  } catch (error: any) {
    console.error("Error fetching product:", error);
    toast.error("Failed to load product details");
    return null;
  }
};
