// import React from 'react'
// import { Link } from 'react-router-dom'
// import Container from '../../../../components/layout/Container'
// import SectionHeader from '../../../../components/ui/SectionHeader'

// const tiles = [
//     { id: 1, title: 'Football', img: '/images/Football.jpg', sport: 'football' },
//     { id: 2, title: 'Padel', img: '/images/Padel.jpg', sport: 'padel' },
//     { id: 3, title: 'Squash', img: 'images/Squash.jpg', sport: 'squash' },
// ]

// const FindYourSport = () => {
//     return (
//         <section className="py-10 sm:py-16 lg:py-20 bg-[#E7F1F1]">
//             <Container>
//                 <div className="text-center mb-4 lg:mb-6">
//                   <h2 className="font-bold text-[#0B544E]  text-2xl sm:text-3xl md:text-4xl lg:text-5xl " >
//                     Find your sport. Find your squad.
//                   </h2>
//                 </div>
//                 <p className="text-center text-gray-600 text-base mb-8 max-w-2xl mx-auto">
//                   We're expanding our sports and local listings. If you can't find what you're looking for yet, help us shape what comes next.
//                 </p>

//                 <div className="flex justify-center">
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 w-full container">
//                         {tiles.map((t) => (
//                             <Link
//                                 key={t.id}
//                                 to={`/find-sport?sport=${encodeURIComponent(t.sport)}`}
//                                 className="block w-full rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
//                             >
//                                 <div className="relative flex flex-col h-full">
//                                     <img src={t.img} alt={t.title} className="w-full h-72 md:h-85 lg:h-160 object-cover block" />
//                                     <div className="absolute left-0 right-0 bottom-0 bg-[#0d6b62] text-white py-3 md:py-4 lg:py-8 px-4">
//                                         <span className="font-semibold text-2xl lg:text-3xl">{t.title}</span>
//                                     </div>
//                                 </div>
//                             </Link>
//                         ))}
//                     </div>
//                 </div>
//             </Container>
//         </section>
//     )
// }

// export default FindYourSport




import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../../../components/layout/Container';
import SectionHeader from '../../../../components/ui/SectionHeader';

const tiles = [
    { id: 1, title: 'Football', img: '/images/Football.jpg', sport: 'football' },
    { id: 2, title: 'Padel', img: '/images/Padel.jpg', sport: 'padel' },
    { id: 3, title: 'Squash', img: '/images/Squash.jpg', sport: 'squash' },
];

const FindYourSport = () => {
    const scrollRef = useRef(null);

    // Function to handle manual scrolling via arrows on mobile
    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <section className="py-10 sm:py-16 lg:py-20 bg-[#E7F1F1] overflow-hidden">
            <Container>
                <div className="text-center mb-4 lg:mb-6">
                    <h2 className="font-semibold text-[#0B544E] text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                        Find your sport. Find your squad.
                    </h2>
                </div>
                <p className="text-center text-gray-600 text-base mb-6 md:mb-12 ">
                    We're expanding our sports and local listings. If you can't find what you're looking for yet, help us shape what comes next.
                </p>

                <div className="relative flex justify-center w-full">
                    {/* Mobile Navigation Arrows (Visible only on small screens) */}
                    <button
                        onClick={() => scroll("left")}
                        className="sm:hidden absolute left-0 top-[50%] -translate-y-1/2 -translate-x-2 z-10 bg-[#0B544E] text-white p-2 rounded-full shadow-md focus:outline-none"
                        aria-label="Scroll left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>

                    <button
                        onClick={() => scroll("right")}
                        className="sm:hidden absolute right-0 top-[50%] -translate-y-1/2 translate-x-2 z-10 bg-[#0B544E] text-white p-2 rounded-full shadow-md focus:outline-none"
                        aria-label="Scroll right"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>

                    {/* Cards Grid / Slider */}
                    <div
                        ref={scrollRef}
                        className="flex sm:grid sm:grid-cols-3 gap-4 lg:gap-6 w-full overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-smooth pb-4 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                    >
                        {tiles.map((t) => (
                            <Link
                                key={t.id}
                                to={`/discover?sport=${encodeURIComponent(t.sport)}`}
                                // Mobile: Takes 85% width (w-[85%]) for peeking effect. Desktop: Takes full grid column width (sm:w-auto).
                                className="block w-[85%] sm:w-auto shrink-0 snap-center sm:snap-align-none rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="relative flex flex-col h-full">
                                    <img src={t.img} alt={t.title} className="w-full h-72 md:h-85 lg:h-160 object-cover block" />
                                    <div className="absolute left-0 right-0 bottom-0 bg-[#0d6b62] text-white py-3 md:py-4 lg:py-8 px-4">
                                        <span className="font-semibold text-2xl lg:text-3xl">{t.title}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default FindYourSport;