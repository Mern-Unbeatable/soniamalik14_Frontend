
import React from 'react';
import Container from '../../../../components/layout/Container';
import Button from '../../../../components/ui/Button';

const InjurySupportHub = () => {
  return (
    <section className="py-12 lg:py-16">
      <Container>
        <div className="">
          <div className="rounded-2xl overflow-hidden shadow-lg bg-btn-primary text-white grid grid-cols-1 lg:grid-cols-[60%_40%]">
            {/* Left: Content */}
            <div className="p-4 lg:p-12">
              <h2 className="text-2xl lg:text-4xl font-bold mb-4">Injury Support Hub</h2>

              <p className="text-base text-[#F3F3F3] mb-6 max-w-2xl">
                Injuries and setbacks are a common part of staying active - but they shouldn’t mean stepping away from sport altogether.
              </p>

              <p className="text-base text-[#F3F3F3] mb-6 max-w-xl">
                The ESSA Injury Support Hub is a starting point for women dealing with injury, recovery, or returning after time out. It helps you find the right professional support and feel less alone in the process.
              </p>
              <p className="text-base text-[#F3F3F3] mb-6 max-w-2xl">
                What this hub aims to offer:
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-white text-xl">Trusted physio partners</h3>
                  <p className="text-[#F3F3F3] text-base">Connect with professionals who work with women and understand the realities of female sport and movement.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-white text-xl">Simple, general recovery principles</h3>
                  <p className="text-[#F3F3F3] text-base">Clear, common-sense guidance around rest, gradual return and listening to your body — without medical overload.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-white text-xl">Community-led insight</h3>
                  <p className="text-[#F3F3F3] text-base">Learn from shared experiences within the ESSA community as the platform grows.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-white text-xl">A place to start</h3>
                  <p className="text-[#F3F3F3] text-base">If you're unsure who to speak to or how to return, this hub helps you take the first step.</p>
                </div>
              </div>

              <p className="text-base text-white mb-6">ESSA does not replace medical advice - it’s here to help you find the right support.</p>

          
            </div>

            {/* Right: Patterned panel */}
            <div 
                className="hidden lg:block h-full"
                style={{
                  backgroundImage: `url('/ctaBg.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              ></div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default InjurySupportHub;





