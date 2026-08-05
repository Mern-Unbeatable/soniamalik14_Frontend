import React, { useState, useEffect, useMemo } from 'react';
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

const SUITABLE_FOR_OPTIONS = ['Women', 'College Students', 'Professionals'];

const getSuitableForValue = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const EventModal = ({
  isOpen,
  onClose,
  initialData = null,
  mode = 'create',
  useOrganizerApi = false,
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
  const { createEvent, updateEvent, createLoading, updateLoading } = useEvent();
  const authUser = useSelector(selectAuthUser);
  const createOrganizerLoading = useSelector(selectCreateOrganizerEventLoading);
  const updateOrganizerLoading = useSelector(selectUpdateOrganizerEventLoading);
  const [formData, setFormData] = useState({
    eventTitle: '',
    sportType: '',
    suitableFor: [],
    eventType: 'TRAINING',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    venueName: '',
    city: '',
    fullAddress: '',
    googleMapLinks: '',
    minAge: '18',
    maxParticipant: '20',
    skillLevel: 'New To Sport',
    costType: 'Free',
    price: '',
    responseMethods: ['Add booking link'],
    organizerName: '',
    organizerPhone: '',
    organizerEmail: '',
    image: null,
  });

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        eventTitle: initialData.title || '',
        sportType: initialData.sportType || '',
        suitableFor: getSuitableForValue(initialData.suitableFor),
        eventType: initialData.eventType || initialData.type || 'TRAINING',
        description: initialData.description || '',
        startDate: toDateInputValue(initialData.startDate || initialData.date),
        endDate: toDateInputValue(initialData.endDate),
        startTime: toTimeInputValue(initialData.startTime),
        endTime: toTimeInputValue(initialData.endTime),
        venueName: initialData.venueName || '',
        city: initialData.city || '',
        fullAddress: initialData.fullAddress || initialData.location || '',
        googleMapLinks: initialData.googleMapLink || initialData.googleMapLinks || '',
        minAge: initialData.minAge || '18',
        maxParticipant: initialData.maxParticipants || initialData.maxParticipant || '20',
        skillLevel: initialData.skillLevel || 'New To Sport',
        costType: String(initialData.costType || 'Free').toLowerCase() === 'paid' ? 'Paid' : 'Free',
        price: initialData.registrationFee || initialData.price || '',
        responseMethods: Array.isArray(initialData.responseMethods)
          ? initialData.responseMethods
          : ['Add booking link'],
        organizerName: initialData.organizerName || authUser?.name || '',
        organizerPhone:
          initialData.organizerPhone || authUser?.phone || authUser?.phoneNumber || '',
        organizerEmail: initialData.organizerEmail || authUser?.email || '',
        image: initialData.image || null,
        womensOnly: initialData?.womensOnly ?? initialData?.womenOnly ?? true,
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        eventTitle: '',
        sportType: '',
        suitableFor: [],
        eventType: 'TRAINING',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        venueName: '',
        city: '',
        fullAddress: '',
        googleMapLinks: '',
        minAge: '18',
        maxParticipant: '20',
        skillLevel: 'New To Sport',
        costType: 'Free',
        price: '',
        responseMethods: ['Add booking link'],
        organizerName: authUser?.name || '',
        organizerPhone: authUser?.phone || authUser?.phoneNumber || '',
        organizerEmail: authUser?.email || '',
        image: null,
        womensOnly: true,
      });
    }
  }, [initialData, mode, isOpen, authUser]);

  const [errors, setErrors] = useState({});

  const imagePreview = useMemo(() => {
    if (!formData.image) return '';
    if (typeof formData.image === 'string') return formData.image;
    return URL.createObjectURL(formData.image);
  }, [formData.image]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleResponseMethod = (method) => {
    setFormData((prev) => {
      const hasMethod = prev.responseMethods.includes(method);
      return {
        ...prev,
        responseMethods: hasMethod
          ? prev.responseMethods.filter((item) => item !== method)
          : [...prev.responseMethods, method],
      };
    });
  };

  const toggleSuitableFor = (option) => {
    setFormData((prev) => {
      const current = Array.isArray(prev.suitableFor) ? prev.suitableFor : [];
      const hasOption = current.includes(option);
      const next = hasOption
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, suitableFor: next };
    });
    setErrors((prev) => ({ ...prev, suitableFor: undefined }));
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
      'venueName',
      'city',
      'fullAddress',
      'googleMapLinks',
      'skillLevel',
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
    payload.append('startTime', formData.startTime);
    payload.append('endTime', formData.endTime);
    payload.append('venueName', formData.venueName);
    payload.append('city', formData.city);
    payload.append('fullAddress', formData.fullAddress);
    payload.append('googleMapLink', formData.googleMapLinks);
    payload.append('minAge', formData.minAge || '18');
    payload.append('maxParticipants', formData.maxParticipant || '20');
    payload.append('skillLevel', normalizeSkillLevel(formData.skillLevel));
    payload.append('costType', normalizeCostType(formData.costType));
    payload.append(
      'registrationFee',
      formData.costType === 'Paid' ? String(formData.price || '').trim() : '0'
    );
    const finalMethods = [...(formData.responseMethods || [])];
    if (!finalMethods.includes('Allow users to ask a question')) {
      finalMethods.push('Allow users to ask a question');
    }
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
    payload.append('womenOnly', String(formData.womensOnly === true));

    // Add image if present
    if (formData.image instanceof File) {
      payload.append('image', formData.image);
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

  const fieldClass =
    'w-full rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-sm text-[#1A1D1D] outline-none placeholder:text-gray-500';
  const labelClass = 'mb-1 block text-base font-medium text-white';
  const errorClass = 'mt-1 text-sm text-red-300';

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F766E] sm:flex sm:items-center sm:justify-center sm:bg-black/55 sm:p-4 sm:backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-full w-full flex-col overflow-hidden bg-[#0F766E] sm:max-h-[88vh] sm:max-w-2xl sm:rounded-2xl sm:border sm:border-[#0A4A45] sm:shadow-2xl">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/15 bg-[#0F766E] px-5 py-4 sm:px-6">
          <h2 className="text-2xl font-semibold text-white">
            {mode === 'edit' ? 'Edit Event' : 'Add Event '}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-white/20 p-1 text-white transition-colors hover:bg-white/30"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-[#0F766E] p-4 sm:p-5 md:p-6">
          <form id="event-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title & Sport Type */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Event Title</label>
                <input
                  type="text"
                  placeholder="enter event title"
                  value={formData.eventTitle}
                  onChange={(e) => handleChange('eventTitle', e.target.value)}
                  className={fieldClass}
                />
                {errors.eventTitle && <p className={errorClass}>{errors.eventTitle}</p>}
              </div>
              <div>
                <label className={labelClass}>Sport</label>
                <select
                  value={formData.sportType}
                  onChange={(e) => handleChange('sportType', e.target.value)}
                  className={fieldClass}
                >
                  <option value="">Select sport</option>
                  {sportsCategories && sportsCategories.length > 0
                    ? sportsCategories.map((sport) => (
                        <option key={sport.id || sport.name} value={sport.name}>
                          {sport.name}
                        </option>
                      ))
                    : SPORT_OPTIONS.map((sport) => (
                        <option key={sport} value={sport}>
                          {sport}
                        </option>
                      ))}
                </select>
                {errors.sportType && <p className={errorClass}>{errors.sportType}</p>}
              </div>
            </div>

            {/* Event Type */}
            <div>
              <label className={labelClass}>Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => handleChange('eventType', e.target.value)}
                className={fieldClass}
              >
                <option value="MATCH">Match</option>
                <option value="TOURNAMENT">Tournament</option>
                <option value="TRIAL">Trial</option>
                <option value="TRAINING">Training</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="SEMINAR">Seminar</option>
                <option value="COMPETITION">Competition</option>
                <option value="MEETUP">Meetup</option>
              </select>
              {errors.eventType && <p className={errorClass}>{errors.eventType}</p>}
            </div>

            {/* Event Description */}
            <div>
              <label className={labelClass}>Event Description</label>
              <textarea
                placeholder="Tell people what to expect, who it’s for and what to bring"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={`${fieldClass} min-h-24 resize-none`}
              />
              {errors.description && <p className={errorClass}>{errors.description}</p>}
            </div>

            {/* Start Date & End Date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.startDate}
                    min={todayStr}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className={fieldClass}
                  />
                  {errors.startDate && <p className={errorClass}>{errors.startDate}</p>}
                </div>
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.endDate}
                    min={formData.startDate || todayStr}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className={fieldClass}
                  />
                  {errors.endDate && <p className={errorClass}>{errors.endDate}</p>}
                </div>
              </div>
            </div>

            {/* Start Time & End Time */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Start Time</label>
                <div className="relative">
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                    className={fieldClass}
                  />
                  {errors.startTime && <p className={errorClass}>{errors.startTime}</p>}
                </div>
              </div>
              <div>
                <label className={labelClass}>End Time</label>
                <div className="relative">
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                    className={fieldClass}
                  />
                  {errors.endTime && <p className={errorClass}>{errors.endTime}</p>}
                </div>
              </div>
            </div>

            {/* Venue Name & City */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Venue Name</label>
                <input
                  type="text"
                  placeholder="e.g. Clapham Leisure Centre"
                  value={formData.venueName}
                  onChange={(e) => handleChange('venueName', e.target.value)}
                  className={fieldClass}
                />
                {errors.venueName && <p className={errorClass}>{errors.venueName}</p>}
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={fieldClass}
                />
                {errors.city && <p className={errorClass}>{errors.city}</p>}
              </div>
            </div>

            {/* Venue Address */}
            <div>
              <label className={labelClass}>Venue Address</label>
              <input
                type="text"
                placeholder="Enter full venue address"
                value={formData.fullAddress}
                onChange={(e) => handleChange('fullAddress', e.target.value)}
                className={fieldClass}
              />
              {errors.fullAddress && <p className={errorClass}>{errors.fullAddress}</p>}
            </div>

            {/* Google Maps Link */}
            <div>
              <label className={labelClass}>Google Maps Link</label>
              <input
                type="text"
                placeholder="Paste Google Maps link"
                value={formData.googleMapLinks}
                onChange={(e) => handleChange('googleMapLinks', e.target.value)}
                className={fieldClass}
              />
              {errors.googleMapLinks && <p className={errorClass}>{errors.googleMapLinks}</p>}
            </div>

            {/* Who it's suitable for */}
            <div className="space-y-2">
              <label className="text-base font-medium text-white">
                Suitable for (more than one can be selected)
              </label>
              <div className="flex flex-col gap-2">
                {SUITABLE_FOR_OPTIONS.map((option) => {
                  const isChecked =
                    Array.isArray(formData.suitableFor) && formData.suitableFor.includes(option);
                  return (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-2 text-sm text-white/90"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSuitableFor(option)}
                        className="cursor-pointer rounded border-white/40 accent-[#0B544E]"
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
              {errors.suitableFor && <p className={errorClass}>{errors.suitableFor}</p>}
            </div>

            {/* Who can take part? */}
            <div>
              <label className="mb-2 block text-base font-medium text-white">Who can take part?</label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.womensOnly === true}
                    onChange={() => handleChange('womensOnly', true)}
                    className="h-[15px] w-[15px] cursor-pointer rounded-sm border-white/40 accent-[#0B544E]"
                  />
                  <span className="text-base text-white/90">Women only</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.womensOnly === false}
                    onChange={() => handleChange('womensOnly', false)}
                    className="h-[15px] w-[15px] cursor-pointer rounded-sm border-white/40 accent-[#0B544E]"
                  />
                  <span className="text-base text-white/90">Mixed, women welcome</span>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-base font-medium text-white">Who is this for?</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'New To Sport',
                  'All levels welcome',
                  'Experienced players',
                  'Coaches',
                  'Referees',
                ].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleChange('skillLevel', level)}
                    className={`rounded-sm px-4 py-2 text-base font-medium transition-colors ${
                      formData.skillLevel === level
                        ? 'bg-white text-[#0B544E]'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              {errors.skillLevel && <p className={errorClass}>{errors.skillLevel}</p>}
            </div>

            {/* Cost and Price */}
            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[auto_1fr]">
              <div>
                <label className="mb-2 block text-base font-medium text-white">Pricing</label>
                <div className="flex gap-2">
                  {['Free', 'Paid'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange('costType', type)}
                      className={`rounded-sm px-5 py-2 text-base font-medium transition-colors ${
                        formData.costType === type
                          ? 'bg-white text-[#0B544E]'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-base font-medium text-white">Price</label>
                <input
                  type="text"
                  placeholder="e.g. £8 per session"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  disabled={formData.costType !== 'Paid'}
                  className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-70`}
                />
                {errors.price && <p className={errorClass}>{errors.price}</p>}
              </div>
            </div>

            {/* Response methods */}
            <div className="space-y-4">
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
                  const selected = formData.responseMethods.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChange('responseMethods', [option.value])}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? 'border-white bg-[#F5F1EB] text-[#0B544E] shadow-sm'
                          : 'border-white/30 bg-transparent text-white hover:border-white/60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-[#0B544E]' : 'border-white/60'
                          }`}
                        >
                          {selected && <div className="h-2 w-2 rounded-full bg-[#0B544E]" />}
                        </div>
                        <div>
                          <p
                            className={`text-base font-semibold ${
                              selected ? 'text-[#0B544E]' : 'text-white'
                            }`}
                          >
                            {option.label}
                          </p>
                          <p
                            className={`mt-1 text-sm leading-normal ${
                              selected ? 'text-[#0B544E]/70' : 'text-white/70'
                            }`}
                          >
                            {option.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.responseMethods && (
                <p className={errorClass}>{errors.responseMethods}</p>
              )}
            </div>

            {/* Upload Image */}
            <div>
              <label className="relative block h-48 cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-white/30 bg-transparent p-6 text-center hover:bg-white/10">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Uploaded preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="relative z-10 flex h-full items-center justify-center">
                      <span className="rounded-md bg-[#F5F1EB] px-4 py-2 text-base font-medium text-[#0B544E]">
                        Click to change image
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="mx-auto mb-2 h-8 w-8 text-white/80" />
                    <p className="text-lg font-medium text-white">Upload Image</p>
                    <p className="mt-1 text-sm text-white/70">JPEG files accepted. Max 100MB</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleChange('image', e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              {errors.image && <p className={`mt-2 ${errorClass}`}>{errors.image}</p>}
            </div>
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-10 border-t border-white/15 bg-[#0F766E] px-5 py-4 sm:px-6">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="event-form"
              className="rounded-lg bg-[#F5F1EB] px-6 py-2.5 text-sm font-semibold text-[#0B544E] hover:bg-white disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Submitting...'
                : mode === 'edit'
                  ? 'Update Event'
                  : 'Submit For Approval'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
