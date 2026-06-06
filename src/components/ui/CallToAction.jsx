import React from 'react';
import Container from '../layout/Container';
import Button from './Button';
import { ArrowRight } from 'lucide-react';

const CallToAction = ({
  title,
  description,
  buttonText,
  onButtonClick,
  buttonVariant = "outline",
  buttonClassName = "",
  backgroundImage = null,
  bgColor = "bg-btn-primary",
  showArrow = true,
  centered = false
}) => {
  return (
    <section className="py-10 lg:py-16">
      <Container>
        <div className={`relative rounded-2xl overflow-hidden ${bgColor}`}>
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left Content */}
            <div className={`px-5 lg:px-12 lg:py-12 py-6 space-y-4 lg:space-y-6 col-span-2 flex flex-col ${centered ? 'items-center' : 'items-center lg:items-start'} lg:max-w-2xl`}>
              <h2 className="cta-title">
                {title}
              </h2>
              
              <p className={`description text-white ${centered ? 'text-center' : 'lg:text-left text-center'}`}>
                {description}
              </p>
              
              <Button 
                variant={buttonVariant}
                className={`bg-white text-gray-900 leading-tight hover:bg-gray-50 rounded-full px-6 py-2! gap-2 ${buttonClassName}`}
                onClick={onButtonClick}
              >
                {buttonText}
                {showArrow && (
                  <ArrowRight className="h-5 w-5 bg-btn-primary rounded-full text-white p-0.5" />
                )}
              </Button>
            </div>
            
            {/* Right Pattern Image */}
            {backgroundImage && (
              <div 
                className="hidden lg:block h-full"
                style={{
                  backgroundImage: `url('${backgroundImage}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              ></div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CallToAction;
