import React, { useMemo, useState } from 'react';
import Container from '../../../components/layout/Container';
import Button from '../../../components/ui/Button';
import PageHeader from '../../../components/ui/PageHeader';

// Sample data using the placeholder image to match your screenshot
const sampleBrands = [
  // {
  //     id: 1,
  //     name: 'IDA Sports',
  //     sport: 'Football',
  //     logo: 'https://i.ibb.co.com/YF44kMmL/Press-Blog-Image-1600x.webp',
  //     description: 'Football boots engineered specifically for women’s foot shape. Designed for performance fit and comfort at every level.',
  //     url: 'https://idasports.com',
  // },
  // {
  //     id: 2,
  //     name: 'Gilbert Netball',
  //     sport: 'Netball',
  //     logo: 'https://i.ibb.co.com/V0JTnmHm/images.png',
  //     description: 'Official netball equipment supplier offering performance balls, kits and training gear.',
  //     url: 'https://www.gilbert-netball.com',
  // },
  // {
  //     id: 3,
  //     name: 'Nike',
  //     sport: 'Multi-sport',
  //     logo: 'https://i.ibb.co.com/zhppVwBV/002-nike-logos-swoosh-white.jpg',
  //     description: 'Global sportswear brand providing training, running, football and lifestyle products.',
  //     url: 'https://www.nike.com',
  // },
  // {
  //     id: 4,
  //     name: 'Adidas',
  //     sport: 'Padel',
  //     logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
  //     description: 'Performance padel rackets and apparel designed for power, control and comfort.',
  //     url: 'https://www.adidas.com',
  // },
  {
    id: 5,
    name: 'Everera Active',
    sport: 'Fitness',
    logo: '/evera.jpg',
    description:
      'Activewear and fitness accessories designed to support women in moving, training and staying active every day.',
    url: '#',
  },
];

const BrandCard = ({ brand }) => {
  return (
    <div className="flex h-full flex-col rounded-lg border border-[#B5D5D2] bg-white p-4">
      {/* Inset Top Cover Image with its own rounded corners */}
      <div className="mb-4 w-full overflow-hidden rounded-lg bg-[#F3B48A]">
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={`${brand.name} logo`}
            className="h-auto w-full rounded-lg object-contain"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex grow flex-col">
        <h3 className="mb-2 text-2xl font-semibold text-[#0B544E]">{brand.name}</h3>
        <p className="mb-6 grow pr-2 text-base leading-relaxed text-gray-600">
          {brand.description}
        </p>

        {/* Action Button */}
        <div className="mt-auto">
          <a href={brand.url} target="_blank" rel="noreferrer" className="block w-full">
            <Button className="w-full rounded-md border-none bg-[#137C71] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F635A]">
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
      <Container className="bg-[#F8FAFC] py-6 font-sans lg:py-10">
        {/* Header Title */}

        {/* Header Section */}
        <div className="mb-6">
          <PageHeader
            title="Marketplace"
            description={'Shop curated brands and products designed for women in sport.'}
          />
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
              <span className="text-base leading-tight font-semibold">Pre-Loved</span>
              <span className="text-sm leading-tight opacity-75">(Coming Soon)</span>
            </button>

            <button
              onClick={() => setActiveTab('list_item')}
              className={`min-h-16 w-full rounded-lg px-6 py-3 text-base transition-colors hover:opacity-90 ${activeTab === 'list_item' ? 'bg-[#0F766E] text-white' : 'border border-[#0F766E] bg-white text-black'} flex flex-col items-center justify-center`}
            >
              <span className="text-base leading-tight font-semibold">List Your Item</span>
              <span className="text-sm leading-tight opacity-75">(Coming Soon)</span>
            </button>
          </div>
        </div>

        {/* Dynamic Content Area based on Active Tab */}
        {activeTab === 'shop_brands' && (
          <>
            {filtered.length === 0 ? (
              <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-8 text-center">
                <h3 className="mb-2 text-xl font-bold">No brands found</h3>
                <p className="mb-6 text-gray-600">
                  We couldn't find any brands that match "{query}". Try widening your search or
                  clear the search to see all brands.
                </p>
                <Button
                  onClick={() => setQuery('')}
                  className="rounded-md bg-[#137C71] px-6 py-2 font-semibold text-white"
                >
                  Clear search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((b) => (
                  <BrandCard key={b.id} brand={b} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Coming Soon View for Pre-Loved & List Item Tabs */}
        {(activeTab === 'pre_loved' || activeTab === 'list_item') && (
          <div className="animate-fadeIn flex flex-col items-center justify-center px-4 text-center">
            <h2 className="mx-auto mb-8 max-w-4xl text-3xl leading-tight font-semibold text-black md:text-[2.75rem]">
              {activeTab === 'pre_loved'
                ? 'A space to buy and sell pre-loved sports kit within the ESSA community.'
                : 'A space to list your sports items and reach the ESSA community.'}
            </h2>

            {/* Red Brush Stroke Image Placeholder */}
            <div className="mb-10 flex w-full justify-center">
              <div className="relative flex h-25 w-75 items-center justify-center md:h-32.5 md:w-100">
                {/* Replace the src below with the actual path to your red brush stroke image */}
                <img
                  src="/comingSoon.png"
                  alt="Coming Soon"
                  className="absolute inset-0 h-full w-full object-contain"
                />
                {/* Fallback CSS box just in case the image is missing */}
                <div
                  className="absolute inset-0 -z-10 flex items-center justify-center bg-red-600 text-4xl font-bold tracking-widest text-white"
                  style={{ clipPath: 'polygon(5% 0, 100% 10%, 95% 100%, 0 90%)' }}
                >
                  COMING SOON
                </div>
              </div>
            </div>

            <Button className="rounded-md border-none bg-[#0F766E] px-10 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-[#0F635A]">
              Notify Me
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default MarketPlaceView;
