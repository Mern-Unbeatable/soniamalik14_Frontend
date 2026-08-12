// import { useRef } from 'react';

// const HubCard = ({ title, description, image, alt }) => {
//   return (
//     <article
//       className="group flex w-[85%] shrink-0 cursor-pointer snap-center flex-col overflow-hidden rounded-2xl border-[5px] border-white bg-white shadow-lg shadow-black/20 sm:w-auto sm:snap-align-none"
//       role="button"
//       tabIndex={0}
//       aria-label={`Explore ${title}`}
//       onKeyDown={(e) => e.key === 'Enter' && console.log(`Maps to ${title}`)}
//     >
//       <div className="relative h-52 overflow-hidden">
//         {image ? (
//           <img src={image} alt={alt} className="h-full w-full object-cover" />
//         ) : (
//           <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
//             No image
//           </div>
//         )}
//       </div>

//       <div className="flex flex-1 flex-col bg-[#F1F1F5] p-6">
//         <h3 className="mb-2 text-lg font-semibold text-[#0B544E]">{title}</h3>
//         <p className="text-base leading-relaxed text-[#373737]">{description}</p>
//       </div>
//     </article>
//   );
// };

// const decodeHtmlEntities = (value = '') => {
//   if (typeof document === 'undefined') return String(value || '');
//   const textarea = document.createElement('textarea');
//   textarea.innerHTML = String(value || '');
//   return textarea.value;
// };

// const sanitizeText = (value) =>
//   decodeHtmlEntities(String(value || ''))
//     .replace(/<[^>]*>/g, ' ')
//     .replace(/\s+/g, ' ')
//     .trim();

// export default function CoreFeatures({ cards = [], section }) {
//   const scrollRef = useRef(null);
//   const title = section?.sectionTitle || '';
//   const subtitle = section?.sectionSubTitle || '';
  
//   const displayCards = Array.isArray(cards) && cards.length > 0
//     ? cards.map((card, idx) => ({
//       id: card?.id || `card-${idx + 1}`,
//       title: sanitizeText(card?.title) || 'Untitled',
//       description: sanitizeText(card?.description) || '',
//       image: card?.image || '',
//       alt: sanitizeText(card?.subtitle) || sanitizeText(card?.title) || 'Card image',
//     }))
//     : [];
//   const scroll = (direction) => {
//     if (scrollRef.current) {
//       const scrollAmount = direction === 'left' ? -300 : 300;
//       scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
//     }
//   };

//   return (
//     <section
//       id="core-features"
//       className="flex h-auto w-full flex-col items-center justify-center overflow-hidden bg-[#E7F1F199] px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20 scroll-mt-24"
//       aria-labelledby="essa-hub-heading"
//     >
//       <div className="relative container w-full">
//         <header className="mb-6 text-center md:mb-12">
//           <h1
//             id="essa-hub-heading"
//             className="mb-3 text-2xl font-semibold tracking-tight text-[#0B544E] sm:text-3xl md:text-4xl lg:text-5xl"
//           >
//             {title}
//           </h1>
//           <p className="text-base text-gray-500 sm:text-lg">
//             {subtitle}
//           </p>
//         </header>

//         <button
//           onClick={() => scroll('left')}
//           className="absolute top-[60%] left-0 z-10 -translate-x-2 -translate-y-1/2 rounded-full bg-[#0B544E] p-2 text-white shadow-md focus:outline-none sm:hidden"
//           aria-label="Scroll left"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={2.5}
//             stroke="currentColor"
//             className="h-5 w-5"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
//             />
//           </svg>
//         </button>

//         <button
//           onClick={() => scroll('right')}
//           className="absolute top-[60%] right-0 z-10 translate-x-2 -translate-y-1/2 rounded-full bg-[#0B544E] p-2 text-white shadow-md focus:outline-none sm:hidden"
//           aria-label="Scroll right"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth={2.5}
//             stroke="currentColor"
//             className="h-5 w-5"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
//             />
//           </svg>
//         </button>

//         <div
//           ref={scrollRef}
//           className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:'none'] [scrollbar-width:'none'] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
//         >
//           {displayCards.map((card) => (
//             <HubCard key={card.id} {...card} />
//           ))}
//           {displayCards.length === 0 && (
//             <div className="col-span-full rounded-lg bg-white/70 p-6 text-center text-sm text-gray-600">
//               No cards available right now.
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }



import { useState, useRef } from 'react';

const cardData = [
  {
    id: 1,
    title: 'Discover',
    description:
      'Explore women-only teams, sessions and activities near you - from beginner-friendly to competitive.',
    image: '/images/Discover.jpg',
    alt: 'Person tying athletic shoes',
  },
  {
    id: 2,
    title: 'Community & Guidance',
    description: 'Ask questions, share experiences and build your network.',
    image: '/images/Community.webp',
    alt: 'Group of women exercising outdoors',
  },
  {
    id: 3,
    title: 'Support & Services',
    description:
      'Find women-focused professionals and services designed to support an active lifestyle.',
    image: '/images/Support.jpg',
    alt: 'Female healthcare professional',
  },
  {
    id: 4,
    title: 'Marketplace',
    description: 'A curated space for brands supporting women in sport.',
    image: '/images/Marketplace.jpg',
    alt: 'Sports gear and equipment',
  },
];

const HubCard = ({ title, description, image, alt }) => {
  const [isHovered, setHovered] = useState(false);

  return (
    <article
      // Mobile view: Takes 85% width and enables snapping. Desktop: Auto width.
      className="group flex w-[85%] shrink-0 cursor-pointer snap-center flex-col overflow-hidden rounded-2xl border-[5px] border-white bg-white shadow-lg shadow-black/20 sm:w-auto sm:snap-align-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Explore ${title}`}
      onKeyDown={(e) => e.key === 'Enter' && console.log(`Maps to ${title}`)}
    >
      {/* Image container */}
      <div className="relative h-52 overflow-hidden">
        <img src={image} alt={alt} className="h-full w-full object-cover" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col bg-[#F1F1F5] p-6">
        <h3 className="mb-2 text-lg font-semibold text-[#0B544E]">{title}</h3>
        <p className="text-base leading-relaxed text-[#373737]">{description}</p>
      </div>
    </article>
  );
};

export default function CoreFeatures() {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      className="flex h-auto w-full flex-col items-center justify-center overflow-hidden bg-[#E7F1F199] px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20"
      aria-labelledby="essa-hub-heading"
    >
      <div className="relative container w-full">
        {/* Header */}
        <header className="mb-6 text-center md:mb-12">
          <h1
            id="essa-hub-heading"
            className="mb-3 text-2xl font-semibold tracking-tight text-[#0B544E] sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Explore ESSA Hub
          </h1>
          <p className="text-base text-gray-500 sm:text-lg">
            Everything you need - all in one place.
          </p>
        </header>

        <button
          onClick={() => scroll('left')}
          className="absolute top-[60%] left-0 z-10 -translate-x-2 -translate-y-1/2 rounded-full bg-[#0B544E] p-2 text-white shadow-md focus:outline-none sm:hidden"
          aria-label="Scroll left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>

        <button
          onClick={() => scroll('right')}
          className="absolute top-[60%] right-0 z-10 translate-x-2 -translate-y-1/2 rounded-full bg-[#0B544E] p-2 text-white shadow-md focus:outline-none sm:hidden"
          aria-label="Scroll right"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:'none'] [scrollbar-width:'none'] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
        >
          {cardData.map((card) => (
            <HubCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
