import { Product, AuctionSettings, Bid } from "./types";

export const products: Product[] = [
  {
    id: "1",
    zone: "Zone 1",
    name: "Galaxy Buds2 Pro",
    modelCode: "SM-R510NZAAXFA",
    quantity: 2,
    pricePerUnit: 589.00,
    totalPrice: 1178.00,
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/ae/sm-r510nzaaxsg/gallery/ae-galaxy-buds2-pro-r510-431273-sm-r510nzaaxsg-533186128?$650_519_PNG$",
    description: "Immerse yourself in premium sound quality with these wireless earbuds featuring Active Noise Cancellation and crystal clear audio."
  },
  {
    id: "2",
    zone: "Zone 1",
    name: "Bespoke Jet™ 280 W Vacuum Cleaner",
    modelCode: "VS20A95823W/GE",
    quantity: 1,
    pricePerUnit: 2099.00,
    totalPrice: 2099.00,
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/ae/vs20a95823w-ge/gallery/ae-jet-vs20a95823w-ge-425797-vs20a95823w-ge-424147171?$650_519_PNG$",
    description: "Experience powerful cleaning with this premium vacuum featuring All-in-One Clean Station™ and a versatile design for all floor types."
  },
  {
    id: "3",
    zone: "Zone 1",
    name: "32L Microwave Oven",
    modelCode: "MS32M3000AS/GS",
    quantity: 2,
    pricePerUnit: 449.00,
    totalPrice: 898.00,
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/ae/ms32m3000as-sg/gallery/ae-grill-microwave-oven-with-ceramic-inside-ms32m3000as-sg-rperspectivesilver-205345004?$650_519_PNG$",
    description: "Cook, reheat, and defrost with precision using this feature-packed microwave with ceramic interior for easy cleaning."
  },
  {
    id: "4",
    zone: "Zone 1",
    name: "Electric Oven with Convection",
    modelCode: "NV60A3140BS/GS",
    quantity: 1,
    pricePerUnit: 2499.00,
    totalPrice: 2499.00,
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/ae/nv60a3140bs-gs/gallery/ae-electric-oven-nv60a3140bs-gs-446898-nv60a3140bs-gs-422344797?$650_519_PNG$",
    description: "Bake like a professional with this 60L electric oven featuring multiple cooking modes and precise temperature control."
  },
  {
    id: "5",
    zone: "Zone 2",
    name: "French Door Refrigerator",
    modelCode: "RF71SG9RGB1/AF",
    quantity: 1,
    pricePerUnit: 13999.00,
    totalPrice: 13999.00,
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/ae/rf71sg9rgb1-ae/gallery/ae-front-rf71sg9rgb1-ae-531851242?$650_519_PNG$",
    description: "This family hub refrigerator offers spacious storage and smart features to keep your food fresh and your family connected."
  },
  {
    id: "6",
    zone: "Zone 3",
    name: "75 inch The Frame",
    modelCode: "QA75LS03BAUAZN",
    quantity: 1,
    pricePerUnit: 8999.00,
    totalPrice: 8999.00,
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/ae/qa75ls03bauztw/gallery/ae-the-frame-ls03b-qa75ls03bauztw-532525244?$650_519_PNG$",
    description: "Transform your living space with this stunning QLED TV that doubles as artwork when not in use, with a customizable frame."
  },
  {
    id: "7",
    zone: "Zone 3",
    name: "Ultra Slim Soundbar",
    modelCode: "HW-S801B/ZN",
    quantity: 1,
    pricePerUnit: 1299.00,
    totalPrice: 1299.00,
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/ae/hw-s801b-xu/gallery/ae-ultra-slim-soundbar-hw-s801b-hw-s801b-xu-533168503?$650_519_PNG$",
    description: "Enhance your TV's audio with this sleek, ultra-slim soundbar designed to complement your home entertainment setup."
  },
  {
    id: "8",
    zone: "Zone 3",
    name: "WindFree™ Wall-mount AC",
    modelCode: "AR24TXFQAWK/BU",
    quantity: 1,
    pricePerUnit: 3799.00,
    totalPrice: 3799.00,
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/ae/ar24txfqawk-ae/gallery/ae-wind-free-ar24txfqawk-ae-531852004?$650_519_PNG$",
    description: "Experience cool comfort without direct cold air flow with this innovative air conditioner featuring energy-efficient technology."
  },
  {
    id: "9",
    zone: "Zone 3 & 4",
    name: "Music Frame HW-LS60D Frame",
    modelCode: "HW-LS60D/ZN",
    quantity: 5,
    pricePerUnit: 1399.00,
    totalPrice: 6995.00,
    imageUrl: "https://images.samsung.com/is/image/samsung/p6pim/ae/hw-ls60d-xu/gallery/ae-music-frame-hw-ls60d-hw-ls60d-xu-536643358?$650_519_PNG$",
    description: "Combine premium audio with elegant design in this unique speaker that looks like a picture frame while delivering room-filling sound."
  }
];

