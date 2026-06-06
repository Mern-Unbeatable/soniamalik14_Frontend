import React from 'react';
import { ImagePlus } from 'lucide-react';

const ContentFormSection = ({ title, includeImage = true, imageLabel = "Upload Hero image" }) => {
    return (
        <div className="mb-12 last:mb-0">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{title}</h2>

            {includeImage && (
                <div className="w-full h-64 md:h-80 bg-[#f5f5f5] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#eeeeee] transition-colors mb-6 group">
                    <ImagePlus className="w-10 h-10 text-[#0f766e] mb-3 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-gray-700">{imageLabel}</span>
                </div>
            )}

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Title</label>
                <input
                    type="text"
                    placeholder="Write title"
                    className="w-full bg-[#f5f5f5] border-none rounded-lg px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#0f766e]/20 outline-none text-gray-800 placeholder-gray-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Subheadline</label>
                <textarea
                    placeholder="Write your subheadline"
                    className="w-full h-32 bg-[#f5f5f5] border-none rounded-lg px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#0f766e]/20 outline-none resize-none text-gray-800 placeholder-gray-500"
                />
            </div>
        </div>
    );
};

export default ContentFormSection;
