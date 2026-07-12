import React, { useEffect, useMemo, useState } from 'react';
import Container from '../../../components/layout/Container';
import SportProvidersSection from './components/SportProvidersSection';
import ProfessionalSupportSection from './components/ProfessionalSupportSection';
import BrandsProductsSection from './components/BrandsProductsSection';
import { GET } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';
import 'react-quill-new/dist/quill.snow.css';

const decodeHtmlEntities = (value = '') => {
  if (typeof document === 'undefined') return String(value || '');
  const textarea = document.createElement('textarea');
  textarea.innerHTML = String(value || '');
  return textarea.value;
};

const sanitizeText = (value) =>
  decodeHtmlEntities(String(value || ''))
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const CollaborateView = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const loadHomepageContent = async () => {
      try {
        const response = await GET(ENDPOINT.HOMEPAGE.CONTENT);
        const allSections = response?.data?.data?.homepage?.sections || [];
        setSections(Array.isArray(allSections) ? allSections : []);
      } catch (error) {
        console.error('Failed to load collaborate content:', error);
        setSections([]);
      }
    };

    loadHomepageContent();
  }, []);

  const collaborateSection = useMemo(() => {
    const filtered = sections
      .filter((item) => item?.page === 'COLLABORATE' && item?.isActive !== false)
      .sort(
        (a, b) =>
          new Date(b?.updatedAt || b?.createdAt || 0).getTime() -
          new Date(a?.updatedAt || a?.createdAt || 0).getTime()
      );
    return filtered[0] || null;
  }, [sections]);

  const normalizedCollaborateSection = useMemo(() => {
    if (!collaborateSection) return null;
    return {
      ...collaborateSection,
      title: sanitizeText(collaborateSection.title),
      subtitle: collaborateSection.subtitle || '',
      description: collaborateSection.description || '',
      sportsProviderDescription: collaborateSection.sportsProviderDescription || '',
      supportDescription: collaborateSection.supportDescription || '',
      brandDescription: collaborateSection.brandDescription || '',
    };
  }, [collaborateSection]);

  return (
    <section className="bg-[#F8FAFC] py-6 font-sans lg:py-10">
      <Container>
        {/* Header Section */}
        <div className="mb-8 max-w-7xl">
          <h1 className="mb-4 text-3xl font-semibold break-words text-[#0B544E] lg:text-[40px]">
            {normalizedCollaborateSection?.title || ''}
          </h1>
          <p className="mb-3 text-lg break-words text-[#0B544E]">
            {sanitizeText(normalizedCollaborateSection?.subtitle)}
          </p>
          {normalizedCollaborateSection?.description ? (
            <div
              className="w-full max-w-7xl overflow-hidden text-base break-words text-gray-600 sm:text-lg [&_a]:break-all [&_img]:h-auto [&_img]:max-w-full [&_li]:mb-1 [&_li]:break-words [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_p]:break-words [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: normalizedCollaborateSection.description }}
            />
          ) : null}
        </div>

        {/* Individual Sections Container */}
        <div className="flex flex-col gap-8 md:gap-12">
          <SportProvidersSection section={normalizedCollaborateSection} />
          <ProfessionalSupportSection section={normalizedCollaborateSection} />
          <BrandsProductsSection section={normalizedCollaborateSection} />
        </div>
      </Container>
    </section>
  );
};

export default CollaborateView;