export const auctionSettings: AuctionSettings = {
  startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Started yesterday
  endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // Ends in 7 days
  isActive: true
};

export const bids: Bid[] = [
  {
    id: "bid1",
    productId: "1",
    userEmail: "mohit.khatwani@gmail.com",
    amount: 650,
    timestamp: new Date(new Date().getTime() - 3 * 60 * 60 * 1000) // 3 hours ago
  },
  {
    id: "bid2",
    productId: "3",
    userEmail: "mohit.khatwani@gmail.com",
    amount: 500,
    timestamp: new Date(new Date().getTime() - 5 * 60 * 60 * 1000) // 5 hours ago
  },
  {
    id: "bid3",
    productId: "5",
    userEmail: "mohit.khatwani@gmail.com",
    amount: 14500,
    timestamp: new Date(new Date().getTime() - 8 * 60 * 60 * 1000) // 8 hours ago
  },
  {
    id: "bid4",
    productId: "7",
    userEmail: "john.doe@example.com",
    amount: 1450,
    timestamp: new Date(new Date().getTime() - 7 * 60 * 60 * 1000) // 7 hours ago
  },
  {
    id: "bid5",
    productId: "9",
    userEmail: "jane.smith@example.com",
    amount: 1650,
    timestamp: new Date(new Date().getTime() - 4 * 60 * 60 * 1000) // 4 hours ago
  }
];

export const updateAuctionDates = (startDate: Date, endDate: Date): void => {
  if (startDate > endDate) {
    throw new Error("Start date cannot be after end date");
  }
  
  auctionSettings.startDate = startDate;
  auctionSettings.endDate = endDate;
};

export const getHighestBidForProduct = (productId: string): Bid | null => {
  const productBids = bids.filter(bid => bid.productId === productId);
  if (productBids.length === 0) return null;
  
  return productBids.reduce((prev, current) => {
    return (prev.amount > current.amount) ? prev : current;
  });
};

export const getTotalBidsForProduct = (productId: string): number => {
  return bids.filter(bid => bid.productId === productId).length;
};

export const getBidsByUser = (email: string): Bid[] => {
  return bids.filter(bid => bid.userEmail === email);
};

export const hasUserAlreadyBid = (productId: string, userEmail: string): boolean => {
  return bids.some(bid => bid.productId === productId && bid.userEmail === userEmail);
};

export const placeBid = (productId: string, userEmail: string, amount: number): Bid | null => {
  const product = products.find(p => p.id === productId);
  if (!product) return null;
  
  if (amount < product.pricePerUnit) return null;
  
  if (hasUserAlreadyBid(productId, userEmail)) return null;
  
  const newBid: Bid = {
    id: Date.now().toString(),
    productId,
    userEmail,
    amount,
    timestamp: new Date()
  };
  
  bids.push(newBid);
  
  return newBid;
};

export const getWinningBids = (): Bid[] => {
  return [...bids].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const getWinners = (): Map<string, Bid> => {
  const winners = new Map<string, Bid>();
  
  const productIds = [...new Set(bids.map(bid => bid.productId))];
  
  productIds.forEach(productId => {
    const highestBid = getHighestBidForProduct(productId);
    if (highestBid) {
      winners.set(productId, highestBid);
    }
  });
  
  return winners;
};

export const isWinningBid = (bid: Bid): boolean => {
  const highestBid = getHighestBidForProduct(bid.productId);
  return highestBid?.id === bid.id;
};

export const isAuctionActive = (): boolean => {
  return true;
};

export const getRemainingTime = (): number => {
  const now = new Date();
  
  if (now < auctionSettings.startDate) {
    return auctionSettings.startDate.getTime() - now.getTime();
  }
  
  if (now > auctionSettings.endDate) {
    return 0;
  }
  
  return auctionSettings.endDate.getTime() - now.getTime();
};
