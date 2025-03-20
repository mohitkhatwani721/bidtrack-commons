
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products, bids, getWinningBids, isAuctionActive, auctionSettings, isWinningBid, getWinners } from "@/lib/data";
import { Bid, Product } from "@/lib/types";
import { toast } from "sonner";
import AuctionTimer from "@/components/ui/AuctionTimer";
import { DownloadIcon, LockIcon, TrophyIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [winningBids, setWinningBids] = useState<Bid[]>([]);
  const [showAllBids, setShowAllBids] = useState(true); // Default to showing all bids
  const [filter, setFilter] = useState("");
  const [winners, setWinners] = useState<Map<string, Bid>>(new Map());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setWinningBids(getWinningBids());
      setWinners(getWinners());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple authentication (in a real app, use proper authentication)
    setTimeout(() => {
      if (password === "admin123") {
        setIsAuthenticated(true);
        toast.success("Admin authenticated successfully!");
      } else {
        toast.error("Invalid password");
      }
      setIsLoading(false);
    }, 1000);
  };

  const getProductById = (productId: string): Product | undefined => {
    return products.find(product => product.id === productId);
  };

  const handleExportToExcel = () => {
    toast.success("Results exported successfully!");
    
    // In a real app, implement actual Excel export logic here
    console.log("Exporting results to Excel...");
    
    // This would typically generate a CSV or Excel file
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Product ID,Product Name,Model Code,Zone,Price Per Unit,Winning Bid Amount,Bidder Email,Is Winner\n"
      + winningBids.map(bid => {
          const product = getProductById(bid.productId);
          const isWinner = isWinningBid(bid);
          return product 
            ? `${product.id},${product.name},${product.modelCode},${product.zone},${product.pricePerUnit},${bid.amount},${bid.userEmail},${isWinner ? "Yes" : "No"}`
            : "";
        }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "auction_results.csv");
    document.body.appendChild(link);
    link.click();
  };

  // Filter bids by email if filter is provided
  const filteredBids = filter
    ? winningBids.filter(bid => bid.userEmail.toLowerCase().includes(filter.toLowerCase()))
    : winningBids;

  // Filter to only show winning bids if showAllBids is false
  const displayBids = showAllBids 
    ? filteredBids 
    : filteredBids.filter(bid => isWinningBid(bid));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
              <p className="text-gray-600">
                View auction results and export data. This area is restricted to administrators only.
              </p>
            </motion.div>
            
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <AuctionTimer />
            </motion.div>
            
            {!isAuthenticated ? (
              <motion.div 
                className="bg-white rounded-lg border p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <LockIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium">Admin Authentication</h2>
                    <p className="text-gray-600">Please enter your password to access the admin area.</p>
                  </div>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        Authenticating
                        <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      </span>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
                
                <p className="text-xs text-gray-500 mt-4">
                  Note: For demo purposes, the password is "admin123"
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-medium">Auction Results</h2>
                      <p className="text-gray-600">
                        {isAuctionActive() 
                          ? "The auction is currently active. Final results will be available after it ends."
                          : new Date() < auctionSettings.startDate
                            ? "The auction has not started yet."
                            : "The auction has ended. Here are the final results."}
                      </p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="flex items-center" 
                      onClick={handleExportToExcel}
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Export to Excel
                    </Button>
                  </div>
                  
                  <div className="mb-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {bids.length} total bids, showing {displayBids.length} bids
                      </span>
                      
                      <Button 
                        variant="link" 
                        onClick={() => setShowAllBids(!showAllBids)}
                        className="text-sm"
                      >
                        {showAllBids ? "Show Only Winning Bids" : "Show All Bids"}
                      </Button>
                    </div>
                    
                    <div>
                      <Input
                        type="text"
                        placeholder="Filter by email (e.g., mohit.khatwani@gmail.com)"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Zone</TableHead>
                          <TableHead>Model Code</TableHead>
                          <TableHead>Starting Price</TableHead>
                          <TableHead>Bid Amount</TableHead>
                          <TableHead>Bidder</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayBids.map((bid, index) => {
                          const product = getProductById(bid.productId);
                          if (!product) return null;
                          
                          const isWinner = isWinningBid(bid);
                          
                          return (
                            <TableRow key={bid.id} className={isWinner ? "bg-green-50" : ""}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{product.zone}</TableCell>
                              <TableCell>{product.modelCode}</TableCell>
                              <TableCell>AED {product.pricePerUnit.toLocaleString()}</TableCell>
                              <TableCell>AED {bid.amount.toLocaleString()}</TableCell>
                              <TableCell className="font-medium">{bid.userEmail}</TableCell>
                              <TableCell>{bid.timestamp.toLocaleString()}</TableCell>
                              <TableCell>
                                {isWinner ? (
                                  <Badge className="bg-green-500 flex items-center space-x-1">
                                    <TrophyIcon className="h-3 w-3 mr-1" />
                                    Winner
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-gray-500">
                                    Outbid
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        
                        {displayBids.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                              {filter ? `No bids found for "${filter}"` : "No bids have been placed yet."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Winners Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map(product => {
                        const winningBid = getHighestBidForProduct(product.id);
                        return (
                          <div key={product.id} className="p-4 border rounded-lg flex items-start space-x-3">
                            <div className="bg-gray-100 rounded-md p-2 flex-shrink-0">
                              <TrophyIcon className={`h-5 w-5 ${winningBid ? 'text-yellow-500' : 'text-gray-400'}`} />
                            </div>
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-gray-500">{product.zone} - {product.modelCode}</p>
                              {winningBid ? (
                                <div className="mt-1">
                                  <p className="text-sm font-medium">Winner: <span className="text-green-600">{winningBid.userEmail}</span></p>
                                  <p className="text-sm">Bid Amount: AED {winningBid.amount.toLocaleString()}</p>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 mt-1">No bids yet</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border p-6">
                  <h2 className="text-xl font-medium mb-4">Auction Statistics</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-500 text-sm">Total Products</p>
                      <p className="text-2xl font-bold">{products.length}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-500 text-sm">Total Bids</p>
                      <p className="text-2xl font-bold">{bids.length}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-500 text-sm">Unique Bidders</p>
                      <p className="text-2xl font-bold">
                        {new Set(bids.map(bid => bid.userEmail)).size}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
