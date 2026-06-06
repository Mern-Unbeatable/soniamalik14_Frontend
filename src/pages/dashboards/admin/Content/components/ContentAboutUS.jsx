import React, { useState, useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';

const ContentAboutUS = () => {
    const [heroImage, setHeroImage] = useState(null);
    const [founderImage, setFounderImage] = useState(null);

    const heroFileRef = useRef(null);
    const founderFileRef = useRef(null);

    // Handle image upload
    const handleImageChange = (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageUrl = event.target?.result;
            if (type === 'hero') {
                setHeroImage(imageUrl);
            } else if (type === 'founder') {
                setFounderImage(imageUrl);
            }
        };
        reader.readAsDataURL(file);
    };

    // Trigger file input clicks
    const handleUploadClick = (type) => {
        if (type === 'hero') heroFileRef.current?.click();
        else if (type === 'founder') founderFileRef.current?.click();
    };

    // Remove image
    const removeImage = (type) => {
        if (type === 'hero') {
            setHeroImage(null);
        } else if (type === 'founder') {
            setFounderImage(null);
        }
    };

    return (
        <div className="space-y-8 font-sans pb-12">

            {/* Hidden File Inputs */}
            <input
                ref={heroFileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageChange(e, 'hero')}
            />
            <input
                ref={founderFileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageChange(e, 'founder')}
            />

            {/* 1. Hero Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-6">Hero section</h2>

                {/* Image Upload Area */}
                <div
                    onClick={() => handleUploadClick('hero')}
                    className="w-full h-64 md:h-80 bg-[#f5f5f5] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#eeeeee] transition-colors mb-6 group relative overflow-hidden"
                >
                    {heroImage ? (
                        <>
                            <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage('hero');
                                }}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" strokeWidth={2} />
                            </button>
                        </>
                    ) : (
                        <>
                            <ImagePlus className="w-10 h-10 text-[#0f766e] mb-3 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                            <span className="text-base font-medium text-gray-700">Upload Hero image</span>
                        </>
                    )}
                </div>

                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-base font-medium text-gray-900 mb-2">Tittle</label>
                        <input
                            type="text"
                            placeholder="Write title"
                            className="w-full bg-[#f5f5f5] border-none rounded-lg px-4 py-3.5 text-base focus:ring-2 focus:ring-[#0f766e]/20 outline-none text-gray-800 placeholder-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-base font-medium text-gray-900 mb-2">Subheadline</label>
                        <textarea
                            placeholder="Write your subheadline"
                            className="w-full h-32 bg-[#f5f5f5] border-none rounded-lg px-4 py-3.5 text-base focus:ring-2 focus:ring-[#0f766e]/20 outline-none resize-none text-gray-800 placeholder-gray-500"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Founder Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-6">Founder section</h2>

                {/* Image Upload Area */}
                <div
                    onClick={() => handleUploadClick('founder')}
                    className="w-full h-64 md:h-80 bg-[#f5f5f5] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#eeeeee] transition-colors mb-6 group relative overflow-hidden"
                >
                    {founderImage ? (
                        <>
                            <img src={founderImage} alt="Founder Preview" className="w-full h-full object-cover" />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage('founder');
                                }}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" strokeWidth={2} />
                            </button>
                        </>
                    ) : (
                        <>
                            <ImagePlus className="w-10 h-10 text-[#0f766e] mb-3 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                            <span className="text-base font-medium text-gray-700">Upload Hero image</span>
                        </>
                    )}
                </div>

                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-base font-medium text-gray-900 mb-2">Tittle</label>
                        <input
                            type="text"
                            placeholder="Write title"
                            className="w-full bg-[#f5f5f5] border-none rounded-lg px-4 py-3.5 text-base focus:ring-2 focus:ring-[#0f766e]/20 outline-none text-gray-800 placeholder-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-base font-medium text-gray-900 mb-2">Subheadline</label>
                        <textarea
                            placeholder="Write your subheadline"
                            className="w-full h-32 bg-[#f5f5f5] border-none rounded-lg px-4 py-3.5 text-base focus:ring-2 focus:ring-[#0f766e]/20 outline-none resize-none text-gray-800 placeholder-gray-500"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ContentAboutUS;