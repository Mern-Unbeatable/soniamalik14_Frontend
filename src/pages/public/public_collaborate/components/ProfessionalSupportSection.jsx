import React from 'react';
import { ROLES } from '../../../../context/AuthContext';
import CollaborateListingButton from './CollaborateListingButton';
import { REGISTER_ROLE_KEYS, useCollaborateListingCta } from '../hooks/useCollaborateListingCta';

const ProfessionalSupportSection = ({ section }) => {
  const { handleClick, isDisabled } = useCollaborateListingCta({
    targetRole: ROLES.PROVIDER,
    registerRoleKey: REGISTER_ROLE_KEYS.SERVICE_PROVIDER,
    dashboardPath: '/provider',
    providerLabel: 'service provider',
  });
  const sectionImage = section?.supportImg || '';
  const sectionTitle = section?.sectionSubTitle || '';
  const sectionDescription = section?.supportDescription || '';

  return (
    <div className="relative mb-10 flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-sm md:block">
      {/* Mobile Image (Visible only on small screens) */}
      <div className="relative h-64 w-full sm:h-80 md:hidden">
        {sectionImage ? (
          <img
            src={sectionImage}
            alt="For Professional Support"
            loading="lazy"
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}
        {/* Subtle gradient to transition to white content below on mobile */}
        <div className="absolute right-0 bottom-0 left-0 h-32 bg-linear-to-t from-white from-0% via-white/60 via-50% to-transparent to-100%"></div>
      </div>

      {/* Desktop Background Image (Hidden on small screens) */}
      <div className="absolute inset-0 z-0 hidden h-full w-full md:block xl:min-h-175">
        {sectionImage && (
          <img
            src={sectionImage}
            alt="For Professional Support"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* Smooth Gradient Overlay (Fades Right to Left this time) */}
        <div className="absolute inset-0 ml-auto w-[90%] bg-[linear-gradient(270deg,#FFFFFF_40%,rgba(255,255,255,0.9)_55%,transparent_100%)] lg:w-[70%]" />
      </div>

      {/* Content Container (Right Side) */}
      <div className="min-h-112.5] relative z-10 ml-auto flex w-full flex-col justify-center bg-white p-4 sm:p-6 md:min-h-125 md:w-[50%] md:bg-transparent md:p-8 lg:w-[40%] lg:p-10 xl:min-h-137.5">
        {sectionTitle ? (
          <h2 className="mb-5 text-3xl leading-tight font-medium tracking-tight text-[#0B544E] md:text-[40px]">
            {sectionTitle}
          </h2>
        ) : null}

        {sectionDescription ? (
          // <div
          //     className="mb-8 max-w-md text-[#333333] [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1"
          //     dangerouslySetInnerHTML={{ __html: sectionDescription }}
          // />
          <div
            className="mb-8 max-w-md break-words text-[#333333] [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: sectionDescription }}
          />
        ) : null}

        <div>
          <CollaborateListingButton
            label="List your business"
            onClick={handleClick}
            disabled={isDisabled}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSupportSection;
