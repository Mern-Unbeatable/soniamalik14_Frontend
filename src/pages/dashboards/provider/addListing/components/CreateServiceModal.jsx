import React, { useState, useEffect, useMemo } from 'react';
import { X, Upload } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../../../context/AuthContext';
import { useService } from '../../../../../context/ServiceContext';
import { fetchSportsCategories } from '../../../../../features/sportsCategories/sportsCategoriesAPI';
import { selectSportsCategories } from '../../../../../features/sportsCategories/sportsCategoriesSlice';

const providerTypeOptions = [
  'Nutrition',
  'Physiotherapy & injury recovery',
  'Sports massage',
  'Strength & conditioning',
  'Mental wellbeing',
  '1:1 coaching',
  'Other'
];

const sessionTypeOptions = ['In clinic', 'Online', 'At venue'];

const sportOptions = [
  'Football',
  'Netball',
  'Squash',
  'Padel',
  'Tennis',
  'Badminton',
  'Cricket',
  'Rugby',
  'Golf',
  'Running',
  'All sports',
  'Other'
];

const normalizeSessionType = (value) => {
  const val = String(value || '').trim().toLowerCase();
  if (val === 'in clinic') return 'In Clinic';
  if (val === 'online') return 'Online';
  if (val === 'at venue') return 'At Venue';
  return value;
};

const mapSessionTypeToUi = (value) => {
  const val = String(value || '').trim().toLowerCase();
  if (val === 'in clinic') return 'In clinic';
  if (val === 'online') return 'Online';
  if (val === 'at venue') return 'At venue';
  // Fallbacks for old values
  if (val === 'online video') return 'Online';
  if (val === 'at-home visits') return 'At venue';
  return String(value || '').trim();
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];

  const text = String(value).trim();
  if (!text) return [];

  // Supports backend values like '["In Clinic","Online Video"]'
  if (text.startsWith('[') && text.endsWith(']')) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fall through to comma split
    }
  }

  return text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const getInitialSessionTypes = (initialData) => {
  const parsed = toArray(initialData?.sessionTypes).map(mapSessionTypeToUi);
  const filtered = parsed.filter((item) => sessionTypeOptions.includes(item));
  return filtered.length > 0 ? filtered : ['In clinic'];
};

const getInitialSports = (initialData) => {
  const rawSports = toArray(initialData?.sports);
  const rawWhoServiceFor = toArray(initialData?.whoServiceFor);
  const merged = [...rawSports, ...rawWhoServiceFor]
    .map((item) => String(item || '').trim())
    .filter(Boolean);

  if (merged.length === 0) {
    return { sports: [], otherSport: '' };
  }

  const unique = [...new Set(merged)];
  const knownSports = unique.filter((item) => sportOptions.includes(item) && item !== 'Other');
  const customSports = unique.filter((item) => !sportOptions.includes(item));

  return {
    sports: customSports.length > 0 ? [...knownSports, 'Other'] : knownSports,
    otherSport: customSports.join(', '),
  };
};

const getParticipantResponseType = (methods = []) => {
  if (methods.includes('Add booking link')) return 'ADD_BOOKING_LINK';
  if (methods.includes('Allow users to register interest')) return 'ALLOW_REGISTER_INTEREST';
  return 'ADD_BOOKING_LINK';
};

const buildSportsList = (sports = [], otherSport = '') => {
  const customSport = String(otherSport || '').trim();
  return sports
    .filter((sport) => sport !== 'Other')
    .concat(customSport ? [customSport] : []);
};

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
  values.forEach((value) => {
    appendIfPresent(formData, key, value);
  });
};

const buildInitialState = (initialData) => ({
  ...getInitialSports(initialData),
  providerBusinessName: initialData?.providerName || '',
  contactName: initialData?.contactName || initialData?.providerName || '',
  logo: initialData?.logo || initialData?.image || null,
  clinicName: initialData?.clinicName || '',
  address1: initialData?.addressLine1 || initialData?.fullAddress || '',
  townCity: initialData?.city || '',
  postcode: initialData?.postcode || '',
  providerTypes: initialData?.providerType
    ? [initialData.providerType]
    : initialData?.category
      ? [initialData.category]
      : [],
  listingHeadline: initialData?.listingHeadline || initialData?.title || '',
  about: initialData?.aboutService || initialData?.description || '',
  sessionTypes: getInitialSessionTypes(initialData),
  registration: initialData?.professionalRegistration || '',
  insuranceInPlace: initialData?.insuranceInPlace === false ? 'No' : 'Yes',
  responseMethods: initialData?.participantResponseType === 'ALLOW_REGISTER_INTEREST'
    ? ['Allow users to register interest']
    : ['Add booking link'],
  bookingLink: initialData?.bookingLink || '',
  price: initialData?.price ?? '',
  duration: initialData?.duration ?? '',
  availableDays: initialData?.availableDays || '',
  timeSlots: initialData?.timeSlots || '',
  category: initialData?.category || '',
});

