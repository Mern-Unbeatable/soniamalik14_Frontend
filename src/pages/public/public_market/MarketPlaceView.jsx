import React, { useEffect, useMemo, useRef, useState } from 'react';
import Container from '../../../components/layout/Container';
import Button from '../../../components/ui/Button';
import PageHeader from '../../../components/ui/PageHeader';
import { marketplaceBrands } from '../../../data/marketplaceBrands';
import { POST } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';

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
  ...marketplaceBrands,
];

const trackBrandClick = (brand) => {
  if (!brand?.slug || !brand.url || brand.url === '#') return;
  POST(ENDPOINT.MARKETPLACE.BRAND_CLICK, { brandKey: brand.slug }).catch(() => {});
};

const BrandCard = ({ brand }) => {
  const descriptionRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = descriptionRef.current;
    if (!el || expanded) return undefined;

    // Newer browsers report scrollHeight as the clamped height, so compare against the unclamped height.
    const measure = () => {
      const clampedHeight = el.getBoundingClientRect().height;
      el.style.display = 'block';
      el.style.webkitLineClamp = 'unset';
      const fullHeight = el.getBoundingClientRect().height;
      el.style.display = '';
      el.style.webkitLineClamp = '';
      setIsTruncated(fullHeight > clampedHeight + 1);
    };
    measure();
    document.fonts?.ready.then(measure);

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, brand.description]);

  return (
    // Only the image row is shared across the grid row (so names line up); the body sizes itself
    // so expanding one description doesn't stretch the neighbouring cards.
    <div className="row-span-2 mb-6 grid grid-rows-subgrid gap-y-0">
      <div className="rounded-t-lg border border-b-0 border-[#B5D5D2] bg-white px-4 pt-4">
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
      </div>

      <div className="flex flex-col self-start rounded-b-lg border border-t-0 border-[#B5D5D2] bg-white px-4 pb-4">
        <h3 className="mb-2 truncate text-2xl font-semibold text-[#0B544E]" title={brand.name}>
          {brand.name}
        </h3>
        <p
          ref={descriptionRef}
          className={`min-h-[6.5rem] text-base leading-relaxed text-gray-600 ${expanded ? '' : 'line-clamp-4'}`}
        >
          {brand.description}
        </p>

        <div className="mb-4 h-7">
          {(isTruncated || expanded) && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="text-sm font-semibold text-[#137C71] hover:underline"
              aria-expanded={expanded}
            >
              {expanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>

        <div>
          <a
            href={brand.url}
            target="_blank"
            rel="noreferrer"
            className="block w-full"
            onClick={() => trackBrandClick(brand)}
          >
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
              <div className="grid grid-cols-1 gap-x-6 gap-y-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
