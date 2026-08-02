import React from 'react';
import Container from '../../../components/layout/Container';
import SportProvidersSection from './components/SportProvidersSection';
import ProfessionalSupportSection from './components/ProfessionalSupportSection';
import BrandsProductsSection from './components/BrandsProductsSection';

const CollaborateView = () => {
  return (
    <section className="bg-[#F8FAFC] py-6 font-sans lg:py-10">
      <Container>
        {/* Header Section */}
        <div className="mb-8 max-w-3xl">
          <h1 className="mb-4 text-3xl font-semibold text-[#0B544E] lg:text-[40px]">
            Collaborate With ESSA Hub
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            We're building a trusted space for women's sport and we welcome organisations and
            businesses who want to be part of it.
          </p>
        </div>

        <div className="flex flex-col gap-8 md:gap-12">
          <SportProvidersSection />
          <ProfessionalSupportSection />
          <BrandsProductsSection />
        </div>
      </Container>
    </section>
  );
};

export default CollaborateView;
