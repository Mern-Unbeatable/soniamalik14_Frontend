import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BriefcaseMedical,
  Target,
  Medal,
  FileCheck,
  ShieldCheck,
  CircleDollarSign,
  MapPin,
  Users,
  UserCheck,
  ExternalLink,
  AlertCircle,
  MessageSquare,
  Send,
  Mail,
  Phone,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { GET, POST } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';
import {
  handleImageLoadError,
  pickImageSource,
  resolveImageUrl,
} from '../../../../utils/resolveImageUrl';

const SERVICE_AVATAR_PLACEHOLDER = '/service-placeholder.png';

const normalizeStatus = (service) => {
  if (service?.bannedAt || service?.bannedReason) return 'Banned';
  if (service?.isFeatured) return 'Featured';

  const normalized = String(service?.status || '')
    .trim()
    .toLowerCase();
  if (['active', 'approved', 'live'].includes(normalized)) return 'Live';
  if (['pending', 'pending_approval'].includes(normalized)) return 'Pending';
  if (['banned', 'blocked', 'rejected'].includes(normalized)) return 'Banned';

  return 'Pending';
};

const formatListValue = (value) => {
  if (Array.isArray(value)) {
    const normalized = value.map((item) => String(item || '').trim()).filter(Boolean);
    return normalized.length > 0 ? normalized.join(', ') : '';
  }
  return String(value || '').trim();
};

const hasValue = (value) => {
  if (typeof value === 'boolean') return true;
  return String(value || '').trim().length > 0 && String(value).trim().toLowerCase() !== 'n/a';
};

