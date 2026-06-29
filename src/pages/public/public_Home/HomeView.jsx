import React, { useEffect, useMemo, useState } from 'react';
import { GET } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';

import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import CoreFeatures from './components/CoreFeatures';

import FindYourSport from './components/FindYourSport';

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

const HomeView = () => {
  const [sections, setSections] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        const [contentResponse, cardsResponse] = await Promise.all([
          GET(ENDPOINT.HOMEPAGE.CONTENT),
          GET(ENDPOINT.HOMEPAGE.CARDS),
        ]);
        const allSections = contentResponse?.data?.data?.homepage?.sections || [];
        const cardItems = cardsResponse?.data?.data || [];
        setSections(Array.isArray(allSections) ? allSections : []);
        setCards(Array.isArray(cardItems) ? cardItems : []);
      } catch (error) {
        console.error('Failed to load homepage content:', error);
        setSections([]);
        setCards([]);
      }
    };

    loadHomepageData();
  }, []);

  const homeSection = useMemo(() => {
    const homeSections = sections
      .filter((item) => item?.page === 'HOME' && item?.isActive !== false)
      .sort(
        (a, b) =>
          new Date(b?.updatedAt || b?.createdAt || 0).getTime() -
          new Date(a?.updatedAt || a?.createdAt || 0).getTime()
      );
    return homeSections[0] || null;
  }, [sections]);

  const normalizedHomeSection = useMemo(() => {
    if (!homeSection) return null;
    return {
      ...homeSection,
      title: sanitizeText(homeSection.title),
      description: sanitizeText(homeSection.description),
      sectionTitle: sanitizeText(homeSection.sectionTitle),
      sectionSubTitle: sanitizeText(homeSection.sectionSubTitle),
      sportTitle: sanitizeText(homeSection.sportTitle),
      sportSubTitle: sanitizeText(homeSection.sportSubTitle),
    };
  }, [homeSection]);

// console.log("normalizedHomeSection: ",normalizedHomeSection?.sportSubTitle);




  return (
    <div className=" " >
      <Hero section={normalizedHomeSection} />
      {/* <GetInvolved/> */}
      <CoreFeatures cards={cards} textsections= {sections} />
      <HowItWorks/>
      <FindYourSport section={normalizedHomeSection} />
      {/* <InjurySupportHub/> */}
      {/* <JoinCta/> */}
    </div>
  );
};

export default HomeView;
