import React from 'react';
import Container from '../../../components/layout/Container';
import SportProvidersSection from './components/SportProvidersSection';
import ProfessionalSupportSection from './components/ProfessionalSupportSection';
import BrandsProductsSection from './components/BrandsProductsSection';

const CollaborateView = () => {
    return (
        <section className="py-6 lg:py-10 bg-[#F8FAFC] font-sans">
            <Container>
                {/* Header Section */}
                <div className="max-w-3xl mb-8">
                    <h1 className="text-3xl lg:text-[40px] font-semibold text-[#0B544E] mb-4">
                        Collaborate With ESSA Hub
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
                        We're building a trusted space for women's sport and we welcome organisations and businesses who want to be part of it.
                    </p>
                </div>

                {/* Individual Sections Container */}
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