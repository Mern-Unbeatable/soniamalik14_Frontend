import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { createService, updateService } from '../../features/service/serviceApi';
import { selectCreateLoading } from '../../features/service/serviceSlice';
import { selectAuthUser } from '../../features/auth/authSlice';
import { fetchSportsCategories } from '../../features/sportsCategories/sportsCategoriesAPI';
import { selectSportsCategories } from '../../features/sportsCategories/sportsCategoriesSlice';
import { GET } from '../../services/httpMethods';
import {
  buildSchedulePayload,
  createEmptySchedule,
  isEndAfterStart,
  parseSchedulesFromService,
} from '../../utils/sessionSchedules';

const sessionTypeOptions = ['Training', 'Coaching', 'Social Play','Other'];

const DELIVERY_TYPE_OPTIONS = ['In clinic', 'Online', 'At venue'];

const PROVIDER_SERVICE_TYPE_OPTIONS = [
  'Physiotherapy',
  'Nutrition',
  'Personal Training',
  'Sports Massage',
  'Mental Health & Wellbeing',
  'Coaching',
  'Other',
];

const SESSION_FREQUENCY_OPTIONS = ['Weekly', 'Fortnightly', 'Monthly', 'Other'];

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
    value: 'INTERESTED',
    label: 'Register Interest',
    desc: 'Choose this if you want to confirm places first, check demand, or contact people before they attend.',
    note: 'You should follow up with anyone who registers interest to let them know the next steps.',
  },
];

