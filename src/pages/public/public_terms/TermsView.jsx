import React, { useEffect } from 'react';
import Container from '../../../components/layout/Container';

const TermsView = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 'about',
      title: '1. About ESSA Hub',
      content: (
        <>
          <p>
            ESSA Hub ("we", "us", "our") is an online platform that helps users discover sports opportunities, events, services, communities and resources.
          </p>
          <p className="mt-2">
            By accessing or using ESSA Hub, you agree to these Terms & Conditions. If you do not agree with these Terms, you should not use the platform.
          </p>
        </>
      ),
    },
    {
      id: 'eligibility',
      title: '2. Eligibility',
      content: (
        <>
          <p>
            You must be at least 18 years old to create an account or submit content on ESSA Hub.
          </p>
          <p className="mt-2">
            If you are registering on behalf of an organisation, club, business or other entity, you confirm that you have authority to do so.
          </p>
        </>
      ),
    },
    {
      id: 'accounts',
      title: '3. User Accounts',
      content: (
        <>
          <p>
            You are responsible for maintaining the confidentiality of your account details and for all activity carried out under your account.
          </p>
          <p className="mt-2">
            You agree to provide accurate and up-to-date information and to keep your account information current.
          </p>
          <p className="mt-2">
            We reserve the right to suspend or terminate accounts that provide false information or breach these Terms.
          </p>
        </>
      ),
    },
    {
      id: 'listings',
      title: '4. Listings and Provider Information',
      content: (
        <>
          <p>
            ESSA Hub enables sports providers, clubs, coaches, organisations and service providers to create listings and share information with users.
          </p>
          <p className="mt-2">
            Providers are solely responsible for the accuracy, completeness and legality of the information they publish.
          </p>
          <p className="mt-2">
            ESSA Hub does not verify, endorse or guarantee any provider, organisation, event, service, qualification, accreditation, availability or outcome.
          </p>
          <p className="mt-2">
            Users should undertake their own checks before participating in any activity, event or service.
          </p>
        </>
      ),
    },
    {
      id: 'participation',
      title: '5. Events, Activities and Participation',
      content: (
        <>
          <p>
            Participation in any activity, event, session or service promoted through ESSA Hub is entirely at your own risk.
          </p>
          <p className="mt-2 font-medium text-[#0f766e]">ESSA Hub is not responsible for:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The organisation or delivery of any event or activity.</li>
            <li>Changes, cancellations or postponements.</li>
            <li>Injuries, losses or damages arising from participation.</li>
            <li>The conduct of organisers, coaches, instructors or participants.</li>
          </ul>
          <p className="mt-3">
            Providers are responsible for ensuring they have appropriate insurance, safeguarding procedures and any required qualifications.
          </p>
        </>
      ),
    },
    {
      id: 'messages',
      title: '6. Messages and Expressions of Interest',
      content: (
        <>
          <p>
            ESSA Hub may provide tools that allow users to contact providers, submit enquiries or register interest in activities.
          </p>
          <p className="mt-2">
            We do not guarantee that providers will respond to enquiries or expressions of interest.
          </p>
          <p className="mt-2">
            Communications made through the platform are the responsibility of the sender and recipient.
          </p>
        </>
      ),
    },
    {
      id: 'content',
      title: '7. Community Content',
      content: (
        <>
          <p>
            Users may submit content including posts, comments, reviews, stories, questions, images and other materials.
          </p>
          <p className="mt-2 font-medium text-[#0f766e]">You agree not to submit content that:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Is unlawful, abusive, defamatory or misleading.</li>
            <li>Infringes another person's rights.</li>
            <li>Contains harmful, offensive or discriminatory material.</li>
            <li>Promotes illegal activities.</li>
            <li>Contains spam or unauthorised advertising.</li>
          </ul>
          <p className="mt-3">
            We reserve the right to remove content at our discretion.
          </p>
        </>
      ),
    },
    {
      id: 'ip',
      title: '8. Intellectual Property',
      content: (
        <>
          <p>
            All content, branding, logos, designs, text and materials belonging to ESSA Hub remain our intellectual property or that of our licensors.
          </p>
          <p className="mt-2">
            You may not reproduce, distribute or commercially exploit any content without our written permission.
          </p>
          <p className="mt-2">
            By submitting content to ESSA Hub, you grant us a non-exclusive, worldwide, royalty-free licence to display, reproduce and distribute that content in connection with operating and promoting the platform.
          </p>
        </>
      ),
    },
    {
      id: 'links',
      title: '9. Third-Party Links',
      content: (
        <>
          <p>
            ESSA Hub may contain links to third-party websites, booking systems, social media platforms or other services.
          </p>
          <p className="mt-2">
            We are not responsible for the content, availability, security or privacy practices of third-party websites.
          </p>
          <p className="mt-2">
            Your use of third-party services is governed by their own terms and policies.
          </p>
        </>
      ),
    },
    {
      id: 'liability',
      title: '10. Limitation of Liability',
      content: (
        <>
          <p>
            To the fullest extent permitted by law, ESSA Hub shall not be liable for any indirect, incidental, consequential or special losses arising from your use of the platform.
          </p>
          <p className="mt-2">
            Nothing in these Terms excludes liability for death or personal injury caused by negligence, fraud or any liability that cannot be excluded by law.
          </p>
        </>
      ),
    },
    {
      id: 'indemnity',
      title: '11. Indemnity',
      content: (
        <>
          <p>
            You agree to indemnify and hold ESSA Hub harmless from any claims, liabilities, losses, damages or expenses arising from:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Your use of the platform.</li>
            <li>Your breach of these Terms.</li>
            <li>Content you submit.</li>
            <li>Activities, services or events you organise or promote.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'termination',
      title: '12. Suspension and Termination',
      content: (
        <>
          <p>
            We reserve the right to suspend, restrict or terminate access to the platform at any time where we reasonably believe a user has breached these Terms or where necessary to protect the platform and its users.
          </p>
        </>
      ),
    },
    {
      id: 'privacy',
      title: '13. Privacy',
      content: (
        <>
          <p>
            Your use of ESSA Hub is also governed by our Privacy Policy, which explains how personal information is collected and used.
          </p>
        </>
      ),
    },
    {
      id: 'changes',
      title: '14. Changes to These Terms',
      content: (
        <>
          <p>
            We may update these Terms from time to time.
          </p>
          <p className="mt-2">
            Updated versions will be published on the website and continued use of the platform constitutes acceptance of any changes.
          </p>
        </>
      ),
    },
    {
      id: 'law',
      title: '15. Governing Law',
      content: (
        <>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of England and Wales.
          </p>
          <p className="mt-2">
            Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>
        </>
      ),
    },
    {
      id: 'contact',
      title: '16. Contact',
      content: (
        <div className="bg-[#e7f1f1]/50 p-4 rounded-lg border border-[#0f766e]/10">
          <p className="font-semibold text-[#0f766e]">ESSA Hub</p>
          <p className="mt-1">
            Email:{' '}
            <a href="mailto:admin@essahub.co.uk" className="text-[#0f766e] hover:underline font-medium">
              admin@essahub.co.uk
            </a>
          </p>
          <p>
            Website:{' '}
            <a href="https://essahub.co.uk" target="_blank" rel="noopener noreferrer" className="text-[#0f766e] hover:underline font-medium">
              essahub.co.uk
            </a>
          </p>
        </div>
      ),
    },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-btn-primary py-12 md:py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(15,118,110,0.4),transparent)]" />
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <span className="bg-[#f6bc09] text-[#1c1c1c] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Legal Document
            </span>
            <h1 className="text-3xl md:text-5xl font-semibold mt-4 mb-3 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-white/80 text-sm md:text-base">
              Last Updated: July 2026 • Please read these terms carefully before using the ESSA Hub platform.
            </p>
          </div>
        </Container>
      </div>

      <Container className="mt-8 md:mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4 lg:sticky lg:top-28 h-fit bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hidden lg:block">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Table of Contents
            </h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="w-full text-left text-sm py-2 px-3 rounded-lg text-gray-600 hover:text-[#0f766e] hover:bg-slate-50 transition-all font-medium truncate block"
                >
                  {section.title.split('. ')[1]}
                </button>
              ))}
            </nav>
          </div>

          {/* Terms Content */}
          <div className="lg:w-3/4 flex-1">
            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 space-y-8">
              {sections.map((section, idx) => (
                <div
                  key={section.id}
                  id={section.id}
                  className={`scroll-mt-24 ${
                    idx !== sections.length - 1 ? 'border-b border-gray-100 pb-8' : ''
                  }`}
                >
                  <h2 className="text-xl md:text-2xl font-semibold text-[#0B544E] mb-4 flex items-center gap-2">
                    {section.title}
                  </h2>
                  <div className="text-gray-600 leading-relaxed text-sm md:text-base space-y-3">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TermsView;
