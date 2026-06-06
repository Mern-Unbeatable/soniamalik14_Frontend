import React, { useState, useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';

const ContentCollaboratePage = () => {
    const [images, setImages] = useState({
        hero: null,
        sportProvider: null,
        serviceProvider: null,
        brand: null
    });

    // Create individual refs for each file input
    const heroFileRef = useRef(null);
    const sportProviderFileRef = useRef(null);
    const serviceProviderFileRef = useRef(null);
    const brandFileRef = useRef(null);

    // Map section keys to their refs
    const refMap = {
        hero: heroFileRef,
        sportProvider: sportProviderFileRef,
        serviceProvider: serviceProviderFileRef,
        brand: brandFileRef
    };

    // Handle image upload
    const handleImageChange = (e, sectionKey) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageUrl = event.target?.result;
            setImages(prev => ({
                ...prev,
                [sectionKey]: imageUrl
            }));
        };
        reader.readAsDataURL(file);
    };

    // Trigger file input click
    const handleUploadClick = (sectionKey) => {
        refMap[sectionKey]?.current?.click();
    };

    // Remove image
    const removeImage = (sectionKey) => {
        setImages(prev => ({
            ...prev,
            [sectionKey]: null
        }));
    };

    // Helper function to render each section consistently
    const renderSection = (title, sectionKey) => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-6">{title}</h2>

            {/* Hidden File Input */}
            <input
                ref={refMap[sectionKey]}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageChange(e, sectionKey)}
            />

            {/* Image Upload Area */}
            <div
                onClick={() => handleUploadClick(sectionKey)}
                className="w-full h-64 md:h-80 bg-[#f5f5f5] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#eeeeee] transition-colors mb-6 group relative overflow-hidden"
            >
                {images[sectionKey] ? (
                    <>
                        <img src={images[sectionKey]} alt={`${title} Preview`} className="w-full h-full object-cover" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeImage(sectionKey);
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
    );

    return (
        <div className="space-y-8 font-sans pb-12">
            {/* 1. Hero Section */}
            {renderSection('Hero section', 'hero')}

            {/* 2. Sport Provider Section */}
            {renderSection('Sport Provider section', 'sportProvider')}

            {/* 3. Service Provider Section */}
            {renderSection('Service Provider section', 'serviceProvider')}

            {/* 4. Brand Section */}
            {renderSection('Brand section', 'brand')}
        </div>
    );
};

export default ContentCollaboratePage;