// import { useState } from 'react';

// const renderHtmlOrText = (value, className) => {
//   const content = String(value || '').trim();
//   if (!content) return null;

//   const looksLikeHtml = /<[^>]+>/.test(content);
//   if (looksLikeHtml) {
//     return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />;
//   }

//   return <p className={className}>{content}</p>;
// };

// const Foundersection = ({ section }) => {
//   const [hovered, setHovered] = useState(false);
//   const founderInfoRaw = section?.founderInfo || '';
//   const founderInfoObject =
//     founderInfoRaw && typeof founderInfoRaw === 'object' && !Array.isArray(founderInfoRaw)
//       ? founderInfoRaw
//       : null;
//   const founderImage = founderInfoObject?.image || section?.brandImg || '';
//   const founderTitle = founderInfoObject?.title || 'A note from the founder';
//   const founderIntro = founderInfoObject?.intro || '';
//   const founderParagraphs = Array.isArray(founderInfoObject?.paragraphs)
//     ? founderInfoObject.paragraphs
//     : [];
//   const founderFooterTitle = founderInfoObject?.footerTitle || 'Welcome to ESSA Hub';
//   const founderFallbackText = !founderInfoObject ? founderInfoRaw : '';

//   return (
//     <div className="flex h-auto items-center justify-center bg-[#E7F1F1] px-4 py-10 sm:py-16 lg:py-20">
//       <article
//         className="relative w-full max-w-lg rounded-2xl bg-white px-6 py-8 shadow-lg transition-all duration-500 md:max-w-5xl md:p-10"
//         style={{
//           boxShadow: hovered
//             ? '0 32px 64px rgba(90, 158, 146, 0.18), 0 8px 24px rgba(0,0,0,0.07)'
//             : '0 16px 48px rgba(90, 158, 146, 0.12), 0 4px 16px rgba(0,0,0,0.06)',
//         }}
//         onMouseEnter={() => setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//       >
//         {/* Header section: Modified for Mobile Horizontal Layout */}
//         <header className="mb-6 md:mb-4 flex flex-row items-center gap-4 sm:mb-8 sm:items-start sm:gap-6">
//           {/* Founder photo: Circular and small on mobile, larger on desktop */}
//           <div className="shrink-0">
//             {founderImage ? (
//               <img
//                 src={founderImage}
//                 alt="ESSA Hub founder"
//                 className="h-28 w-28 rounded-lg object-cover sm:h-36 sm:w-36 "
//               />
//             ) : (
//               <div className="h-28 w-28 rounded-lg bg-gray-300 sm:h-36 sm:w-36" />
//             )}
//           </div>

//           {/* Title */}
//           <div className="flex-1  mt-0 md:mt-2">
//             <h1 className="text-xl leading-tight font-normal text-[#0B544E] italic sm:text-3xl sm:not-italic  pb-2">
//               {founderTitle}
//             </h1>
//             {/**for large device */}
//             {founderInfoObject ? (
//               <div className="hidden lg:block">
//                 {renderHtmlOrText(
//                   founderIntro,
//                   'text-[15px] leading-relaxed text-[#1A1D1F]/80 md:text-lg'
//                 )}
//               </div>
//             ) : (
//               <div className="hidden lg:block">
//                 {renderHtmlOrText(
//                   founderFallbackText,
//                   'text-[15px] leading-relaxed text-[#1A1D1F]/80 md:text-lg'
//                 )}
//               </div>
//             )}
//           </div>
//         </header>

//         {/* Content Body */}
//         {founderInfoObject ? (
//           <div className="space-y-5">
//             <div className="lg:hidden">
//               {renderHtmlOrText(
//                 founderIntro,
//                 'text-[15px] leading-relaxed text-[#1A1D1F]/80 md:text-lg'
//               )}
//             </div>
//             {founderParagraphs.map((paragraph, idx) => (
//               <div key={`founder-paragraph-${idx}`}>
//                 {renderHtmlOrText(
//                   paragraph,
//                   'text-[15px] leading-relaxed text-[#1A1D1F]/80 md:text-lg'
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="space-y-5">
//             <div className="lg:hidden">
//               {renderHtmlOrText(
//                 founderFallbackText,
//                 'text-[15px] leading-relaxed text-[#1A1D1F]/80 md:text-lg'
//               )}
//             </div>
//           </div>
//         )}

//         {/* Sign-off */}
//         <footer className="mt-8 pt-2">
//           <p className="text-[15px] font-medium text-[#1A1D1F] md:text-lg">{founderFooterTitle}</p>
//         </footer>
//       </article>
//     </div>
//   );
// };

// export default Foundersection;



import { useState } from 'react';

const Foundersection = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex h-auto items-center justify-center bg-[#E7F1F1] px-4 py-10 sm:py-16 lg:py-20">
      <article
        className="relative w-full max-w-lg rounded-2xl bg-white px-6 py-8 shadow-lg transition-all duration-500 md:max-w-5xl md:p-10"
        // style={{
        //   boxShadow: hovered
        //     ? '0 32px 64px rgba(90, 158, 146, 0.18), 0 8px 24px rgba(0,0,0,0.07)'
        //     : '0 16px 48px rgba(90, 158, 146, 0.12), 0 4px 16px rgba(0,0,0,0.06)',
        // }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Header section: Modified for Mobile Horizontal Layout */}
        <header className="mb-6 md:mb-4 flex flex-row items-center gap-4 sm:mb-8 sm:items-start sm:gap-6">
          {/* Founder photo: Circular and small on mobile, larger on desktop */}
          <div className="shrink-0">
            <img
              src="/founderImage.jpeg"
              alt="ESSA Hub founder"
              className="h-28 w-28 rounded-lg object-cover sm:h-36 sm:w-36 "
            />
          </div>

          {/* Title */}
          <div className="flex-1  mt-0 md:mt-2">
            <h1 className="text-xl leading-tight font-normal text-[#0B544E] italic sm:text-3xl sm:not-italic  pb-2">
              A note from the founder
            </h1>
            {/**for large device */}
            <p className="hidden lg:block text-[15px] leading-relaxed text-[#1A1D1F]/80 md:text-lg">
              ESSA Hub grew from recognising that women's relationship with sport isn't always
              straightforward. Life changes. Confidence shifts. Priorities evolve. The right
              opportunity isn't always obvious or accessible.
            </p>
          </div>
        </header>

        {/* Content Body */}
        <div className="space-y-5">
          {/**for mobile device */}
          <p className="lg:hidden text-[15px] leading-relaxed text-[#1A1D1F]/80 md:text-lg">
            ESSA Hub grew from recognising that women's relationship with sport isn't always
            straightforward. Life changes. Confidence shifts. Priorities evolve. The right
            opportunity isn't always obvious or accessible.
          </p>
          <p className="text-[15px] leading-relaxed text-[#1A1D1F]/80 md:text-lg">
            I wanted to build something that makes getting involved easier-in ways that fit around
            real life. A space where women can explore opportunities, connect with others and take
            part in ways that feel right for them, without pressure or judgement.
          </p>

          <p className="text-[15px] leading-relaxed text-[#1A1D1F]/80 md:text-lg">
            ESSA Hub is still growing and evolving, shaped by the women who use it. My hope is that
            it becomes a place women return to again and again, as their lives and interests change
            over time.
          </p>
        </div>

        {/* Sign-off */}
        <footer className="mt-8 pt-2">
          <p className="text-[15px] font-medium text-[#1A1D1F] md:text-lg">Welcome to ESSA Hub</p>
        </footer>
      </article>
    </div>
  );
};

export default Foundersection;
