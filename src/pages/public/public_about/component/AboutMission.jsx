// import React from 'react';
// import Container from '../../../../components/layout/Container';

// const decodeHtmlEntities = (value = '') => {
//   if (typeof document === 'undefined') return String(value || '');
//   const textarea = document.createElement('textarea');
//   textarea.innerHTML = String(value || '');
//   return textarea.value;
// };

// const sanitizeText = (value = '') =>
//   decodeHtmlEntities(String(value || ''))
//     .replace(/<[^>]*>/g, ' ')
//     .replace(/\s+/g, ' ')
//     .trim();

// const renderTextBlocks = (value) => {
//   const content = String(value || '').trim();
//   if (!content) return null;

//   const looksLikeHtml = /<[^>]+>/.test(content);
//   if (looksLikeHtml) {
//     return (
//       <div
//         className="max-w-full text-justify text-[15px] leading-relaxed break-words text-[#1A1D1F] md:text-base lg:text-lg [&_li]:break-words [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:break-words [&_p]:mb-4 [&_p]:break-words [&_p]:whitespace-normal [&_span]:break-words [&_span]:whitespace-normal [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:break-words"
//         dangerouslySetInnerHTML={{ __html: content }}
//       />
//     );
//   }

//   const blocks = content
//     .split(/\n+/)
//     .map((item) => item.trim())
//     .filter(Boolean);
//   return (
//     <div className="space-y-4 md:space-y-6">
//       {blocks.map((block, idx) => (
//         <p
//           key={`about-block-${idx}`}
//           className="max-w-full text-[15px] leading-relaxed break-words text-[#1A1D1F] md:text-base lg:text-lg"
//         >
//           {block}
//         </p>
//       ))}
//     </div>
//   );
// };

// const AboutMission = ({ section }) => {
//   const aboutImages = Array.isArray(section?.aboutImages) ? section.aboutImages.slice(0, 4) : [];
//   const [imgOne, imgTwo, imgThree, imgFour] = aboutImages;

//   return (
//     <section className="py-10 sm:py-16 lg:py-20">
//       <Container>
//         {/* Switched to flex-col on mobile/tablet so image goes below text, and grid on lg devices */}
//         <div className="flex flex-col items-center gap-10 md:gap-14 lg:grid lg:grid-cols-2 lg:gap-16">
//           {/* Left: Text Content */}
//           <div className="order-1 w-full max-w-full min-w-0 lg:order-none">
//             <h2 className="mb-4 text-3xl font-bold text-[#0B544E] md:mb-6 md:text-4xl lg:text-[40px]">
//               {sanitizeText(section?.title)}
//             </h2>
//             {section?.subtitle ? (
//               <p className="mb-4 text-base leading-relaxed text-[#0B544E] md:mb-6 md:text-xl">
//                 {sanitizeText(section?.subtitle)}
//               </p>
//             ) : null}

//             {renderTextBlocks(section?.description)}
//           </div>

//           {/* Right: Image Collage (Below text on Tab/Mobile) */}
//           <div className="mx-auto hidden w-full max-w-xl lg:block lg:max-w-none">
//             <div className="grid grid-cols-2 gap-3 md:gap-5 lg:gap-6">
//               {/* Left Column */}
//               <div className="flex flex-col gap-3 md:gap-5 lg:gap-6">
//                 {/* Football field - Tall image (Height increased for md/lg, original for xl) */}
//                 <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-sm md:aspect-[2/3] md:rounded-[24px] lg:aspect-[2/3.2] xl:aspect-[2.7/3] 2xl:aspect-[3.5/3]">
//                   {imgOne ? (
//                     <img
//                       src={imgOne}
//                       alt="About image one"
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <div className="h-full w-full bg-gray-200" />
//                   )}
//                 </div>

//                 {/* Woman resting - Pill shaped (Height increased for md/lg, original for xl) */}
//                 <div className="aspect-[2/1] w-full overflow-hidden rounded-[100px] shadow-sm md:aspect-[2/1.4] lg:aspect-[2/1.3] xl:aspect-[2.5/1]">
//                   {imgTwo ? (
//                     <img
//                       src={imgTwo}
//                       alt="About image two"
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <div className="h-full w-full bg-gray-200" />
//                   )}
//                 </div>
//               </div>

//               {/* Right Column */}
//               <div className="flex flex-col gap-3 md:gap-5 lg:gap-6">
//                 {/* Three women - Pill shaped (Height increased for md/lg, original for xl) */}
//                 <div className="aspect-[2/1] w-full overflow-hidden rounded-[100px] shadow-sm md:aspect-[2/1.4] lg:aspect-[2/1.3] xl:aspect-[2.5/1]">
//                   {imgThree ? (
//                     <img
//                       src={imgThree}
//                       alt="About image three"
//                       className="h-full w-full object-cover object-center"
//                     />
//                   ) : (
//                     <div className="h-full w-full bg-gray-200" />
//                   )}
//                 </div>

