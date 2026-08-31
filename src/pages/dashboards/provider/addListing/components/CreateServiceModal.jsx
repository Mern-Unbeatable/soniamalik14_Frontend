import React, { useState, useEffect, useMemo } from 'react';
import { X, Upload } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../../../../context/AuthContext';
import { useService } from '../../../../../context/ServiceContext';
import { fetchSportsCategories } from '../../../../../features/sportsCategories/sportsCategoriesAPI';
import { selectSportsCategories } from '../../../../../features/sportsCategories/sportsCategoriesSlice';

const SESSION_TYPE_OPTIONS = ['In clinic', 'Online', 'At venue'];
const SESSION_FREQUENCY_OPTIONS = ['Weekly', 'Fortnightly', 'Monthly', 'One-off', 'Other'];
const SUITABLE_FOR_OPTIONS = [
  'New to sport',
  'Some experience',
  'Experienced players',
  'Competitive players',
  'All levels welcome',
];
const DAY_OPTIONS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const RESPONSE_ACTION_OPTIONS = [
  { value: 'REGISTER', label: 'Register', desc: 'People can sign up to attend this session.' },
  { value: 'REGISTER_INTEREST', label: 'Register Interest', desc: 'Confirm demand before people attend.' },
];

const fieldClass =
  'w-full rounded-md border border-gray-200 bg-[#F8F9F9] px-3 py-2.5 text-sm text-[#1A1D1F] outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-[#147B6B]';
const labelClass = 'mb-1.5 block text-sm font-medium text-[#1A1D1F]';

const FormSection = ({ title, children }) => (
  <section className="rounded-lg border border-[#CDE1DF] bg-white p-4 shadow-sm">
    {title ? <h3 className="mb-4 text-base font-bold text-[#14322F]">{title}</h3> : null}
    {children}
  </section>
);

const getOrgFromUser = (user = {}) => ({
  organizationName:
    user?.organizationName ||
    user?.organisationName ||
    user?.providerBusinessName ||
    user?.businessName ||
    user?.providerName ||
    '',
  contactName:
    user?.contactName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.name ||
    '',
  role: user?.role || user?.providerRole || user?.jobTitle || '',
  logo: user?.logo || user?.avatar || user?.profileImage || user?.image || null,
});

// Legacy service-provider categories (not used on Add Session layout)
// const providerTypeOptions = [ ... ];

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
  const filtered = parsed.filter((item) => SESSION_TYPE_OPTIONS.includes(item));
  return filtered[0] || '';
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

const buildInitialState = (initialData, user) => {
  const org = getOrgFromUser(user);
  const sports = getInitialSports(initialData);
  const responseType =
    initialData?.responseType ||
    (initialData?.participantResponseType === 'ALLOW_REGISTER_INTEREST' ? 'REGISTER_INTEREST' : 'REGISTER');

  return {
    ...sports,
    organizationName: initialData?.organizationName || org.organizationName,
    providerBusinessName: initialData?.providerName || org.organizationName,
    contactName: initialData?.contactName || org.contactName,
    role: initialData?.role || org.role,
    logo: initialData?.logo || initialData?.image || org.logo,
    clinicName: initialData?.clinicName || '',
    address1: initialData?.addressLine1 || initialData?.fullAddress || '',
    townCity: initialData?.city || '',
    postcode: initialData?.postcode || '',
    googleMapLink: initialData?.googleMapLink || '',
    listingHeadline: initialData?.listingHeadline || initialData?.title || '',
    about: initialData?.aboutService || initialData?.description || '',
    sessionType: getInitialSessionTypes(initialData),
    sessionTypes: getInitialSessionTypes(initialData) ? [getInitialSessionTypes(initialData)] : [],
    suitableFor: toArray(initialData?.suitableFor),
    sessionDay: initialData?.sessonDay || '',
    startTime: '',
    endTime: '',
    sessionFrequency: initialData?.sessionFrequency || '',
    costMode: initialData?.costMemebershipDetail === 'Free' ? 'free' : initialData?.costMemebershipDetail === 'Contact provider' ? 'contact' : 'details',
    costMembershipDetail: initialData?.costMemebershipDetail || '',
    responseType,
    responseMethods:
      responseType === 'REGISTER_INTEREST'
        ? ['Allow users to register interest']
        : ['Add booking link'],
    registration: initialData?.professionalRegistration || '',
    insuranceInPlace: initialData?.insuranceInPlace === false ? 'No' : 'Yes',
    bookingLink: initialData?.bookingLink || '',
    womensOnly: initialData?.womensOnly ?? initialData?.womenOnly ?? true,
    providerTypes: [],
    price: initialData?.price ?? '',
    duration: initialData?.duration ?? '',
    availableDays: initialData?.availableDays || '',
    timeSlots: initialData?.timeSlots || '',
    category: initialData?.category || '',
  };
};

