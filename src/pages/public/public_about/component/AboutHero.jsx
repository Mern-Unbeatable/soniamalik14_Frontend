// import React from 'react';
// import Container from '../../../../components/layout/Container';
// import Button from '../../../../components/ui/Button';
// import HeroTitle from '../../../../components/ui/HeroTitle';

// const AboutHero = () => {
//   const backgroundImageUrl = '/images/about1.png'; 
//   return (
//     <div
//       style={{ backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none' }}
//       className="relative flex w-auto items-center justify-center bg-cover bg-center h-70 sm:h-160 md:h-160 lg:h-200"
//     >
//       <div className="absolute inset-0 z-0 bg-black opacity-10"></div>
//       <Container className="relative z-10 py-10 lg:py-0">
    
//       </Container>
//     </div>
//   );
// };

// export default AboutHero;






import React from 'react';
import Container from '../../../../components/layout/Container';

const AboutHero = ({ section }) => {
  const heroImage = section?.image || section?.aboutImages?.[0] || '';

  return (
    <div className="relative flex w-auto items-center justify-center bg-cover bg-center h-70 sm:h-160 md:h-160 lg:h-160">
      {heroImage ? (
        <img src={heroImage} alt="About hero" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gray-300" />
      )}
      <div className="absolute inset-0 z-0 bg-black opacity-10"></div>
      <Container className="relative z-10 py-10 lg:py-0" />
    </div>
  );
};

export default AboutHero;