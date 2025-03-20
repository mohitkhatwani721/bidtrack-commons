
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { GavelIcon, HomeIcon, PackageIcon, UserIcon, TimerIcon } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

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
