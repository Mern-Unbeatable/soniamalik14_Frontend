import React, { useState, useRef } from 'react';
import { ImagePlus, Plus, X } from 'lucide-react';

const ContentLandingPage = () => {
    // Image state for different sections
    const [heroImage, setHeroImage] = useState(null);
    const [exploreCards, setExploreCards] = useState([{ id: 1, image: null }]);
    const [findCards, setFindCards] = useState([{ id: 1, image: null }]);

    // Refs for file inputs
    const heroFileRef = useRef(null);
    const exploreFileRef = useRef(null);
    const findFileRef = useRef(null);
    const [activeUploadType, setActiveUploadType] = useState(null);
    const [activeCardId, setActiveCardId] = useState(null);

    // Handle image upload
    const handleImageChange = (e, type, cardId = null) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageUrl = event.target?.result;

            if (type === 'hero') {
                setHeroImage(imageUrl);
            } else if (type === 'explore') {
                setExploreCards(cards =>
                    cards.map(card => card.id === cardId ? { ...card, image: imageUrl } : card)
                );
            } else if (type === 'find') {
                setFindCards(cards =>
                    cards.map(card => card.id === cardId ? { ...card, image: imageUrl } : card)
                );
            }
        };
        reader.readAsDataURL(file);
    };

    // Trigger file input clicks
    const handleUploadClick = (type, cardId = null) => {
        setActiveUploadType(type);
        setActiveCardId(cardId);

        if (type === 'hero') heroFileRef.current?.click();
        else if (type === 'explore') exploreFileRef.current?.click();
        else if (type === 'find') findFileRef.current?.click();
    };

    // Remove image
    const removeImage = (type, cardId = null) => {
        if (type === 'hero') {
            setHeroImage(null);
        } else if (type === 'explore') {
            setExploreCards(cards =>
                cards.map(card => card.id === cardId ? { ...card, image: null } : card)
            );
        } else if (type === 'find') {
            setFindCards(cards =>
                cards.map(card => card.id === cardId ? { ...card, image: null } : card)
            );
        }
    };

    // Add new card
    const addExploreCard = () => {
        const newId = Math.max(...exploreCards.map(c => c.id), 0) + 1;
        setExploreCards([...exploreCards, { id: newId, image: null }]);
    };

    const addFindCard = () => {
        const newId = Math.max(...findCards.map(c => c.id), 0) + 1;
        setFindCards([...findCards, { id: newId, image: null }]);
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
                ref={exploreFileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageChange(e, 'explore', activeCardId)}
            />
            <input
                ref={findFileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageChange(e, 'find', activeCardId)}
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
                            <span className="text-sm font-medium text-gray-700">Upload Hero image</span>
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

            {/* 2. Explore Essa Hub Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-6">Explore Essa Hub</h2>

                {/* Section Inputs */}
                <div className="space-y-6 mb-10">
                    <div>
                        <label className="block text-base font-medium text-gray-900 mb-2">Section Tittle</label>
                        <input
                            type="text"
                            placeholder="Write title"
                            className="w-full bg-[#f5f5f5] border-none rounded-lg px-4 py-3.5 text-base focus:ring-2 focus:ring-[#0f766e]/20 outline-none text-gray-800 placeholder-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-base font-medium text-gray-900 mb-2">Section Subheadline</label>
                        <textarea
                            placeholder="Write your subheadline"
                            className="w-full h-32 bg-[#f5f5f5] border-none rounded-lg px-4 py-3.5 text-base focus:ring-2 focus:ring-[#0f766e]/20 outline-none resize-none text-gray-800 placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Cards Area */}
                <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-6">Card</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Existing Card Items */}
                    {exploreCards.map((card) => (
                        <div key={card.id} className="bg-[#f4f4f4] p-5 rounded-xl border border-gray-100">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-base font-medium text-gray-900 mb-2">Card Tittle</label>
                                    <input
                                        type="text"
                                        placeholder="Write title"
                                        className="w-full bg-white border border-gray-100 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-[#0f766e]/20 outline-none text-gray-800 placeholder-gray-500 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-base font-medium text-gray-900 mb-2">Card Description</label>
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        className="w-full bg-white border border-gray-100 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-[#0f766e]/20 outline-none text-gray-800 placeholder-gray-500 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-base font-medium text-gray-900 mb-2">Image</label>
                                    <div
                                        onClick={() => handleUploadClick('explore', card.id)}
                                        className="w-full h-36 bg-white border border-gray-100 shadow-sm rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group relative overflow-hidden"
                                    >
                                        {card.image ? (
                                            <>
                                                <img src={card.image} alt="Card Preview" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage('explore', card.id);
                                                    }}
                                                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                                                >
                                                    <X className="w-4 h-4" strokeWidth={2} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <ImagePlus className="w-7 h-7 text-[#0f766e] mb-2 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                                                <span className="text-xs font-medium text-gray-600">Upload Hero image</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card Button */}
                    <div
                        onClick={addExploreCard}
                        className="bg-[#f5f5f5] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#eeeeee] transition-colors min-h-[340px] group border-2 border-dashed border-gray-200"
                    >
                        <Plus className="w-8 h-8 text-[#0f766e] mb-3 transition-transform group-hover:scale-110" strokeWidth={2} />
                        <span className="text-sm font-medium text-gray-700">Add new card</span>
                    </div>
                </div>
            </div>

            {/* 3. Find Your Sport Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl lg:text-3xl font-semibold text-[#0B544E] mb-6">Find Your Sport</h2>

                {/* Section Inputs */}
                <div className="space-y-6 mb-10">
                    <div>
                        <label className="block text-base font-medium text-gray-900 mb-2">Section Tittle</label>
                        <input
                            type="text"
                            placeholder="Write title"
                            className="w-full bg-[#f5f5f5] border-none rounded-lg px-4 py-3.5 text-base focus:ring-2 focus:ring-[#0f766e]/20 outline-none text-gray-800 placeholder-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-base font-medium text-gray-900 mb-2">Section Subheadline</label>
                        <textarea
                            placeholder="Write your subheadline"
                            className="w-full h-32 bg-[#f5f5f5] border-none rounded-lg px-4 py-3.5 text-base focus:ring-2 focus:ring-[#0f766e]/20 outline-none resize-none text-gray-800 placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Cards Area */}
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Card</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Existing Card Items (No description field in this section) */}
                    {findCards.map((card) => (
                        <div key={card.id} className="bg-[#f4f4f4] p-5 rounded-xl border border-gray-100 flex flex-col justify-between min-h-[250px]">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-base font-medium text-gray-900 mb-2">Card Tittle</label>
                                    <input
                                        type="text"
                                        placeholder="Write title"
                                        className="w-full bg-white border border-gray-100 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-[#0f766e]/20 outline-none text-gray-800 placeholder-gray-500 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-base font-medium text-gray-900 mb-2">Image</label>
                                    <div
                                        onClick={() => handleUploadClick('find', card.id)}
                                        className="w-full h-28 bg-white border border-gray-100 shadow-sm rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group relative overflow-hidden"
                                    >
                                        {card.image ? (
                                            <>
                                                <img src={card.image} alt="Card Preview" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage('find', card.id);
                                                    }}
                                                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                                                >
                                                    <X className="w-4 h-4" strokeWidth={2} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <ImagePlus className="w-7 h-7 text-[#0f766e] mb-2 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                                                <span className="text-xs font-medium text-gray-600">Upload Hero image</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card Button */}
                    <div
                        onClick={addFindCard}
                        className="bg-[#f5f5f5] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#eeeeee] transition-colors min-h-[250px] group border-2 border-dashed border-gray-200"
                    >
                        <Plus className="w-8 h-8 text-[#0f766e] mb-3 transition-transform group-hover:scale-110" strokeWidth={2} />
                        <span className="text-sm font-medium text-gray-700">Add new card</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ContentLandingPage;