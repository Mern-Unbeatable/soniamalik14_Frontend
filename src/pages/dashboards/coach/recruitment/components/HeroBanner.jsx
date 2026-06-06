import React from 'react';
import { Heart } from 'lucide-react';

const HeroBanner = ({ item }) => {
    return (
        <div className="relative mb-16">
            {/* Banner Image */}
            <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-sm">
                {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-300"></div>
                )}
            </div>

            {/* Overlaid Favorite/Heart Button */}
            <button className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white p-2.5 rounded-full transition-all">
                <Heart className="w-4 h-4" />
            </button>

            {/* Overlaid Avatar Picture */}
            <div className="absolute -bottom-10 left-6 md:left-10 w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#F8FAFC] overflow-hidden bg-gray-200">
                {item.avatar ? (
                    <img src={item.avatar} alt={item.coach} className="w-full h-full object-cover" />
                ) : item.image ? (
                    <img src={item.image} alt="fallback" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-300" />
                )}
            </div>
        </div>
    );
};

export default HeroBanner;
