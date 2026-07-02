import React, { useEffect, useMemo, useState } from 'react';
import { GET } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';
import AboutHero from './component/AboutHero';
import AboutMission from './component/AboutMission';
import Foundersection from './component/Foundersection';

const AboutView = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const loadAboutContent = async () => {
      try {
        const response = await GET(ENDPOINT.HOMEPAGE.CONTENT, { page: 'ABOUT_US' });
        const allSections = response?.data?.data?.homepage?.sections || [];
        setSections(Array.isArray(allSections) ? allSections : []);
      } catch (error) {
        console.error('Failed to load about content:', error);
        setSections([]);
      }
    };

    loadAboutContent();
  }, []);

  const aboutSection = useMemo(() => {
    const filtered = sections
      .filter((item) => item?.page === 'ABOUT_US' && item?.isActive !== false)
      .sort(
        (a, b) =>
          new Date(b?.updatedAt || b?.createdAt || 0).getTime() -
          new Date(a?.updatedAt || a?.createdAt || 0).getTime()
      );
    return filtered[0] || null;
  }, [sections]);

  return (
    <div>
      <div className="md:hidden">
        <AboutHero section={aboutSection} />
      </div>
      <AboutMission section={aboutSection} />
      <Foundersection section={aboutSection} />
    </div>
  );
};

export default AboutView;
