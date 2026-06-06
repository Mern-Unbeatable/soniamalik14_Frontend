import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const NewsCard = ({ news, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col hover:shadow-md transition-shadow">

            {/* Card Image */}
            <img
                src={news.image}
                alt={news.title}
                className="w-full h-48 md:h-52 object-cover rounded-lg"
            />

            {/* Card Content Area */}
            <div className="pt-4 px-1 flex flex-col flex-grow">

                {/* Date */}
                <p className="text-sm font-medium text-gray-400 mb-1.5">
                    {news.date}
                </p>

                {/* Title */}
                <h3 className="text-lg leading-tight font-bold text-gray-900 mb-2 line-clamp-2">
                    {news.title}
                </h3>

                {/* Description */}
                <p className="text-base text-gray-500 mb-6 line-clamp-2 grow leading-relaxed">
                    {news.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto pt-2">
                    <button
                        onClick={() => onEdit(news.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 border border-[#2FDDCF] text-[#0F766E] bg-[#E7F1F1] rounded-md text-sm font-medium hover:bg-[#e2f3f1] transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(news.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 border border-[#2FDDCF] text-[#0F766E] bg-[#E7F1F1] rounded-md text-sm font-medium hover:bg-[#e2f3f1] transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>

            </div>
        </div>
    );
};

export default NewsCard;
