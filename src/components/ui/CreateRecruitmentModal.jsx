import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { createService, updateService } from '../../features/service/serviceApi';
import { selectCreateLoading } from '../../features/service/serviceSlice';
import { selectAuthUser } from '../../features/auth/authSlice';

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
    console.log('fields:', payloadFields);
    console.log('data:', payloadDebug);
    console.log('totalFields:', payloadFields.length);
    console.groupEnd();
  } catch (error) {
    console.error('[CreateRecruitmentModal] Failed to log FormData payload', error);
  }
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
      'Coach / Trainer',
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
  const user = useSelector(selectAuthUser);
  const createLoading = useSelector(selectCreateLoading);
  const [form, setForm] = useState(createInitialForm);

  useEffect(() => {
    if (!isOpen) return;
    const nextForm =
      initialData && mode === 'edit' ? mapInitialDataToForm(initialData) : createInitialForm();

    queueMicrotask(() => {
      setForm(nextForm);
    });
  }, [isOpen, initialData, mode]);

  const logoPreviewUrl = useMemo(() => {
    if (!form.logo) return '';
    if (form.logo instanceof File) return URL.createObjectURL(form.logo);
    return form.logo;
  }, [form.logo]);

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

    if (!serviceTitle || !serviceDescription) {
      toast.error('Organization name and about are required.');
      return;
    }

    // if (!providerPhone || !providerEmail) {
    //   toast.error('Provider phone and email are missing from your profile.');
    //   return;
    // }

    if (!sessionDay || !timeFrom || !timeTo) {
      toast.error('Sesson day and time range (from/to) are required.');
      return;
    }

    let resultAction;

    if (mode === 'edit' && initialData?.id) {
      const updatePayload = {
        listingHeadline: serviceTitle,
        aboutService: serviceDescription,
        providerType: [form.role || 'Coach / Trainer'],
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
      appendIfPresent(payload, 'listingHeadline', serviceTitle);
      appendIfPresent(payload, 'aboutService', serviceDescription);
      appendArrayField(payload, 'providerType', [form.role || 'Coach / Trainer']);
      appendArrayField(payload, 'sessionTypes', normalizedSessionTypes);
      appendArrayField(payload, 'availableDays', normalizedAvailableDays);
      payload.append('title', serviceTitle);
      payload.append('description', serviceDescription);
      payload.append('organizationName', serviceTitle);
      appendIfPresent(payload, 'role', form.role || 'Coach / Trainer');
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
      appendIfPresent(payload, 'sessonDay', sessionDay);
      appendIfPresent(payload, 'date', dateValue);
      appendIfPresent(payload, 'timeFrom', timeFrom);
      appendIfPresent(payload, 'timeTo', timeTo);
      appendIfPresent(payload, 'timeSlote', timeSlot);
      appendIfPresent(payload, 'bookingLink', form.bookingLink);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 flex max-h-[95vh] w-full max-w-2xl flex-col rounded-xl bg-[#f9fafb] shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-[#1a1a1a]">
            {mode === 'edit' ? 'Edit Listing' : 'Add Listing'}
          </h2>
          <button onClick={onClose} className="rounded-full bg-gray-200 p-1 hover:bg-gray-300">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
          <form id="add-listing-form" className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-lg border border-gray-100 bg-white p-5">
              <h3 className="text-lg font-semibold text-gray-800">Organisation Details</h3>
              <p className="-mt-2.5 text-base text-gray-500">
              Tell us about your organisation or club
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-base font-medium text-gray-700">
                    Organisation / Club Name
                  </label>
                  <input
                    value={form.organisationName}
                    onChange={(e) => handleChange('organisationName', e.target.value)}
                    className="w-full rounded-md bg-[#f3f4f6] p-2.5 text-sm outline-none"
                    placeholder="Enter organisation name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-gray-700">Contact Person Name</label>
                  <input
                    value={form.contactPerson}
                    onChange={(e) => handleChange('contactPerson', e.target.value)}
                    className="w-full rounded-md bg-[#f3f4f6] p-2.5 text-sm outline-none"
                    placeholder="Enter contact person name"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-base font-medium text-gray-700">Your Role</label>
                <input
                  value={form.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="w-full rounded-md bg-[#f3f4f6] p-2.5 text-sm text-gray-700 outline-none"
                  placeholder="e.g. Coach, Founder, Trainer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-base font-medium text-gray-700">About your organisation</label>
                <textarea
                  value={form.about}
                  onChange={(e) => handleChange('about', e.target.value)}
                  className="h-24 w-full resize-none rounded-md bg-[#f3f4f6] p-2.5 text-sm outline-none"
                  placeholder="Write a short introduction about what you offer"
                />
              </div>

              <div className="relative flex h-60 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => handleChange('logo', e.target.files[0])}
                />
                {logoPreviewUrl ? (
                  <div className="relative h-full w-full">
                    <img
                      src={logoPreviewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <label
                      htmlFor="file-upload"
                      className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
                    >
                      <Upload className="mb-2 h-8 w-8 text-white" />
                      <span className="text-base font-semibold text-white">Change Image</span>
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="file-upload"
                    className="flex cursor-pointer flex-col items-center"
                  >
                    <Upload className="mb-2 h-8 w-8 text-green-500" />
                    <span className="font-semibold text-green-600">Upload Image</span>
                    <span className="text-sm text-gray-400">JPEG or PNG accepted. Max 10MB</span>
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-gray-100 bg-white p-5">
              <h3 className="text-lg font-semibold text-gray-800">Sport & Session Information</h3>
              <p className="-mt-2.5 text-base text-gray-500">
                Details about your sport sessions or activities
              </p>

              <div className="space-y-2">
                <label className="text-base font-medium text-gray-700">Sport</label>
                <div className="flex flex-wrap gap-2">
                  {sportOptions.map((sport) => {
                    const isChecked = form.sports.includes(sport);
                    return (
                      <label
                        key={sport}
                        className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-all select-none ${
                          isChecked
                            ? 'border-btn-primary bg-btn-primary text-white'
                            : 'text-cardTitle border-transparent bg-[#b8d9d6]'
                        }`}
                      >
                        {/* Default Browser Checkbox */}
                        <input
                          type="checkbox"
                          className="accent-btn-primary h-4 w-4 cursor-pointer rounded"
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
                      className="w-full rounded bg-[#f3f4f6] p-2 text-sm outline-none"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="text-base font-medium text-gray-700">Session Type</label>
                  {sessionTypeOptions.map((type) => (
                    <label
                      key={type}
                      className="flex cursor-pointer items-center gap-2 text-sm text-gray-600"
                    >
                      <input
                        type="checkbox"
                        checked={form.sessionTypes.includes(type)}
                        onChange={() => toggleArrayField('sessionTypes', type)}
                        className="rounded border-gray-300"
                      />
                      {type}
                    </label>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-gray-700">
                    Suitable for (more than one can be selected)
                  </label>
                  {suitabilityOptions.map((opt) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center gap-2 text-sm text-gray-600"
                    >
                      <input
                        type="checkbox"
                        checked={form.suitableFor.includes(opt)}
                        onChange={() => toggleArrayField('suitableFor', opt)}
                        className="rounded border-gray-300"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-base font-medium text-gray-700">Women's Only</label>
                <div className="flex flex-col gap-2">
                  {['YES', 'NO'].map((val) => (
                    <label
                      key={val}
                      className="flex cursor-pointer items-center gap-2 text-sm text-gray-600"
                    >
                      <input
                        type="radio"
                        name="womensOnly"
                        checked={form.womensOnly === val}
                        onChange={() => handleChange('womensOnly', val)}
                        className="border-gray-300"
                      />
                      {val}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-gray-100 bg-white p-5">
              <h3 className="text-lg font-semibold text-gray-800">Location & Timing</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-base font-medium text-gray-700">Venue Name</label>
                  <input
                    value={form.venueName}
                    onChange={(e) => handleChange('venueName', e.target.value)}
                    className="w-full rounded bg-[#f3f4f6] p-2 text-sm outline-none"
                    placeholder="Venue name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-gray-700">Postcode</label>
                  <input
                    value={form.postcode}
                    onChange={(e) => handleChange('postcode', e.target.value)}
                    className="w-full rounded bg-[#f3f4f6] p-2 text-sm outline-none"
                    placeholder="Postcode"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-gray-700">Town / City</label>
                  <input
                    value={form.townCity}
                    onChange={(e) => handleChange('townCity', e.target.value)}
                    className="w-full rounded bg-[#f3f4f6] p-2 text-sm outline-none"
                    placeholder="e.g london"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-gray-700">Google Map Link</label>
                  <input
                    value={form.googleMapLink}
                    onChange={(e) => handleChange('googleMapLink', e.target.value)}
                    className="w-full rounded bg-[#f3f4f6] p-2 text-sm outline-none"
                    placeholder="Paste Google Maps link"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-gray-700">Sesson Day</label>
                  <input
                    value={form.sessonDay}
                    onChange={(e) => handleChange('sessonDay', e.target.value)}
                    className="w-full rounded bg-[#f3f4f6] p-2 text-sm outline-none"
                    placeholder="e.g Tuesday"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-gray-700">Date/Day</label>
                  <input
                    type="date"
                    value={form.dateDay}
                    onChange={(e) => handleChange('dateDay', e.target.value)}
                    className="w-full rounded bg-[#f3f4f6] p-2 text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-gray-700">Time From</label>
                  <input
                    type="time"
                    value={form.timeFrom}
                    onChange={(e) => handleChange('timeFrom', e.target.value)}
                    className="w-full rounded bg-[#f3f4f6] p-2 text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-base font-medium text-gray-700">Time To</label>
                  <input
                    type="time"
                    value={form.timeTo}
                    onChange={(e) => handleChange('timeTo', e.target.value)}
                    className="w-full rounded bg-[#f3f4f6] p-2 text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex gap-4 rounded-b-xl border-t border-gray-200 bg-gray-50 p-4 px-6">
          <button
            type="submit"
            form="add-listing-form"
            disabled={createLoading}
            className="bg-btn-primary rounded-md px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0d635d]"
          >
            {createLoading ? 'Submitting...' : 'Submit For Approval'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRecruitmentModal;
