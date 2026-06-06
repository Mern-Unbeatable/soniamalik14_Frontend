// ProductCard.jsx
import React from 'react';
import { Eye, X, Check } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 shadow-sm">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-900 text-base">{product.productName}</h3>
        <button className="p-1 hover:bg-gray-100 rounded-md">
          <Eye className="w-5 h-5 text-[#000000]" />
        </button>
      </div>
      <div className="text-base text-gray-600 space-y-1">
        <p><span className="font-medium">Seller:</span> {product.sellerName}</p>
        <p><span className="font-medium">Price:</span> {product.price}</p>
        <p><span className="font-medium">Condition:</span> {product.condition}</p>
      </div>
      <div className="flex gap-3 pt-2">
        <button className="flex-1 py-1 bg-red-50 text-[#EA0C0C] rounded-md flex justify-center items-center gap-1">
          <X className="w-4 h-4" /> Reject
        </button>
        <button className="flex-1 py-1 bg-green-50 text-[#55A946] rounded-md flex justify-center items-center gap-1">
          <Check className="w-4 h-4" /> Approve
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
