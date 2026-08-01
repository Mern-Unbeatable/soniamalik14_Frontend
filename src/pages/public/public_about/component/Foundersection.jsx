import { useState } from 'react';

const Foundersection = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex h-auto items-center justify-center bg-[#E7F1F1] px-4 py-10 sm:py-16 lg:py-20">
      <article
        className="relative w-full max-w-lg rounded-2xl bg-white px-6 py-8 shadow-lg transition-all duration-500 md:max-w-5xl md:p-10"
 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Header section: Modified for Mobile Horizontal Layout */}
        <header className="mb-6 flex flex-row items-center gap-4 sm:mb-8 sm:items-start sm:gap-6 md:mb-4">
          {/* Founder photo: Circular and small on mobile, larger on desktop */}
          <div className="shrink-0">
            <img
              src="/founderImage.jpeg"
              alt="ESSA Hub founder"
              className="h-28 w-28 rounded-lg object-cover sm:h-36 sm:w-36"
            />
          </div>

          {/* Title */}
          <div className="mt-0 flex-1 md:mt-2">
            <h1 className="pb-2 text-xl leading-tight font-normal text-[#0B544E] italic sm:text-3xl sm:not-italic">
              Founder’s Note
            </h1>
            {/**for large device */}
            <p className="hidden text-[15px] leading-relaxed text-[#1A1D1F]/80 md:text-lg lg:block">
              Joining a football team and taking up squash in my 40s opened my eyes to something I
              wish more women could experience.
            </p>
          </div>
        </header>

        {/* Content Body */}
        <div className="space-y-5">
          {/**for mobile device */}
          <p className="text-[15px] leading-relaxed text-[#1A1D1F]/80 md:text-lg lg:hidden">
            EJoining a football team and taking up squash in my 40s opened my eyes to something I
            wish more women could experience.
          </p>
          <p className="text-[15px] leading-relaxed text-[#1A1D1F]/80 md:text-lg">
            Beyond the fitness, sport has given me space to have fun, laugh, challenge myself and be
            part of something outside the usual responsibilities of everyday life. It has also
            reminded me that it is never too late to try something new or return to something you
            once loved.
          </p>

          <p className="text-[15px] leading-relaxed text-[#1A1D1F]/80 md:text-lg">
            Whether you want to pick up a racket for the first time or lace up your boots again,
            ESSA Hub is here to help.
          </p>
        </div>

        {/* Sign-off */}
        <footer className="mt-8 pt-2">
          <p className="text-[15px] font-medium text-[#1A1D1F] md:text-lg">Welcome to ESSA Hub</p>
          <p className='text-[15px]  text-[#1A1D1F] md:text-lg'>Sonia Malik</p>
          <p> Founder, ESSA Hub</p>
        </footer>
      </article>
    </div>
  );
};

export default Foundersection;
