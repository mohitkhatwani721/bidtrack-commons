
import { Shield, Package, Award, Truck } from "lucide-react";

const ProductFeatures = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div className="flex items-start space-x-3">
        <Shield className="h-5 w-5 text-gray-700 mt-0.5" />
        <div>
          <h4 className="font-medium">Guaranteed Authenticity</h4>
          <p className="text-sm text-gray-600">All products are original and authentic.</p>
        </div>
      </div>
      
      <div className="flex items-start space-x-3">
        <Package className="h-5 w-5 text-gray-700 mt-0.5" />
        <div>
          <h4 className="font-medium">Factory Sealed</h4>
          <p className="text-sm text-gray-600">Products are new and factory sealed.</p>
        </div>
      </div>
      
      <div className="flex items-start space-x-3">
        <Award className="h-5 w-5 text-gray-700 mt-0.5" />
        <div>
          <h4 className="font-medium">Warranty Included</h4>
          <p className="text-sm text-gray-600">Standard manufacturer warranty applies.</p>
        </div>
      </div>
      
      <div className="flex items-start space-x-3">
        <Truck className="h-5 w-5 text-gray-700 mt-0.5" />
        <div>
          <h4 className="font-medium">Fast Delivery</h4>
          <p className="text-sm text-gray-600">Quick delivery after auction ends.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;
