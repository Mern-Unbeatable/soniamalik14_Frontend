
import React from 'react';
import Container from '../../../../components/layout/Container';

const decodeHtmlEntities = (value = '') => {
  if (typeof document === 'undefined') return String(value || '');
  const textarea = document.createElement('textarea');
  textarea.innerHTML = String(value || '');
  return textarea.value;
};

const sanitizeText = (value = '') =>
  decodeHtmlEntities(String(value || ''))
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const renderTextBlocks = (value) => {
  const content = String(value || '').trim();
  if (!content) return null;

  const looksLikeHtml = /<[^>]+>/.test(content);
  if (looksLikeHtml) {
    return (
      <div
        className="max-w-full text-[15px] text-justify md:text-base lg:text-lg text-[#1A1D1F] leading-relaxed break-words [&_p]:mb-4 [&_p]:whitespace-normal [&_p]:break-words [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:break-words [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:break-words [&_li]:break-words [&_span]:whitespace-normal [&_span]:break-words"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  const blocks = content
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return (
    <div className="space-y-4 md:space-y-6">
      {blocks.map((block, idx) => (
        <p key={`about-block-${idx}`} className="max-w-full break-words text-[15px] md:text-base lg:text-lg text-[#1A1D1F] leading-relaxed">
          {block}
        </p>
      ))}
    </div>
  );
};

const AboutMission = ({ section }) => {
  const aboutImages = Array.isArray(section?.aboutImages) ? section.aboutImages.slice(0, 4) : [];
  const [imgOne, imgTwo, imgThree, imgFour] = aboutImages;

  return (
    <section className="py-10 sm:py-16 lg:py-20">
      <Container>
        {/* Switched to flex-col on mobile/tablet so image goes below text, and grid on lg devices */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 md:gap-14 lg:gap-16 items-center">

          {/* Left: Text Content */}
          <div className="order-1 lg:order-none w-full min-w-0 max-w-full text-justify">
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-[#0B544E] mb-4 md:mb-6">
              {sanitizeText(section?.title)}
            </h2>
            {section?.subtitle ? (
              <p className="mb-4 md:mb-6 text-base md:text-xl text-[#0B544E] leading-relaxed">
                {sanitizeText(section?.subtitle)}
              </p>
            ) : null}

            {renderTextBlocks(section?.description)}
          </div>

          {/* Right: Image Collage (Below text on Tab/Mobile) */}
          <div className="hidden lg:block w-full max-w-xl mx-auto lg:max-w-none">
            <div className="grid grid-cols-2 gap-3 md:gap-5 lg:gap-6">

              {/* Left Column */}
              <div className="flex flex-col gap-3 md:gap-5 lg:gap-6">
                {/* Football field - Tall image (Height increased for md/lg, original for xl) */}
                <div className="w-full aspect-[3/4] md:aspect-[2/3] lg:aspect-[2/3.2] xl:aspect-[2.7/3] 2xl:aspect-[3.5/3] rounded-2xl md:rounded-[24px] overflow-hidden shadow-sm">
                  {imgOne ? (
                    <img src={imgOne} alt="About image one" className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-200" />
                  )}
                </div>

                {/* Woman resting - Pill shaped (Height increased for md/lg, original for xl) */}
                <div className="w-full aspect-[2/1] md:aspect-[2/1.4] lg:aspect-[2/1.3] xl:aspect-[2.5/1] rounded-[100px] overflow-hidden shadow-sm">
                  {imgTwo ? (
                    <img src={imgTwo} alt="About image two" className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-200" />
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-3 md:gap-5 lg:gap-6">
                {/* Three women - Pill shaped (Height increased for md/lg, original for xl) */}
                <div className="w-full aspect-[2/1] md:aspect-[2/1.4] lg:aspect-[2/1.3] xl:aspect-[2.5/1] rounded-[100px] overflow-hidden shadow-sm">
                  {imgThree ? (
                    <img src={imgThree} alt="About image three" className="w-full h-full object-cover object-center" />
                  ) : (
                    <div className="h-full w-full bg-gray-200" />
                  )}
                </div>

                {/* Basketball player - Tall image (Height increased for md/lg, original for xl) */}
                <div className="w-full aspect-[3/4] md:aspect-[2/3] lg:aspect-[2/3.2] xl:aspect-[2.7/3] 2xl:aspect-[3.5/3] rounded-2xl md:rounded-[24px] overflow-hidden shadow-sm">
                  {imgFour ? (
                    <img src={imgFour} alt="About image four" className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-200" />
                  )}
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