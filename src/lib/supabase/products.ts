
import { toast } from "sonner";
import { supabase } from "./client";
import type { Product } from "@/lib/types";
import { getRelevantPlaceholder } from "@/utils/imageUtils";

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
      // Get a proper image URL, using the placeholder if needed
      const imageUrl = item.image_url || getRelevantPlaceholder(item.name);
      
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
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Get a proper image URL, using the placeholder if needed
    const imageUrl = data.image_url || getRelevantPlaceholder(data.name);
    
    return {
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
  } catch (error: any) {
    console.error("Error fetching product:", error);
    toast.error("Failed to load product details");
    return null;
  }
};
