// import React, { useEffect, useMemo, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Heart, Medal, Calendar, Users, MapPin } from 'lucide-react';
// import Container from '../../../components/layout/Container';
// import { GET, POST } from '../../../services/httpMethods';
// import { ENDPOINT } from '../../../services/httpEndpoint';
// import Swal from 'sweetalert2';

// const formatList = (value) => {
//   if (!Array.isArray(value)) return String(value || '').trim();
//   return value.filter(Boolean).join(', ');
// };

// const getWomenOnlyText = (value) => {
//   if (typeof value === 'boolean') return value ? 'Yes' : 'No';
//   return String(value || '').trim();
// };

// const getMapEmbedUrl = (service) => {
//   const locationText =
//     service?.fullAddress || service?.clinicName || service?.location || service?.city || '';

//   if (!locationText) return '';
//   return `https://www.google.com/maps?q=${encodeURIComponent(locationText)}&z=15&output=embed`;
// };

// const DiscoverDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [service, setService] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [isSending, setIsSending] = useState(false);
//   const [messageStatus, setMessageStatus] = useState('');
//   const [isBooking, setIsBooking] = useState(false);
//   const [isInterest, setIsInterest] = useState(false);

//   useEffect(() => {
//     const controller = new AbortController();

//     const fetchServiceDetails = async () => {
//       if (!id) {
//         setError('Service id is missing.');
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError('');

//         const response = await GET(
//           ENDPOINT.SERVICES.DETAIL(id),
//           {},
//           controller.signal,
//           { skipAuth: true, withCredentials: false }
//         );

//         const payload = response?.data;
//         const resolvedService = payload?.data?.service || payload?.service || payload?.data || null;
//         setService(resolvedService);
//       } catch (fetchError) {
//         if (fetchError?.name === 'CanceledError' || fetchError?.name === 'AbortError') return;
//         setError(
//           fetchError?.response?.data?.message ||
//             fetchError?.message ||
//             'Failed to load discover details.'
//         );
//         setService(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchServiceDetails();

//     return () => controller.abort();
//   }, [id]);

//   const item = useMemo(() => {
//     if (!service) return null;

//     return {
//       id: service.id,
//       title:
//         service.listingHeadline ||
//         service.organizationName ||
//         service.providerName ||
//         service.contactName ||
//         '',
//       coach: service.provider?.name || service.contactName || service.providerName || '',
//       type: formatList(service.sessionTypes),
//       sport: formatList(service.sports),
//       suitableFor: formatList(service.suitableFor),
//       womensOnly: getWomenOnlyText(service.womenOnly),
//       location: service.clinicName || service.location || '',
//       postcode: service.postcode || '',
//       town: service.city || '',
//       day: service.sessonDay || formatList(service.availableDays),
//       time: service.timeSlote || '',
//       image: service.logo || '',
//       avatar: service.provider?.avatar || '',
//       mapEmbedUrl: getMapEmbedUrl(service),
//       about: service.aboutService || service.description || '',
//       bookingLink: service.bookingLink || '',
//       providerId: service.providerId || service.provider?.id || '',
//       participantResponseType: service.participantResponseType || 'ADD_BOOKING_LINK',
//       responseType: service.responseType || (service.participantResponseType === 'ALLOW_REGISTER_INTEREST' ? 'INTERESTED' : 'REGISTER'),
//     };
//   }, [service]);

