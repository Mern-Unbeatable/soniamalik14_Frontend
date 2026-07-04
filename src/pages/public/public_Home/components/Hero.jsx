import { useNavigate } from 'react-router-dom';
import Container from '../../../../components/layout/Container';
import Button from '../../../../components/ui/Button';
import HeroTitle from '../../../../components/ui/HeroTitle';
import { useAuth } from '../../../../context/AuthContext';
import { ENV } from '../../../../config/env';

const CORE_FEATURES_SECTION_ID = 'core-features';

const resolveImageUrl = (value, fallback) => {
  if (!value) return fallback;
  const imageUrl = String(value).trim();
  if (!imageUrl) return fallback;

  if (/^https?:\/\//i.test(imageUrl)) {
    try {
      const parsedImageUrl = new URL(imageUrl);
      const apiBaseUrl = String(ENV.API_BASE_URL || '').trim();
      const parsedApiBaseUrl = apiBaseUrl ? new URL(apiBaseUrl) : null;

      if (
        parsedApiBaseUrl &&
        parsedImageUrl.pathname.includes('/uploads/') &&
        parsedImageUrl.hostname !== parsedApiBaseUrl.hostname
      ) {
        return `${parsedApiBaseUrl.origin}${parsedImageUrl.pathname}${parsedImageUrl.search}${parsedImageUrl.hash}`;
      }
      return imageUrl;
    } catch {
      return imageUrl;
    }
  }

  const apiBaseUrl = String(ENV.API_BASE_URL || '').replace(/\/+$/, '');
  if (apiBaseUrl && imageUrl.startsWith('/uploads/')) {
    return `${apiBaseUrl}${imageUrl}`;
  }

  return imageUrl;
};

const Hero = ({ section }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const heading = section?.title || 'Women. Sport. Community.';
  const description =
    section?.description || "A platform built for women in sport-whatever level you're starting at.";
  const desktopImage = resolveImageUrl(section?.image, '/heroWebp.webp');
  const mobileImage = resolveImageUrl(section?.image, '/hero23.png');

  const buttonLabel = isAuthenticated ? 'Explore ESSA Hub' : 'Join ESSA Hub';

  const handleCtaClick = () => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    document.getElementById(CORE_FEATURES_SECTION_ID)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      <div className="w-full bg-white md:hidden">
        {/* Image Section with Masking Effect */}
        <div className="relative h-72 w-full">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${mobileImage}), url('/hero23.png')`,
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            }}
          />
          {/* Optional: Extra overlay to ensure smooth transition to #F2F4F5 or White */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent" />
        </div>

        {/* Text Content Section */}
        <div className="relative z-10 -mt-4 bg-white px-5 py-8 text-center">
          <h1 className="text-2xl leading-[1.05] font-semibold text-[#0F6660]">
            {heading}
          </h1>

          <p className="mx-auto mt-3 max-w-95 text-xl leading-8 text-[#545C60]">
            {description}
          </p>

          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              onClick={handleCtaClick}
              className="rounded-2xl bg-[#0F766E] px-8 py-3 text-base whitespace-nowrap text-white hover:bg-[#0d655d]"
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      </div>

      <div
        className="relative hidden h-[70vh] w-full items-end justify-center bg-white bg-cover bg-center md:flex md:h-150 lg:h-screen"
        style={{ backgroundImage: `url(${desktopImage}), url('/heroWebp.webp')` }}
      >
        <div className="absolute inset-0 z-0 bg-black/10 md:bg-black/10" />

        <Container className="relative z-10 pb-16 md:pb-0 lg:py-0">
          <div className="flex flex-col items-center justify-center space-y-4 px-4 text-center md:space-y-5">
            <HeroTitle className="text-3xl leading-tight md:text-5xl lg:mt-70 lg:text-7xl">
              {heading}
            </HeroTitle>

            <p className="herosubtitle max-w-70 text-sm text-white/90 md:max-w-none md:text-lg">
              {description}
            </p>

            <div className="flex w-full justify-center sm:pb-30 md:pb-35 lg:pb-40">
              <Button
                type="button"
                onClick={handleCtaClick}
                className="w-full max-w-62.5 rounded-md border-none bg-[#00796B] px-8 py-3 whitespace-nowrap text-white hover:bg-[#005a50] md:w-auto"
              >
                {buttonLabel}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Hero;