const buildGoogleMapsSearchUrl = (query) => {
  const normalized = String(query || '').trim();
  if (!normalized || normalized.toLowerCase() === 'n/a') return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(normalized)}`;
};

const resolveResponseType = (service) => {
  const responseType = String(service?.responseType || '')
    .trim()
    .toUpperCase();
  if (responseType === 'INTERESTED' || responseType === 'REGISTER_INTEREST') {
    return 'INTERESTED';
  }
  if (responseType === 'REGISTER') return 'REGISTER';

  const participantType = String(service?.participantResponseType || '')
    .trim()
    .toUpperCase();
  if (participantType === 'ALLOW_REGISTER_INTEREST') return 'INTERESTED';

  return 'REGISTER';
};

const OverviewRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#F8FAFC] p-3.5">
    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E0F2EE] text-[#147B6B]">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-semibold tracking-wider text-[#8A9BAE] uppercase">{label}</p>
      <div className="mt-0.5 text-sm font-semibold break-words text-[#1A1D1F]">{value}</div>
    </div>
  </div>
);

const ServiceProviderListingDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [service, setService] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    let active = true;

    const loadService = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await GET(ENDPOINT.SERVICES.DETAIL(id));
        const payload = response?.data || response;
        const nextService = payload?.data?.service || payload?.service || payload?.data || null;

        if (!active) return;
        if (!nextService?.id) {
          setService(null);
          setError('Service not found.');
          return;
        }

        setService(nextService);
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || err?.message || 'Failed to load service details');
        setService(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (!id) {
      setError('Invalid service id.');
      setLoading(false);
      return;
    }

    loadService();

    return () => {
      active = false;
    };
  }, [id]);

  const data = useMemo(() => {
    if (!service) return null;

    const sports = Array.isArray(service?.sports) ? service.sports : [];
    const sessionTypes = Array.isArray(service?.sessionTypes) ? service.sessionTypes : [];
    const suitableFor = Array.isArray(service?.suitableFor) ? service.suitableFor : [];
    const responseType = resolveResponseType(service);

    const fullAddress = String(
      service?.fullAddress || service?.location || service?.addressLine1 || ''
    ).trim();
    const townCity = String(service?.city || service?.town || '').trim();
    const postcode = String(service?.postcode || '').trim();
    const clinicName = String(service?.clinicName || '').trim();
    const listingHeadline = String(service?.listingHeadline || '').trim();
    const organizationName = String(service?.organizationName || '').trim();
    const bookingLink = String(service?.bookingLink || '').trim();
    const professionalRegistration = String(
      service?.professionalRegistration || service?.registration || ''
    ).trim();
    const primaryProfession = formatListValue(
      Array.isArray(service?.providerType) && service.providerType.length > 0
        ? service.providerType
        : service?.role || service?.profession || service?.category
    );

    const combinedLocation = [clinicName, fullAddress, townCity, postcode]
      .filter(Boolean)
      .join(', ');

    return {
      id: service?.id,
      listing: listingHeadline || organizationName || service?.providerName || 'Untitled Listing',
      coach: service?.contactName || service?.provider?.name || service?.providerName || 'N/A',
      providerEmail: service?.providerEmail || service?.provider?.email || 'N/A',
      providerPhone:
        service?.providerPhone ||
        service?.provider?.phone ||
        service?.provider?.phoneNumber ||
        'N/A',
      status: normalizeStatus(service),
      avatar: resolveImageUrl(
        pickImageSource(service?.provider?.avatar, service?.logo, service?.image),
        SERVICE_AVATAR_PLACEHOLDER
      ),
      about: service?.aboutService || service?.description || 'No service details available.',
      clinicName,
      listingHeadline,
      organizationName,
      fullAddress,
      townCity,
      postcode,
      combinedLocation,
      combinedLocationMapsUrl: buildGoogleMapsSearchUrl(combinedLocation),
      addressMapsUrl: buildGoogleMapsSearchUrl(fullAddress),
      townCityMapsUrl: buildGoogleMapsSearchUrl(townCity),
      postcodeMapsUrl: buildGoogleMapsSearchUrl(postcode),
      primaryProfession,
      sessionTypes: formatListValue(sessionTypes.length > 0 ? sessionTypes : service?.sessionType),
      sports: formatListValue(sports.length > 0 ? sports : service?.sport),
      suitableFor: formatListValue(suitableFor),
      whoCanTakePart: formatListValue(
        service?.whoCanTakePart ??
          (typeof service?.womenOnly === 'boolean'
            ? service.womenOnly
              ? 'Women only'
              : 'Mixed, women welcome'
            : typeof service?.womensOnly === 'boolean'
              ? service.womensOnly
                ? 'Women only'
                : 'Mixed, women welcome'
              : '')
      ),
      costMemebershipDetail: String(
        service?.costMemebershipDetail || service?.costMembershipDetail || ''
      ).trim(),
      professionalRegistration,
      bookingLink,
      insuranceInPlace:
        service?.insuranceInPlace === true ||
        String(service?.insuranceInPlace || '')
          .trim()
          .toLowerCase() === 'yes' ||
        String(service?.insuranceInPlace || '')
          .trim()
          .toLowerCase() === 'true'
          ? 'Confirmed by provider'
          : service?.insuranceInPlace === false ||
              String(service?.insuranceInPlace || '')
                .trim()
                .toLowerCase() === 'no' ||
              String(service?.insuranceInPlace || '')
                .trim()
                .toLowerCase() === 'false'
            ? 'No'
            : String(service?.insuranceInPlace || service?.insurance || '').trim(),
      responseType,
    };
  }, [service]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setSendingMessage(true);
    try {
      toast.success('Message sent to provider successfully!');
      setChatMessage('');
    } catch (err) {
      toast.error('Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner label="Loading service details..." containerClassName="py-0" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center text-red-600">Error: {error}</div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Listing not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-lg bg-[#0F766E] px-4 py-2 text-white hover:bg-[#0d655d]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const overviewHasContent =
    hasValue(data.combinedLocation) ||
    hasValue(data.primaryProfession) ||
    hasValue(data.sessionTypes) ||
    hasValue(data.sports) ||
    hasValue(data.whoCanTakePart) ||
    hasValue(data.suitableFor) ||
    hasValue(data.professionalRegistration) ||
    hasValue(data.insuranceInPlace) ||
    hasValue(data.costMemebershipDetail) ||
    hasValue(data.bookingLink);

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-6 font-sans md:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-base font-medium text-[#147B6B] transition-colors hover:text-[#0D655D]"
        >
          <ArrowLeft className="h-4 w-4" /> <span>Back to Listings</span>
        </button>

        {/* Main Content Layout */}
        <div className="max-w-4xl space-y-8">
          {/* Header / Profile Card */}
          <div className="flex items-center gap-4">
            <img
              src={data.avatar}
              alt={data.listing}
              onError={(e) => handleImageLoadError(e, SERVICE_AVATAR_PLACEHOLDER)}
              className="h-[72px] w-[72px] rounded-full bg-gray-200 object-cover shadow-sm"
            />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[24px] leading-tight font-semibold text-[#0B544E] md:text-3xl">
                  {data.listing}
                </h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    data.status === 'Live'
                      ? 'bg-green-100 text-green-800'
                      : data.status === 'Banned'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {data.status}
                </span>
              </div>
              {hasValue(data.coach) ? (
                <p className="mt-1 text-base text-[#4A5565]">
                  Coach: <span className="font-semibold text-[#1A1D1F]">{data.coach}</span>
                </p>
              ) : null}
            </div>
          </div>

          {/* Banned Alert Banner */}
          {data.status === 'Banned' && (
            <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-5">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <div>
                <h3 className="mb-1 text-base font-semibold text-red-700">
                  This listing is not approved / banned
                </h3>
                <p className="text-xs leading-relaxed text-red-600">
                  This listing is currently suspended or banned. Please review community guidelines
                  before approving.
                </p>
              </div>
            </div>
          )}

          {/* About This Service */}
          {hasValue(data.about) ? (
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-bold text-[#1A1D1F] md:text-xl">
                About This Service
              </h3>
              <p className="text-[15px] leading-relaxed whitespace-pre-line text-[#4A5565]">
                {data.about}
              </p>
            </div>
          ) : null}

          {/* Service Overview Grid */}
          {overviewHasContent ? (
            <div>
              <h3 className="mb-4 text-xl font-bold text-[#1A1D1F]">Service Overview</h3>
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  {/* Service type */}
                  {hasValue(data.primaryProfession) ? (
                    <OverviewRow
                      icon={BriefcaseMedical}
                      label="Service type"
                      value={data.primaryProfession}
                    />
                  ) : null}

                  {/* Delivery type */}
                  {hasValue(data.sessionTypes) ? (
                    <OverviewRow icon={Target} label="Delivery type" value={data.sessionTypes} />
                  ) : null}

                  {/* Location */}
                  {hasValue(data.combinedLocation) ? (
                    <OverviewRow
                      icon={MapPin}
                      label="Location"
                      value={
                        data.combinedLocationMapsUrl ? (
                          <a
                            href={data.combinedLocationMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0F766E] underline-offset-2 hover:underline"
                          >
                            {data.combinedLocation}
                          </a>
                        ) : (
                          data.combinedLocation
                        )
                      }
                    />
                  ) : null}

                  {/* Sports supported */}
                  {hasValue(data.sports) ? (
                    <OverviewRow icon={Medal} label="Sports supported" value={data.sports} />
                  ) : null}

                  {/* Who can take part? */}
                  {hasValue(data.whoCanTakePart) ? (
                    <OverviewRow
                      icon={Users}
                      label="Who can take part?"
                      value={data.whoCanTakePart}
                    />
                  ) : null}

                  {/* Suitable for */}
                  {hasValue(data.suitableFor) ? (
                    <OverviewRow icon={UserCheck} label="Suitable for" value={data.suitableFor} />
                  ) : null}

                  {/* Professional registration */}
                  {hasValue(data.professionalRegistration) ? (
                    <OverviewRow
                      icon={FileCheck}
                      label="Professional registration / qualifications"
                      value={data.professionalRegistration}
                    />
                  ) : null}

                  {/* Insurance in place */}
                  {hasValue(data.insuranceInPlace) ? (
                    <OverviewRow
                      icon={ShieldCheck}
                      label="Insurance in place"
                      value={data.insuranceInPlace}
                    />
                  ) : null}

                  {/* Cost / Membership */}
                  {hasValue(data.costMemebershipDetail) ? (
                    <OverviewRow
                      icon={CircleDollarSign}
                      label="Cost / membership"
                      value={data.costMemebershipDetail}
                    />
                  ) : null}

                  {/* Booking Link */}
                  {hasValue(data.bookingLink) ? (
                    <OverviewRow
                      icon={ExternalLink}
                      label="Booking Link"
                      value={
                        <a
                          href={data.bookingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-[#0F766E] underline-offset-2 hover:underline"
                        >
                          {data.bookingLink}
                        </a>
                      }
                    />
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderListingDetails;
