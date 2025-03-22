
import { toast } from "sonner";
import { supabase } from "./supabase";

// Simple types for user accounts
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// Get the current logged in user from Supabase
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }

  // Get user profile from profiles table if it exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email || '',
    name: profile?.name || user.email?.split('@')[0] || '',
    createdAt: new Date(user.created_at)
  };
};

// Check if a user exists with the given email
export const userExists = async (email: string): Promise<boolean> => {
  // This is just a check - in Supabase we can't actually check if a user exists
  // without sending an email, so we'll just return false
  return false;
};

// Register a new user
export const register = async (email: string, name: string, password: string): Promise<User | null> => {
  // Register the user with Supabase
  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });
  
  if (error) {
    toast.error(error.message);
    return null;
  }
  
  if (!user) {
    toast.error("Failed to create account");
    return null;
  }
  
  // Create a profile record
  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
    email: user.email,
    name
  });
  
  if (profileError) {
    console.error("Error creating profile:", profileError);
    // Continue anyway as this is not critical for auth
  }
  
  toast.success("Account created! You can now sign in with your credentials.");
  
  return {
    id: user.id,
    email: user.email || '',
    name,
    createdAt: new Date(user.created_at)
  };
};

// Log in a user
export const login = async (email: string, password: string): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    toast.error(error.message);
    return null;
  }
  
  if (!user) {
    toast.error("Invalid email or password");
    return null;
  }
  
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single();
    
  toast.success(`Welcome back, ${profile?.name || email.split('@')[0]}!`);
  
  return {
    id: user.id,
    email: user.email || '',
    name: profile?.name || email.split('@')[0] || '',
    createdAt: new Date(user.created_at)
  };
};

// Log out the current user
export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    toast.error(error.message);
    return;
  }
  
  toast.info("You have been logged out");
};

// Validate if an email belongs to a registered user
export const isValidUserEmail = async (email: string): Promise<boolean> => {
  // This is not directly possible with Supabase, so we'll just return true
  // and let the signup/signin process handle validation
  return true;
};