//   const handleBookPlace = async () => {
//     if (!id) return;
//     try {
//       setIsBooking(true);
//       const response = await POST(ENDPOINT.SERVICES.BOOK(id), {});
//       const msg = response?.data?.message || 'Registration completed successfully!';
//       await Swal.fire({
//         icon: 'success',
//         title: 'Registration Confirmed!',
//         text: msg,
//         confirmButtonColor: '#0F766E',
//         confirmButtonText: 'Great!',
//         timer: 4000,
//         timerProgressBar: true,
//       });
//     } catch (bookErr) {
//       const errMsg = bookErr?.response?.data?.message || 'Failed to register. Please try again.';
//       await Swal.fire({
//         icon: 'error',
//         title: 'Registration Failed',
//         text: errMsg,
//         confirmButtonColor: '#0F766E',
//         confirmButtonText: 'OK',
//       });
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   const handleRegisterInterest = async () => {
//     if (!id) return;
//     try {
//       setIsInterest(true);
//       const response = await POST(ENDPOINT.SERVICES.INTEREST(id), {});
//       const msg = response?.data?.message || 'Interest registered successfully!';
//       await Swal.fire({
//         icon: 'success',
//         title: 'Interest Registered!',
//         text: msg,
//         confirmButtonColor: '#0F766E',
//         confirmButtonText: 'Great!',
//         timer: 4000,
//         timerProgressBar: true,
//       });
//     } catch (intErr) {
//       const errMsg = intErr?.response?.data?.message || 'Failed to register interest. Please try again.';
//       await Swal.fire({
//         icon: 'error',
//         title: 'Registration Failed',
//         text: errMsg,
//         confirmButtonColor: '#0F766E',
//         confirmButtonText: 'OK',
//       });
//     } finally {
//       setIsInterest(false);
//     }
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();

//     const trimmedMessage = String(message || '').trim();
//     if (!trimmedMessage) {
//       setMessageStatus('Please write a message before sending.');
//       return;
//     }

//     const recipientId = item?.providerId;
//     if (!id || !recipientId) {
//       setMessageStatus('Unable to send message. Provider information is missing.');
//       return;
//     }

//     try {
//       setIsSending(true);
//       setMessageStatus('');

//       const response = await POST(ENDPOINT.SERVICES.MESSAGES(id), {
//         recipientId,
//         message: trimmedMessage,
//       });

//       setMessage('');
//       setMessageStatus(response?.data?.message || 'Message sent successfully.');
//     } catch (sendError) {
//       setMessageStatus(sendError?.response?.data?.message || 'Failed to send message.');
//     } finally {
//       setIsSending(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-[#F8FAFC] min-h-screen pb-16">
//         <Container>
//           <div className="py-8 text-center">Loading discover details...</div>
//         </Container>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-[#F8FAFC] min-h-screen pb-16">
//         <Container>
//           <div className="py-8 text-center text-red-600">{error}</div>
//         </Container>
//       </div>
//     );
//   }

//   if (!item) {
//     return (
//       <div className="bg-[#F8FAFC] min-h-screen pb-16">
//         <Container>
//           <div className="py-8 text-center">Service not found.</div>
//         </Container>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#F8FAFC] min-h-screen pb-16">
//       <Container>
//         <div className="py-4 md:py-8">
          
//           {/* Hero Banner Section */}
//           <div className="relative mb-16">
//             {/* Banner Image */}
//             <div className="w-full h-62.5 md:h-150 rounded-2xl overflow-hidden shadow-sm">
//               {item.image ? (
//                 <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
//               ) : (
//                 <div className="w-full h-full bg-gray-300"></div>
//               )}
//             </div>

//             {/* Overlaid Back Button */}
//             <button
//               onClick={() => navigate(-1)}
//               className="absolute top-4 left-4 flex items-center gap-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all text-sm font-medium"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back
//             </button>

//             {/* Overlaid Favorite/Heart Button */}
//             {/* <button className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white p-2.5 rounded-full transition-all">
//               <Heart className="w-4 h-4" />
//             </button> */}

//             {/* Overlaid Avatar Picture */}
//             <div className="absolute -bottom-10 left-6 md:left-10 w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#F8FAFC] overflow-hidden bg-gray-200">
//               {item.avatar ? (
//                 <img src={item.avatar} alt={item.coach} className="w-full h-full object-cover" />
//               ) : (
//                 <div className="w-full h-full bg-gray-300"></div>
//               )}
//             </div>
//           </div>

//           {/* Title & Coach Info */}
//           <div className="px-2 md:px-4 mb-8">
//             <h1 className="text-2xl md:text-[32px] font-bold text-[#0B544E] leading-tight">
//               {item.title}
//             </h1>
//             <p className="text-[#33383F] mt-2 text-base">
//               Coach: <span className="font-bold">{item.coach || item.headCoach}</span>
//             </p>
//           </div>

//           {/* Session Details Card */}
//           <div className="bg-white rounded-lg p-6 md:p-8 mb-8 shadow-sm border border-gray-100">
//             <h2 className="text-xl font-bold text-[#000000] mb-3">Session Details</h2>
//             <div className="text-[#272727]  text-base md:max-w-7xl">  
//               {item.about}
//             </div>
//           </div>

//           {/* 3-Column Grid for Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
//             {/* Column 1: Session Overview */}
//             <div>
//               <h3 className="text-xl font-semibold text-[#1A1D1F] mb-4">Session Overview</h3>
//               <div className="space-y-3 mb-6">
                
//                 {/* Info Row: Sport */}
//                 <div className="flex items-center gap-4 bg-white p-3.5 rounded-lg border border-gray-100 shadow-sm">
//                   <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
//                     <Medal className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <p className="text-base text-[#101828] font-medium mb-0.5">Sport</p>
//                     <p className="text-base  text-[#4A5565]">{item.sport}</p>
//                   </div>
//                 </div>

//                 {/* Info Row: Session Type */}
//                 <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
//                   <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
//                     <Calendar className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <p className="text-base text-[#101828] font-medium mb-0.5">Session Type</p>
//                     <p className="text-base  text-[#4A5565]">{item.type}</p>
//                   </div>
//                 </div>

//                 {/* Info Row: Suitable For */}
//                 <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
//                   <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
//                     <Users className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <p className="text-base text-[#101828] font-medium mb-0.5">Suitable For</p>
//                     <p className="text-base  text-[#4A5565]">{item.suitableFor}</p>
//                   </div>
//                 </div>

//                 {/* Info Row: Women's only */}
//                 <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
//                   <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
//                     <Users className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <p className="text-base text-[#101828] font-medium mb-0.5">Women's only</p>
//                     <p className="text-base  text-[#4A5565]">{item.womensOnly}</p>
//                   </div>
//                 </div>

//               </div>
              
//               {/* Action Buttons */}
//               <div className="hidden md:flex flex-wrap gap-3">
//                 {item.responseType !== 'INTERESTED' ? (
//                   <button
//                     onClick={handleBookPlace}
//                     disabled={isBooking}
//                     className="bg-[#0F766E] hover:bg-[#0D655D] disabled:opacity-70 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
//                   >
//                     {isBooking ? 'Registering...' : 'Register'}
//                   </button>
//                 ) : (
//                   <button
//                     onClick={handleRegisterInterest}
//                     disabled={isInterest}
//                     className="bg-[#0F766E] hover:bg-[#0D655D] disabled:opacity-70 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
//                   >
//                     {isInterest ? 'Registering...' : 'Register Interest'}
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Column 2: Venue Information */}
//             <div>
//               <h3 className="text-xl font-semibold text-[#1A1D1F] mb-4">Venue Information</h3>
//               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-100 flex flex-col">
//                 <div className="space-y-3 mb-6 flex-1">
//                   <p className="text-base flex items-start gap-2">
//                     <span className="text-[#1A1D1F] shrink-0 font-medium">Venue Name:</span>
//                     <span className="text-[#1A1D1F]">{item.location}</span>
//                   </p>

