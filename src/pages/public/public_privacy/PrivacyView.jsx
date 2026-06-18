import React, { useEffect } from 'react';
import Container from '../../../components/layout/Container';

const PrivacyView = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: (
        <>
          <p>
            ESSA Hub respects your privacy and is committed to protecting your personal information.
          </p>
          <p className="mt-2">
            We collect only the information necessary to operate the platform, connect users with sports and service providers, and improve the ESSA Hub experience.
          </p>
        </>
      ),
    },
    {
      id: 'collect',
      title: 'Information We Collect',
      content: (
        <>
          <p>Depending on how you use ESSA Hub, we may collect:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Name</li>
            <li>Email address</li>
            <li>Account information</li>
            <li>Organisation or business details</li>
            <li>Information submitted through contact forms, enquiries or registrations</li>
            <li>Information provided when creating listings, events or services</li>
            <li>Website usage information collected through cookies and analytics tools</li>
          </ul>
        </>
      ),
    },
    {
      id: 'use',
      title: 'How We Use Information',
      content: (
        <>
          <p>We use information to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Create and manage user accounts</li>
            <li>Enable users to connect with sports and service providers</li>
            <li>Respond to enquiries and support requests</li>
            <li>Operate and improve the platform</li>
            <li>Send platform updates and service-related communications</li>
            <li>Send newsletters and marketing communications where you have chosen to receive them</li>
          </ul>
        </>
      ),
    },
    {
      id: 'sharing',
      title: 'Sharing Information',
      content: (
        <>
          <p>ESSA Hub does not sell personal information.</p>
          <p className="mt-2">
            Where you submit an enquiry, message or register interest through the platform, your details may be shared with the relevant provider so they can respond to you.
          </p>
          <p className="mt-2">
            We may also use trusted third-party providers to help us operate the website and deliver our services.
          </p>
        </>
      ),
    },
    {
      id: 'marketing',
      title: 'Marketing Communications',
      content: (
        <>
          <p>
            If you choose to join our mailing list, we may send you updates, news and information about ESSA Hub.
          </p>
          <p className="mt-2">
            You can unsubscribe at any time using the unsubscribe link included in our emails.
          </p>
        </>
      ),
    },
    {
      id: 'rights',
      title: 'Your Rights',
      content: (
        <>
          <p>You may have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Access the personal information we hold about you</li>
            <li>Request corrections to inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Withdraw consent to marketing communications</li>
          </ul>
          <p className="mt-3">To make a request, please contact us using the details below.</p>
        </>
      ),
    },
    {
      id: 'contact',
      title: 'Contact',
      content: (
        <div className="bg-[#e7f1f1]/50 p-4 rounded-lg border border-[#0f766e]/10">
          <p className="font-semibold text-[#0f766e]">ESSA Hub</p>
          <p className="mt-1">
            Email:{' '}
            <a href="mailto:admin@essahub.co.uk" className="text-[#0f766e] hover:underline font-medium">
              admin@essahub.co.uk
            </a>
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      <div className="bg-[#0B544E] py-12 md:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(15,118,110,0.4),transparent)]" />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <span className="bg-[#f6bc09] text-[#1c1c1c] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Privacy & Security
            </span>
            <h1 className="text-3xl md:text-5xl font-semibold mt-4 mb-3 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-white/80 text-sm md:text-base">
              Last Updated: July 2026 • Please read this policy to understand how we handle your personal details.
            </p>
          </div>
        </Container>
      </div>

      <Container className="mt-8 md:mt-12 max-w-4xl">
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 space-y-8">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              id={section.id}
              className={`scroll-mt-24 ${
                idx !== sections.length - 1 ? 'border-b border-gray-100 pb-8' : ''
              }`}
            >
              <h2 className="text-xl md:text-2xl font-semibold text-[#0B544E] mb-4">
                {section.title}
              </h2>
              <div className="text-gray-600 leading-relaxed text-sm md:text-base space-y-3">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default PrivacyView;
