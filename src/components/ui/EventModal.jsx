import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEvent } from '../../context/EventContext';
import { toast } from 'react-toastify';
import { createOrganizerEvent, updateOrganizerEvent } from '../../features/events/eventsAPI';
import { selectAuthUser } from '../../features/auth/authSlice';
import {
  selectCreateOrganizerEventLoading,
  selectUpdateOrganizerEventLoading,
} from '../../features/events/eventsSlice';
import { fetchSportsCategories } from '../../features/sportsCategories/sportsCategoriesAPI';
import { selectSportsCategories } from '../../features/sportsCategories/sportsCategoriesSlice';
import { GET } from '../../services/httpMethods';

const ALL_LEVELS_WELCOME = 'All levels welcome';

const SUITABLE_FOR_OPTIONS = [
  'New to sport',
  'Some experience',
  'Experienced players',
  'Competitive players',
  ALL_LEVELS_WELCOME,
];

const EVENT_TYPE_OPTIONS = [
  { label: 'Tournament', value: 'TOURNAMENT' },
  { label: 'Open Day', value: 'OPEN_DAY' },
  { label: 'Taster Session', value: 'TASTER_SESSION' },
  { label: 'Workshop', value: 'WORKSHOP' },
  { label: 'Talk', value: 'TALK' },
  { label: 'Charity Event', value: 'CHARITY_EVENT' },
  { label: 'Social Event', value: 'SOCIAL_EVENT' },
  { label: 'Other', value: 'OTHER' },
];

const DAY_OPTIONS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

const RESPONSE_ACTION_OPTIONS = [
  {
    value: 'REGISTER',
    label: 'Register',
    desc: 'Choose this if the session is confirmed and people can sign up to attend.',
    note: 'If payment or final details are required, you should contact the person after they register.',
  },
  {
    value: 'REGISTER_INTEREST',
    label: 'Register Interest',
    desc: 'Choose this if you want to confirm places first, check demand, or contact people before they attend.',
    note: 'You should follow up with anyone who registers interest to let them know the next steps.',
  },
];

const fieldClass =
  'w-full rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white/40';
const labelClass = 'mb-1.5 block text-sm font-medium text-white';
const sectionTitleClass = 'text-base font-bold text-white';
const sectionHintClass = 'mt-1 text-sm text-white/80';

const FormSection = ({ title, hint, children }) => (
  <section className="rounded-lg border border-white/20 bg-[#0f756d] p-4">
    {title ? (
      <div className="mb-4">
        <h3 className={sectionTitleClass}>{title}</h3>
        {hint ? <p className={sectionHintClass}>{hint}</p> : null}
      </div>
    ) : null}
    {children}
  </section>
);

const isRegisterInterestType = (responseType) =>
  responseType === 'REGISTER_INTEREST' || responseType === 'INTERESTED';

const toUiResponseType = (responseType) =>
  isRegisterInterestType(responseType) ? 'REGISTER_INTEREST' : 'REGISTER';

const toApiResponseType = (responseType) =>
  isRegisterInterestType(responseType) ? 'INTERESTED' : 'REGISTER';

const AUTH_ROLE_LABELS = {
  coach: 'Coach',
  provider: 'Service Provider',
  admin: 'Admin',
  user: 'Player',
};

const resolveRoleFromUser = (user = {}) => {
  const explicit =
    user?.providerRole ||
    user?.jobTitle ||
    user?.yourRole ||
    user?.listingRole ||
    '';
  if (String(explicit || '').trim()) return String(explicit).trim();

  const providerType = Array.isArray(user?.providerType)
    ? user.providerType[0]
    : user?.providerType;
  if (String(providerType || '').trim()) return String(providerType).trim();

  const authRole = String(user?.role || '')
    .trim()
    .toLowerCase()
    .replace(/^role[_\s-]*/, '');
  if (AUTH_ROLE_LABELS[authRole]) return AUTH_ROLE_LABELS[authRole];
  if (authRole) return authRole.charAt(0).toUpperCase() + authRole.slice(1);
  return '';
};

