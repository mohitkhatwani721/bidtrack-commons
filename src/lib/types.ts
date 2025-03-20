
export interface Product {
  id: string;
  zone: string;
  name: string;
  modelCode: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  imageUrl?: string;
  description?: string;
}

export interface Bid {
  id: string;
  productId: string;
  userEmail: string;
  amount: number;
  timestamp: Date;
}

export interface AuctionSettings {
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}
