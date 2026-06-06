import React from 'react';
import Container from '../layout/Container';
import Button from './Button';
import { ArrowLeft } from 'lucide-react';

const UnderConstruction = ({ title = 'Page Under Construction', message = 'We are working on this page â€” check back soon.' }) => {
  return (
    <section className="min-h-[60vh] flex items-center">
      <Container>
        <div className="max-w-2xl mx-auto text-center py-12 px-4">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-[#EAF7F6] mb-6">
            <svg className="w-12 h-12 text-btn-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 13h4l3 8 4-16 3 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-[#282828] mb-3">{title}</h1>
          <p className="text-base text-[#505050] mb-6">{message}</p>

          <div className="flex items-center justify-center gap-3">
            <Button as="link" to="/" variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>

            
          </div>
        </div>
      </Container>
    </section>
  );
};

export default UnderConstruction;