const PillButton = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
      active ? 'bg-[#0F766E] text-white' : 'bg-[#91C0BC] text-[#242424]'
    }`}
  >
    {children}
  </button>
);

const CheckboxPill = ({ active, onClick, children }) => (
  <label
    className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
      active
        ? 'bg-btn-primary border-btn-primary text-white'
        : 'border-transparent bg-[#B5D5D2] text-[#06322E]'
    } border`}
  >
    {/* Input checkbox with custom accent color */}
    <input
      type="checkbox"
      checked={active}
      onChange={onClick}
      className="h-4 w-4 cursor-pointer rounded accent-[#06322E]"
    />

    {children}
  </label>
);
const CreateServiceModal = ({
  isOpen,
  onClose,
  mode = 'create',
  initialData = null,
  onSuccess,
  localMode = false,
  onLocalSubmit,
}) => {
  const { user } = useAuth();
  const { createService, createLoading, updateService, updateLoading } = useService();
  const dispatch = useDispatch();
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

  const [formData, setFormData] = useState(() => buildInitialState(initialData));
  const [previewImage, setPreviewImage] = useState(
    typeof (initialData?.logo || initialData?.image) === 'string'
      ? initialData?.logo || initialData?.image
      : ''
  );

  const isBusy = createLoading || updateLoading;

  useEffect(() => {
    if (isOpen) {
      const nextFormData = buildInitialState(initialData);
      const nextPreviewImage =
        typeof (initialData?.logo || initialData?.image) === 'string'
          ? initialData?.logo || initialData?.image
          : '';

      queueMicrotask(() => {
        setFormData(nextFormData);
        setPreviewImage(nextPreviewImage);
      });
    }
  }, [isOpen, initialData]);

  const updateField = (field, value) => {
    if (field === 'logo') {
      if (!value) setPreviewImage('');
      else if (typeof value === 'string') setPreviewImage(value);
      else setPreviewImage(URL.createObjectURL(value));
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMulti = (field, value) => {
    setFormData((prev) => {
      const list = prev[field] || [];
      const exists = list.includes(value);
      const newList = exists ? list.filter((x) => x !== value) : [...list, value];
      const extra = {};
      if (field === 'sports' && value === 'Other' && exists) {
        extra.otherSport = '';
      }
      return {
        ...prev,
        [field]: newList,
        ...extra,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (localMode && onLocalSubmit) {
      onLocalSubmit(formData, mode, initialData);
      onClose?.();
      return;
    }

    const serviceTitle = String(formData.listingHeadline || '').trim();
    const serviceDescription = String(formData.about || '').trim();
    const providerName = String(formData.providerBusinessName || '').trim();
    const contactName = String(formData.contactName || '').trim();
    const providerType = formData.providerTypes?.[0] || '';
    const sportsList = buildSportsList(formData.sports, formData.otherSport);
    const mapLink = String(initialData?.googleMapLink || '').trim();
    const providerPhone =
      user?.phone || user?.phoneNumber || user?.mobile || user?.contactNumber || user?.providerPhone || '';
    const providerEmail = user?.email || user?.providerEmail || '';
    const fullAddress = [
      formData.clinicName,
      formData.address1,
      formData.townCity,
      formData.postcode,
    ]
      .map((item) => String(item || '').trim())
      .filter(Boolean)
      .join(', ');

    const payload = new FormData();
    payload.append('title', serviceTitle);
    payload.append('listingHeadline', serviceTitle);
    payload.append('about', serviceDescription);
    payload.append('description', serviceDescription);
    payload.append('aboutService', serviceDescription);
    payload.append('providerBusinessName', providerName);
    payload.append('providerName', providerName);
    appendIfPresent(payload, 'contactName', contactName || providerName);
    appendIfPresent(payload, 'providerPhone', providerPhone);
    appendIfPresent(payload, 'providerEmail', providerEmail);
    appendIfPresent(payload, 'providerType', providerType);
    payload.append('serviceType', initialData?.serviceType || 'COACHING');
    payload.append('clinicName', String(formData.clinicName || '').trim());
    payload.append('address1', String(formData.address1 || '').trim());
    payload.append('addressLine1', String(formData.address1 || '').trim());
    payload.append('townCity', String(formData.townCity || '').trim());
    payload.append('city', String(formData.townCity || '').trim());
    payload.append('postcode', String(formData.postcode || '').trim());
    payload.append('fullAddress', fullAddress);
    appendIfPresent(payload, 'googleMapLink', mapLink);
    payload.append('location', String(formData.townCity || '').trim());
    appendArrayValues(
      payload,
      'sessionTypes',
      (formData.sessionTypes || []).map((item) => normalizeSessionType(item))
    );
    appendArrayValues(payload, 'sports', sportsList);
    payload.append('whoServiceFor', sportsList.join(', '));
    payload.append(
      'isOnline',
      String((formData.sessionTypes || []).some((item) => String(item).toLowerCase() === 'online video'))
    );
    payload.append('registration', String(formData.registration || '').trim());
    payload.append('professionalRegistration', String(formData.registration || '').trim());
    payload.append('insuranceInPlace', String(formData.insuranceInPlace === 'Yes'));
    payload.append('participantResponseType', getParticipantResponseType(formData.responseMethods));
    payload.append('bookingLink', String(formData.bookingLink || '').trim());
    // Note: status and isApproved are set by backend, not sent by frontend
    payload.append('category', formData.category || providerType || 'Other');
    appendIfPresent(payload, 'availableDays', formData.availableDays);
    appendIfPresent(payload, 'timeSlots', formData.timeSlots);
    appendIfPresent(payload, 'price', formData.price);
    appendIfPresent(payload, 'duration', formData.duration);

    if (formData.logo && typeof formData.logo !== 'string') {
      payload.append('logo', formData.logo);
    }

    // Debug: Log FormData entries to console
    try {
      const payloadDebug = {};
      const payloadFieldsList = [];
      for (const [key, value] of payload.entries()) {
        if (value instanceof File) {
          if (payloadDebug[key] !== undefined) {
            payloadDebug[key] = Array.isArray(payloadDebug[key])
              ? [...payloadDebug[key], `[File: ${value.name}]`]
              : [payloadDebug[key], `[File: ${value.name}]`];
          } else {
            payloadDebug[key] = `[File: ${value.name}]`;
          }
        } else {
          if (payloadDebug[key] !== undefined) {
            payloadDebug[key] = Array.isArray(payloadDebug[key])
              ? [...payloadDebug[key], value]
              : [payloadDebug[key], value];
          } else {
            payloadDebug[key] = value;
          }
        }
        payloadFieldsList.push(key);
      }
      console.log('--- [CreateServiceModal] SUBMITTING PAYLOAD ---');
      console.log('Payload data object:', payloadDebug);
      console.log('Payload fields list:', payloadFieldsList);
      console.log('Total fields:', payloadFieldsList.length);
    } catch (e) {
      console.error('[CreateServiceModal] Error logging payload:', e);
    }

    let result;
    if (mode === 'edit' && initialData?.id) {
      console.log('[CreateServiceModal] Calling updateService API with id:', initialData.id);
      result = await updateService(initialData.id, payload);
    } else {
      console.log('[CreateServiceModal] Calling createService API...');
      result = await createService(payload);
    }
    
    console.log('--- [CreateServiceModal] BACKEND RESPONSE RECEIVED ---');
    console.log('Response result:', result);
    console.log('----------------------------------------------------');

    if (result?.success) {
      onSuccess?.(result?.service || result, mode);
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-[#F9FAFB] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E3EBEA] bg-white px-5 py-4 sm:px-6">
          <h2 className="text-xl font-bold text-[#0F766E]">
            {mode === 'edit' ? 'Edit Service' : 'Add Service'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          id="service-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6"
        >
          {/* Section 1: Service Provider Form */}
          <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div>
              <p className="text-base font-medium text-gray-500">
                Join our community of professional support services aimed at empowering women in
                sport and fitness.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-base font-medium text-[#0A0A0A]">
                  Provider / Business Name
                </label>
                <input
                  value={formData.providerBusinessName}
                  onChange={(e) => updateField('providerBusinessName', e.target.value)}
                  className="w-full rounded-lg bg-[#F3F3F5] p-3 text-sm outline-none"
                  placeholder="e.g. Richmond Women's Physios"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-base font-medium text-[#0A0A0A]">Contact Name</label>
                <input
                  value={formData.contactName}
                  onChange={(e) => updateField('contactName', e.target.value)}
                  className="w-full rounded-lg bg-[#F3F3F5] p-3 text-sm outline-none"
                  placeholder="Enter name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-base font-medium text-[#0A0A0A]">Logo</label>
              <label className="relative block h-65 cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-400 p-10 text-center hover:bg-gray-50 bg-white">
                {previewImage ? (
                  <>
                    <img
                      src={previewImage}
                      alt="Uploaded preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="relative z-10 flex h-full items-center justify-center">
                      <span className="rounded-md bg-white/90 px-4 py-2 text-base font-medium text-[#1D1D1D]">
                        Click to change image
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="mx-auto mb-3 h-10 w-10 text-[#22A547]" />
                    <p className="text-xl font-medium text-[#22A547]">Upload Image</p>
                    <p className="mt-1 text-base text-gray-500">JPEG or PNG accepted. Max 10MB</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => updateField('logo', e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#0A0A0A]">Location Details</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-base font-medium text-[#0A0A0A]">Clinic / venue name</label>
                <input
                  className="w-full rounded-lg bg-[#F3F3F5] p-3 text-sm outline-none"
                  placeholder="e.g. The Wellness Centre"
                  value={formData.clinicName}
                  onChange={(e) => updateField('clinicName', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-base font-medium text-[#0A0A0A]">Address Line </label>
                <input
                  className="w-full rounded-lg bg-[#F3F3F5] p-3 text-sm outline-none"
                  placeholder="e.g. 123 High Street"
                  value={formData.address1}
                  onChange={(e) => updateField('address1', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-base font-medium text-[#0A0A0A]">Town/City</label>
                <input
                  className="w-full rounded-lg bg-[#F3F3F5] p-3 text-sm outline-none"
                  placeholder="e.g. Richmond"
                  value={formData.townCity}
                  onChange={(e) => updateField('townCity', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-base font-medium text-[#0A0A0A]">Postcode</label>
                <input
                  className="w-full rounded-lg bg-[#F3F3F5] p-3 text-sm outline-none"
                  placeholder="e.g. TW9 1AB"
                  value={formData.postcode}
                  onChange={(e) => updateField('postcode', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Service type */}
          <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <label className="block text-base font-semibold text-gray-700">Service type</label>
            <select
              value={formData.providerTypes?.[0] || ''}
              onChange={(e) => updateField('providerTypes', [e.target.value])}
              className="focus:ring-btn-primary w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
            >
              <option value="">Select service type</option>
              {providerTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Section 4: About your service */}
          <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#0A0A0A]">About your service</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-base font-medium text-[#0A0A0A]">Listing Headline</label>
                <input
                  className="w-full rounded-lg bg-[#F3F3F5] p-3 text-sm outline-none"
                  placeholder="e.g. The Wellness Centre"
                  value={formData.listingHeadline}
                  onChange={(e) => updateField('listingHeadline', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-base font-medium text-[#0A0A0A]">
                  About your service
                </label>
                <textarea
                  className="h-28 w-full resize-none rounded-lg bg-[#F3F3F5] p-3 text-sm outline-none"
                  placeholder="Provide a short description of the service, including what clients can expect."
                  value={formData.about}
                  onChange={(e) => updateField('about', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-base font-medium text-[#0A0A0A]">Delivery type</label>
              <div className="flex flex-wrap gap-2">
                {sessionTypeOptions.map((opt) => (
                  <PillButton
                    key={opt}
                    active={formData.sessionTypes.includes(opt)}
                    onClick={() => toggleMulti('sessionTypes', opt)}
                  >
                    {opt}
                  </PillButton>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-base font-medium text-[#0A0A0A]">Sports supported</label>
              <p className="text-sm text-gray-500">
                Optional - leave blank if your service is not sport-specific.
              </p>
              <select
                value={formData.sports?.[0] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  updateField('sports', val ? [val] : []);
                }}
                className="focus:ring-btn-primary w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
              >
                <option value="">Select sport</option>
                {sportOptions.map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>
              {formData.sports.includes('Other') && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Please specify"
                    value={formData.otherSport}
                    onChange={(e) => updateField('otherSport', e.target.value)}
                    className="w-full rounded-lg bg-[#F3F3F5] p-3 text-sm outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Credentials */}
          <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#0A0A0A]">Professional Credentials</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-base font-medium text-[#0A0A0A]">
                  Professional registration / qualifications.
                </label>
                <input
                  className="w-full rounded-lg bg-[#F3F3F5] p-3 text-sm outline-none"
                  placeholder="e.g. HCPC Registered, CSP Member"
                  value={formData.registration}
                  onChange={(e) => updateField('registration', e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-[#0A0A0A]">Insurance in place?</label>
                <div className="flex gap-2">
                  {['Yes', 'No'].map((v) => (
                    <PillButton
                      key={v}
                      active={formData.insuranceInPlace === v}
                      onClick={() => updateField('insuranceInPlace', v)}
                    >
                      {v}
                    </PillButton>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-20 flex items-center gap-3 border-t border-gray-100 bg-white px-6 py-4">
          <button
            type="submit"
            form="service-form"
            disabled={isBusy}
            className="bg-btn-primary hover:bg-btn-primary-dark rounded-md px-6 py-2 text-[15px] font-semibold text-white transition-colors disabled:opacity-60"
          >
            {isBusy ? 'Submitting...' : 'Submit for approval'}
          </button>

      
        </div>
      </div>
    </div>
  );
};

export default CreateServiceModal;