const PROVIDER_RESPONSE_ACTION_OPTIONS = [
  {
    value: 'REGISTER',
    label: 'Register',
    desc: 'Choose this if the service is confirmed and people can sign up to attend.',
    note: 'If payment or final details are required, you should contact the person after they register.',
  },
  {
    value: 'INTERESTED',
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

const sportOptions = [
  'Badminton',
  'Cricket',
  'Football',
  'Golf',
  'Netball',
  'Running',
  'Padel',
  'Rugby',
  'Squash',
  'Tennis',
  'Other',
];

const ALL_LEVELS_WELCOME = 'All levels welcome';

const suitabilityOptions = [
  'New to sport',
  'Some experience',
  'Experienced players',
  'Competitive players',
  ALL_LEVELS_WELCOME,
];

const createInitialForm = () => ({
  organisationName: '',
  contactPerson: '',
  role: '',
  about: '',
  logo: null,
  sports: [],
  sessionType: '',
  sessionTypes: [],
  suitableFor: [],
  womensOnly: '',
  otherSport: '',
  venueName: '',
  addressLine1: '',
  postcode: '',
  townCity: '',
  googleMapLink: '',
  sessonDay: '',
  sessionFrequency: '',
  sessionSchedules: [createEmptySchedule()],
  sessionDescription: '',
  costMembershipDetail: '',
  listingImage: null,
  listingHeadline: '',
  professionalRegistration: '',
  insuranceInPlace: 'Yes',
  dateDay: '',
  timeFrom: '',
  timeTo: '',
  bookingLink: '',
  responseType: 'REGISTER',
  responseMethods: ['Add booking link'],
});

const appendIfPresent = (formData, key, value) => {
  const normalized = typeof value === 'string' ? value.trim() : value;
  if (
    normalized !== undefined &&
    normalized !== null &&
    !(typeof normalized === 'string' && normalized.length === 0)
  ) {
    formData.append(key, normalized);
  }
};

const appendArrayValues = (formData, key, values = []) => {
  values.forEach((value) => appendIfPresent(formData, key, value));
};

const appendArrayField = (formData, key, values = []) => {
  const normalized = values.map((value) => String(value || '').trim()).filter(Boolean);

  if (normalized.length === 0) return;
  if (normalized.length === 1) {
    formData.append(key, JSON.stringify(normalized));
    return;
  }

  appendArrayValues(formData, key, normalized);
};

const normalizeArray = (values = []) =>
  values.map((value) => String(value || '').trim()).filter(Boolean);

const getResponseType = (methods = [], responseType = '') => {
  if (responseType === 'INTERESTED' || responseType === 'REGISTER_INTEREST') return 'INTERESTED';
  if (responseType === 'REGISTER') return 'REGISTER';
  if (methods.includes('Allow users to register interest')) return 'INTERESTED';
  if (methods.includes('Add booking link')) return 'REGISTER';
  return 'REGISTER';
};

const resolveResponseType = (value) => {
  if (value === 'INTERESTED' || value === 'REGISTER_INTEREST') return 'INTERESTED';
  return 'REGISTER';
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  const text = String(value).trim();
  if (!text) return [];
  if (text.startsWith('[') && text.endsWith(']')) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Fall back to comma-separated parsing.
    }
  }
  return text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
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

  const parsed = new Date(`1970-01-01T${text}`);
  if (Number.isNaN(parsed.getTime())) return '';

  const hours = String(parsed.getHours()).padStart(2, '0');
  const minutes = String(parsed.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const toTimeRangeInputValue = (value) => {
  const text = String(value || '').trim();
  if (!text) return { timeFrom: '', timeTo: '' };

  const parts = text
    .split('-')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    return {
      timeFrom: toTimeInputValue(parts[0]),
      timeTo: toTimeInputValue(parts[1]),
    };
  }

  const normalized = toTimeInputValue(text);
  return { timeFrom: normalized, timeTo: '' };
};

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

const mapUserToForm = (user) => {
  console.log('[CreateRecruitmentModal] Mapping user from Redux auth state:', user);
  const organisationName =
    user?.organizationName ||
    user?.organisationName ||
    user?.clubName ||
    user?.organization ||
    user?.providerBusinessName ||
    user?.businessName ||
    '';
  const contactPerson =
    user?.contactName ||
    user?.fullName ||
    user?.displayName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.firstName ||
    user?.name ||
    '';
  const about = user?.bio || user?.aboutOrganization || user?.about || '';
  const logo = user?.logo || user?.avatar || user?.profileImage || user?.photo || null;
  const role = resolveRoleFromUser(user);

  const mapped = {
    ...createInitialForm(),
    organisationName,
    contactPerson,
    role,
    about,
    logo,
    postcode: user?.postcode || user?.postCode || user?.postalCode || user?.zip || '',
  };
  console.log('[CreateRecruitmentModal] Mapped initial form from Redux user:', mapped);
  return mapped;
};

const mapInitialDataToForm = (initialData) => {
  const sportsFromService = toArray(initialData?.sports);
  const sportsFromWhoServiceFor = toArray(initialData?.whoServiceFor);
  const mergedSports = [...sportsFromService, ...sportsFromWhoServiceFor].filter(Boolean);
  const knownSports = mergedSports.filter(
    (sport) => sportOptions.includes(sport) && sport !== 'Other'
  );
  const customSports = mergedSports.filter((sport) => !sportOptions.includes(sport));
  const womenOnlyValue = initialData?.womenOnly;
  const schedules = parseSchedulesFromService(initialData);
  const firstSchedule = schedules[0] || createEmptySchedule();

  return {
    ...createInitialForm(),
    organisationName:
      initialData?.organizationName || initialData?.providerName || initialData?.title || '',
    contactPerson: initialData?.contactName || '',
    role:
      initialData?.role ||
      resolveRoleFromUser(initialData?.provider || initialData?.user || {}) ||
      (Array.isArray(initialData?.providerType)
        ? initialData.providerType[0]
        : initialData?.providerType) ||
      '',
    about: initialData?.aboutOrganization || '',
    sessionDescription: initialData?.aboutService || initialData?.description || '',
    logo: initialData?.logo || null,
    listingImage: initialData?.image || null,
    sports: customSports.length
      ? [...new Set([...knownSports, 'Other'])]
      : [...new Set(knownSports)],
    otherSport: customSports.join(', '),
    sessionType: toArray(initialData?.sessionType || initialData?.sessionTypes)[0] || '',
    sessionTypes: toArray(initialData?.sessionType || initialData?.sessionTypes),
    sessionFrequency: initialData?.frequency || initialData?.sessionFrequency || '',
    sessionSchedules: schedules.length > 0 ? schedules : [createEmptySchedule()],
    costMembershipDetail: initialData?.costMemebershipDetail || '',
    suitableFor: toArray(initialData?.suitableFor),
    womensOnly:
      typeof womenOnlyValue === 'boolean'
        ? womenOnlyValue
          ? 'YES'
          : 'NO'
        : String(womenOnlyValue || '').toUpperCase(),
    venueName: initialData?.clinicName || '',
    addressLine1: initialData?.addressLine1 || '',
    postcode: initialData?.postcode || '',
    townCity: initialData?.city || initialData?.townCity || '',
    googleMapLink: initialData?.googleMapLink || initialData?.googleMapLinks || '',
    sessonDay: firstSchedule.day || '',
    dateDay: toDateInputValue(initialData?.date || initialData?.dateDay),
    timeFrom: firstSchedule.startTime || '',
    timeTo: firstSchedule.endTime || '',
    bookingLink: initialData?.bookingLink || '',
    listingHeadline: initialData?.listingHeadline || initialData?.title || '',
    professionalRegistration:
      initialData?.professionalRegistration || initialData?.registration || '',
    insuranceInPlace:
      initialData?.insuranceInPlace === false || initialData?.insuranceInPlace === 'No'
        ? 'No'
        : 'Yes',
    responseType: resolveResponseType(initialData?.responseType),
    responseMethods:
      resolveResponseType(initialData?.responseType) === 'INTERESTED'
        ? ['Allow users to register interest']
        : ['Add booking link'],
  };
};

const isProviderUser = (user) => {
  const role = String(user?.role || '')
    .trim()
    .toLowerCase()
    .replace(/^role[_\s-]*/, '');
  return role === 'provider' || role.includes('provider');
};

const CreateRecruitmentModal = ({
  isOpen,
  onClose,
  initialData = null,
  mode = 'create',
  onSuccess,
  onSwitchToEvent,
}) => {
  const dispatch = useDispatch();
  const sportsCategories = useSelector(selectSportsCategories);
  const user = useSelector(selectAuthUser);
  const createLoading = useSelector(selectCreateLoading);
  const orgLogoInputRef = useRef(null);
  const listingImageInputRef = useRef(null);
  const [form, setForm] = useState(() => createInitialForm());
  const [errors, setErrors] = useState({});
  const isProvider = isProviderUser(user);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchSportsCategories());
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const hydrateForm = async () => {
      let nextForm;
      try {
        nextForm =
          initialData && mode === 'edit'
            ? mapInitialDataToForm(initialData)
            : mapUserToForm(user);
      } catch {
        nextForm = createInitialForm();
      }

      if (mode !== 'edit') {
        try {
          const response = await GET('/api/users/me/profile');
          console.log('[CreateRecruitmentModal] GET /api/users/me/profile raw response:', response);
          const profile = response?.data?.user || response?.data?.profile || response?.data || response;
          console.log('[CreateRecruitmentModal] Extracted profile object from backend:', profile);

          if (profile && typeof profile === 'object') {
            const backendOrgName =
              profile.organizationName ||
              profile.organisationName ||
              profile.clubName ||
              profile.providerBusinessName ||
              profile.businessName ||
              '';
            const backendContactPerson =
              profile.contactName ||
              profile.fullName ||
              profile.displayName ||
              [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
              profile.firstName ||
              profile.name ||
              '';

            console.log('[CreateRecruitmentModal] Resolved backend org name:', backendOrgName);
            console.log('[CreateRecruitmentModal] Resolved backend contact person:', backendContactPerson);

            nextForm = {
              ...nextForm,
              organisationName: nextForm.organisationName || backendOrgName,
              contactPerson: nextForm.contactPerson || backendContactPerson,
              role: nextForm.role || resolveRoleFromUser(profile),
              about: nextForm.about || profile.bio || profile.aboutOrganization || '',
              logo:
                nextForm.logo ||
                profile.logo ||
                profile.avatar ||
                profile.profileImage ||
                null,
            };
          }
        } catch (err) {
          console.warn('[CreateRecruitmentModal] Failed fetching backend profile:', err);
        }
      }

      if (!cancelled) {
        console.log('[CreateRecruitmentModal] Final hydrated form state set to:', nextForm);
        setForm(nextForm);
        setErrors({});
      }
    };

    hydrateForm();

    return () => {
      cancelled = true;
    };
  }, [isOpen, initialData, mode, user]);

  const dynamicSports = useMemo(() => {
    if (!sportsCategories || sportsCategories.length === 0) {
      return sportOptions;
    }
    const names = sportsCategories.map(cat => cat.name).filter(Boolean);
    const filtered = names.filter(n => n !== 'Other');
    return [...filtered, 'Other'];
  }, [sportsCategories]);

  const logoPreviewUrl = useMemo(() => {
    if (!form.logo) return '';
    if (form.logo instanceof File) return URL.createObjectURL(form.logo);
    return form.logo;
  }, [form.logo]);

  useEffect(() => {
    return () => {
      if (logoPreviewUrl && logoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  const handleLogoFile = (event) => {
    const file = event.target.files?.[0];
    if (file) setForm((s) => ({ ...s, logo: file }));
    event.target.value = '';
  };

  const listingImagePreview = useMemo(() => {
    if (!form.listingImage) return '';
    if (form.listingImage instanceof File) return URL.createObjectURL(form.listingImage);
    return form.listingImage;
  }, [form.listingImage]);

  useEffect(() => {
    return () => {
      if (listingImagePreview && listingImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(listingImagePreview);
      }
    };
  }, [listingImagePreview]);

  const handleListingImageFile = (event) => {
    const file = event.target.files?.[0];
    if (file) setForm((s) => ({ ...s, listingImage: file }));
    event.target.value = '';
  };

  const handleChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleScheduleChange = (scheduleId, field, value) => {
    setForm((prev) => ({
      ...prev,
      sessionSchedules: (prev.sessionSchedules || []).map((row) =>
        row.id === scheduleId ? { ...row, [field]: value } : row
      ),
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.sessionSchedules;
      delete next[`schedule-${scheduleId}-day`];
      delete next[`schedule-${scheduleId}-startTime`];
      delete next[`schedule-${scheduleId}-endTime`];
      delete next[`schedule-${scheduleId}-range`];
      return next;
    });
  };

  const handleAddSchedule = () => {
    setForm((prev) => ({
      ...prev,
      sessionSchedules: [...(prev.sessionSchedules || []), createEmptySchedule()],
    }));
  };

  const handleRemoveSchedule = (scheduleId) => {
    setForm((prev) => {
      const rows = prev.sessionSchedules || [];
      if (rows.length <= 1) {
        return { ...prev, sessionSchedules: [createEmptySchedule()] };
      }
      return {
        ...prev,
        sessionSchedules: rows.filter((row) => row.id !== scheduleId),
      };
    });
  };

  const toggleArrayField = (field, value) => {
    setForm((s) => {
      const arr = s[field] || [];
      const exists = arr.includes(value);
      const newArr = exists ? arr.filter((a) => a !== value) : [...arr, value];
      const extra = {};
      if (field === 'sports' && value === 'Other' && exists) {
        extra.otherSport = '';
      }
      return { ...s, [field]: newArr, ...extra };
    });
  };

  const toggleSuitableFor = (value) => {
    setForm((s) => {
      const arr = s.suitableFor || [];
      const exists = arr.includes(value);

      if (value === ALL_LEVELS_WELCOME) {
        return { ...s, suitableFor: exists ? [] : [ALL_LEVELS_WELCOME] };
      }

      if (exists) {
        return { ...s, suitableFor: arr.filter((a) => a !== value) };
      }

      return {
        ...s,
        suitableFor: [...arr.filter((a) => a !== ALL_LEVELS_WELCOME), value],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sportsList = (form.sports || [])
      .filter((sport) => sport !== 'Other')
      .concat(String(form.otherSport || '').trim() ? [String(form.otherSport || '').trim()] : []);
    const normalizedSports = normalizeArray(sportsList);
    const normalizedSessionTypes = normalizeArray(
      form.sessionType ? [form.sessionType] : form.sessionTypes || []
    );
    const normalizedSuitableFor = normalizeArray(form.suitableFor || []);

    const serviceTitle = isProvider
      ? String(form.listingHeadline || form.organisationName || '').trim()
      : String(form.organisationName || '').trim();
    const serviceDescription = String(form.sessionDescription || form.about || '').trim();
    const orgAbout = String(form.about || '').trim();
    const providerPhone =
      user?.phone ||
      user?.phoneNumber ||
      user?.mobile ||
      user?.contactNumber ||
      user?.providerPhone ||
      '';
    const providerEmail = user?.email || user?.providerEmail || '';
    const schedulePayload = isProvider
      ? {
          schedules: [],
          availableDays: [],
          sessonDay: '',
          timeFrom: '',
          timeTo: '',
          timeSlote: '',
        }
      : buildSchedulePayload(form.sessionSchedules || []);
    const sessionDay = schedulePayload.sessonDay;
    const normalizedAvailableDays = schedulePayload.availableDays;
    const dateValue = String(form.dateDay || '').trim();
    let timeFrom = schedulePayload.timeFrom;
    let timeTo = schedulePayload.timeTo;
    // Provider form has no time fields, but API requires startTime/endTime.
    if (isProvider) {
      if (!timeFrom) timeFrom = '09:00';
      if (!timeTo) timeTo = '17:00';
    }
    const timeSlot = schedulePayload.timeSlote || (timeFrom && timeTo ? `${timeFrom} - ${timeTo}` : '');
    const fullAddress = [form.venueName, form.addressLine1, form.townCity, form.postcode]
      .map((item) => String(item || '').trim())
      .filter(Boolean)
      .join(', ');
    const providerServiceType = String(form.role || '').trim();

    const newErrors = {};
    if (isProvider) {
      if (!String(form.organisationName || '').trim()) newErrors.organisationName = true;
      if (!String(form.contactPerson || '').trim()) newErrors.contactPerson = true;
      if (!String(form.townCity || '').trim()) newErrors.townCity = true;
      if (!String(form.postcode || '').trim()) newErrors.postcode = true;
      if (!providerServiceType) newErrors.role = true;
      if (!String(form.listingHeadline || '').trim()) newErrors.listingHeadline = true;
      if (!serviceDescription) newErrors.sessionDescription = true;
      if (normalizedSessionTypes.length === 0) newErrors.sessionType = true;
    } else {
      if (!serviceTitle) newErrors.organisationName = true;
      if (normalizedSports.length === 0) newErrors.sport = true;
      if (normalizedSessionTypes.length === 0) newErrors.sessionType = true;
      if (normalizedSuitableFor.length === 0) newErrors.suitableFor = true;
      if (!form.womensOnly) newErrors.womensOnly = true;
      if (!String(form.townCity || '').trim()) newErrors.townCity = true;
      if (!String(form.postcode || '').trim()) newErrors.postcode = true;
      if (!String(form.sessionFrequency || '').trim()) newErrors.sessionFrequency = true;
      if (!String(form.costMembershipDetail || '').trim()) newErrors.costMembershipDetail = true;
      if (!serviceDescription) newErrors.sessionDescription = true;

      const scheduleRows = form.sessionSchedules || [];
      const filledRows = scheduleRows.filter(
        (row) =>
          String(row.day || '').trim() ||
          String(row.startTime || '').trim() ||
          String(row.endTime || '').trim()
      );

      if (filledRows.length === 0) {
        newErrors.sessionSchedules = true;
      }

      filledRows.forEach((row) => {
        const day = String(row.day || '').trim();
        const start = String(row.startTime || '').trim();
        const end = String(row.endTime || '').trim();
        if (!day) newErrors[`schedule-${row.id}-day`] = true;
        if (!start) newErrors[`schedule-${row.id}-startTime`] = true;
        if (!end) newErrors[`schedule-${row.id}-endTime`] = true;
        if (day && start && end && !isEndAfterStart(start, end)) {
          newErrors[`schedule-${row.id}-range`] = true;
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const messages = [];
      if (newErrors.organisationName) {
        messages.push(isProvider ? 'Provider / Business Name' : 'Organisation name');
      }
      if (newErrors.contactPerson) messages.push('Contact Name');
      if (newErrors.sport) messages.push('Sport or activity');
      if (newErrors.role) messages.push('Service type');
      if (newErrors.listingHeadline) messages.push('Listing Headline');
      if (newErrors.sessionType) {
        messages.push(isProvider ? 'Delivery type' : 'Session type');
      }
      if (newErrors.suitableFor) messages.push('Suitable for');
      if (newErrors.womensOnly) messages.push('Who can take part');
      if (newErrors.townCity) messages.push(isProvider ? 'Town/City' : 'Town/Area');
      if (newErrors.postcode) messages.push('Postcode');
      if (newErrors.sessionSchedules) messages.push('Day / time');
      if (Object.keys(newErrors).some((key) => key.endsWith('-day'))) messages.push('Day');
      if (Object.keys(newErrors).some((key) => key.endsWith('-startTime'))) messages.push('Start time');
      if (Object.keys(newErrors).some((key) => key.endsWith('-endTime'))) messages.push('End time');
      if (Object.keys(newErrors).some((key) => key.endsWith('-range'))) {
        messages.push('End time must be later than Start time');
      }
      if (newErrors.sessionFrequency) messages.push('How often does it run');
      if (newErrors.costMembershipDetail) messages.push('Cost or membership');
      if (newErrors.sessionDescription) {
        messages.push(isProvider ? 'About your service' : 'Session description');
      }
      toast.error(`Required: ${[...new Set(messages)].join(', ')}`);
      return;
    }
    setErrors({});

    let resultAction;

    if (mode === 'edit' && initialData?.id) {
      const updatePayload = {
        listingHeadline: isProvider
          ? String(form.listingHeadline || '').trim()
          : serviceTitle,
        aboutService: serviceDescription,
        serviceType: 'COACHING',
        providerType: [providerServiceType || form.role || ''],
        sessionTypes: normalizedSessionTypes,
        availableDays: normalizedAvailableDays,
        sessionSchedules: JSON.stringify(schedulePayload.schedules),
        organizationName: String(form.organisationName || '').trim() || serviceTitle,
        role: form.role,
        description: serviceDescription,
        contactName: form.contactPerson || serviceTitle,
        providerPhone,
        providerEmail,
        clinicName: String(form.venueName || '').trim(),
        addressLine1: String(form.addressLine1 || '').trim(),
        city: String(form.townCity || '').trim(),
        postcode: String(form.postcode || '').trim(),
        fullAddress,
        location: String(form.townCity || '').trim() || fullAddress,
        googleMapLink: String(form.googleMapLink || '').trim(),
        sessionType: normalizedSessionTypes,
        suitableFor: normalizedSuitableFor,
        womenOnly: form.womensOnly === 'YES',
        sports: normalizedSports,
        whoServiceFor: normalizedSports.join(', '),
        sessonDay: sessionDay,
        date: dateValue,
        timeFrom,
        timeTo,
        startTime: timeFrom,
        endTime: timeTo,
        timeSlote: timeSlot,
        timeSlots: JSON.stringify(schedulePayload.schedules),
        frequency: String(form.sessionFrequency || '').trim(),
        costMemebershipDetail: String(form.costMembershipDetail || '').trim(),
        aboutOrganization: orgAbout,
        bookingLink: String(form.bookingLink || '').trim(),
        responseType: getResponseType(form.responseMethods, form.responseType),
        professionalRegistration: String(form.professionalRegistration || '').trim(),
        insuranceInPlace: form.insuranceInPlace === 'Yes',
        isOnline: String(form.sessionType || '').toLowerCase() === 'online',
      };

      Object.keys(updatePayload).forEach((key) => {
        const value = updatePayload[key];
        if (
          value === '' ||
          value === undefined ||
          value === null ||
          (Array.isArray(value) && value.length === 0)
        ) {
          delete updatePayload[key];
        }
      });

      if (
        (form.logo && typeof form.logo !== 'string') ||
        form.listingImage instanceof File
      ) {
        const updateFormData = new FormData();

        Object.entries(updatePayload).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            appendArrayField(updateFormData, key, value);
            return;
          }
          appendIfPresent(updateFormData, key, value);
        });

        const listingFile =
          form.listingImage instanceof File
            ? form.listingImage
            : form.logo instanceof File
              ? form.logo
              : null;
        if (listingFile) updateFormData.append('logo', listingFile);
        resultAction = await dispatch(
          updateService({ id: initialData.id, serviceData: updateFormData })
        );
      } else {
        resultAction = await dispatch(
          updateService({ id: initialData.id, serviceData: updatePayload })
        );
      }
    } else {
      const payload = new FormData();
      payload.append('serviceType', 'COACHING');
      appendIfPresent(
        payload,
        'listingHeadline',
        isProvider ? form.listingHeadline : serviceTitle
      );
      appendIfPresent(payload, 'aboutService', serviceDescription);
      appendArrayField(payload, 'providerType', [providerServiceType || form.role || '']);
      appendArrayField(payload, 'sessionTypes', normalizedSessionTypes);
      appendArrayField(payload, 'availableDays', normalizedAvailableDays);
      if (!isProvider && schedulePayload.schedules.length > 0) {
        appendIfPresent(payload, 'sessionSchedules', JSON.stringify(schedulePayload.schedules));
        appendIfPresent(payload, 'timeSlots', JSON.stringify(schedulePayload.schedules));
      }
      payload.append('title', isProvider ? form.listingHeadline || serviceTitle : serviceTitle);
      payload.append('description', serviceDescription);
      payload.append(
        'organizationName',
        String(form.organisationName || '').trim() || serviceTitle
      );
      appendIfPresent(payload, 'role', form.role || '');
      appendIfPresent(payload, 'contactName', form.contactPerson || serviceTitle);
      appendIfPresent(payload, 'providerPhone', providerPhone);
      appendIfPresent(payload, 'providerEmail', providerEmail);
      appendIfPresent(payload, 'clinicName', form.venueName);
      appendIfPresent(payload, 'addressLine1', form.addressLine1);
      appendIfPresent(payload, 'city', form.townCity);
      appendIfPresent(payload, 'postcode', form.postcode);
      appendIfPresent(payload, 'fullAddress', fullAddress);
      appendIfPresent(payload, 'location', form.townCity || fullAddress);
      appendIfPresent(payload, 'googleMapLink', form.googleMapLink);
      appendArrayField(payload, 'sessionType', normalizedSessionTypes);
      appendArrayField(payload, 'suitableFor', normalizedSuitableFor);
      appendIfPresent(payload, 'womenOnly', String(form.womensOnly === 'YES'));
      appendArrayField(payload, 'sports', normalizedSports);
      appendIfPresent(payload, 'whoServiceFor', normalizedSports.join(', '));
      appendIfPresent(payload, 'whoCanTakePart', normalizedSuitableFor.join(', ') || normalizedSports.join(', '));
      appendIfPresent(payload, 'sessonDay', sessionDay);
      appendIfPresent(payload, 'date', dateValue);
      appendIfPresent(payload, 'timeFrom', timeFrom);
      appendIfPresent(payload, 'timeTo', timeTo);
      if (isProvider) {
        payload.append('startTime', timeFrom);
        payload.append('endTime', timeTo);
      } else {
        appendIfPresent(payload, 'startTime', timeFrom);
        appendIfPresent(payload, 'endTime', timeTo);
      }
      appendIfPresent(payload, 'timeSlote', timeSlot);
      appendIfPresent(payload, 'frequency', form.sessionFrequency);
      appendIfPresent(payload, 'costMemebershipDetail', form.costMembershipDetail);
      appendIfPresent(payload, 'aboutOrganization', orgAbout);
      appendIfPresent(payload, 'bookingLink', form.bookingLink);
      appendIfPresent(payload, 'professionalRegistration', form.professionalRegistration);
      appendIfPresent(payload, 'insuranceInPlace', String(form.insuranceInPlace === 'Yes'));
      appendIfPresent(
        payload,
        'isOnline',
        String(String(form.sessionType || '').toLowerCase() === 'online')
      );
      payload.append('responseType', getResponseType(form.responseMethods, form.responseType));

      const listingFile =
        form.listingImage instanceof File
          ? form.listingImage
          : form.logo instanceof File
            ? form.logo
            : null;
      if (listingFile) payload.append('logo', listingFile);

      resultAction = await dispatch(createService(payload));
    }

    const isSuccess =
      (mode === 'edit' && updateService.fulfilled.match(resultAction)) ||
      (mode !== 'edit' && createService.fulfilled.match(resultAction));

    if (isSuccess) {
      onSuccess?.();
      onClose?.();
    }
  };

  const errorClass = 'mt-1 text-sm text-red-200';
  const selectedSport = (form.sports || [])[0] || '';
  const sessionSchedules = form.sessionSchedules?.length
    ? form.sessionSchedules
    : [createEmptySchedule()];

  if (!isOpen) return null;

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
              {isProvider
                ? mode === 'edit'
                  ? 'Edit Service'
                  : 'Add Service'
                : mode === 'edit'
                  ? 'Edit Session'
                  : 'Add Session'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              {isProvider ? (
                'Join our community of professional support services aimed at empowering women in sport and fitness.'
              ) : (
                <>
                  Use this form for regular or recurring sport sessions and activities. For a one-off activity,
                  taster session or special occasion, please add an{' '}
                  {mode === 'create' && typeof onSwitchToEvent === 'function' ? (
                    <button
                      type="button"
                      onClick={() => {
                        onClose?.();
                        onSwitchToEvent();
                      }}
                      className="font-medium text-[#F5F1EB] underline underline-offset-2 hover:text-white"
                    >
                      Event
                    </button>
                  ) : (
                    <span className="font-medium text-[#F5F1EB] underline underline-offset-2">Event</span>
                  )}{' '}
                  instead.
                </>
              )}
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
          <form id="add-listing-form" className="space-y-4" onSubmit={handleSubmit}>
            {isProvider ? (
              <>
                <FormSection>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Provider / Business Name *</label>
                      <input
                        className={fieldClass}
                        value={form.organisationName}
                        onChange={(e) => {
                          handleChange('organisationName', e.target.value);
                          setErrors((prev) => ({ ...prev, organisationName: false }));
                        }}
                        placeholder="e.g. Richmond Women's Physios"
                      />
                      {errors.organisationName && <p className={errorClass}>Required</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Contact Name *</label>
                      <input
                        className={fieldClass}
                        value={form.contactPerson}
                        onChange={(e) => {
                          handleChange('contactPerson', e.target.value);
                          setErrors((prev) => ({ ...prev, contactPerson: false }));
                        }}
                        placeholder="Enter name"
                      />
                      {errors.contactPerson && <p className={errorClass}>Required</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Logo</label>
                      <div
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') orgLogoInputRef.current?.click();
                        }}
                        onClick={() => orgLogoInputRef.current?.click()}
                        className="relative flex h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-white/35 bg-white/10"
                      >
                        {logoPreviewUrl ? (
                          <>
                            <img
                              src={logoPreviewUrl}
                              alt="Logo"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                            <span className="relative z-10 rounded bg-black/50 px-2 py-1 text-xs text-white">
                              Click to change
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="mb-2 h-8 w-8 text-white/80" />
                            <span className="text-sm font-medium text-[#F5F1EB]">Upload Image</span>
                            <span className="mt-1 text-xs text-white/65">
                              JPEG or PNG accepted. Max 10MB
                            </span>
                          </>
                        )}
                        <input
                          ref={orgLogoInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          className="hidden"
                          aria-label="Upload logo"
                          onChange={handleLogoFile}
                        />
                      </div>
                    </div>
                  </div>
                </FormSection>

                <FormSection title="Location Details">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>Clinic / venue name</label>
                        <input
                          className={fieldClass}
                          value={form.venueName}
                          onChange={(e) => handleChange('venueName', e.target.value)}
                          placeholder="e.g. The Wellness Centre"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Address Line</label>
                        <input
                          className={fieldClass}
                          value={form.addressLine1}
                          onChange={(e) => handleChange('addressLine1', e.target.value)}
                          placeholder="e.g. 123 High Street"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>Town/City *</label>
                        <input
                          className={fieldClass}
                          value={form.townCity}
                          onChange={(e) => {
                            handleChange('townCity', e.target.value);
                            setErrors((prev) => ({ ...prev, townCity: false }));
                          }}
                          placeholder="e.g. Richmond"
                        />
                        {errors.townCity && <p className={errorClass}>Required</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Postcode *</label>
                        <input
                          className={fieldClass}
                          value={form.postcode}
                          onChange={(e) => {
                            handleChange('postcode', e.target.value);
                            setErrors((prev) => ({ ...prev, postcode: false }));
                          }}
                          placeholder="e.g. TW9 1AB"
                        />
                        {errors.postcode && <p className={errorClass}>Required</p>}
                      </div>
                    </div>
                  </div>
                </FormSection>

                <FormSection>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Service type *</label>
                      <select
                        className={fieldClass}
                        value={form.role}
                        onChange={(e) => {
                          handleChange('role', e.target.value);
                          setErrors((prev) => ({ ...prev, role: false }));
                        }}
                      >
                        <option value="">Select service type</option>
                        {PROVIDER_SERVICE_TYPE_OPTIONS.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.role && <p className={errorClass}>Required</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Listing Headline *</label>
                      <input
                        className={fieldClass}
                        value={form.listingHeadline}
                        onChange={(e) => {
                          handleChange('listingHeadline', e.target.value);
                          setErrors((prev) => ({ ...prev, listingHeadline: false }));
                        }}
                        placeholder="e.g. The Wellness Centre"
                      />
                      {errors.listingHeadline && <p className={errorClass}>Required</p>}
                    </div>
                    <div>
                      <label className={labelClass}>About your service *</label>
                      <textarea
                        rows={4}
                        className={`${fieldClass} min-h-28 resize-none`}
                        value={form.sessionDescription}
                        onChange={(e) => {
                          handleChange('sessionDescription', e.target.value);
                          setErrors((prev) => ({ ...prev, sessionDescription: false }));
                        }}
                        placeholder="Provide a short description of the service, including what clients can expect."
                      />
                      {errors.sessionDescription && <p className={errorClass}>Required</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Delivery type *</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {DELIVERY_TYPE_OPTIONS.map((option) => {
                          const selected = form.sessionType === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setForm((s) => ({
                                  ...s,
                                  sessionType: option,
                                  sessionTypes: [option],
                                }));
                                setErrors((prev) => ({ ...prev, sessionType: false }));
                              }}
                              className={`rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
                                selected
                                  ? 'bg-[#F5F1EB] text-[#0f756d]'
                                  : 'border border-white/30 bg-transparent text-white hover:border-white/50'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                      {errors.sessionType && <p className={errorClass}>Required</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Sports supported</label>
                      <p className="mb-2 text-xs text-white/75">
                        Optional - leave blank if your service is not sport-specific.
                      </p>
                      <select
                        className={fieldClass}
                        value={selectedSport}
                        onChange={(e) => {
                          const v = e.target.value;
                          handleChange('sports', v ? [v] : []);
                          if (v !== 'Other') handleChange('otherSport', '');
                        }}
                      >
                        <option value="">Select sport</option>
                        {dynamicSports.map((sport) => (
                          <option key={sport} value={sport}>
                            {sport}
                          </option>
                        ))}
                      </select>
                      {selectedSport === 'Other' && (
                        <input
                          type="text"
                          placeholder="Please specify"
                          value={form.otherSport || ''}
                          onChange={(e) => handleChange('otherSport', e.target.value)}
                          className={`${fieldClass} mt-2`}
                        />
                      )}
                    </div>
                  </div>
                </FormSection>

                <FormSection title="Professional Credentials">
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>
                        Professional registration / qualifications
                      </label>
                      <input
                        className={fieldClass}
                        value={form.professionalRegistration}
                        onChange={(e) => handleChange('professionalRegistration', e.target.value)}
                        placeholder="e.g. HCPC Registered, CSP Member"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Insurance in place?</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {['Yes', 'No'].map((option) => {
                          const selected = form.insuranceInPlace === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleChange('insuranceInPlace', option)}
                              className={`rounded-md px-5 py-2.5 text-sm font-semibold transition-colors ${
                                selected
                                  ? 'bg-[#F5F1EB] text-[#0f756d]'
                                  : 'border border-white/30 bg-transparent text-white hover:border-white/50'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Website link</label>
                      <input
                        className={fieldClass}
                        type="url"
                        value={form.bookingLink}
                        onChange={(e) => handleChange('bookingLink', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </FormSection>

                <FormSection>
                  <p className="mb-1 text-base font-bold text-white">
                    Choose the main action for this listing
                  </p>
                  <p className="mb-3 text-sm text-white/80">
                    Select the button that best matches what you want people to do next. They will still be able to contact you with a question separately.
                  </p>
                  <div className="space-y-2">
                    {PROVIDER_RESPONSE_ACTION_OPTIONS.map((option) => {
                      const isSelected = form.responseType === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              responseType: option.value,
                              responseMethods:
                                option.value === 'INTERESTED'
                                  ? ['Allow users to register interest']
                                  : ['Add booking link'],
                            }));
                          }}
                          className={`w-full rounded-xl border p-4 text-left transition-colors ${
                            isSelected
                              ? 'border-transparent bg-[#F5F1EB]'
                              : 'border-white/30 bg-transparent hover:border-white/50'
                          }`}
                        >
                          <p
                            className={`text-sm font-semibold ${
                              isSelected ? 'text-[#1A1D1D]' : 'text-white'
                            }`}
                          >
                            {option.label}
                          </p>
                          <p
                            className={`mt-1 text-sm ${
                              isSelected ? 'text-[#1A1D1D]/70' : 'text-white/75'
                            }`}
                          >
                            {option.desc}
                          </p>
                          {option.note ? (
                            <p
                              className={`mt-2 text-xs leading-relaxed ${
                                isSelected ? 'text-[#1A1D1D]/60' : 'text-white/65'
                              }`}
                            >
                              Note: {option.note}
                            </p>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </FormSection>
              </>
            ) : (
              <>
            <FormSection
              title="Organisation Details"
              hint="These details are pre-populated from your account."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Organisation / Club Name <span className="text-red-200">*</span>
                  </label>
                  <input
                    className={`${fieldClass} ${errors.organisationName ? 'border-red-400' : ''}`}
                    value={form.organisationName}
                    onChange={(e) => {
                      handleChange('organisationName', e.target.value);
                      setErrors((prev) => ({ ...prev, organisationName: false }));
                    }}
                    placeholder="Example Netball Club"
                  />
                </div>
                <div>
                  <label className={labelClass}>Contact Person Name</label>
                  <input
                    className={fieldClass}
                    value={form.contactPerson}
                    onChange={(e) => handleChange('contactPerson', e.target.value)}
                    placeholder="Contact name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Your Role</label>
                  <input
                    className={fieldClass}
                    value={form.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    placeholder="Coach"
                  />
                </div>
                <div>
                  <label className={labelClass}>Organisation Image / Logo</label>
                  <div className="mt-1 flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/35 bg-white/10">
                      {logoPreviewUrl ? (
                        <img src={logoPreviewUrl} alt="Organisation" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-white/60">Logo</div>
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
                      onChange={handleLogoFile}
                    />
                  </div>
                </div>
              </div>
            </FormSection>

            <FormSection title="Sport & Session Information">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Sport or activity *</label>
                    <select
                      className={fieldClass}
                      value={selectedSport}
                      onChange={(e) => {
                        const v = e.target.value;
                        handleChange('sports', v ? [v] : []);
                        if (v !== 'Other') handleChange('otherSport', '');
                        setErrors((prev) => ({ ...prev, sport: false }));
                      }}
                    >
                      <option value="">Select sport or activity</option>
                      {dynamicSports.map((sport) => (
                        <option key={sport} value={sport}>{sport}</option>
                      ))}
                    </select>
                    {errors.sport && <p className={errorClass}>Please select a sport or activity</p>}
                    {selectedSport === 'Other' && (
                      <input
                        type="text"
                        placeholder="Please specify"
                        value={form.otherSport || ''}
                        onChange={(e) => handleChange('otherSport', e.target.value)}
                        className={`${fieldClass} mt-2`}
                      />
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Session type *</label>
                    <select
                      className={fieldClass}
                      value={form.sessionType}
                      onChange={(e) => {
                        const v = e.target.value;
                        setForm((s) => ({ ...s, sessionType: v, sessionTypes: v ? [v] : [] }));
                        setErrors((prev) => ({ ...prev, sessionType: false }));
                      }}
                    >
                      <option value="">Select session type</option>
                      {sessionTypeOptions.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.sessionType && <p className={errorClass}>Required</p>}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Suitable for</label>
                  <p className="mb-2 text-xs text-white/75">Select all that apply.</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {suitabilityOptions.map((opt) => {
                      const allLevelsSelected = (form.suitableFor || []).includes(ALL_LEVELS_WELCOME);
                      const isDisabled = allLevelsSelected && opt !== ALL_LEVELS_WELCOME;
                      return (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 text-sm text-white/90 ${
                            isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={(form.suitableFor || []).includes(opt)}
                            disabled={isDisabled}
                            onChange={() => {
                              toggleSuitableFor(opt);
                              setErrors((prev) => ({ ...prev, suitableFor: false }));
                            }}
                            className="accent-[#0f756d]"
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                  {errors.suitableFor && <p className={errorClass}>Select at least one option</p>}
                </div>
                <div>
                  <label className={labelClass}>Who can take part? *</label>
                  <div className="flex flex-wrap items-center gap-6">
                    {[
                      { label: 'Women only', value: 'YES' },
                      { label: 'Mixed, women welcome', value: 'NO' },
                    ].map((item) => (
                      <label key={item.value} className="flex cursor-pointer items-center gap-2 text-sm text-white/90">
                        <input
                          type="radio"
                          name="womensOnly"
                          checked={form.womensOnly === item.value}
                          onChange={() => {
                            handleChange('womensOnly', item.value);
                            setErrors((prev) => ({ ...prev, womensOnly: false }));
                          }}
                          className="accent-[#0f756d]"
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                  {errors.womensOnly && <p className={errorClass}>Please choose an option</p>}
                </div>
              </div>
            </FormSection>



            <FormSection title="Session Description *" hint="Tell people more about your session.">
              <textarea
                rows={5}
                className={`${fieldClass} min-h-28 resize-none`}
                value={form.sessionDescription}
                onChange={(e) => {
                  handleChange('sessionDescription', e.target.value);
                  setErrors((prev) => ({ ...prev, sessionDescription: false }));
                }}
                placeholder="Include what to expect, who it’s for, what to bring and how the session works."
              />
              {errors.sessionDescription && <p className={errorClass}>Required</p>}
            </FormSection>

            <FormSection title="Location & Timing">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Venue name</label>
                    <input
                      className={fieldClass}
                      value={form.venueName}
                      onChange={(e) => handleChange('venueName', e.target.value)}
                      placeholder="Enter venue name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Address line 1</label>
                    <input
                      className={fieldClass}
                      value={form.addressLine1}
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
                      value={form.townCity}
                      onChange={(e) => {
                        handleChange('townCity', e.target.value);
                        setErrors((prev) => ({ ...prev, townCity: false }));
                      }}
                      placeholder="Enter town or area"
                    />
                    {errors.townCity && <p className={errorClass}>Required</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Postcode *</label>
                    <input
                      className={fieldClass}
                      value={form.postcode}
                      onChange={(e) => {
                        handleChange('postcode', e.target.value);
                        setErrors((prev) => ({ ...prev, postcode: false }));
                      }}
                      placeholder="Enter postcode"
                    />
                    {errors.postcode && <p className={errorClass}>Required</p>}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">Day & time *</p>
                    {errors.sessionSchedules ? (
                      <p className="text-sm text-red-200">Add at least one day and time</p>
                    ) : null}
                  </div>

                  {sessionSchedules.map((row, index) => (
                    <div
                      key={row.id}
                      className="rounded-lg border border-white/15 bg-white/5 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                          {index === 0 ? 'Session time' : `Session time ${index + 1}`}
                        </p>
                        {sessionSchedules.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => handleRemoveSchedule(row.id)}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-white/90 hover:bg-white/10"
                            aria-label="Remove day/time"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                          <label className={labelClass}>Day *</label>
                          <select
                            className={fieldClass}
                            value={row.day}
                            onChange={(e) => handleScheduleChange(row.id, 'day', e.target.value)}
                          >
                            <option value="">Select day</option>
                            {DAY_OPTIONS.map((day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>
                          {errors[`schedule-${row.id}-day`] ? (
                            <p className={errorClass}>Required</p>
                          ) : null}
                        </div>
                        <div>
                          <label className={labelClass}>Start time *</label>
                          <input
                            type="time"
                            className={fieldClass}
                            value={row.startTime}
                            onChange={(e) =>
                              handleScheduleChange(row.id, 'startTime', e.target.value)
                            }
                          />
                          {errors[`schedule-${row.id}-startTime`] ? (
                            <p className={errorClass}>Required</p>
                          ) : null}
                        </div>
                        <div>
                          <label className={labelClass}>End time *</label>
                          <input
                            type="time"
                            className={fieldClass}
                            value={row.endTime}
                            onChange={(e) =>
                              handleScheduleChange(row.id, 'endTime', e.target.value)
                            }
                          />
                          {errors[`schedule-${row.id}-endTime`] ? (
                            <p className={errorClass}>Required</p>
                          ) : null}
                          {errors[`schedule-${row.id}-range`] ? (
                            <p className={errorClass}>End time must be later than Start time</p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddSchedule}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/40 bg-white/5 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Add another day/time
                  </button>
                </div>
                <div>
                  <label className={labelClass}>How often does it run? *</label>
                  <select
                    className={fieldClass}
                    value={form.sessionFrequency}
                    onChange={(e) => {
                      handleChange('sessionFrequency', e.target.value);
                      setErrors((prev) => ({ ...prev, sessionFrequency: false }));
                    }}
                  >
                    <option value="">Select frequency</option>
                    {SESSION_FREQUENCY_OPTIONS.map((freq) => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                  {errors.sessionFrequency && <p className={errorClass}>Required</p>}
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Cost or Membership Details *"
              hint="Explain any fees, subscriptions, membership options or match costs."
            >
              <textarea
                rows={4}
                className={`${fieldClass} min-h-24 resize-none`}
                value={form.costMembershipDetail}
                onChange={(e) => {
                  handleChange('costMembershipDetail', e.target.value);
                  setErrors((prev) => ({ ...prev, costMembershipDetail: false }));
                }}
                placeholder="For example: £5 pay-as-you-go, £120 annual membership, first session free, or contact the club for details."
              />
              {errors.costMembershipDetail && <p className={errorClass}>Required</p>}
            </FormSection>

            <FormSection>
              <p className="mb-1 text-base font-bold text-white">
                Choose the main action for this listing
              </p>
              <p className="mb-3 text-sm text-white/80">
                Select the button that best matches what you want people to do next. They will still be able to contact you with a question separately.
              </p>
              <div className="space-y-2">
                {RESPONSE_ACTION_OPTIONS.map((option) => {
                  const isSelected = form.responseType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          responseType: option.value,
                          responseMethods:
                            option.value === 'INTERESTED'
                              ? ['Allow users to register interest']
                              : ['Add booking link'],
                        }));
                      }}
                      className={`w-full rounded-xl border p-4 text-left transition-colors ${
                        isSelected
                          ? 'border-transparent bg-[#F5F1EB]'
                          : 'border-white/30 bg-transparent hover:border-white/50'
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          isSelected ? 'text-[#1A1D1D]' : 'text-white'
                        }`}
                      >
                        {option.label}
                      </p>
                      <p
                        className={`mt-1 text-sm ${
                          isSelected ? 'text-[#1A1D1D]/70' : 'text-white/75'
                        }`}
                      >
                        {option.desc}
                      </p>
                      {option.note ? (
                        <p
                          className={`mt-2 text-xs leading-relaxed ${
                            isSelected ? 'text-[#1A1D1D]/60' : 'text-white/65'
                          }`}
                        >
                          Note: {option.note}
                        </p>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </FormSection>

            <FormSection>
              <label className={labelClass}>Website link</label>
              <input
                className={fieldClass}
                type="url"
                value={form.bookingLink}
                onChange={(e) => handleChange('bookingLink', e.target.value)}
                placeholder="https://example.com"
              />
            </FormSection>

            <FormSection>
              <label className={labelClass}>Upload an image for this session (optional)</label>
              <p className="mb-2 text-sm text-white/80">This image will appear with your session listing. If left blank, a default image will be shown</p>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') listingImageInputRef.current?.click();
                }}
                onClick={() => listingImageInputRef.current?.click()}
                className="relative flex h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-white/35 bg-white/10"
              >
                {listingImagePreview ? (
                  <>
                    <img src={listingImagePreview} alt="Session" className="absolute inset-0 h-full w-full object-cover" />
                    <span className="relative z-10 rounded bg-black/50 px-2 py-1 text-xs text-white">Click to change</span>
                  </>
                ) : (
                  <>
                    <Upload className="mb-2 h-8 w-8 text-white/80" />
                    <span className="text-sm font-medium text-[#F5F1EB]">Click to upload an image</span>
                    <span className="mt-1 text-xs text-white/65">JPEG or PNG accepted. Max 10MB</span>
                  </>
                )}
                <input
                  ref={listingImageInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  aria-label="Upload session image"
                  className="hidden"
                  onChange={handleListingImageFile}
                />
              </div>
            </FormSection>
              </>
            )}
          </form>
        </div>

        <div className="border-t border-white/15 px-5 py-4">
          <button
            type="submit"
            form="add-listing-form"
            disabled={createLoading}
            className="w-full rounded-lg bg-[#F5F1EB] py-3 text-sm font-semibold text-[#0f756d] hover:bg-[#ebe5dc] disabled:opacity-60"
          >
            {createLoading
              ? 'Submitting...'
              : mode === 'edit'
                ? isProvider
                  ? 'Update service'
                  : 'Update session'
                : 'Submit for approval'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateRecruitmentModal;
