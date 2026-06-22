import React, { useState, useEffect, useMemo } from 'react';
import { X, Upload } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Button from './Button';
import { useEvent } from '../../context/EventContext';
import { toast } from 'react-toastify';
import { createOrganizerEvent, updateOrganizerEvent } from '../../features/events/eventsAPI';
import { selectAuthUser } from '../../features/auth/authSlice';
import {
  selectCreateOrganizerEventLoading,
  selectUpdateOrganizerEventLoading,
} from '../../features/events/eventsSlice';

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

const EventModal = ({
  isOpen,
  onClose,
  initialData = null,
  mode = 'create',
  useOrganizerApi = false,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const { createEvent, updateEvent, createLoading, updateLoading } = useEvent();
  const authUser = useSelector(selectAuthUser);
  const createOrganizerLoading = useSelector(selectCreateOrganizerEventLoading);
  const updateOrganizerLoading = useSelector(selectUpdateOrganizerEventLoading);
  const [formData, setFormData] = useState({
    eventTitle: '',
    sportType: '',
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
      });
    } else if (mode === 'create') {
      // Reset form for create mode
      setFormData({
        eventTitle: '',
        sportType: '',
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
      if (val === null || (typeof val === 'string' && val.trim() === '')) {
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

    // Debug: Log FormData entries
    console.log('Submitting event with data:', Object.fromEntries(payload.entries()));

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
    } else if (useOrganizerApi && mode === 'create') {
      const action = await dispatch(createOrganizerEvent(payload));
      isSuccess = createOrganizerEvent.fulfilled.match(action);
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#DCE7E6] bg-white shadow-2xl">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E3EBEA] bg-white px-5 py-4 sm:px-6">
          <h2 className="text-2xl font-semibold text-[#1D1D1D]">
            {mode === 'edit' ? 'Edit Event' : 'Add Event '}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-[#D9D9D9] p-1 text-[#000000] transition-colors hover:bg-[#CFCFCF]"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFB] p-4 sm:p-6">
          <form id="event-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Event Title & Sport Type */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-base font-medium text-gray-700">
                  Event Title
                </label>
                <input
                  type="text"
                  placeholder="enter event title"
                  value={formData.eventTitle}
                  onChange={(e) => handleChange('eventTitle', e.target.value)}
                  className="focus:ring-btn-primary w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
                />
                {errors.eventTitle && (
                  <p className="mt-1 text-base text-red-600">{errors.eventTitle}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-base font-medium text-gray-700">Sport</label>
                <input
                  type="text"
                  placeholder="e.g. Football, Cricket, Netball"
                  value={formData.sportType}
                  onChange={(e) => handleChange('sportType', e.target.value)}
                  className="focus:ring-btn-primary w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
                />
                {errors.sportType && (
                  <p className="mt-1 text-base text-red-600">{errors.sportType}</p>
                )}
              </div>
            </div>

            {/* Event Type */}
            <div>
              <label className="mb-1 block text-base font-medium text-gray-700">Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => handleChange('eventType', e.target.value)}
                className="focus:ring-btn-primary w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
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
              {errors.eventType && (
                <p className="mt-1 text-base text-red-600">{errors.eventType}</p>
              )}
            </div>

            {/* Event Description */}
            <div>
              <label className="mb-1 block text-base font-medium text-gray-700">
                Event Description
              </label>
              <textarea
                placeholder="Tell people what to expect, who it’s for and what to bring"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="focus:ring-btn-primary w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
              />
              {errors.description && (
                <p className="mt-1 text-base text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Start Date & End Date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-base font-medium text-gray-700">Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="focus:ring-btn-primary w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-base text-red-600">{errors.startDate}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-base font-medium text-gray-700">End Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="focus:ring-btn-primary w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-base text-red-600">{errors.endDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Start Time & End Time */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-base font-medium text-gray-700">Start Time</label>
                <div className="relative">
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleChange('startTime', e.target.value)}
                    className="focus:ring-btn-primary w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
                  />
                  {errors.startTime && (
                    <p className="mt-1 text-base text-red-600">{errors.startTime}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-base font-medium text-gray-700">End Time</label>
                <div className="relative">
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleChange('endTime', e.target.value)}
                    className="focus:ring-btn-primary w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
                  />
                  {errors.endTime && (
                    <p className="mt-1 text-base text-red-600">{errors.endTime}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Venue Name & City */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-base font-medium text-gray-700">Venue Name</label>
                <input
                  type="text"
                  placeholder="e.g. Clapham Leisure Centre"
                  value={formData.venueName}
                  onChange={(e) => handleChange('venueName', e.target.value)}
                  className="focus:ring-btn-primary w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
                />
                {errors.venueName && (
                  <p className="mt-1 text-base text-red-600">{errors.venueName}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-base font-medium text-gray-700">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="focus:ring-btn-primary w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
                />
                {errors.city && <p className="mt-1 text-base text-red-600">{errors.city}</p>}
              </div>
            </div>

            {/* Venue Address */}
            <div>
              <label className="mb-1 block text-base font-medium text-gray-700">
                Venue Address
              </label>
              <input
                type="text"
                placeholder="Enter full venue address"
                value={formData.fullAddress}
                onChange={(e) => handleChange('fullAddress', e.target.value)}
                className="focus:ring-btn-primary w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
              />
              {errors.fullAddress && (
                <p className="mt-1 text-base text-red-600">{errors.fullAddress}</p>
              )}
            </div>

            {/* Google Maps Link */}
            <div>
              <label className="mb-1 block text-base font-medium text-gray-700">
                Google Maps Link
              </label>
              <input
                type="text"
                placeholder="Paste Google Maps link"
                value={formData.googleMapLinks}
                onChange={(e) => handleChange('googleMapLinks', e.target.value)}
                className="focus:ring-btn-primary w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none"
              />
              {errors.googleMapLinks && (
                <p className="mt-1 text-base text-red-600">{errors.googleMapLinks}</p>
              )}
            </div>

            {/* Who it's suitable for */}
            <div>
              <label className="mb-2 block text-base font-medium text-gray-700">
                Who is this for?
              </label>
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
                        ? 'bg-[#0F766E] text-white'
                        : 'bg-[#A7C8C7] text-[#1F2B2A] hover:bg-[#97BCBA]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              {errors.skillLevel && (
                <p className="mt-1 text-base text-red-600">{errors.skillLevel}</p>
              )}
            </div>

            {/* Cost and Price */}
            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[auto_1fr]">
              <div>
                <label className="mb-2 block text-base font-medium text-gray-700">Pricing</label>
                <div className="flex gap-2">
                  {['Free', 'Paid'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange('costType', type)}
                      className={`rounded-sm px-5 py-2 text-base font-medium transition-colors ${
                        formData.costType === type
                          ? 'bg-[#0F766E] text-white'
                          : 'bg-[#A7C8C7] text-[#1F2B2A] hover:bg-[#97BCBA]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-base font-medium text-gray-700">Price</label>
                <input
                  type="text"
                  placeholder="e.g. £8 per session"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  disabled={formData.costType !== 'Paid'}
                  className="focus:ring-btn-primary w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                />
                {errors.price && <p className="mt-1 text-base text-red-600">{errors.price}</p>}
              </div>
            </div>

            {/* Response methods */}
            <div>
              <label className="mb-1 block text-base font-semibold text-gray-700">
                Choose the main action for this listing
              </label>
              <p className="mb-3 text-sm text-gray-500">
                Select the button that best matches what you want people to do next. They will still be able to contact you with a question separately.
              </p>
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
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selected
                          ? 'border-[#0F766E] bg-[#E7F1F1] text-gray-900 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gray-400">
                          {selected && <div className="h-2 w-2 rounded-full bg-[#0F766E]" />}
                        </div>
                        <div>
                          <p className="font-semibold text-base text-gray-900">{option.label}</p>
                          <p className="mt-1 text-sm text-gray-500 leading-normal">{option.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.responseMethods && (
                <p className="mt-1 text-base text-red-600">{errors.responseMethods}</p>
              )}
            </div>

            {/* Upload Image */}
            <div>
              <label className="relative block h-65 cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-gray-400 p-10 text-center hover:bg-gray-50">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
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
                    <p className="mt-1 text-base text-gray-500">JPEG files accepted. Max 100MB</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleChange('image', e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              {errors.image && <p className="mt-2 text-base text-red-600">{errors.image}</p>}
            </div>
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-10 border-t border-[#E3EBEA] bg-white px-5 py-4 sm:px-6">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#0F766E] px-5 py-2.5 text-sm font-medium text-[#0F766E] hover:bg-[#F0FAF9]"
            >
              Cancel
            </button>
            <Button
              type="submit"
              form="event-form"
              variant="primary"
              className="rounded-lg px-6 py-2.5 text-sm font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Submitting...'
                : mode === 'edit'
                  ? 'Update Event'
                  : 'Submit For Approval'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