const parseListValue = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const getOrganisationDefaultsFromUser = (user = {}) => ({
  organizationName:
    user?.organizationName ||
    user?.organisationName ||
    user?.providerBusinessName ||
    user?.businessName ||
    user?.providerName ||
    user?.name ||
    '',
  contactName:
    user?.contactName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.name ||
    '',
  role: resolveRoleFromUser(user),
  logo: user?.logo || user?.avatar || user?.profileImage || user?.image || null,
});

const mapResponseTypeToMethods = (responseType) =>
  responseType === 'REGISTER_INTEREST' ? ['Allow users to register interest'] : ['Add booking link'];

const mapMethodsToResponseType = (methods = []) =>
  methods.includes('Allow users to register interest') ? 'REGISTER_INTEREST' : 'REGISTER';

const formatTimeForApi = (value) => {
  if (!value) return '';
  const match = String(value).trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return String(value).trim();
  const hours = Number(match[1]);
  const hour12 = hours % 12 || 12;
  return `${hour12}:${match[2]} ${hours >= 12 ? 'PM' : 'AM'}`;
};

const toDateInputValue = (value) => {
  if (!value) return '';
  const text = String(value).trim();
  if (!text) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return '';
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toTimeInputValue = (value) => {
  if (!value) return '';
  const text = String(value).trim();
  if (!text) return '';
  const hhmm = text.match(/^(\d{2}):(\d{2})/);
  if (hhmm) return `${hhmm[1]}:${hhmm[2]}`;
  const ampmMatch = text.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampmMatch) {
    let hours = Number(ampmMatch[1]) % 12;
    if (ampmMatch[3].toUpperCase() === 'PM') hours += 12;
    return `${String(hours).padStart(2, '0')}:${ampmMatch[2]}`;
  }
  const parsed = new Date(`1970-01-01T${text}`);
  if (Number.isNaN(parsed.getTime())) return '';
  const hours = String(parsed.getHours()).padStart(2, '0');
  const minutes = String(parsed.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const timesFromTimeSlote = (timeSlote) => {
  const text = String(timeSlote || '').trim();
  if (!text) return { startTime: '', endTime: '' };
  const parts = text.split(/\s*-\s*/);
  return {
    startTime: toTimeInputValue(parts[0]),
    endTime: toTimeInputValue(parts[1]),
  };
};

const normalizeCostType = (value) => {
  const text = String(value || '')
    .trim()
    .toLowerCase();
  return text === 'paid' ? 'paid' : 'free';
};

const normalizeSkillLevel = (value) => {
  const text = String(value || '')
    .trim()
    .toLowerCase();
  if (text.includes('new') || text.includes('beginner')) return 'BEGINNER';
  if (text.includes('regular') || text.includes('intermediate')) return 'INTERMEDIATE';
  if (text.includes('coach') || text.includes('advanced')) return 'ADVANCED';
  if (text.includes('open') || text.includes('all')) return 'ALL_LEVELS';
  return (
    String(value || '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_') || 'BEGINNER'
  );
};

const SPORT_OPTIONS = [
  'Football',
  'Squash',
  'Rugby',
  'Netball',
  'Cricket',
  'Padel',
  'Tennis',
  'Badminton',
  'Golf',
  'Running',
  'Multi-Sport',
  'Not sport-specific',
];

const buildEmptyEventForm = (authUser) => {
  const org = getOrganisationDefaultsFromUser(authUser);
  return {
    organizationName: org.organizationName,
    contactName: org.contactName,
    role: org.role,
    orgLogo: org.logo,
    eventTitle: '',
    sportType: '',
    suitableFor: [],
    eventType: 'TOURNAMENT',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    sessionDay: '',
    venueName: '',
    addressLine1: '',
    city: '',
    postcode: '',
    googleMapLinks: '',
    minAge: '18',
    maxParticipant: '20',
    skillLevel: ALL_LEVELS_WELCOME,
    costType: 'Free',
    price: '',
    responseType: 'REGISTER',
    responseMethods: mapResponseTypeToMethods('REGISTER'),
    organizerName: org.contactName,
    organizerPhone: authUser?.phone || authUser?.phoneNumber || '',
    organizerEmail: authUser?.email || '',
    image: null,
    womensOnly: true,
  };
};

const mapEventToForm = (initialData, authUser) => {
  const org = getOrganisationDefaultsFromUser(authUser);
  const responseType = toUiResponseType(
    initialData?.responseType ||
      (initialData?.responseMethods?.includes('Allow users to register interest')
        ? 'REGISTER_INTEREST'
        : 'REGISTER')
  );
  const slotTimes = timesFromTimeSlote(initialData?.timeSlote || initialData?.timeSlots);

  return {
    organizationName: initialData?.organizationName || initialData?.organizerName || org.organizationName,
    contactName: initialData?.contactName || initialData?.organizerName || org.contactName,
    role: initialData?.role || org.role,
    orgLogo: initialData?.orgLogo || initialData?.logo || org.logo,
    eventTitle: initialData.title || '',
    sportType: initialData.sportType || '',
    suitableFor: parseListValue(initialData.suitableFor),
    eventType: initialData.eventType || initialData.type || 'TOURNAMENT',
    description: initialData.description || '',
    startDate: toDateInputValue(initialData.startDate || initialData.date),
    endDate: toDateInputValue(initialData.endDate),
    startTime: toTimeInputValue(initialData.startTime) || slotTimes.startTime,
    endTime: toTimeInputValue(initialData.endTime) || slotTimes.endTime,
    sessionDay: initialData?.sessionDay || initialData?.sessonDay || '',
    venueName: initialData.venueName || '',
    addressLine1: initialData.addressLine1 || '',
    city: initialData.city || initialData.townCity || '',
    postcode: initialData.postCode || initialData.postcode || '',
    googleMapLinks: initialData.googleMapLink || initialData.googleMapLinks || '',
    minAge: initialData.minAge || '18',
    maxParticipant: initialData.maxParticipants || initialData.maxParticipant || '20',
    skillLevel: initialData.skillLevel || ALL_LEVELS_WELCOME,
    costType: String(initialData.costType || 'Free').toLowerCase() === 'paid' ? 'Paid' : 'Free',
    price: initialData.registrationFee || initialData.price || '',
    responseType,
    responseMethods: mapResponseTypeToMethods(responseType),
    organizerName: initialData.organizerName || org.contactName,
    organizerPhone: initialData.organizerPhone || authUser?.phone || authUser?.phoneNumber || '',
    organizerEmail: initialData.organizerEmail || authUser?.email || '',
    image: initialData.image || null,
    womensOnly: initialData?.womensOnly ?? initialData?.womenOnly ?? true,
  };
};

const EventModal = ({
  isOpen,
  onClose,
  initialData = null,
  mode = 'create',
  useOrganizerApi = false,
  onSuccess,
  onSwitchToSession,
}) => {
  const dispatch = useDispatch();
  const todayStr = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);
  const sportsCategories = useSelector(selectSportsCategories);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchSportsCategories());
    }
  }, [dispatch, isOpen]);
  const { createEvent, updateEvent, createLoading, updateLoading } = useEvent();
  const authUser = useSelector(selectAuthUser);
  const createOrganizerLoading = useSelector(selectCreateOrganizerEventLoading);
  const updateOrganizerLoading = useSelector(selectUpdateOrganizerEventLoading);
  const orgLogoInputRef = useRef(null);
  const eventImageInputRef = useRef(null);
  const [formData, setFormData] = useState(() => buildEmptyEventForm(authUser));

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const hydrateForm = async () => {
      let nextForm =
        initialData && mode === 'edit'
          ? mapEventToForm(initialData, authUser)
          : buildEmptyEventForm(authUser);

      if (mode !== 'edit') {
        try {
          const response = await GET('/api/users/me/profile');
          const profile = response?.data?.user || response?.data || response;
          if (profile && typeof profile === 'object') {
            nextForm = {
              ...nextForm,
              organizationName:
                nextForm.organizationName ||
                profile.organizationName ||
                profile.organisationName ||
                profile.clubName ||
                '',
              contactName:
                nextForm.contactName ||
                profile.contactName ||
                [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
                profile.name ||
                '',
              role: nextForm.role || resolveRoleFromUser(profile),
              orgLogo:
                nextForm.orgLogo ||
                profile.logo ||
                profile.avatar ||
                profile.profileImage ||
                null,
            };
          }
        } catch {
          // optional
        }
      }

      if (!cancelled) setFormData(nextForm);
    };

    hydrateForm();

    return () => {
      cancelled = true;
    };
  }, [initialData, mode, isOpen, authUser]);

  const [errors, setErrors] = useState({});

  const imagePreview = useMemo(() => {
    if (!formData.image) return '';
    if (typeof formData.image === 'string') return formData.image;
    return URL.createObjectURL(formData.image);
  }, [formData.image]);

  const orgLogoPreview = useMemo(() => {
    if (!formData.orgLogo) return '';
    if (typeof formData.orgLogo === 'string') return formData.orgLogo;
    return URL.createObjectURL(formData.orgLogo);
  }, [formData.orgLogo]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // const toggleResponseMethod = (method) => { ... };

  const toggleSuitableFor = (option) => {
    setFormData((prev) => {
      const current = Array.isArray(prev.suitableFor) ? prev.suitableFor : [];
      const exists = current.includes(option);

      if (option === ALL_LEVELS_WELCOME) {
        return { ...prev, suitableFor: exists ? [] : [ALL_LEVELS_WELCOME] };
      }

      if (exists) {
        return { ...prev, suitableFor: current.filter((item) => item !== option) };
      }

      return {
        ...prev,
        suitableFor: [...current.filter((item) => item !== ALL_LEVELS_WELCOME), option],
      };
    });
    setErrors((prev) => ({ ...prev, suitableFor: undefined }));
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      if (orgLogoPreview && orgLogoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(orgLogoPreview);
      }
    };
  }, [imagePreview, orgLogoPreview]);

  const handleOrgLogoFile = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleChange('orgLogo', file);
    }
    event.target.value = '';
  };

  const handleEventImageFile = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleChange('image', file);
    }
    event.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields (image is optional)
    const requiredFields = [
      'eventTitle',
      'sportType',
      'suitableFor',
      'eventType',
      'description',
      'startDate',
      'endDate',
      'startTime',
      'endTime',
      'city',
      'postcode',
      // 'googleMapLinks',
      // 'skillLevel',
      'costType',
    ];

    const newErrors = {};
    requiredFields.forEach((key) => {
      const val = formData[key];
      if (
        val === null ||
        val === undefined ||
        (Array.isArray(val) && val.length === 0) ||
        (typeof val === 'string' && val.trim() === '')
      ) {
        newErrors[key] = 'This field is required';
      }
    });

    if (formData.costType === 'Paid' && String(formData.price || '').trim() === '') {
      newErrors.price = 'Price is required for paid events';
    }

    if (!Array.isArray(formData.responseMethods) || formData.responseMethods.length === 0) {
      newErrors.responseMethods = 'Select at least one response option';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.warn('Validation errors:', newErrors);
      // Use toast instead of blocking alert for user feedback
      toast.error(
        `Please fill all required fields. Missing: ${Object.keys(newErrors).length} field(s)`
      );
      return;
    }

    // Prepare FormData for API submission
    const payload = new FormData();
    payload.append('title', formData.eventTitle);
    payload.append('sportType', formData.sportType);
    const finalSuitableFor = Array.isArray(formData.suitableFor)
      ? formData.suitableFor
      : [formData.suitableFor].filter(Boolean);
    finalSuitableFor.forEach((option) => {
      payload.append('suitableFor', option);
    });
    payload.append('eventType', formData.eventType);
    payload.append('description', formData.description);
    payload.append('startDate', formData.startDate);
    payload.append('endDate', formData.endDate);
    payload.append('startTime', formatTimeForApi(formData.startTime) || formData.startTime);
    payload.append('endTime', formatTimeForApi(formData.endTime) || formData.endTime);
    payload.append('venueName', formData.venueName);
    if (String(formData.addressLine1 || '').trim()) {
      payload.append('addressLine1', formData.addressLine1);
    }
    payload.append('city', formData.city);
    payload.append('postCode', formData.postcode || '');
    const fullAddress = [formData.venueName, formData.addressLine1, formData.city, formData.postcode]
      .map((item) => String(item || '').trim())
      .filter(Boolean)
      .join(', ');
    if (fullAddress) {
      payload.append('fullAddress', fullAddress);
    }
    payload.append('googleMapLink', formData.googleMapLinks);
    payload.append('organizationName', formData.organizationName || formData.organizerName || '');
    payload.append('contactName', formData.contactName || formData.organizerName || '');
    payload.append('role', formData.role || '');
    payload.append(
      'whoCanTakePart',
      formData.womensOnly ? 'women only' : 'Mixed, women welcome'
    );
    payload.append('minAge', formData.minAge || '18');
    payload.append('maxParticipants', formData.maxParticipant || '20');
    payload.append('skillLevel', normalizeSkillLevel(formData.skillLevel));
    payload.append('costType', normalizeCostType(formData.costType));
    payload.append(
      'registrationFee',
      formData.costType === 'Paid' ? String(formData.price || '').trim() : '0'
    );
    if (formData.costType === 'Paid') {
      payload.append('price', String(formData.price || '').trim());
    }
    const responseType = toApiResponseType(
      formData.responseType || mapMethodsToResponseType(formData.responseMethods)
    );
    payload.append('responseType', responseType);
    const finalMethods = [...mapResponseTypeToMethods(toUiResponseType(responseType))];
    // if (!finalMethods.includes('Allow users to ask a question')) {
    //   finalMethods.push('Allow users to ask a question');
    // }
    finalMethods.forEach((method) => {
      if (String(method || '').trim()) {
        payload.append('responseMethods', String(method).trim());
      }
    });

    const organizerName = formData.organizerName || authUser?.name || authUser?.fullName || 'N/A';
    const organizerPhone =
      formData.organizerPhone ||
      authUser?.phone ||
      authUser?.phoneNumber ||
      authUser?.mobile ||
      authUser?.contactNumber ||
      'N/A';
    const organizerEmail = formData.organizerEmail || authUser?.email || 'no-reply@example.com';

    payload.append('organizerName', organizerName);
    payload.append('organizerPhone', organizerPhone);
    payload.append('organizerEmail', organizerEmail);
    payload.append('womensOnly', String(formData.womensOnly === true));

    // API multer accepts a single file field: `image` (not `logo`)
    const eventImageFile =
      formData.image instanceof File
        ? formData.image
        : formData.orgLogo instanceof File
          ? formData.orgLogo
          : null;
    if (eventImageFile) {
      payload.append('image', eventImageFile);
    }

    // Call create or update based on mode
    let isSuccess = false;

    if (useOrganizerApi && mode === 'edit' && initialData?.id) {
      const action = await dispatch(
        updateOrganizerEvent({ id: initialData.id, eventData: payload })
      );
      isSuccess = updateOrganizerEvent.fulfilled.match(action);
      if (!isSuccess) {
        console.error('[EventModal] updateOrganizerEvent failed:', action.payload || action.error);
      }
    } else if (useOrganizerApi && mode === 'create') {
      const action = await dispatch(createOrganizerEvent(payload));
      isSuccess = createOrganizerEvent.fulfilled.match(action);
      if (!isSuccess) {
        console.error('[EventModal] createOrganizerEvent failed:', action.payload || action.error);
      }
    } else if (mode === 'edit' && initialData?.id) {
      const result = await updateEvent(initialData.id, payload);
      isSuccess = Boolean(result?.success);
    } else {
      const result = await createEvent(payload);
      isSuccess = Boolean(result?.success);
    }

    if (isSuccess) {
      onSuccess?.();
      onClose();
    }
  };

  const isSubmitting =
    createLoading || updateLoading || createOrganizerLoading || updateOrganizerLoading;

  if (!isOpen) return null;

  const errorClass = 'mt-1 text-sm text-red-200';

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#0a5a54] bg-[#0f756d] shadow-xl">
        <div className="flex items-start justify-between border-b border-white/15 px-5 py-4">
          <div className="pr-4">
            <h2 className="text-2xl font-semibold text-white">
              {mode === 'edit' ? 'Edit Event' : 'Add Event'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              Use this form for one-off activities, taster sessions or special occasions. For regular or
              recurring sport sessions, please add a{' '}
              {mode === 'create' && typeof onSwitchToSession === 'function' ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose?.();
                    onSwitchToSession();
                  }}
                  className="font-medium text-[#F5F1EB] underline underline-offset-2 hover:text-white"
                >
                  Session
                </button>
              ) : (
                <span className="font-medium text-[#F5F1EB] underline underline-offset-2">Session</span>
              )}{' '}
              instead.
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full bg-white/20 p-1 text-white transition-colors hover:bg-white/30"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <form id="event-form" onSubmit={handleSubmit} className="space-y-4">
            <FormSection
              title="Organisation Details"
              hint="These details are pre-populated from your account."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Organisation / Club Name</label>
                  <input
                    className={fieldClass}
                    value={formData.organizationName}
                    onChange={(e) => handleChange('organizationName', e.target.value)}
                    placeholder="Example Netball Club"
                  />
                </div>
                <div>
                  <label className={labelClass}>Contact Person Name</label>
                  <input
                    className={fieldClass}
                    value={formData.contactName}
                    onChange={(e) => handleChange('contactName', e.target.value)}
                    placeholder="Contact name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Your Role</label>
                  <input
                    className={fieldClass}
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    placeholder="Coach"
                  />
                </div>
                <div>
                  <label className={labelClass}>Organisation Image / Logo</label>
                  <div className="mt-1 flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/35 bg-white/10">
                      {orgLogoPreview ? (
                        <img
                          src={orgLogoPreview}
                          alt="Organisation"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-white/60">
                          Logo
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => orgLogoInputRef.current?.click()}
                      className="text-sm font-medium text-[#F5F1EB] underline underline-offset-2 hover:text-white"
                    >
                      Edit organisation details
                    </button>
                    <input
                      ref={orgLogoInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      className="hidden"
                      aria-label="Upload organisation logo"
                      onChange={handleOrgLogoFile}
                    />
                  </div>
                </div>
              </div>
            </FormSection>

            <FormSection title="Sport & Event Information">
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Event title *</label>
                  <input
                    value={formData.eventTitle}
                    onChange={(e) => handleChange('eventTitle', e.target.value)}
                    className={fieldClass}
                    placeholder="Enter event title"
                  />
                  {errors.eventTitle && <p className={errorClass}>{errors.eventTitle}</p>}
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Sport or activity *</label>
                    <select
                      value={formData.sportType}
                      onChange={(e) => handleChange('sportType', e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Select sport</option>
                      {(sportsCategories?.length ? sportsCategories : SPORT_OPTIONS.map((name) => ({ name }))).map(
                        (sport) => (
                          <option key={sport.id || sport.name} value={sport.name}>
                            {sport.name}
                          </option>
                        )
                      )}
                    </select>
                    {errors.sportType && <p className={errorClass}>{errors.sportType}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Event type *</label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => handleChange('eventType', e.target.value)}
                      className={fieldClass}
                    >
                      {EVENT_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.eventType && <p className={errorClass}>{errors.eventType}</p>}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Suitable for</label>
                  <p className="mb-2 text-xs text-white/75">Select all that apply.</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {SUITABLE_FOR_OPTIONS.map((option) => {
                      const allLevelsSelected = (formData.suitableFor || []).includes(
                        ALL_LEVELS_WELCOME
                      );
                      const isDisabled = allLevelsSelected && option !== ALL_LEVELS_WELCOME;
                      return (
                        <label
                          key={option}
                          className={`flex items-center gap-2 text-sm text-white/90 ${
                            isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={(formData.suitableFor || []).includes(option)}
                            disabled={isDisabled}
                            onChange={() => toggleSuitableFor(option)}
                            className="accent-[#0f756d]"
                          />
                          {option}
                        </label>
                      );
                    })}
                  </div>
                  {errors.suitableFor && <p className={errorClass}>{errors.suitableFor}</p>}
                </div>
                <div>
                  <label className={labelClass}>Who can take part?</label>
                  <div className="mt-2 flex flex-wrap items-center gap-6">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-white/90">
                      <input
                        type="radio"
                        name="eventWho"
                        checked={formData.womensOnly === true}
                        onChange={() => handleChange('womensOnly', true)}
                        className="accent-[#0f756d]"
                      />
                      Women only
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-white/90">
                      <input
                        type="radio"
                        name="eventWho"
                        checked={formData.womensOnly === false}
                        onChange={() => handleChange('womensOnly', false)}
                        className="accent-[#0f756d]"
                      />
                      Mixed, women welcome
                    </label>
                  </div>
                </div>
              </div>
            </FormSection>


            <FormSection title="Event Description">
              <textarea
                placeholder="Tell people what to expect, who it is for and what to bring"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={5}
                className={`${fieldClass} min-h-28 resize-none`}
              />
              {errors.description && <p className={errorClass}>{errors.description}</p>}
            </FormSection>

            <FormSection title="Location & Timing">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Venue name</label>
                    <input
                      className={fieldClass}
                      value={formData.venueName}
                      onChange={(e) => handleChange('venueName', e.target.value)}
                      placeholder="Enter venue name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Address line 1</label>
                    <input
                      className={fieldClass}
                      value={formData.addressLine1}
                      onChange={(e) => handleChange('addressLine1', e.target.value)}
                      placeholder="Enter address"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Town/Area *</label>
                    <input
                      className={fieldClass}
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="Enter town or area"
                    />
                    {errors.city && <p className={errorClass}>{errors.city}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Postcode *</label>
                    <input
                      className={fieldClass}
                      value={formData.postcode}
                      onChange={(e) => handleChange('postcode', e.target.value)}
                      placeholder="Enter postcode"
                    />
                    {errors.postcode && <p className={errorClass}>{errors.postcode}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className={labelClass}>Start date *</label>
                    <input
                      type="date"
                      min={todayStr}
                      className={fieldClass}
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                    />
                    {errors.startDate && <p className={errorClass}>{errors.startDate}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>End date *</label>
                    <input
                      type="date"
                      min={formData.startDate || todayStr}
                      className={fieldClass}
                      value={formData.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                    />
                    {errors.endDate && <p className={errorClass}>{errors.endDate}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Start time *</label>
                    <input
                      type="time"
                      className={fieldClass}
                      value={formData.startTime}
                      onChange={(e) => handleChange('startTime', e.target.value)}
                    />
                    {errors.startTime && <p className={errorClass}>{errors.startTime}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className={labelClass}>End time *</label>
                    <input
                      type="time"
                      className={fieldClass}
                      value={formData.endTime}
                      onChange={(e) => handleChange('endTime', e.target.value)}
                    />
                    {errors.endTime && <p className={errorClass}>{errors.endTime}</p>}
                  </div>
                </div>
              </div>
            </FormSection>

            <FormSection>
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className={labelClass}>Pricing</label>
                  <div className="flex gap-2">
                    {['Free', 'Paid'].map((option) => {
                      const selected = formData.costType === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              costType: option,
                              price: option === 'Free' ? '' : prev.price,
                            }));
                            setErrors((prev) => ({
                              ...prev,
                              costType: undefined,
                              price: option === 'Free' ? undefined : prev.price,
                            }));
                          }}
                          className={`rounded-md px-5 py-2.5 text-sm font-semibold transition-colors ${
                            selected
                              ? 'bg-[#F5F1EB] text-[#1A1D1D]'
                              : 'border border-white/30 bg-transparent text-white hover:border-white/50'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {errors.costType && <p className={errorClass}>{errors.costType}</p>}
                </div>
                {formData.costType === 'Paid' ? (
                  <div className="min-w-[220px] flex-1 max-w-sm">
                    <label className={labelClass}>Price</label>
                    <input
                      className={fieldClass}
                      value={formData.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      placeholder="e.g. £10 per person"
                    />
                    {errors.price && <p className={errorClass}>{errors.price}</p>}
                  </div>
                ) : null}
              </div>
            </FormSection>

            {/* Client mock: min age / max participants / skill not shown — payload still supports these if re-enabled */}
            {/* <FormSection title="Event details">...</FormSection> */}

            <FormSection>
              <p className="mb-1 text-base font-bold text-white">
                Choose the main action for this listing
              </p>
              <p className="mb-3 text-sm text-white/80">
                Select the button that best matches what you want people to do next. They will still be able to contact you with a question separately.
              </p>
              <div className="space-y-3">
                {RESPONSE_ACTION_OPTIONS.map((option) => {
                  const selected = formData.responseType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          responseType: option.value,
                          responseMethods: mapResponseTypeToMethods(option.value),
                        }))
                      }
                      className={`w-full rounded-xl border p-4 text-left ${
                        selected
                          ? 'border-white bg-[#F5F1EB] text-[#1A1D1D]'
                          : 'border-white/30 bg-[#0f756d] text-white'
                      }`}
                    >
                      <p className="font-semibold">{option.label}</p>
                      <p className={`mt-1 text-sm ${selected ? 'text-gray-600' : 'text-white/75'}`}>
                        {option.desc}
                      </p>
                      {option.note ? (
                        <p className={`mt-2 text-xs leading-relaxed ${selected ? 'text-gray-500' : 'text-white/65'}`}>
                          Note: {option.note}
                        </p>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              {errors.responseMethods && <p className={errorClass}>{errors.responseMethods}</p>}
            </FormSection>

            <FormSection>
              <label className={labelClass}>Upload an image for this event (optional)</label>
              <p className="mb-2 text-xs text-white/75">This image will appear with your event listing. If left blank, a default image will be shown.</p>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') eventImageInputRef.current?.click();
                }}
                onClick={() => eventImageInputRef.current?.click()}
                className="relative flex h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-white/35 bg-white/10"
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Event"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="relative z-10 rounded bg-black/50 px-2 py-1 text-xs text-white">
                      Click to change
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="mb-2 h-8 w-8 text-white/80" />
                    <span className="text-sm font-medium text-[#F5F1EB]">Click to upload an image</span>
                    <span className="mt-1 text-xs text-white/65">JPEG or PNG accepted. Max 10MB</span>
                  </>
                )}
                <input
                  ref={eventImageInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  aria-label="Upload event image"
                  className="hidden"
                  onChange={handleEventImageFile}
                />
              </div>
            </FormSection>
          </form>
        </div>

        <div className="border-t border-white/15 px-5 py-4">
          <button
            type="submit"
            form="event-form"
            className="w-full rounded-lg bg-[#F5F1EB] py-3 text-sm font-semibold text-[#0f756d] hover:bg-[#ebe5dc] disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : mode === 'edit' ? 'Update Event' : 'Submit for approval'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EventModal;
