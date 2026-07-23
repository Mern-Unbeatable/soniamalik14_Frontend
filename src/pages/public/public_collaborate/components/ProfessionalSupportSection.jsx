// import React from 'react';
// import { ROLES } from '../../../../context/AuthContext';
// import CollaborateListingButton from './CollaborateListingButton';
// import { REGISTER_ROLE_KEYS, useCollaborateListingCta } from '../hooks/useCollaborateListingCta';

// const ProfessionalSupportSection = ({ section }) => {
//   const { handleClick, isDisabled } = useCollaborateListingCta({
//     targetRole: ROLES.PROVIDER,
//     registerRoleKey: REGISTER_ROLE_KEYS.SERVICE_PROVIDER,
//     dashboardPath: '/provider',
//     providerLabel: 'service provider',
//   });
//   const sectionImage = section?.supportImg || '';
//   const sectionTitle = section?.sectionSubTitle || '';
//   const sectionDescription = section?.supportDescription || '';

//   return (
//     <div className="relative mb-10 flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-sm md:block">
//       <div className="relative h-64 w-full sm:h-80 md:hidden">
//         {sectionImage ? (
//           <img
//             src={sectionImage}
//             alt="For Professional Support"
//             loading="lazy"
//             className="h-full w-full object-cover object-center"
//           />
//         ) : (
//           <div className="h-full w-full bg-gray-200" />
//         )}
//         <div className="absolute right-0 bottom-0 left-0 h-32 bg-linear-to-t from-white from-0% via-white/60 via-50% to-transparent to-100%"></div>
//       </div>

//       <div className="absolute inset-0 z-0 hidden h-full w-full md:block xl:min-h-175">
//         {sectionImage && (
//           <img
//             src={sectionImage}
//             alt="For Professional Support"
//             className="absolute inset-0 h-full w-full object-cover"
//           />
//         )}
//         <div className="absolute inset-0 ml-auto w-[90%] bg-[linear-gradient(270deg,#FFFFFF_40%,rgba(255,255,255,0.9)_55%,transparent_100%)] lg:w-[70%]" />
//       </div>

//       <div className="min-h-112.5] relative z-10 ml-auto flex w-full flex-col justify-center bg-white p-4 sm:p-6 md:min-h-125 md:w-[50%] md:bg-transparent md:p-8 lg:w-[40%] lg:p-10 xl:min-h-137.5">
//         {sectionTitle ? (
//           <h2 className="mb-5 text-3xl leading-tight font-medium tracking-tight text-[#0B544E] md:text-[40px]">
//             {sectionTitle}
//           </h2>
//         ) : null}

//         {sectionDescription ? (
//           <div
//               className="mb-8 max-w-md text-[#333333] [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1"
//               dangerouslySetInnerHTML={{ __html: sectionDescription }}
//           />
//           <div
//             className="mb-8 max-w-md break-words text-[#333333] [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6"
//             dangerouslySetInnerHTML={{ __html: sectionDescription }}
//           />
//         ) : null}

//         <div>
//           <CollaborateListingButton
//             label="List your business"
//             onClick={handleClick}
//             disabled={isDisabled}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfessionalSupportSection;



import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
const ProfessionalSupportSection = () => {
    return (
        <div className="relative w-full rounded-lg overflow-hidden bg-white shadow-sm flex flex-col md:block mb-10">

            {/* Mobile Image (Visible only on small screens) */}
            <div className="h-64 sm:h-80 w-full md:hidden relative">
                <img
                    src="/ProfessionalSupport1.webp"
                    alt="For Professional Support"
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                />
                {/* Subtle gradient to transition to white content below on mobile */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white from-0% via-white/60 via-50% to-transparent to-100%"></div>
            </div>

            {/* Desktop Background Image (Hidden on small screens) */}
            <div className="hidden md:block absolute inset-0 z-0 w-full h-full xl:min-h-175">
                <img
                    // Replace with your original image: "/ProfessionalSupport1.png"
                    src="/ProfessionalSupport1.webp"
                    alt="For Professional Support"
                    className="absolute inset-0 w-full h-full object-cover "
                />
                {/* Smooth Gradient Overlay (Fades Right to Left this time) */}
                <div className="absolute inset-0 ml-auto bg-[linear-gradient(270deg,#FFFFFF_40%,rgba(255,255,255,0.9)_55%,transparent_100%)] w-[90%] lg:w-[80%]" />
            </div>

            {/* Content Container (Right Side) */}
            <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-16 w-full md:w-[50%] lg:w-[40%] bg-white md:bg-transparent min-h-112.5] md:min-h-125 xl:min-h-137.5 flex flex-col justify-center ml-auto">

                <h2 className="text-3xl md:text-[40px] leading-tight font-medium text-[#0B544E] mb-5 tracking-tight">
                    For Professional Support
                </h2>

                <p className="text-[#333333] text-base md:text-lg  mb-8 leading-relaxed pr-4 md:pr-10 max-w-md">
                    We want to work with professionals whose expertise supports women in sport — including physiotherapy, strength and conditioning, nutrition, women's health and wellbeing.
                </p>

                <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                        <Check className="w-5.5 h-5.5] text-[#107C66] mr-3 mt-0.5 shrink-0" strokeWidth={2.5} />
                        <span className="text-[#1A1A1A] text-base font-medium tracking-tight">
                            Connect with a targeted audience
                        </span>
                    </li>
                    <li className="flex items-start">
                        <Check className="w-5.5 h-5.5] text-[#107C66] mr-3 mt-0.5 shrink-0" strokeWidth={2.5} />
                        <span className="text-[#1A1A1A] text-base font-medium tracking-tight">
                            Increase visibility within a trusted platform
                        </span>
                    </li>
                </ul>

                <div>
                    <a
                        href="#"
                        className="bg-[#107C66] hover:bg-[#0c6150] transition-colors duration-200 text-white text-[15px] font-medium py-3 px-6 rounded-md inline-flex items-center group shadow-sm"
                    >
                        List your business
                        <ArrowRight className="w-4 h-4 ml-2 mt-[1px] transform group-hover:translate-x-1 transition-transform duration-200" strokeWidth={2.5} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalSupportSection;

