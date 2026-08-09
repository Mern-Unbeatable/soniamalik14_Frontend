import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { createService, updateService } from '../../features/service/serviceApi';
import { selectCreateLoading } from '../../features/service/serviceSlice';
import { selectAuthUser } from '../../features/auth/authSlice';
import { fetchSportsCategories } from '../../features/sportsCategories/sportsCategoriesAPI';
import { selectSportsCategories } from '../../features/sportsCategories/sportsCategoriesSlice';
import { GET } from '../../services/httpMethods';

const sessionTypeOptions = ['In clinic', 'Online', 'At venue'];

const SESSION_FREQUENCY_OPTIONS = ['Weekly', 'Fortnightly', 'Monthly', 'Other'];

const DAY_OPTIONS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
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

const suitabilityOptions = [
  'New to sport',
  'Some experience',
  'Experienced players',
  'Competitive players',
  'All levels welcome',
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
  postcode: '',
  townCity: '',
  googleMapLink: '',
  sessonDay: '',
  sessionFrequency: '',
  sessionDescription: '',
  costMembershipDetail: '',
  listingImage: null,
  dateDay: '',
  timeFrom: '',
  timeTo: '',
  bookingLink: '',
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

const logFormDataDebug = (label, formData) => {
  try {
    const payloadDebug = {};
    const payloadFields = [];

    for (const [key, value] of formData.entries()) {
      const normalizedValue = value instanceof File ? `[File: ${value.name}]` : value;

      if (payloadDebug[key] !== undefined) {
        payloadDebug[key] = Array.isArray(payloadDebug[key])
          ? [...payloadDebug[key], normalizedValue]
          : [payloadDebug[key], normalizedValue];
      } else {
        payloadDebug[key] = normalizedValue;
      }

      payloadFields.push(key);
    }

    console.groupCollapsed(label);
    console.groupEnd();
  } catch (error) {
    console.error('[CreateRecruitmentModal] Failed to log FormData payload', error);
  }
};

const getResponseType = (methods = []) => {
  if (methods.includes('Add booking link')) return 'REGISTER';
  if (methods.includes('Allow users to register interest')) return 'INTERESTED';
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
  const organisationName =
    user?.organizationName ||
    user?.organisationName ||
    user?.clubName ||
    user?.organization ||
    user?.providerBusinessName ||
    user?.name ||
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

  return {
    ...createInitialForm(),
    organisationName,
    contactPerson,
    role,
    about,
    logo,
    postcode: user?.postcode || user?.postCode || user?.postalCode || user?.zip || '',
  };
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
  const timeRange = toTimeRangeInputValue(initialData?.timeSlote || initialData?.timeSlots);

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
    sessionFrequency: initialData?.sessionFrequency || '',
    costMembershipDetail: initialData?.costMemebershipDetail || '',
    suitableFor: toArray(initialData?.suitableFor),
    womensOnly:
      typeof womenOnlyValue === 'boolean'
        ? womenOnlyValue
          ? 'YES'
          : 'NO'
        : String(womenOnlyValue || '').toUpperCase(),
    venueName: initialData?.clinicName || '',
    postcode: initialData?.postcode || '',
    townCity: initialData?.city || '',
    googleMapLink: initialData?.googleMapLink || initialData?.googleMapLinks || '',
    sessonDay:
      initialData?.sessonDay ||
      (Array.isArray(initialData?.availableDays)
        ? initialData.availableDays.join(', ')
        : initialData?.availableDays) ||
      '',
    dateDay: toDateInputValue(initialData?.date || initialData?.dateDay),
    timeFrom: timeRange.timeFrom,
    timeTo: timeRange.timeTo,
    bookingLink: initialData?.bookingLink || '',
    responseMethods: initialData?.responseType === 'INTERESTED'
      ? ['Allow users to register interest']
      : ['Add booking link'],
  };
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
      } catch (error) {
        console.error('[CreateRecruitmentModal] Failed to map form', error);
        nextForm = createInitialForm();
      }

      if (mode !== 'edit') {
        try {
          const response = await GET('/api/users/me/profile');
          const profile = response?.data?.user || response?.data || response;
          if (profile && typeof profile === 'object') {
            nextForm = {
              ...nextForm,
              organisationName:
                nextForm.organisationName ||
                profile.organizationName ||
                profile.organisationName ||
                profile.clubName ||
                '',
              contactPerson:
                nextForm.contactPerson ||
                profile.contactName ||
                [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
                profile.name ||
                '',
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
        } catch {
          // Profile fetch is optional; Redux user data is enough.
        }
      }

      if (!cancelled) {
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

    const serviceTitle = String(form.organisationName || '').trim();
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
    const sessionDay = String(form.sessonDay || '').trim();
    const normalizedAvailableDays = normalizeArray(toArray(form.sessonDay));
    const dateValue = String(form.dateDay || '').trim();
    const timeFrom = String(form.timeFrom || '').trim();
    const timeTo = String(form.timeTo || '').trim();
    const timeSlot = timeFrom && timeTo ? `${timeFrom} - ${timeTo}` : '';
    const fullAddress = [form.venueName, form.townCity, form.postcode]
      .map((item) => String(item || '').trim())
      .filter(Boolean)
      .join(', ');

    const newErrors = {};
    if (!serviceTitle) newErrors.organisationName = true;
    if (normalizedSports.length === 0) newErrors.sport = true;
    if (normalizedSessionTypes.length === 0) newErrors.sessionType = true;
    if (normalizedSuitableFor.length === 0) newErrors.suitableFor = true;
    if (!form.womensOnly) newErrors.womensOnly = true;
    if (!String(form.venueName || '').trim()) newErrors.venueName = true;
    if (!String(form.postcode || '').trim()) newErrors.postcode = true;
    if (!sessionDay) newErrors.sessonDay = true;
    if (!timeFrom) newErrors.timeFrom = true;
    if (!timeTo) newErrors.timeTo = true;
    if (!String(form.sessionFrequency || '').trim()) newErrors.sessionFrequency = true;
    if (!String(form.costMembershipDetail || '').trim()) newErrors.costMembershipDetail = true;
    if (!serviceDescription) newErrors.sessionDescription = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const messages = [];
      if (newErrors.organisationName) messages.push('Organisation name');
      if (newErrors.sport) messages.push('Sport or activity');
      if (newErrors.sessionType) messages.push('Session type');
      if (newErrors.suitableFor) messages.push('Suitable for');
      if (newErrors.womensOnly) messages.push('Who can take part');
      if (newErrors.venueName) messages.push('Venue name');
      if (newErrors.postcode) messages.push('Postcode');
      if (newErrors.sessonDay) messages.push('Session day');
      if (newErrors.timeFrom) messages.push('Start time');
      if (newErrors.timeTo) messages.push('End time');
      if (newErrors.sessionFrequency) messages.push('Frequency');
      if (newErrors.costMembershipDetail) messages.push('Cost or membership');
      if (newErrors.sessionDescription) messages.push('Session description');
      toast.error(`Required: ${messages.join(', ')}`);
      return;
    }
    setErrors({});

    let resultAction;

    if (mode === 'edit' && initialData?.id) {
      const updatePayload = {
        listingHeadline: serviceTitle,
        aboutService: serviceDescription,
        serviceType: 'COACHING',
        providerType: [form.role || ''],
        sessionTypes: normalizedSessionTypes,
        availableDays: normalizedAvailableDays,
        organizationName: serviceTitle,
        role: form.role ,
        description: serviceDescription,
        contactName: form.contactPerson || serviceTitle,
        providerPhone,
        providerEmail,
        clinicName: String(form.venueName || '').trim(),
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
        timeSlote: timeSlot,
        sessionFrequency: String(form.sessionFrequency || '').trim(),
        costMemebershipDetail: String(form.costMembershipDetail || '').trim(),
        aboutOrganization: orgAbout,
        bookingLink: String(form.bookingLink || '').trim(),
        responseType: getResponseType(form.responseMethods),
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
        logFormDataDebug(
          '[CreateRecruitmentModal] Service update payload (multipart)',
          updateFormData
        );
        resultAction = await dispatch(
          updateService({ id: initialData.id, serviceData: updateFormData })
        );
      } else {
        console.log('[CreateRecruitmentModal] Service update payload (json):', updatePayload);
        resultAction = await dispatch(
          updateService({ id: initialData.id, serviceData: updatePayload })
        );
      }
    } else {
      const payload = new FormData();
      payload.append('serviceType', 'COACHING');
      appendIfPresent(payload, 'listingHeadline', serviceTitle);
      appendIfPresent(payload, 'aboutService', serviceDescription);
      appendArrayField(payload, 'providerType', [form.role || '']);
      appendArrayField(payload, 'sessionTypes', normalizedSessionTypes);
      appendArrayField(payload, 'availableDays', normalizedAvailableDays);
      payload.append('title', serviceTitle);
      payload.append('description', serviceDescription);
      payload.append('organizationName', serviceTitle);
      appendIfPresent(payload, 'role', form.role || '');
      appendIfPresent(payload, 'contactName', form.contactPerson || serviceTitle);
      appendIfPresent(payload, 'providerPhone', providerPhone);
      appendIfPresent(payload, 'providerEmail', providerEmail);
      appendIfPresent(payload, 'clinicName', form.venueName);
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
      appendIfPresent(payload, 'startTime', timeFrom);
      appendIfPresent(payload, 'endTime', timeTo);
      appendIfPresent(payload, 'timeSlote', timeSlot);
      appendIfPresent(payload, 'sessionFrequency', form.sessionFrequency);
      appendIfPresent(payload, 'costMemebershipDetail', form.costMembershipDetail);
      appendIfPresent(payload, 'aboutOrganization', orgAbout);
      appendIfPresent(payload, 'bookingLink', form.bookingLink);
      payload.append('responseType', getResponseType(form.responseMethods));

      const listingFile =
        form.listingImage instanceof File
          ? form.listingImage
          : form.logo instanceof File
            ? form.logo
            : null;
      if (listingFile) payload.append('logo', listingFile);

      logFormDataDebug('[CreateRecruitmentModal] Service payload', payload);
      resultAction = await dispatch(createService(payload));
    }

    const isSuccess =
      (mode === 'edit' && updateService.fulfilled.match(resultAction)) ||
      (mode !== 'edit' && createService.fulfilled.match(resultAction));

    if (isSuccess) {
      onSuccess?.();
      onClose?.();
      return;
    }

    console.group('[CreateRecruitmentModal] Service submit failed');
    console.error('mode:', mode);
    console.error('rejectedPayload:', resultAction?.payload);
    console.error('error:', resultAction?.error);
    console.error('meta:', resultAction?.meta);
    console.groupEnd();
  };

  const errorClass = 'mt-1 text-sm text-red-200';
  const selectedSport = (form.sports || [])[0] || '';
  const sessionDayValue = DAY_OPTIONS.includes(form.sessonDay)
    ? form.sessonDay
    : String(form.sessonDay || '').split(',')[0]?.trim() || form.sessonDay;

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
              {mode === 'edit' ? 'Edit Session' : 'Add Session'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
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
                    {errors.sessionType && <p className={errorClass}>Please select a session type</p>}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Suitable for</label>
                  <p className="mb-2 text-xs text-white/75">Select all that apply.</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {suitabilityOptions.map((opt) => (
                      <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-white/90">
                        <input
                          type="checkbox"
                          checked={(form.suitableFor || []).includes(opt)}
                          onChange={() => {
                            toggleArrayField('suitableFor', opt);
                            setErrors((prev) => ({ ...prev, suitableFor: false }));
                          }}
                          className="accent-[#0f756d]"
                        />
                        {opt}
                      </label>
                    ))}
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

            <FormSection title="Location & Timing">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className={labelClass}>Town/Area *</label>
                    <input
                      className={fieldClass}
                      value={form.venueName}
                      onChange={(e) => {
                        handleChange('venueName', e.target.value);
                        setErrors((prev) => ({ ...prev, venueName: false }));
                      }}
                      placeholder="Enter venue name"
                    />
                    {errors.venueName && <p className={errorClass}>Required</p>}
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
                  <div>
                    <label className={labelClass}>Google Maps Link</label>
                    <input
                      className={fieldClass}
                      value={form.googleMapLink}
                      onChange={(e) => handleChange('googleMapLink', e.target.value)}
                      placeholder="Paste Google Maps link"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className={labelClass}> Day *</label>
                    <select
                      className={fieldClass}
                      value={sessionDayValue}
                      onChange={(e) => {
                        handleChange('sessonDay', e.target.value);
                        setErrors((prev) => ({ ...prev, sessonDay: false }));
                      }}
                    >
                      <option value="">Select day</option>
                      {DAY_OPTIONS.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    {errors.sessonDay && <p className={errorClass}>Required</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Start time *</label>
                    <input
                      type="time"
                      className={fieldClass}
                      value={form.timeFrom}
                      onChange={(e) => {
                        handleChange('timeFrom', e.target.value);
                        setErrors((prev) => ({ ...prev, timeFrom: false }));
                      }}
                    />
                    {errors.timeFrom && <p className={errorClass}>Required</p>}
                  </div>
                  <div>
                    <label className={labelClass}>End time *</label>
                    <input
                      type="time"
                      className={fieldClass}
                      value={form.timeTo}
                      onChange={(e) => {
                        handleChange('timeTo', e.target.value);
                        setErrors((prev) => ({ ...prev, timeTo: false }));
                      }}
                    />
                    {errors.timeTo && <p className={errorClass}>Required</p>}
                  </div>
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
          </form>
        </div>

        <div className="border-t border-white/15 px-5 py-4">
          <button
            type="submit"
            form="add-listing-form"
            disabled={createLoading}
            className="w-full rounded-lg bg-[#F5F1EB] py-3 text-sm font-semibold text-[#0f756d] hover:bg-[#ebe5dc] disabled:opacity-60"
          >
            {createLoading ? 'Submitting...' : mode === 'edit' ? 'Update session' : 'Submit for approval'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateRecruitmentModal;
