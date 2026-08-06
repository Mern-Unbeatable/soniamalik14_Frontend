import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { createService, updateService } from '../../features/service/serviceApi';
import { selectCreateLoading } from '../../features/service/serviceSlice';
import { selectAuthUser } from '../../features/auth/authSlice';
import { fetchSportsCategories } from '../../features/sportsCategories/sportsCategoriesAPI';
import { selectSportsCategories } from '../../features/sportsCategories/sportsCategoriesSlice';

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

const sessionTypeOptions = [
  'Recreational',
  'Social',
  'Training',
  'Coaching',
  'League',
  'Competitive',
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
  sessionTypes: [],
  suitableFor: [],
  womensOnly: '',
  otherSport: '',
  venueName: '',
  postcode: '',
  townCity: '',
  googleMapLink: '',
  sessonDay: '',
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

const mapUserToForm = (user) => {
  const organisationName =
    user?.organizationName ||
    user?.clubName ||
    user?.organization ||
    user?.name ||
    '';
  const contactPerson =
    user?.firstName ||
    user?.fullName ||
    user?.displayName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.name ||
    '';
  const about = user?.bio || user?.aboutOrganization || user?.about || '';
  const logo = user?.avatar || user?.profileImage || user?.photo || null;
  const role =
    user?.providerRole ||
    user?.jobTitle ||
    (Array.isArray(user?.providerType) ? user.providerType[0] : user?.providerType) ||
    '';

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
      (Array.isArray(initialData?.providerType)
        ? initialData.providerType[0]
        : initialData?.providerType) ||
      initialData?.category ||
      '',
    about: initialData?.description || initialData?.aboutService || '',
    logo: initialData?.logo || initialData?.image || null,
    sports: customSports.length
      ? [...new Set([...knownSports, 'Other'])]
      : [...new Set(knownSports)],
    otherSport: customSports.join(', '),
    sessionTypes: toArray(initialData?.sessionType || initialData?.sessionTypes),
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

  const dynamicSports = useMemo(() => {
    if (!sportsCategories || sportsCategories.length === 0) {
      return sportOptions;
    }
    const names = sportsCategories.map(cat => cat.name).filter(Boolean);
    const filtered = names.filter(n => n !== 'Other');
    return [...filtered, 'Other'];
  }, [sportsCategories]);

  const user = useSelector(selectAuthUser);
  const createLoading = useSelector(selectCreateLoading);
  const [form, setForm] = useState(createInitialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    const nextForm =
      initialData && mode === 'edit'
        ? mapInitialDataToForm(initialData)
        : mapUserToForm(user);

    queueMicrotask(() => {
      setForm(nextForm);
      setErrors({});
    });
  }, [isOpen, initialData, mode, user]);

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
    if (file) {
      setForm((s) => ({ ...s, logo: file }));
    }
    event.target.value = '';
  };

  if (!isOpen) return null;

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
    const normalizedSessionTypes = normalizeArray(form.sessionTypes || []);
    const normalizedSuitableFor = normalizeArray(form.suitableFor || []);

    const serviceTitle = String(form.organisationName || '').trim();
    const serviceDescription = String(form.about || '').trim();
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
    if (!serviceDescription) newErrors.about = true;
    if (normalizedSuitableFor.length === 0 && normalizedSports.length === 0) newErrors.suitableFor = true;
    if (!sessionDay) newErrors.sessonDay = true;
    if (!timeFrom) newErrors.timeFrom = true;
    if (!timeTo) newErrors.timeTo = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const messages = [];
      if (newErrors.organisationName) messages.push('Organisation name');
      if (newErrors.about) messages.push('About');
      if (newErrors.suitableFor) messages.push('Suitable for');
      if (newErrors.sessonDay) messages.push('Session day');
      if (newErrors.timeFrom) messages.push('Start time');
      if (newErrors.timeTo) messages.push('End time');
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

      if (form.logo && typeof form.logo !== 'string') {
        const updateFormData = new FormData();

        Object.entries(updatePayload).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            appendArrayField(updateFormData, key, value);
            return;
          }
          appendIfPresent(updateFormData, key, value);
        });

        updateFormData.append('logo', form.logo);
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
      appendIfPresent(payload, 'bookingLink', form.bookingLink);
      payload.append('responseType', getResponseType(form.responseMethods));

      if (form.logo && typeof form.logo !== 'string') {
        payload.append('logo', form.logo);
      }

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

  return (
    <div className="fixed inset-0 z-50 bg-[#0F766E] sm:flex sm:items-center sm:justify-center sm:bg-black/55 sm:p-4 sm:backdrop-blur-sm">
      <div className="flex h-full w-full flex-col overflow-hidden bg-[#0F766E] sm:mx-4 sm:max-h-[95vh] sm:max-w-2xl sm:rounded-2xl sm:border sm:border-[#0A4A45] sm:shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/15 bg-[#0F766E] px-5 py-4 sm:px-6">
          <h2 className="text-2xl font-semibold text-white">
            {mode === 'edit' ? 'Edit Listing' : 'Add Session'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-white/20 p-1 text-white transition-colors hover:bg-white/30"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-[#0F766E] p-4 sm:p-5 md:p-6">
          <form id="add-listing-form" className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-lg ">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Organisation Details</h3>
                <p className="text-sm text-white/80">
                  Prefilled from your account. Update these in your profile if needed.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-base font-medium text-white">
                    Organisation / Club Name <span className="text-red-300">*</span>
                  </label>
                  <input
                    readOnly
                    value={form.organisationName}
                    className={`w-full cursor-not-allowed rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none ${errors.organisationName ? 'border-red-400' : ''}`}
                    placeholder="From your account"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-white">Contact Person Name</label>
                  <input
                    readOnly
                    value={form.contactPerson}
                    className="w-full cursor-not-allowed rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none"
                    placeholder="From your account"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-base font-medium text-white">Your Role</label>
                <input
                  readOnly
                  value={form.role}
                  className="w-full cursor-not-allowed rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none"
                  placeholder="From your account"
                />
              </div>

              <div className="space-y-1">
                <label className="text-base font-medium text-white">About your organisation <span className="text-red-300">*</span></label>
                <textarea
                  readOnly
                  value={form.about}
                  className={`h-24 w-full resize-none cursor-not-allowed rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none ${errors.about ? 'border-red-400' : ''}`}
                  placeholder="From your account"
                />
              </div>

              <div className="relative flex h-60 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-white/30 bg-transparent">
                {logoPreviewUrl ? (
                  <>
                    <img
                      src={logoPreviewUrl}
                      alt="Organisation"
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute bottom-3 left-3 rounded bg-black/50 px-2 py-1 text-xs text-white">
                      {form.logo instanceof File ? 'New upload — click to change' : 'From your account — click to change'}
                    </div>
                  </>
                ) : (
                  <div className="pointer-events-none flex flex-col items-center px-4 text-center">
                    <Upload className="mb-2 h-8 w-8 text-white/70" />
                    <span className="text-sm text-white/70">
                      No organisation image on your account yet.
                    </span>
                    <span className="mt-1 text-xs text-white/60">Click to upload</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  aria-label="Upload organisation logo"
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  onChange={handleLogoFile}
                />
              </div>
            </div>
            <div className="space-y-4 rounded-lg">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Sport & Session Information</h3>
                <p className="text-sm text-white/80">
                  Details about your sport sessions or activities
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-white">Sport</label>
                <div className="flex flex-wrap gap-2">
                  {dynamicSports.map((sport) => {
                    const isChecked = form.sports.includes(sport);
                    return (
                      <label
                        key={sport}
                        className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-all select-none ${
                          isChecked
                            ? 'border-white bg-white text-[#0B544E]'
                            : 'border-transparent bg-white/20 text-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 cursor-pointer rounded accent-[#0B544E]"
                          checked={isChecked}
                          onChange={() => toggleArrayField('sports', sport)}
                        />

                        {sport}
                      </label>
                    );
                  })}
                </div>
                {form.sports.includes('Other') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Please specify"
                      value={form.otherSport || ''}
                      onChange={(e) => handleChange('otherSport', e.target.value)}
                      className="w-full rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none placeholder:text-gray-500"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 pt-1">
                <div className="space-y-2">
                  <label className="text-base font-medium text-white">Session Type</label>
                  {sessionTypeOptions.map((type) => (
                    <label
                      key={type}
                      className="flex cursor-pointer items-center gap-2 text-sm text-white/90"
                    >
                      <input
                        type="checkbox"
                        checked={form.sessionTypes.includes(type)}
                        onChange={() => toggleArrayField('sessionTypes', type)}
                        className="rounded border-white/40 accent-[#0B544E]"
                      />
                      {type}
                    </label>
                  ))}
                </div>

                <div className={`space-y-2 rounded-md border p-2 ${errors.suitableFor ? 'border-red-400' : 'border-transparent'}`}>
                  <label className="text-base font-medium text-white">
                    Suitable for (more than one can be selected) <span className="text-red-300">*</span>
                  </label>
                  {suitabilityOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center gap-2 text-sm text-white/90"
                    >
                      <input
                        type="checkbox"
                        checked={form.suitableFor.includes(opt)}
                        onChange={() => { toggleArrayField('suitableFor', opt); setErrors(prev => ({ ...prev, suitableFor: false })); }}
                        className="rounded border-white/40 accent-[#0B544E]"
                      />
                      {opt}
                    </label>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-white">Who can take part?</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: 'Women only', value: 'YES' },
                      { label: 'Mixed, women welcome', value: 'NO' },
                    ].map((item) => (
                      <label
                        key={item.value}
                        className="flex cursor-pointer items-center gap-2 text-sm text-white/90"
                      >
                        <input
                          type="radio"
                          name="womensOnly"
                          checked={form.womensOnly === item.value}
                          onChange={() => handleChange('womensOnly', item.value)}
                          className="border-white/40 accent-[#0B544E]"
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white">Location & Timing</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-base font-medium text-white">Venue Name</label>
                  <input
                    value={form.venueName}
                    onChange={(e) => handleChange('venueName', e.target.value)}
                    className="w-full rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none placeholder:text-gray-500"
                    placeholder="Venue name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-white">Postcode</label>
                  <input
                    value={form.postcode}
                    onChange={(e) => handleChange('postcode', e.target.value)}
                    className="w-full rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none placeholder:text-gray-500"
                    placeholder="Postcode"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-white">e.g. London</label>
                  <input
                    value={form.townCity}
                    onChange={(e) => handleChange('townCity', e.target.value)}
                    className="w-full rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none placeholder:text-gray-500"
                    placeholder="e.g london"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-white">Google Maps Link</label>
                  <input
                    value={form.googleMapLink}
                    onChange={(e) => handleChange('googleMapLink', e.target.value)}
                    className="w-full rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none placeholder:text-gray-500"
                    placeholder="Paste Google Maps link"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-white">Session Day <span className="text-red-300">*</span></label>
                  <input
                    value={form.sessonDay}
                    onChange={(e) => { handleChange('sessonDay', e.target.value); setErrors(prev => ({ ...prev, sessonDay: false })); }}
                    className={`w-full rounded-lg border bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none placeholder:text-gray-500 ${errors.sessonDay ? 'border-red-400' : 'border-transparent'}`}
                    placeholder="e.g Tuesday"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-white">Start Time <span className="text-red-300">*</span></label>
                  <input
                    type="time"
                    value={form.timeFrom}
                    onChange={(e) => { handleChange('timeFrom', e.target.value); setErrors(prev => ({ ...prev, timeFrom: false })); }}
                    className={`w-full rounded-lg border bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none ${errors.timeFrom ? 'border-red-400' : 'border-transparent'}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-white">End Time <span className="text-red-300">*</span></label>
                  <input
                    type="time"
                    value={form.timeTo}
                    onChange={(e) => { handleChange('timeTo', e.target.value); setErrors(prev => ({ ...prev, timeTo: false })); }}
                    className={`w-full rounded-lg border bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none ${errors.timeTo ? 'border-red-400' : 'border-transparent'}`}
                  />
                </div>
              </div>
            </div>

            {/* Choose CTA */}
            <div className="space-y-4 rounded-lg">
              <div className="space-y-1">
                <label className="block text-base font-semibold text-white">
                  Choose the main action for this listing
                </label>
                <p className="text-sm text-white/80">
                  Select the button that best matches what you want people to do next. They will still be able to contact you with a question separately.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  {
                    value: 'Add booking link',
                    label: 'Register',
                    desc: 'Choose this if the event or session is confirmed and people can sign up to attend. Note: If payment or final details are required, you should contact the person after they register.',
                  },
                  {
                    value: 'Allow users to register interest',
                    label: 'Register Interest',
                    desc: 'Choose this if you want to confirm places first, check demand, or contact people before they attend. Note: You should follow up with anyone who registers interest to let them know the next steps.',
                  },
                ].map((option) => {
                  const selected = form.responseMethods?.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange('responseMethods', [option.value])}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selected
                          ? 'border-white bg-[#F5F1EB] text-[#0B544E] shadow-sm'
                          : 'border-white/30 bg-transparent text-white hover:border-white/60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-[#0B544E]' : 'border-white/60'}`}>
                          {selected && <div className="h-2 w-2 rounded-full bg-[#0B544E]" />}
                        </div>
                        <div>
                          <p className={`font-semibold text-base ${selected ? 'text-[#0B544E]' : 'text-white'}`}>{option.label}</p>
                          <p className={`mt-1 text-sm leading-normal ${selected ? 'text-[#0B544E]/70' : 'text-white/70'}`}>{option.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 z-10 flex gap-4 border-t border-white/15 bg-[#0F766E] p-4 px-5 sm:px-6">
          <button
            type="submit"
            form="add-listing-form"
            disabled={createLoading}
            className="rounded-md bg-[#F5F1EB] px-6 py-2.5 text-sm font-semibold text-[#0B544E] hover:bg-white disabled:opacity-60"
          >
            {createLoading ? 'Submitting...' : 'Submit For Approval'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRecruitmentModal;
