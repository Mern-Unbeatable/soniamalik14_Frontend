import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react';
import Container from './Container';
import Title from '../ui/Title';

const FooterLayout = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className=" bg-white">
      {/* Newsletter Section */}
      <div className="bg-white py-5 lg:py-10">
        <Container>
          <div className="flex flex-col items-stretch gap-6 border-b border-gray-300 pb-6 lg:pb-12 lg:flex-row lg:items-center">
            <div className="flex-1 text-center lg:text-left">
              <Title className={"text-xl md:text-4xl text-[#0B544E] "}>Stay connected with ESSA</Title>
              <p className="mt-1 text-gray-600 max-w-lg mx-auto lg:mx-0">
                Occasional updates on new teams, events, services and community features
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="relative w-full lg:w-96 2xl:w-196 self-center lg:self-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="bg-secondary w-full rounded-md px-4 py-4 md:py-8 pr-32 focus:ring-2 focus:ring-btn-primary focus:outline-none"
                required
              />
              <button
                type="submit"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md bg-white px-3 lg:px-4 py-1.5 md:py-3 font-medium text-gray-900 transition hover:bg-gray-50 text-base"
              >
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </div>

      {/* Main Footer */}
      <div className="py-2 lg:py-6">
        <Container className={''}>
          <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
            {/* Brand Section */}
            <div className="lg:flex-1">
              <img src="/logo.png" alt="Essa Hub" className="mb-4 h-8" />
              <p className="max-w-md leading-tight lg:leading-relaxed text-gray-600">
                ESSA Hub helps women find teams, sessions, services and community - making sport
                easier to access, return to and enjoy.

              </p>
            </div>

            {/* Collections */}
            <div className="flex flex-col sm:flex-row gap-8 lg:gap-18">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-[#212121]">Explore ESSA</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-[#4D4D4D] transition hover:text-btn-primary">
                     Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/discover" className="text-[#4D4D4D] transition hover:text-btn-primary">
                      Discover
                    </Link>
                  </li>
                  <li>
                    <Link to="/community" className="text-[#4D4D4D] transition hover:text-btn-primary">
                     Community
                    </Link>
                  </li>
                  <li>
                    <Link to="/events" className="text-[#4D4D4D] transition hover:text-btn-primary">
                      Events
                    </Link>
                  </li>
                 <li>
                    <Link
                      to="/marketplace"
                      className="text-[#4D4D4D] transition hover:text-btn-primary"
                    >
                      Marketplace
                    </Link>
                  </li>
                  <li>
                    <Link to="/services" className="text-[#4D4D4D] transition hover:text-btn-primary">
                      Services
                    </Link>
                  </li>
                  
                </ul>
              </div>

              {/* About & Support */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-[#212121]">About & Support</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/about" className="text-[#4D4D4D] transition hover:text-btn-primary">
                      About ESSA
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/news" className="text-[#4D4D4D] transition hover:text-btn-primary">
                      News
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      to="/services"
                      className="text-[#4D4D4D] transition hover:text-btn-primary"
                    >
                      Injury & Recovery Support
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-[#4D4D4D] transition hover:text-btn-primary"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Quick Links */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-[#212121]">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/privacy" className="text-[#4D4D4D] transition hover:text-btn-primary">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-[#4D4D4D] transition hover:text-btn-primary">
                      Terms of use
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      to="/safeguarding"
                      className="text-[#4D4D4D] transition hover:text-btn-primary"
                    >
                      Safeguarding
                    </Link>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section - Copyright and Social Media */}
          <div className="mt-5 lg:mt-10 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-[#464646]">2026 Essa hub</p>

              {/* Social Media Icons */}
              <div className="flex items-center gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4D4D4D] transition hover:text-btn-primary"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4D4D4D] transition hover:text-btn-primary"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4D4D4D] transition hover:text-btn-primary"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4D4D4D] transition hover:text-btn-primary"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4D4D4D] transition hover:text-btn-primary "
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default FooterLayout;