const fieldClassLegacy =
  'w-full rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none placeholder:text-gray-500';
const labelClassLegacy = 'text-base font-medium text-white';

// const PillButton = ...
// const CheckboxPill = ...
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

  const [formData, setFormData] = useState(() => buildInitialState(initialData, user));
  const [previewImage, setPreviewImage] = useState(
    typeof (initialData?.logo || initialData?.image) === 'string'
      ? initialData?.logo || initialData?.image
      : ''
  );

  const isBusy = createLoading || updateLoading;

  useEffect(() => {
    if (isOpen) {
      const nextFormData = buildInitialState(initialData, user);
      const nextPreviewImage =
        typeof (initialData?.logo || initialData?.image) === 'string'
          ? initialData?.logo || initialData?.image
          : '';

      queueMicrotask(() => {
        setFormData(nextFormData);
        setPreviewImage(nextPreviewImage);
      });
    }
  }, [isOpen, initialData, user]);

  const toggleSuitableFor = (option) => {
    setFormData((prev) => {
      const list = Array.isArray(prev.suitableFor) ? prev.suitableFor : [];
      return {
        ...prev,
        suitableFor: list.includes(option) ? list.filter((x) => x !== option) : [...list, option],
      };
    });
  };

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

    const serviceTitle = String(
      formData.listingHeadline ||
        formData.organizationName ||
        [formData.sports?.[0], formData.clinicName].filter(Boolean).join(' — ') ||
        ''
    ).trim();
    const serviceDescription = String(formData.about || '').trim();
    const providerName = String(formData.organizationName || formData.providerBusinessName || '').trim();
    const contactName = String(formData.contactName || '').trim();
    const providerType = formData.providerTypes?.[0] || '';
    const sportsList = buildSportsList(formData.sports, formData.otherSport);
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
    appendIfPresent(payload, 'googleMapLink', String(formData.googleMapLink || initialData?.googleMapLink || '').trim());
    appendArrayValues(payload, 'suitableFor', formData.suitableFor || []);
    const responseType =
      formData.responseType ||
      (formData.responseMethods?.includes('Allow users to register interest')
        ? 'REGISTER_INTEREST'
        : 'REGISTER');
    payload.append('responseType', responseType);
    payload.append('organizationName', String(formData.organizationName || formData.providerBusinessName || '').trim());
    payload.append('role', String(formData.role || '').trim());
    appendIfPresent(payload, 'sessonDay', formData.sessionDay);
    appendIfPresent(payload, 'sessionFrequency', formData.sessionFrequency);
    if (formData.startTime && formData.endTime) {
      appendIfPresent(payload, 'timeSlote', `${formData.startTime} - ${formData.endTime}`);
    }
    if (formData.costMode === 'free') {
      appendIfPresent(payload, 'costMemebershipDetail', 'Free');
    } else if (formData.costMode === 'contact') {
      appendIfPresent(payload, 'costMemebershipDetail', 'Contact provider for cost or membership details');
    } else {
      appendIfPresent(payload, 'costMemebershipDetail', formData.costMembershipDetail);
    }
    payload.append(
      'whoCanTakePart',
      formData.womensOnly ? 'women only' : 'Mixed, women welcome'
    );
    payload.append('visibility', 'public');
    payload.append('location', String(formData.townCity || '').trim());
    appendArrayValues(
      payload,
      'sessionTypes',
      formData.sessionType ? [normalizeSessionType(formData.sessionType)] : (formData.sessionTypes || []).map((item) => normalizeSessionType(item))
    );
    appendArrayValues(payload, 'sports', sportsList);
    payload.append('whoServiceFor', sportsList.join(', '));
    payload.append(
      'isOnline',
      String(String(formData.sessionType || formData.sessionTypes?.[0] || '').toLowerCase() === 'online')
    );
    payload.append('registration', String(formData.registration || '').trim());
    payload.append('professionalRegistration', String(formData.registration || '').trim());
    payload.append('insuranceInPlace', String(formData.insuranceInPlace === 'Yes'));
    payload.append('womensOnly', String(formData.womensOnly === true));
    payload.append('womenOnly', String(formData.womensOnly === true));
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

    // Debug payload logging (disabled)
    // try { ... console.log ... } catch (e) { ... }

    let result;
    if (mode === 'edit' && initialData?.id) {
      result = await updateService(initialData.id, payload);
    } else {
      result = await createService(payload);
    }

    if (result?.success) {
      onSuccess?.(result?.service || result, mode);
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[#F3F6F6] shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#14322F]">
              {mode === 'edit' ? 'Edit Session' : 'Add Session'}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Share a session with the community. Need a one-off event instead? Add an event from your dashboard.
            </p>
          </div>
          <button onClick={onClose} className="rounded-full bg-gray-100 p-1 text-gray-600 hover:bg-gray-200" aria-label="Close">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form id="service-form" onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          <FormSection title="Organisation Details">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Organisation / Club Name</label>
                <input className={fieldClass} value={formData.organizationName} onChange={(e) => updateField('organizationName', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Contact Person Name</label>
                <input className={fieldClass} value={formData.contactName} onChange={(e) => updateField('contactName', e.target.value)} />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>Your Role</label>
              <input className={fieldClass} value={formData.role} onChange={(e) => updateField('role', e.target.value)} />
            </div>
          </FormSection>

          <FormSection title="Sport & Session Information">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Sport or activity *</label>
                <select className={fieldClass} value={formData.sports?.[0] || ''} onChange={(e) => updateField('sports', e.target.value ? [e.target.value] : [])}>
                  <option value="">Select sport</option>
                  {dynamicSports.map((sport) => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Session type *</label>
                <select
                  className={fieldClass}
                  value={formData.sessionType}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData((prev) => ({ ...prev, sessionType: v, sessionTypes: v ? [v] : [] }));
                  }}
                >
                  <option value="">Select session type</option>
                  {SESSION_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <label className={labelClass}>Suitable for</label>
              {SUITABLE_FOR_OPTIONS.map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={(formData.suitableFor || []).includes(option)} onChange={() => toggleSuitableFor(option)} />
                  {option}
                </label>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <label className={labelClass}>Who can take part?</label>
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="sessionWho" checked={formData.womensOnly === true} onChange={() => updateField('womensOnly', true)} />Women only</label>
              <label className="flex items-center gap-2 text-sm"><input type="radio" name="sessionWho" checked={formData.womensOnly === false} onChange={() => updateField('womensOnly', false)} />Mixed, women welcome</label>
            </div>
          </FormSection>

          <FormSection title="Session Description">
            <textarea className={`${fieldClass} min-h-28 resize-none`} value={formData.about} onChange={(e) => updateField('about', e.target.value)} placeholder="Tell people what to expect" />
          </FormSection>

          <FormSection title="Location & Timing">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div><label className={labelClass}>Venue Name *</label><input className={fieldClass} value={formData.clinicName} onChange={(e) => updateField('clinicName', e.target.value)} /></div>
              <div><label className={labelClass}>Postcode *</label><input className={fieldClass} value={formData.postcode} onChange={(e) => updateField('postcode', e.target.value)} /></div>
              <div><label className={labelClass}>Google Maps Link</label><input className={fieldClass} value={formData.googleMapLink} onChange={(e) => updateField('googleMapLink', e.target.value)} /></div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className={labelClass}>Session day *</label>
                <select className={fieldClass} value={formData.sessionDay} onChange={(e) => updateField('sessionDay', e.target.value)}>
                  <option value="">Select day</option>
                  {DAY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Start time *</label><input type="time" className={fieldClass} value={formData.startTime} onChange={(e) => updateField('startTime', e.target.value)} /></div>
              <div><label className={labelClass}>End time *</label><input type="time" className={fieldClass} value={formData.endTime} onChange={(e) => updateField('endTime', e.target.value)} /></div>
            </div>
            <div className="mt-4">
              <label className={labelClass}>How often does it run? *</label>
              <select className={fieldClass} value={formData.sessionFrequency} onChange={(e) => updateField('sessionFrequency', e.target.value)}>
                <option value="">Select frequency</option>
                {SESSION_FREQUENCY_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div><label className={labelClass}>Town/City</label><input className={fieldClass} value={formData.townCity} onChange={(e) => updateField('townCity', e.target.value)} /></div>
              <div><label className={labelClass}>Address line</label><input className={fieldClass} value={formData.address1} onChange={(e) => updateField('address1', e.target.value)} /></div>
            </div>
          </FormSection>

          <FormSection title="Cost or Membership Details *">
            <div className="mb-3 flex flex-wrap gap-2">
              {['details', 'free', 'contact'].map((modeKey) => (
                <button key={modeKey} type="button" onClick={() => updateField('costMode', modeKey)} className={`rounded-md px-3 py-1.5 text-sm ${formData.costMode === modeKey ? 'bg-[#0F766E] text-white' : 'bg-gray-200'}`}>
                  {modeKey === 'details' ? 'Enter details' : modeKey === 'free' ? 'Free' : 'Contact provider'}
                </button>
              ))}
            </div>
            {formData.costMode === 'details' && (
              <textarea className={`${fieldClass} min-h-24 resize-none`} value={formData.costMembershipDetail} onChange={(e) => updateField('costMembershipDetail', e.target.value)} />
            )}
          </FormSection>

          <FormSection>
            <p className="mb-3 text-base font-bold text-[#14322F]">Choose the main action for this listing</p>
            {RESPONSE_ACTION_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    responseType: option.value,
                    responseMethods: option.value === 'REGISTER_INTEREST' ? ['Allow users to register interest'] : ['Add booking link'],
                  }))
                }
                className={`mb-2 w-full rounded-xl border p-4 text-left ${formData.responseType === option.value ? 'border-[#147B6B] bg-[#E7F1F1]' : 'border-gray-200 bg-white'}`}
              >
                <p className="font-semibold">{option.label}</p>
                <p className="text-sm text-gray-600">{option.desc}</p>
              </button>
            ))}
          </FormSection>

          <FormSection>
            <label className={labelClass}>Image Upload</label>
            <label className="relative block h-44 cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-[#F8F9F9]">
              {previewImage ? <img src={previewImage} alt="Session" className="h-full w-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center text-gray-500"><Upload className="mb-2 h-7 w-7" /><span className="text-sm">Click to upload an image</span></div>}
              <input type="file" accept="image/jpeg,image/jpg,image/png" className="hidden" onChange={(e) => updateField('logo', e.target.files?.[0] || null)} />
            </label>
          </FormSection>

          {/* Legacy: professional credentials UI (not in client session mock) */}
          {/* <FormSection title="Professional Credentials">...</FormSection> */}
        </form>

        <div className="border-t border-gray-200 bg-white px-5 py-4">
          <button type="submit" form="service-form" disabled={isBusy} className="w-full rounded-lg bg-[#0F766E] py-3 text-sm font-semibold text-white hover:bg-[#0d655d] disabled:opacity-60">
            {isBusy ? 'Submitting...' : 'Submit for approval'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateServiceModal;
