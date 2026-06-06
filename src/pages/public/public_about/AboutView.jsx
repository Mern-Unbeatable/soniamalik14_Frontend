
import AboutHero from './component/AboutHero';
import AboutMission from './component/AboutMission';

import Foundersection from './component/Foundersection';


const AboutView = () => {
  return (
    <div>
      <div className="md:hidden">

      <AboutHero />
      </div>
      <AboutMission />
      <Foundersection/>
  
    </div>
  );
};

export default AboutView;
