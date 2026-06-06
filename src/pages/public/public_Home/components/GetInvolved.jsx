import React from 'react';
import Container from '../../../../components/layout/Container';
import SectionHeader from '../../../../components/ui/SectionHeader';
import ImageFeatureCard from '../../../../components/ui/ImageFeatureCard';

const items = [
  {
    id: 1,
    title: 'Find your sport',
    description: "Explore women-only teams, sessions and activities near you - from beginner-friendly to competitive.",
    img: '/first.png',
  },
  {
    id: 2,
    title: 'Community',
    description: 'Connect with other women and feel part of a welcoming sporting community.',
    img: '/second.png',
  },
  {
    id: 3,
    title: 'Getting started',
    description: 'New to sport or returning after a break? Find guidance, reassurance and real stories from women like you.',
    img: '/third.png',
  },
  {
    id: 4,
    title: 'Support & Services',
    description: 'Find women-focused professionals, services and brands designed around an active lifestyle.',
    img: '/fourth.png',
  },
];

const GetInvolved = () => {
  return (
    <section className="py-10 lg:py-16 bg-linear-to-b from-gray-50 to-white">
      <Container>
        <SectionHeader
          title="Everything you need to get involved in sport"
          description="ESSA Hub brings together sport, community and support for women - whether you're starting for the first time or returning after a break. Discover how sport can build confidence, connection and wellbeing."
          align="left"
          className="mb-4 lg:mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 lg:gap-6">
          {items.map((it) => (
            <ImageFeatureCard
              key={it.id}
              imgSrc={it.img}
              title={it.title}
              description={it.description}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default GetInvolved;
