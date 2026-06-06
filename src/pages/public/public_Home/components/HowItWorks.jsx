import React from 'react';
import { UserPlus, Search, Users2 } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus className="w-10 h-10 text-white" />,
    title: "Join",
    description: "Create a profile to join the ESSA Hub community.",
  },
  {
    icon: <Search className="w-10 h-10 text-white" />,
    title: "Browse",
    description: "Explore women-focused opportunities around you.",
  },
  {
    icon: <Users2 className="w-10 h-10 text-white" />,
    title: "Get involved",
    description: "Play, connect and access the support available.",
  }
];

const HowItWorks = () => {
  return (
    <section className="bg-[#F8FAFC] py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <h2 className="font-semibold text-[#0B544E] text-2xl sm:text-3xl md:text-4xl lg:text-5xl  text-center  mb-10 md:mb-16">
          How it works
        </h2>

        {/* Process Container */}
        <div className="relative">

          {/* Main Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-[45px] left-0 right-0 h-[4px] bg-[#0F766E] z-0 mx-4">
            {/* Left End Dot */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0F766E] " />
            {/* Right End Dot */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0F766E]" />
          </div>

          {/* Steps Wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">

                {/* Icon Circle */}
                <div className="relative mb-6">
                  {/* White background behind icon to create the 'line-break' effect */}
                  <div className="absolute inset-0 bg-[#F8FAFC] scale-50 md:scale-160 rounded-full z-[-1] invisible md:visible" />

                  <div className="w-22 h-22 rounded-full  bg-gradient-to-br from-[#79D7C6] to-[#29A7AE]  flex items-center justify-center shadow-sm">
                    {step.icon}
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="text-2xl font-bold text-[#0B544E] mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed max-w-[250px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
