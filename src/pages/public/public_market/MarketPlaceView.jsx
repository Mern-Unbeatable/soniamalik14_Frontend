import React, { useMemo, useState } from 'react';
import Container from '../../../components/layout/Container';
import Button from '../../../components/ui/Button';
import PageHeader from '../../../components/ui/PageHeader';

// Sample data using the placeholder image to match your screenshot
const sampleBrands = [
    {
        id: 1,
        name: 'IDA Sports',
        sport: 'Football',
        logo: 'https://i.ibb.co.com/YF44kMmL/Press-Blog-Image-1600x.webp',
        description: 'Football boots engineered specifically for women’s foot shape. Designed for performance fit and comfort at every level.',
        url: 'https://idasports.com',
    },
    {
        id: 2,
        name: 'Gilbert Netball',
        sport: 'Netball',
        logo: 'https://i.ibb.co.com/V0JTnmHm/images.png',
        description: 'Official netball equipment supplier offering performance balls, kits and training gear.',
        url: 'https://www.gilbert-netball.com',
    },
    {
        id: 3,
        name: 'Nike',
        sport: 'Multi-sport',
        logo: 'https://i.ibb.co.com/zhppVwBV/002-nike-logos-swoosh-white.jpg',
        description: 'Global sportswear brand providing training, running, football and lifestyle products.',
        url: 'https://www.nike.com',
    },
    {
        id: 4,
        name: 'Adidas',
        sport: 'Padel',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
        description: 'Performance padel rackets and apparel designed for power, control and comfort.',
        url: 'https://www.adidas.com',
    }
]

const BrandCard = ({ brand }) => {
    return (
        <div className="bg-white border border-[#B5D5D2] rounded-lg p-4 flex flex-col h-full ">
            {/* Inset Top Cover Image with its own rounded corners */}
            <div className="w-full h-48 mb-4">
                {brand.logo ? (
                    <img
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>

            {/* Card Body */}
            <div className="flex flex-col grow">
                <h3 className="text-2xl font-semibold text-[#0B544E] mb-2">
                    {brand.name}
                </h3>
                <p className="text-base text-gray-600 mb-6 leading-relaxed grow pr-2">
                    {brand.description}
                </p>

                {/* Action Button */}
                <div className="mt-auto">
                    <a href={brand.url} target="_blank" rel="noreferrer" className="block w-full">
                        <Button className="w-full py-2.5 bg-[#137C71] text-white rounded-md text-sm font-semibold hover:bg-[#0F635A] transition-colors border-none">
                            Shop Brand
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
};

const MarketPlaceView = () => {
    const [query, setQuery] = useState('');
    // New state to track the active tab
    const [activeTab, setActiveTab] = useState('shop_brands');

    const filtered = useMemo(() => {
        const q = (query || '').trim().toLowerCase();
        if (!q) return sampleBrands;
        return sampleBrands.filter(
            (b) => b.name.toLowerCase().includes(q) || (b.sport || '').toLowerCase().includes(q)
        );
    }, [query]);

    return (
        <section>
            <Container className="py-6 lg:py-10 bg-[#F8FAFC] font-sans ">
                {/* Header Title */}

                  {/* Header Section */}
                <div className="mb-6">
                    <PageHeader title="Marketplace" description={"Shop curated brands and products designed for women in sport."} />
                </div>
                

                {/*  Filters Wrapper */}
                <div className="mb-12 w-full rounded-xl bg-[#E7F1F1] p-4 lg:max-w-4xl">

                    {/* Filter Buttons as Tabs */}
                    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <button
                            onClick={() => setActiveTab('shop_brands')}
                            className={`min-h-16 w-full rounded-lg px-6 py-3 text-base font-semibold shadow-sm transition-colors hover:opacity-90 ${activeTab === 'shop_brands' ? 'bg-[#0F766E] text-white' : 'border border-[#0F766E] bg-white text-black'}`}
                        >
                            Shop Brands
                        </button>

                        <button
                            onClick={() => setActiveTab('pre_loved')}
                            className={`min-h-16 w-full rounded-lg px-6 py-3 text-base transition-colors hover:opacity-90 ${activeTab === 'pre_loved' ? 'bg-[#0F766E] text-white' : 'border border-[#0F766E] bg-white text-black'} flex flex-col items-center justify-center`}
                        >
                            <span className="text-base font-semibold leading-tight">Pre-Loved</span>
                            <span className="text-sm leading-tight opacity-75">(Coming Soon)</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('list_item')}
                            className={`min-h-16 w-full rounded-lg px-6 py-3 text-base transition-colors hover:opacity-90 ${activeTab === 'list_item' ? 'bg-[#0F766E] text-white' : 'border border-[#0F766E] bg-white text-black'} flex flex-col items-center justify-center`}
                        >
                            <span className="text-base font-semibold leading-tight">List Your Item</span>
                            <span className="text-sm leading-tight opacity-75">(Coming Soon)</span>
                        </button>
                    </div>
                </div>

                {/* Dynamic Content Area based on Active Tab */}
                {activeTab === 'shop_brands' && (
                    <>
                        {filtered.length === 0 ? (
                            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
                                <h3 className="text-xl font-bold mb-2">No brands found</h3>
                                <p className="text-gray-600 mb-6">
                                    We couldn't find any brands that match "{query}". Try widening your search or clear the search to see all brands.
                                </p>
                                <Button onClick={() => setQuery('')} className="bg-[#137C71] text-white px-6 py-2 rounded-md font-semibold">
                                    Clear search
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filtered.map((b) => (
                                    <BrandCard key={b.id} brand={b} />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Coming Soon View for Pre-Loved & List Item Tabs */}
                {(activeTab === 'pre_loved' || activeTab === 'list_item') && (
                    <div className="flex flex-col items-center justify-center  px-4 text-center animate-fadeIn">

                        <h2 className="text-3xl md:text-[2.75rem] font-semibold text-black max-w-4xl mx-auto leading-tight mb-8">
                            {activeTab === 'pre_loved'
                                ? "A space to buy and sell pre-loved sports kit within the ESSA community."
                                : "A space to list your sports items and reach the ESSA community."}
                        </h2>

                        {/* Red Brush Stroke Image Placeholder */}
                        <div className="mb-10 w-full flex justify-center">
                            <div className="relative w-75 h-25 md:w-100 md:h-32.5 flex items-center justify-center">
                                {/* Replace the src below with the actual path to your red brush stroke image */}
                                <img
                                    src="/comingSoon.png"
                                    alt="Coming Soon"
                                    className="absolute inset-0 w-full h-full object-contain"
                                />
                                {/* Fallback CSS box just in case the image is missing */}
                                <div className="absolute inset-0 bg-red-600 text-white flex items-center justify-center font-bold text-4xl -z-10 tracking-widest" style={{ clipPath: 'polygon(5% 0, 100% 10%, 95% 100%, 0 90%)' }}>
                                    COMING SOON
                                </div>
                            </div>
                        </div>

                        <Button className="px-10 py-3 bg-[#0F766E] text-white rounded-md text-base font-semibold hover:bg-[#0F635A] transition-colors border-none shadow-md">
                            Notify Me
                        </Button>
                    </div>
                )}

            </Container>
        </section>
    );
};

export default MarketPlaceView;