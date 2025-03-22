
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { GavelIcon, HomeIcon, PackageIcon, UserIcon, TimerIcon, LogOutIcon } from "lucide-react";
import { getCurrentUser, logout, User } from "@/lib/auth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Load the current user
    const loadUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    
    loadUser();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    window.location.href = "/"; // Redirect to homepage after logout
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser?.name) return "U";
    return currentUser.name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out py-4",
        scrolled 
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between mx-auto px-4">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xl font-semibold transition-opacity duration-200 hover:opacity-80"
        >
          <GavelIcon className="h-6 w-6" />
          <span>AuctionHub</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" icon={<HomeIcon className="h-4 w-4" />} label="Home" />
          <NavLink to="/products" icon={<PackageIcon className="h-4 w-4" />} label="Products" />
          <NavLink to="/my-bids" icon={<UserIcon className="h-4 w-4" />} label="My Bids" />
          <NavLink to="/admin" icon={<TimerIcon className="h-4 w-4" />} label="Admin" />
          
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-500 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>{currentUser.name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="text-xs text-gray-500">{currentUser.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </nav>
        
        <div className="flex md:hidden">
          {/* Mobile menu button would go here */}
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavLink = ({ to, icon, label }: NavLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      to={to} 
      className="relative flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon}
      <span>{label}</span>
      <span 
        className={cn(
          "absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300",
          isHovered ? "w-full" : "w-0"
        )}
      />
    </Link>
  );
};

export default Navbar;