//                 {/* Basketball player - Tall image (Height increased for md/lg, original for xl) */}
//                 <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-sm md:aspect-[2/3] md:rounded-[24px] lg:aspect-[2/3.2] xl:aspect-[2.7/3] 2xl:aspect-[3.5/3]">
//                   {imgFour ? (
//                     <img
//                       src={imgFour}
//                       alt="About image four"
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <div className="h-full w-full bg-gray-200" />
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Container>
//     </section>
//   );
// };

// export default AboutMission;









 
import React from 'react';
import Container from '../../../../components/layout/Container';
 
const AboutMission = () => {
  return (
    <section className="py-10 sm:py-16 lg:py-20">
      <Container>
        {/* Switched to flex-col on mobile/tablet so image goes below text, and grid on lg devices */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 md:gap-14 lg:gap-16 items-center">
 
          {/* Left: Text Content */}
          <div className="order-1 lg:order-none w-full">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-[#0B544E] mb-4 md:mb-6">
              About ESSA Hub
            </h2>
 
            <div className="space-y-4 md:space-y-6">
              <p className="text-[15px] md:text-base lg:text-lg text-[#1A1D1F] leading-relaxed">
                Sport plays a powerful role in physical health, confidence and mental
                wellbeing. ESSA Hub was created to help more women access those
                benefits by making women's sport easier to find, easier to join and
                easier to feel part of.
              </p>
 
              <p className="text-base md:text-xl text-[#1A1D1F] leading-relaxed">
                For many women, opportunities aren't always visible. Information can
                be scattered, local sessions can be hard to discover, and starting or
                returning can feel daunting.
              </p>
 
              <p className="text-base md:text-xl text-[#1A1D1F] leading-relaxed">
                ESSA Hub brings local sport, community and women-focused services
                into one place.
              </p>
 
              <p className="text-base md:text-xl text-[#1A1D1F] font-bold">
                Built for women. Led by women. Focused on participation.
              </p>
            </div>
          </div>
 
          {/* Right: Image Collage (Below text on Tab/Mobile) */}
          <div className="mx-auto hidden w-full max-w-xl lg:block lg:max-w-none">
            <div className="grid grid-cols-2 gap-3 md:gap-5 lg:gap-6">
 
              {/* Left Column */}
              <div className="flex flex-col gap-3 md:gap-5 lg:gap-6">
                {/* Football field - Tall image (Height increased for md/lg, original for xl) */}
                <div className="w-full aspect-[3/4] md:aspect-[2/3] lg:aspect-[2/3.2] xl:aspect-[2.7/3] 2xl:aspect-[3.5/3] rounded-2xl md:rounded-[24px] overflow-hidden shadow-sm">
                  <img
                    // src="https://i.ibb.co.com/HTH1JGdM/8566dfd34f75b216152413d0df32b95e7a8e5cde.png"
                    src="mission1.webp"
                    alt="Football field"
                    className="w-full h-full object-cover"
                  />
                </div>
 
                {/* Woman resting - Pill shaped (Height increased for md/lg, original for xl) */}
                <div className="w-full aspect-[2/1] md:aspect-[2/1.4] lg:aspect-[2/1.3] xl:aspect-[2.5/1] rounded-[100px] overflow-hidden shadow-sm">
                  <img
                    src="mission4.webp"
                    alt="Woman resting"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
 
              {/* Right Column */}
              <div className="flex flex-col gap-3 md:gap-5 lg:gap-6">
                {/* Three women - Pill shaped (Height increased for md/lg, original for xl) */}
                <div className="w-full aspect-[2/1] md:aspect-[2/1.4] lg:aspect-[2/1.3] xl:aspect-[2.5/1] rounded-[100px] overflow-hidden shadow-sm">
                  <img
                    src="mission3.webp"
                    alt="Three women"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
 
                {/* Basketball player - Tall image (Height increased for md/lg, original for xl) */}
                <div className="w-full aspect-[3/4] md:aspect-[2/3] lg:aspect-[2/3.2] xl:aspect-[2.7/3] 2xl:aspect-[3.5/3] rounded-2xl md:rounded-[24px] overflow-hidden shadow-sm">
                  <img
                    src="mission2.webp"
                    alt="Basketball player"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
 
            </div>
          </div>
 
        </div>
      </Container>
    </section>
  );
};
 
export default AboutMission;
 