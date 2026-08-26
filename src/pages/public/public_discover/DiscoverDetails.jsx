import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Medal, Calendar, Users, MapPin, CircleDollarSign, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import Container from '../../../components/layout/Container';
import { GET, POST } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';
import { getUser } from '../../../utils/storage';
import Swal from 'sweetalert2';
import {
  handleImageLoadError,
  pickImageSource,
  resolveImageUrl,
} from '../../../utils/resolveImageUrl';
import {
  formatScheduleDaysLabel,
  formatScheduleTimeLine,
  parseSchedulesFromService,
} from '../../../utils/sessionSchedules';

const DISCOVER_PLACEHOLDER = '/discover-placeholder.png';

const formatList = (value) => {
  if (!Array.isArray(value)) return String(value || '').trim();
  return value.filter(Boolean).join(', ');
};

const hasText = (value) => String(value || '').trim().length > 0;

const getWomenOnlyText = (value) => {
  if (typeof value === 'boolean') return value ? 'Women-only' : 'Mixed, women welcome';
  const str = String(value || '').trim().toLowerCase();
  if (str === 'yes' || str === 'women-only' || str === 'women_only' || str === 'true') {
    return 'Women-only';
  }
  return 'Mixed, women welcome';
};

const getMapEmbedUrl = (service) => {
  const locationText =
    service?.fullAddress ||
    service?.addressLine1 ||
    service?.clinicName ||
    service?.location ||
    service?.city ||
    '';

  if (!locationText) return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(locationText)}&z=15&output=embed`;
};

const buildLocationSearchLabel = ({ town, postcode, location, fullAddress } = {}) => {
  const fromTownPostcode = [town, postcode].filter(Boolean).join(', ');
  if (fromTownPostcode) return fromTownPostcode;
  return [location, fullAddress].filter(Boolean).join(', ');
};

const buildGoogleMapsSearchUrl = (query) => {
  const normalized = String(query || '').trim();
  if (!normalized) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(normalized)}`;
};

const DiscoverDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messageStatus, setMessageStatus] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [isInterest, setIsInterest] = useState(false);

  const authUser = useSelector((state) => state.auth?.user);
  const currentUser = authUser || getUser();
  const userFullName =
    currentUser?.name ||
    [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') ||
    '';
  const userEmail = currentUser?.email || '';
  const userPostcode =
    currentUser?.postcode ||
    currentUser?.postalCode ||
    currentUser?.zipCode ||
    currentUser?.zip ||
    '';
  const userPhone = currentUser?.phoneNumber || currentUser?.phone || currentUser?.mobile || '';

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    fullName: userFullName,
    email: userEmail,
    phoneNumber: userPhone,
  });
  const [interestForm, setInterestForm] = useState({
    name: userFullName,
    email: userEmail,
    phoneNumber: userPhone,
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchServiceDetails = async () => {
      if (!id) {
        setError('Service id is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await GET(
          ENDPOINT.SERVICES.DETAIL(id),
          {},
          controller.signal,
          { skipAuth: true, withCredentials: false }
        );

        const payload = response?.data;
        const resolvedService = payload?.data?.service || payload?.service || payload?.data || null;

        console.group('[DiscoverDetails] Backend response');
        console.log('full response:', response);
        console.log('response.data:', payload);
        console.log('service:', resolvedService);
        console.groupEnd();

        setService(resolvedService);
      } catch (fetchError) {
        if (fetchError?.name === 'CanceledError' || fetchError?.name === 'AbortError') return;
        setError(
          fetchError?.response?.data?.message ||
            fetchError?.message ||
            'Failed to load discover details.'
        );
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();

    return () => controller.abort();
  }, [id]);

  const item = useMemo(() => {
    if (!service) return null;

    const hasWomenOnly =
      service.womenOnly !== undefined &&
      service.womenOnly !== null &&
      String(service.womenOnly).trim() !== '';

    const timeFrom = String(service.timeFrom || service.startTime || '').trim();
    const timeTo = String(service.timeTo || service.endTime || '').trim();
    const timeRange = timeFrom && timeTo ? `${timeFrom} - ${timeTo}` : timeFrom || timeTo;
    const schedules = parseSchedulesFromService(service);
    const scheduleDays = formatScheduleDaysLabel(schedules);
    const scheduleTimes = formatScheduleTimeLine(schedules);

    return {
      id: service.id,
      title:
        service.listingHeadline ||
        service.organizationName ||
        service.providerName ||
        service.contactName ||
        '',
      coach: service.provider?.name || service.contactName || service.providerName || '',
      type: formatList(service.sessionTypes),
      sport: formatList(service.sports),
      suitableFor: formatList(service.suitableFor),
      womensOnly: hasWomenOnly ? getWomenOnlyText(service.womenOnly) : '',
      venueName: service.clinicName || '',
      addressLine1: service.addressLine1 || '',
      location: service.city || service.townCity || service.location || '',
      fullAddress: service.fullAddress || '',
      googleMapLink: service.googleMapLink || service.googleMapLinks || '',
      postcode: service.postcode || '',
      town: service.city || service.townCity || '',
      day: scheduleDays || service.sessonDay || formatList(service.availableDays),
      time: scheduleTimes || service.timeSlote || timeRange || '',
      sessionFrequency: service.frequency || service.sessionFrequency || '',
      image: service.logo || service.image || service.thumbnail || '',
      avatar: service.provider?.avatar || '',
      mapEmbedUrl: getMapEmbedUrl(service),
      about: service.aboutService || service.description || '',
      costMemebershipDetail: service.costMemebershipDetail || '',
      bookingLink: service.bookingLink || '',
      insuranceInPlace:
        service.insuranceInPlace === true ||
        String(service.insuranceInPlace || '').trim().toLowerCase() === 'yes' ||
        String(service.insuranceInPlace || '').trim().toLowerCase() === 'true'
          ? 'Confirmed by provider'
          : service.insuranceInPlace === false ||
              String(service.insuranceInPlace || '').trim().toLowerCase() === 'no' ||
              String(service.insuranceInPlace || '').trim().toLowerCase() === 'false'
            ? 'No'
            : '',
      providerId: service.providerId || service.provider?.id || '',
      participantResponseType: service.participantResponseType || 'ADD_BOOKING_LINK',
      responseType: service.responseType || (service.participantResponseType === 'ALLOW_REGISTER_INTEREST' ? 'INTERESTED' : 'REGISTER'),
    };
  }, [service]);

  const heroImageSrc = useMemo(
    () =>
      resolveImageUrl(
        pickImageSource(service?.logo, service?.image, service?.thumbnail, item?.image),
        DISCOVER_PLACEHOLDER
      ),
    [service, item?.image]
  );

  const handleBookPlace = async () => {
    if (!id) return;
    try {
      setIsBooking(true);
      const response = await POST(ENDPOINT.SERVICES.BOOK(id), {});
      const msg = response?.data?.message || 'Registration completed successfully!';
      await Swal.fire({
        icon: 'success',
        title: 'Registration Confirmed!',
        text: msg,
        confirmButtonColor: '#0F766E',
        confirmButtonText: 'Great!',
        timer: 4000,
        timerProgressBar: true,
      });
    } catch (bookErr) {
      const errMsg = bookErr?.response?.data?.message || 'Failed to register. Please try again.';
      await Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errMsg,
        confirmButtonColor: '#0F766E',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleRegisterInterest = async () => {
    if (!id) return;
    try {
      setIsInterest(true);
      const response = await POST(ENDPOINT.SERVICES.INTEREST(id), {});
      const msg = response?.data?.message || 'Interest registered successfully!';
      await Swal.fire({
        icon: 'success',
        title: 'Interest Registered!',
        text: msg,
        confirmButtonColor: '#0F766E',
        confirmButtonText: 'Great!',
        timer: 4000,
        timerProgressBar: true,
      });
    } catch (intErr) {
      const errMsg = intErr?.response?.data?.message || 'Failed to register interest. Please try again.';
      await Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: errMsg,
        confirmButtonColor: '#0F766E',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsInterest(false);
    }
  };

  const handleOpenRegister = () => {
    const user = authUser || getUser();
    const name = user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '';
    setBookingForm({
      fullName: name,
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || user?.phone || user?.mobile || '',
    });
    setShowBookingForm(true);
  };

  const handleOpenInterest = () => {
    const user = authUser || getUser();
    const name = user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || '';
    const phone = user?.phoneNumber || user?.phone || user?.mobile || '';
    setInterestForm({
      name: name,
      email: user?.email || '',
      phoneNumber: phone,
    });
    setShowInterestForm(true);
  };

  const handleBookingInputChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleInterestInputChange = (field, value) => {
    setInterestForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmBooking = async () => {
    if (!id) return;
    const fullName = String(bookingForm.fullName || '').trim();
    const email = String(bookingForm.email || '').trim();
    const phoneNumber = String(bookingForm.phoneNumber || '').trim();

    if (!fullName || !email || !phoneNumber) {
      toast.error('Please provide full name, email and phone number to register.');
      return;
    }

    setIsBooking(true);
    try {
      const response = await POST(ENDPOINT.SERVICES.BOOK(id), {
        fullName,
        email,
        phoneNumber,
        notes: `Registration request for ${item.title || 'service'}`,
      });
      const msg = response?.data?.message || response?.message || 'Registration completed successfully!';
      setShowBookingForm(false);
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: msg,
        confirmButtonText: 'Okay',
        confirmButtonColor: '#0F766E',
      });
    } catch (e) {
      await Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: e?.response?.data?.message || 'Failed to register',
        confirmButtonColor: '#0F766E',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsBooking(false);
    }
  };

  const CalendarIcon = () => '📅';

  const handleConfirmInterest = async () => {
    if (!id) return;
    const name = String(interestForm.name || '').trim();
    const email = String(interestForm.email || '').trim();
    const phoneNumber = String(interestForm.phoneNumber || '').trim();

    if (!name || !email || !phoneNumber) {
      toast.error('Please provide name, email and phone number to confirm your interest.');
      return;
    }

    setIsInterest(true);
    try {
      const response = await POST(ENDPOINT.SERVICES.INTEREST(id), {
        fullName: name,
        email,
        phoneNumber,
      });
      const msg = response?.data?.message || response?.message || 'Interest registered successfully!';
      setShowInterestForm(false);
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: msg,
        confirmButtonText: 'Okay',
        confirmButtonColor: '#0F766E',
      });
    } catch (e) {
      await Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: e?.response?.data?.message || 'Failed to register interest',
        confirmButtonColor: '#0F766E',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsInterest(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedMessage = String(message || '').trim();
    if (!trimmedMessage) {
      setMessageStatus('Please write a message before sending.');
      return;
    }

    const recipientId = item?.providerId;
    if (!id || !recipientId) {
      setMessageStatus('Unable to send message. Provider information is missing.');
      return;
    }

    try {
      setIsSending(true);
      setMessageStatus('');

      const response = await POST(ENDPOINT.SERVICES.MESSAGES(id), {
        recipientId,
        message: trimmedMessage,
      });

      setMessage('');
      setMessageStatus(response?.data?.message || 'Message sent successfully.');
    } catch (sendError) {
      setMessageStatus(sendError?.response?.data?.message || 'Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen pb-16">
        <Container>
          <div className="py-8 text-center">Loading discover details...</div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen pb-16">
        <Container>
          <div className="py-8 text-center text-red-600">{error}</div>
        </Container>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen pb-16">
        <Container>
          <div className="py-8 text-center">Service not found.</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-16">
      <Container>
        <div className="py-4 md:py-8">
          
          {/* Hero Banner Section */}
          <div className="relative mb-16">
            {/* Banner Image */}
            <div className="w-full h-62.5 md:h-150 rounded-2xl overflow-hidden shadow-sm">
              <img
                src={heroImageSrc}
                alt={item.title || 'Listing'}
                className="h-full w-full object-cover"
                onError={(e) => handleImageLoadError(e, DISCOVER_PLACEHOLDER)}
              />
            </div>

            {/* Overlaid Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 flex items-center gap-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {/* Overlaid Favorite/Heart Button */}
            {/* <button className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white p-2.5 rounded-full transition-all">
              <Heart className="w-4 h-4" />
            </button> */}

            {/* Overlaid Avatar Picture */}
            {item.avatar ? (
              <div className="absolute -bottom-10 left-6 md:left-10 w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#F8FAFC] overflow-hidden bg-gray-200">
                <img src={item.avatar} alt={item.coach || item.title} className="w-full h-full object-cover" />
              </div>
            ) : null}
          </div>

          {/* Title & Coach Info */}
          <div className={`px-2 md:px-4 mb-8 ${item.avatar ? '' : 'mt-4'}`}>
            {hasText(item.title) ? (
              <h1 className="text-2xl md:text-[32px] font-bold text-[#0B544E] leading-tight">
                {item.title}
              </h1>
            ) : null}
            {hasText(item.coach || item.headCoach) ? (
              <p className="text-[#33383F] mt-2 text-base">
                Coach: <span className="font-bold">{item.coach || item.headCoach}</span>
              </p>
            ) : null}
          </div>

          {/* Session Details Card */}
          {hasText(item.about) ? (
            <div className="bg-white rounded-lg p-6 md:p-8 mb-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#000000] mb-3">About this session</h2>
              <div className="text-[#272727] text-base md:max-w-7xl whitespace-pre-wrap">
                {item.about}
              </div>
            </div>
          ) : null}

          {/* 3-Column Grid for Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Column 1: Session Overview */}
            <div>
              {(hasText(item.sport) ||
                hasText(item.type) ||
                hasText(item.suitableFor) ||
                hasText(item.womensOnly) ||
                hasText(item.costMemebershipDetail) ||
                hasText(item.insuranceInPlace)) && (
                <h3 className="text-xl font-semibold text-[#1A1D1F] mb-4">Session Overview</h3>
              )}
              <div className="space-y-3 mb-6">
                
                {hasText(item.sport) ? (
                  <div className="flex items-center gap-4 bg-white p-3.5 rounded-lg border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
                      <Medal className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-base text-[#101828] font-medium mb-0.5">Sport</p>
                      <p className="text-base text-[#4A5565]">{item.sport}</p>
                    </div>
                  </div>
                ) : null}

                {hasText(item.type) ? (
                  <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-base text-[#101828] font-medium mb-0.5">Session Type</p>
                      <p className="text-base text-[#4A5565]">{item.type}</p>
                    </div>
                  </div>
                ) : null}

                {hasText(item.suitableFor) ? (
                  <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-base text-[#101828] font-medium mb-0.5">Suitable for</p>
                      <p className="text-base text-[#4A5565]">{item.suitableFor}</p>
                    </div>
                  </div>
                ) : null}

                {hasText(item.womensOnly) ? (
                  <div className="flex flex-col gap-2 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-base text-[#101828] font-medium mb-0.5">Participation</p>
                        <p className="text-base text-[#4A5565]">{item.womensOnly}</p>
                      </div>
                    </div>
                    {item.womensOnly === 'Women-only' && (
                      <p className="text-[12px] text-gray-500 italic mt-1 pl-14 leading-normal">
                        Women-only refers to participants. Coaches, organisers, officials or venue staff may be male unless stated otherwise.
                      </p>
                    )}
                  </div>
                ) : null}

                {hasText(item.costMemebershipDetail) ? (
                  <div className="flex items-start gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
                      <CircleDollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-base text-[#101828] font-medium mb-0.5">
                        Cost or membership details
                      </p>
                      <p className="text-base text-[#4A5565] whitespace-pre-wrap">
                        {item.costMemebershipDetail}
                      </p>
                    </div>
                  </div>
                ) : null}

                

              </div>
              
              {/* Action Buttons */}
              <div className="hidden md:flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    if (item.responseType === 'INTERESTED') {
                      handleOpenInterest();
                    } else {
                      handleOpenRegister();
                    }
                  }}
                  className="bg-[#0F766E] hover:bg-[#0D655D] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {item.responseType === 'INTERESTED' ? 'Register Interest' : 'Register'}
                </button>
                {/* {hasText(item.bookingLink) ? (
                  <a
                    href={item.bookingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0F766E] hover:bg-[#0D655D] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Visit provider page
                  </a>
                ) : null} */}
              </div>
            </div>

            {/* Column 2: Location & Timing. */}
            <div>
              {(hasText(item.venueName) ||
                hasText(item.addressLine1) ||
                hasText(item.town || item.location) ||
                hasText(item.postcode) ||
                hasText(item.day) ||
                hasText(item.time) ||
                hasText(item.sessionFrequency) ||
                hasText(item.mapEmbedUrl) ||
                hasText(buildLocationSearchLabel(item))) && (
                <h3 className="text-xl font-semibold text-[#1A1D1F] mb-4">Location & Timing</h3>
              )}
              {(hasText(item.venueName) ||
                hasText(item.addressLine1) ||
                hasText(item.town || item.location) ||
                hasText(item.postcode) ||
                hasText(item.day) ||
                hasText(item.time) ||
                hasText(item.sessionFrequency) ||
                hasText(item.mapEmbedUrl) ||
                hasText(buildLocationSearchLabel(item))) && (
              <div className="flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                <div className="mb-6 min-h-0 flex-1 space-y-4">
                  {(() => {
                    const addressParts = [
                      item.venueName,
                      item.addressLine1,
                      item.town || item.location,
                      item.postcode,
                    ]
                      .map((str) => String(str || '').trim())
                      .filter(Boolean);

                    if (addressParts.length === 0) return null;

                    const formattedAddress = addressParts.join(', ');
                    const mapsHref =
                      String(item.googleMapLink || '').trim() ||
                      buildGoogleMapsSearchUrl(formattedAddress);

                    return (
                      <div className="flex flex-col">
                        <a
                          href={mapsHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group text-base text-[#1A1D1F] leading-normal transition-colors hover:text-[#0F766E]"
                          aria-label={`Open ${formattedAddress} in Google Maps`}
                        >
                          <span className="underline-offset-2 group-hover:underline">{formattedAddress}</span>
                        </a>
                      </div>
                    );
                  })()}

                  {hasText(item.day) ? (
                    <p className="text-base flex items-start gap-2">
                      <span className="text-[#1A1D1F] shrink-0 font-medium">
                        <CalendarIcon />
                      </span>
                      <span className="text-[#1A1D1F]">{item.day}</span>
                    </p>
                  ) : null}

                  {hasText(item.time) ? (
                    <p className="text-base flex items-start gap-2">
                      <span className="text-[#1A1D1F] shrink-0 font-medium">🕒</span>
                      <span className="text-[#1A1D1F]">{item.time}</span>
                    </p>
                  ) : null}

                  {hasText(item.sessionFrequency) ? (
                    <p className="text-base flex items-start gap-2">
                      <span className="text-[#1A1D1F] shrink-0 font-medium">🔄</span>
                      <span className="text-[#1A1D1F]">{item.sessionFrequency}</span>
                    </p>
                  ) : null}
                </div>
                
                {/* Map */}
                {hasText(item.mapEmbedUrl) ? (
                  <div className="relative h-50 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <iframe
                      src={item.mapEmbedUrl}
                      title="Map View"
                      className="absolute inset-0 block h-full w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : null}
              </div>
              )}

            <div className="mt-5 flex flex-col sm:flex-row gap-3 md:hidden">
              <button
                onClick={() => {
                  if (item.responseType === 'INTERESTED') {
                    handleOpenInterest();
                  } else {
                    handleOpenRegister();
                  }
                }}
                className="w-full sm:flex-1 bg-[#0F766E] hover:bg-[#0D655D] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors text-center"
              >
                {item.responseType === 'INTERESTED' ? 'Register Interest' : 'Register'}
              </button>
              {hasText(item.bookingLink) ? (
                <a
                  href={item.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 bg-[#0F766E] hover:bg-[#0D655D] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors text-center"
                >
                  Visit provider page
                </a>
              ) : null}
            </div>
          </div>

            {/* Column 3: Contact Organiser */}
            <div>
              <h3 className="text-xl font-semibold text-[#1A1D1F] mb-4"> Contact the provider.</h3>
              <div className="bg-[#E7F1F1] p-4 rounded-lg h-100 flex flex-col">
                <p className="text-base mb-4 text-[#1A1D1F] ">Ask the organiser a question</p>
                <form onSubmit={handleSendMessage} className="flex flex-col flex-1">
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full flex-1 bg-[#B5D5D2] rounded-xl p-4 text-base text-[#1A1D1F] placeholder-gray-500/70 border-none focus:ring-1 focus:ring-[#147B6B] resize-none mb-4"
                    placeholder="Write your message"
                    disabled={isSending}
                    required
                  ></textarea>
                  <button 
                    type="submit"
                    disabled={isSending}
                    className="bg-[#0F766E] hover:bg-[#0F766E] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors w-fit disabled:opacity-70"
                  >
                    {isSending ? 'Sending...' : 'Send message'}
                  </button>
                </form>
                {messageStatus && <p className="mt-2 text-xs text-[#147B6B]">{messageStatus}</p>}

              </div>
            </div>
          </div>
        </div>
      </Container>
      
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-100 px-5 py-4 md:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-[#1A1D1F]">Register</p>
                  <p className="mt-1 text-sm text-[#5B6976]">
                    Confirm your contact details before sending the registration request.
                  </p>
                </div>
                <button
                  className="rounded-md border border-[#D3DDDB] px-2.5 py-1.5 text-sm font-medium text-[#1A1D1F] hover:bg-[#F2F7F6]"
                  onClick={() => setShowBookingForm(false)}
                  disabled={isBooking}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid gap-6 px-5 py-5 md:grid-cols-[1.2fr_0.8fr] md:px-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#4A5565]">Full name</label>
                  <input
                    type="text"
                    value={bookingForm.fullName}
                    onChange={(e) => handleBookingInputChange('fullName', e.target.value)}
                    className="w-full rounded-lg border border-[#D1D9D8] bg-white px-3 py-2.5 text-sm text-[#1A1D1F] focus:border-[#0F766E] focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[#4A5565]">Email</label>
                  <input
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => handleBookingInputChange('email', e.target.value)}
                    className="w-full rounded-lg border border-[#D1D9D8] bg-white px-3 py-2.5 text-sm text-[#1A1D1F] focus:border-[#0F766E] focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-[#4A5565]">Phone number</label>
                  <input
                    type="tel"
                    value={bookingForm.phoneNumber}
                    onChange={(e) => handleBookingInputChange('phoneNumber', e.target.value)}
                    className="w-full rounded-lg border border-[#D1D9D8] bg-white px-3 py-2.5 text-sm text-[#1A1D1F] focus:border-[#0F766E] focus:outline-none"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-[#F7FBFA] p-4">
                <p className="text-sm font-semibold text-[#1A1D1F]">Service summary</p>
                <div className="mt-3 space-y-3 text-sm text-[#4A5565]">
                  <p>
                    <span className="font-medium text-[#1A1D1F]">Title:</span> {item.title}
                  </p>
                  <p>
                    <span className="font-medium text-[#1A1D1F]">Sport:</span> {item.sport}
                  </p>
                  <p>
                    <span className="font-medium text-[#1A1D1F]">Location:</span> {item.location}
                  </p>
                  <p>
                    <span className="font-medium text-[#1A1D1F]">Date:</span> {item.day || 'Not set'}
                  </p>
                  <p>
                    <span className="font-medium text-[#1A1D1F]">Time:</span> {item.time || 'Not set'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 px-5 py-4 md:px-6">
              <button
                className="rounded-lg border border-[#C7D7D4] px-4 py-2.5 text-sm font-medium text-[#1A1D1F] transition-colors hover:bg-[#EEF4F3]"
                onClick={() => setShowBookingForm(false)}
                disabled={isBooking}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D655D] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleConfirmBooking}
                disabled={isBooking}
              >
                {isBooking ? 'Submitting...' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showInterestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl md:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-[#1A1D1F]">Confirm your interest</p>
                <p className="mt-1 text-sm text-[#5B6976]">
                  Please review your details before sharing with the organiser.
                </p>
              </div>
              <button
                className="rounded-md border border-[#D3DDDB] px-2.5 py-1.5 text-sm font-medium text-[#1A1D1F] hover:bg-[#F2F7F6]"
                onClick={() => setShowInterestForm(false)}
                disabled={isInterest}
              >
                Close
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#4A5565]">Name</label>
                <input
                  type="text"
                  value={interestForm.name}
                  onChange={(e) => handleInterestInputChange('name', e.target.value)}
                  className="w-full rounded-lg border border-[#D1D9D8] bg-white px-3 py-2 text-sm text-[#1A1D1F] focus:border-[#0F766E] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#4A5565]">Email</label>
                <input
                  type="email"
                  value={interestForm.email}
                  onChange={(e) => handleInterestInputChange('email', e.target.value)}
                  className="w-full rounded-lg border border-[#D1D9D8] bg-white px-3 py-2 text-sm text-[#1A1D1F] focus:border-[#0F766E] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#4A5565]">Phone number</label>
                <input
                  type="tel"
                  value={interestForm.phoneNumber}
                  onChange={(e) => handleInterestInputChange('phoneNumber', e.target.value)}
                  className="w-full rounded-lg border border-[#D1D9D8] bg-white px-3 py-2 text-sm text-[#1A1D1F] focus:border-[#0F766E] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
              <button
                className="rounded-lg border border-[#C7D7D4] px-4 py-2.5 text-sm font-medium text-[#1A1D1F] transition-colors hover:bg-[#EEF4F3]"
                onClick={() => setShowInterestForm(false)}
                disabled={isInterest}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D655D] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleConfirmInterest}
                disabled={isInterest}
              >
                {isInterest ? 'Confirming...' : 'Confirm interest'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverDetails;

