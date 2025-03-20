
import { toast } from "sonner";

// Simple types for user accounts
export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // In a real app, this would be hashed
  createdAt: Date;
}

// In-memory storage for user accounts (in a real app, this would be a database)
let users: User[] = [
  {
    id: "1",
    email: "mohit.khatwani@gmail.com",
    name: "Mohit Khatwani",
    password: "password123",
    createdAt: new Date(2023, 0, 1)
  },
  {
    id: "2",
    email: "john.doe@example.com",
    name: "John Doe",
    password: "password123",
    createdAt: new Date(2023, 1, 15)
  }
];

// Current logged in user - in a real app, this would use a proper auth system with sessions/tokens
let currentUser: User | null = null;

// Check if a user exists with the given email
export const userExists = (email: string): boolean => {
  return users.some(user => user.email.toLowerCase() === email.toLowerCase());
};

// Register a new user
export const register = (email: string, name: string, password: string): User | null => {
  if (userExists(email)) {
    toast.error("A user with this email already exists");
    return null;
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    password, // In a real app, this would be hashed
    createdAt: new Date()
  };
  
  users.push(newUser);
  currentUser = newUser;
  
  toast.success("Account created successfully!");
  return newUser;
};

// Log in a user
export const login = (email: string, password: string): User | null => {
  const user = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password
  );
  
  if (!user) {
    toast.error("Invalid email or password");
    return null;
  }
  
  currentUser = user;
  toast.success(`Welcome back, ${user.name}!`);
  return user;
};

// Log out the current user
export const logout = (): void => {
  currentUser = null;
  toast.info("You have been logged out");
};

// Get the current logged in user
export const getCurrentUser = (): User | null => {
  return currentUser;
};

// Validate if an email belongs to a registered user
export const isValidUserEmail = (email: string): boolean => {
  return userExists(email);
};