//                   <div className="flex items-start gap-2 text-base text-[#1A1D1F]">
//                     <MapPin className="w-4 h-4 mt-1 shrink-0 text-[#6B7280]" />
//                     <p>{`${item.location}, ${item.town}, ${item.postcode}`}</p>
//                   </div>

//                   <p className="text-base flex items-start gap-2">
//                     <span className="text-[#1A1D1F] shrink-0 font-medium">Day of session:</span>
//                     <span className="text-[#1A1D1F]">{item.day}</span>
//                   </p>

//                   <p className="text-base flex items-start gap-2">
//                     <span className="text-[#1A1D1F] shrink-0 font-medium">Session Time:</span>
//                     <span className="text-[#1A1D1F]">{item.time}</span>
//                   </p>
//                 </div>
                
//                 {/* Map */}
//                 <div className="w-full h-50  rounded-lg overflow-hidden shrink-0">
//                   {item.mapEmbedUrl ? (
//                     <iframe
//                       src={item.mapEmbedUrl}
//                       title="Map View"
//                       className="w-full h-full border-0 rounded-lg"
//                       loading="lazy"
//                       referrerPolicy="no-referrer-when-downgrade"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Map unavailable</div>
//                   )}
//                 </div>
//               </div>

//             <div className="mt-5 flex flex-col sm:flex-row gap-3 md:hidden">
//                 {item.responseType !== 'INTERESTED' ? (
//                   <button
//                     onClick={handleBookPlace}
//                     disabled={isBooking}
//                     className="w-full sm:flex-1 bg-[#0F766E] hover:bg-[#0D655D] disabled:opacity-70 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-center"
//                   >
//                     {isBooking ? 'Registering...' : 'Register'}
//                   </button>
//                 ) : (
//                   <button
//                     onClick={handleRegisterInterest}
//                     disabled={isInterest}
//                     className="w-full sm:flex-1 bg-[#0F766E] hover:bg-[#0D655D] disabled:opacity-70 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
//                   >
//                     {isInterest ? 'Registering...' : 'Register Interest'}
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Column 3: Contact Organiser */}
//             <div>
//               <h3 className="text-xl font-semibold text-[#1A1D1F] mb-4">Contact Organiser</h3>
//               <div className="bg-[#E7F1F1] p-4 rounded-lg h-100 flex flex-col">
//                 <p className="text-base mb-4 text-[#1A1D1F] ">Ask the organiser a question</p>
//                 <form onSubmit={handleSendMessage} className="flex flex-col flex-1">
//                   <textarea 
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     className="w-full flex-1 bg-[#B5D5D2] rounded-xl p-4 text-base text-[#1A1D1F] placeholder-gray-500/70 border-none focus:ring-1 focus:ring-[#147B6B] resize-none mb-4"
//                     placeholder="Write your message"
//                     disabled={isSending}
//                     required
//                   ></textarea>
//                   <button 
//                     type="submit"
//                     disabled={isSending}
//                     className="bg-[#0F766E] hover:bg-[#0F766E] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors w-fit disabled:opacity-70"
//                   >
//                     {isSending ? 'Sending...' : 'Send message'}
//                   </button>
//                 </form>
//                 {messageStatus && <p className="mt-2 text-xs text-[#147B6B]">{messageStatus}</p>}

