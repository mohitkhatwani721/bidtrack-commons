
import { Link } from "react-router-dom";
import { GavelIcon, GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-xl font-semibold">
              <GavelIcon className="h-6 w-6" />
              <span>AuctionHub</span>
            </Link>
            <p className="text-gray-600 max-w-xs">
              A premium auction platform for exclusive products. Bid, win, and enjoy quality items.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/my-bids" className="text-gray-600 hover:text-gray-900 transition-colors">
                  My Bids
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                <GithubIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} AuctionHub. All rights reserved.
          </p>
          <p className="text-gray-600 mt-4 md:mt-0">
            Designed with precision for an exceptional experience.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