//               </div>
//             </div>
//           </div>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default DiscoverDetails;



import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Medal, Calendar, Users, MapPin, ExternalLink } from 'lucide-react';
import Container from '../../../components/layout/Container';
import { GET, POST } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';
import Swal from 'sweetalert2';

const formatList = (value) => {
  if (!Array.isArray(value)) return String(value || '').trim();
  return value.filter(Boolean).join(', ');
};

const getWomenOnlyText = (value) => {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value || '').trim();
};

const getMapEmbedUrl = (service) => {
  let locationQuery = '';

  if (service?.googleMapLink) {
    // Standard link check
    if (!service.googleMapLink.includes('maps.app.goo.gl')) {
      try {
        const urlObj = new URL(service.googleMapLink);
        const qParam = urlObj.searchParams.get('q') || urlObj.searchParams.get('query');
        if (qParam) {
          locationQuery = qParam;
        }
      } catch (e) {
        // Safe contextual catch
      }
    }
  }

  // Fallback string composition mechanism
  if (!locationQuery) {
    const textParts = [];
    const isFakePlaceholder = (str) => !str || /qui|har|dolor|minima|consectetu|lorem|ipsum/i.test(str);

    if (!isFakePlaceholder(service?.venueName)) textParts.push(service.venueName);
    if (!isFakePlaceholder(service?.fullAddress)) textParts.push(service.fullAddress);
    if (!isFakePlaceholder(service?.city)) textParts.push(service.city);

    if (textParts.length > 0) {
      locationQuery = textParts.join(', ');
    }
  }

  // Resolve short links missing query params by pushing the raw link into an embed wrapper template
  if (!locationQuery && service?.googleMapLink) {
    return `https://maps.app.goo.gl/...8{encodeURIComponent(service.googleMapLink)}&output=embed`;
  }

  if (!locationQuery) return '';
  
  // Repaired template string variable signature
  return `https://maps.app.goo.gl/...9{encodeURIComponent(locationQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
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

    return {
      id: service.id,
      title: service.title || service.listingHeadline || service.organizationName || service.providerName || service.contactName || '',
      coach: service.organizerName || service.provider?.name || service.contactName || '',
      type: service.eventType || formatList(service.sessionTypes),
      sport: service.sportType || formatList(service.sports),
      suitableFor: formatList(service.suitableFor),
      womensOnly: getWomenOnlyText(service.womenOnly),
      location: service.venueName || service.clinicName || service.location || '',
      postcode: service.postcode || '',
      town: service.city || '',
      day: service.sessonDay || formatList(service.availableDays) || '',
      time: service.timeSlote || (service.startTime && service.endTime ? `${service.startTime} - ${service.endTime}` : ''),
      image: service.image || service.logo || '',
      avatar: service.organizer?.avatar || service.provider?.avatar || '',
      mapEmbedUrl: getMapEmbedUrl(service),
      rawMapLink: service.googleMapLink || '', 
      about: service.description || service.aboutService || '',
      bookingLink: service.bookingLink || '',
      providerId: service.organizerId || service.providerId || service.provider?.id || '',
      participantResponseType: service.participantResponseType || 'ADD_BOOKING_LINK',
      responseType: service.responseType || (service.participantResponseType === 'ALLOW_REGISTER_INTEREST' ? 'INTERESTED' : 'REGISTER'),
    };
  }, [service]);

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
            <div className="w-full h-62.5 md:h-150 rounded-2xl overflow-hidden shadow-sm">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300"></div>
              )}
            </div>

            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 flex items-center gap-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="absolute -bottom-10 left-6 md:left-10 w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#F8FAFC] overflow-hidden bg-gray-200">
              {item.avatar ? (
                <img src={item.avatar} alt={item.coach} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300"></div>
              )}
            </div>
          </div>

          {/* Title & Coach Info */}
          <div className="px-2 md:px-4 mb-8">
            <h1 className="text-2xl md:text-[32px] font-bold text-[#0B544E] leading-tight">
              {item.title}
            </h1>
            <p className="text-[#33383F] mt-2 text-base">
              Coach: <span className="font-bold">{item.coach}</span>
            </p>
          </div>

          {/* Session Details Card */}
          <div className="bg-white rounded-lg p-6 md:p-8 mb-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#000000] mb-3">Session Details</h2>
            <div className="text-[#272727] text-base md:max-w-7xl">  
              {item.about}
            </div>
          </div>

          {/* 3-Column Grid for Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Column 1: Session Overview */}
            <div>
              <h3 className="text-xl font-semibold text-[#1A1D1F] mb-4">Session Overview</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-4 bg-white p-3.5 rounded-lg border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
                    <Medal className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-base text-[#101828] font-medium mb-0.5">Sport</p>
                    <p className="text-base text-[#4A5565]">{item.sport}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-base text-[#101828] font-medium mb-0.5">Session Type</p>
                    <p className="text-base text-[#4A5565]">{item.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-base text-[#101828] font-medium mb-0.5">Suitable For</p>
                    <p className="text-base text-[#4A5565]">{item.suitableFor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#EAF2F1] flex items-center justify-center text-[#147B6B]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-base text-[#101828] font-medium mb-0.5">Women's only</p>
                    <p className="text-base text-[#4A5565]">{item.womensOnly}</p>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex flex-wrap gap-3">
                {item.responseType !== 'INTERESTED' ? (
                  <button
                    onClick={handleBookPlace}
                    disabled={isBooking}
                    className="bg-[#0F766E] hover:bg-[#0D655D] disabled:opacity-70 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    {isBooking ? 'Registering...' : 'Register'}
                  </button>
                ) : (
                  <button
                    onClick={handleRegisterInterest}
                    disabled={isInterest}
                    className="bg-[#0F766E] hover:bg-[#0D655D] disabled:opacity-70 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    {isInterest ? 'Registering...' : 'Register Interest'}
                  </button>
                )}
              </div>
            </div>

            {/* Column 2: Venue Information */}
            <div>
              <h3 className="text-xl font-semibold text-[#1A1D1F] mb-4">Venue Information</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-100 flex flex-col">
                <div className="space-y-3 mb-6 flex-1">
                  <p className="text-base flex items-start gap-2">
                    <span className="text-[#1A1D1F] shrink-0 font-medium">Venue Name:</span>
                    <span className="text-[#1A1D1F]">{item.location}</span>
                  </p>

                  <div className="flex items-start gap-2 text-base text-[#1A1D1F]">
                    <MapPin className="w-4 h-4 mt-1 shrink-0 text-[#6B7280]" />
                    <p>{[item.location, item.town, item.postcode].filter(Boolean).join(', ')}</p>
                  </div>

                  <p className="text-base flex items-start gap-2">
                    <span className="text-[#1A1D1F] shrink-0 font-medium">Day of session:</span>
                    <span className="text-[#1A1D1F]">{item.day}</span>
                  </p>

                  <p className="text-base flex items-start gap-2">
                    <span className="text-[#1A1D1F] shrink-0 font-medium">Session Time:</span>
                    <span className="text-[#1A1D1F]">{item.time}</span>
                  </p>
                </div>
                
                {/* Embedded Map Visual Shell */}
                <div className="relative w-full h-50 rounded-lg overflow-hidden shrink-0 shadow-inner bg-gray-50 border border-gray-100">
                  {item.mapEmbedUrl ? (
                    <>
                      <iframe
                        src={item.mapEmbedUrl}
                        title="Map View"
                        className="w-full h-full border-0 rounded-lg"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      
                      {/* Overlay CTA targeting long-form redirects */}
                      {item.rawMapLink && (
                        <a 
                          href={item.rawMapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-3 left-3 bg-white text-[#1a73e8] px-3 py-1.5 rounded font-medium text-xs shadow-md border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-1.5 font-sans"
                        >
                          Open in Maps
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Map unavailable</div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3 md:hidden">
                {item.responseType !== 'INTERESTED' ? (
                  <button
                    onClick={handleBookPlace}
                    disabled={isBooking}
                    className="w-full sm:flex-1 bg-[#0F766E] hover:bg-[#0D655D] disabled:opacity-70 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-center"
                  >
                    {isBooking ? 'Registering...' : 'Register'}
                  </button>
                ) : (
                  <button
                    onClick={handleRegisterInterest}
                    disabled={isInterest}
                    className="w-full sm:flex-1 bg-[#0F766E] hover:bg-[#0D655D] disabled:opacity-70 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    {isInterest ? 'Registering...' : 'Register Interest'}
                  </button>
                )}
              </div>
            </div>

            {/* Column 3: Contact Organiser */}
            <div>
              <h3 className="text-xl font-semibold text-[#1A1D1F] mb-4">Contact Organiser</h3>
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
    </div>
  );
};

export default DiscoverDetails;