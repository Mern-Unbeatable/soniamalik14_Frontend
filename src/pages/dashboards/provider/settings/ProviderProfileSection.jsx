import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiCamera } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Button from '../../../../components/ui/Button';
import { updateUserProfile } from '../../../../services/authService';
import { hydrateAuth } from '../../../../features/auth/authSlice';
import {
  handleImageLoadError,
  pickImageSource,
  resolveImageUrl,
} from '../../../../utils/resolveImageUrl';

const PROFILE_PLACEHOLDER = '/discover-placeholder.png';

const joiningAsOptions = [
  'Physiotherapy',
  'Nutrition',
  'Personal Training',
  'Sports Massage',
  'Mental Health & Wellbeing',
  'Coaching',
  'Other',
];

const resolveUserId = (user) => user?.id || user?._id || user?.userId || null;

const normalizeProfileFromUser = (user, fallbackProfile = {}) => ({
  organizationName:
    user?.organizationName ||
    user?.organisationName ||
    user?.clubName ||
    user?.organization ||
    user?.providerBusinessName ||
    user?.businessName ||
    fallbackProfile?.organizationName ||
    '',
  bio: user?.bio || user?.aboutOrganization || fallbackProfile?.bio || '',
  postcode: user?.postcode || user?.postCode || user?.postalCode || user?.zip || fallbackProfile?.postcode || '',
  sessionType: user?.sessionType || fallbackProfile?.sessionType || 'women',
  sportsOffered: Array.isArray(user?.sportsOffered) && user.sportsOffered.length > 0 ? user.sportsOffered : (fallbackProfile?.sportsOffered || []),
  serviceTypes: Array.isArray(user?.serviceTypes) && user.serviceTypes.length > 0 ? user.serviceTypes : (fallbackProfile?.serviceTypes || []),
  fullName: user?.fullName || user?.name || fallbackProfile?.fullName || '',
  email: user?.email || fallbackProfile?.email || '',
  phone: user?.phone || fallbackProfile?.phone || '',
});

const getUserImage = (user) =>
  pickImageSource(user?.avatar, user?.image, user?.profileImage, user?.photo) || '';

const ProviderProfileSection = ({ user, fetchMe }) => {
  const dispatch = useDispatch();
  console.log('ProviderProfileSection user data prop:', user);
  const [profile, setProfile] = useState(() => normalizeProfileFromUser(user));
  console.log('ProviderProfileSection initial profile state:', profile);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(() => getUserImage(user));
  const [savingProfile, setSavingProfile] = useState(false);

  const selectedSports = useMemo(
    () =>
      Array.isArray(profile.sportsOffered)
        ? profile.sportsOffered
        : String(profile.sportsOffered || '')
            .split(',')
            .filter(Boolean),
    [profile.sportsOffered]
  );

  const selectedServiceTypes = useMemo(
    () =>
      Array.isArray(profile.serviceTypes)
        ? profile.serviceTypes
        : String(profile.serviceTypes || '')
            .split(',')
            .filter(Boolean),
    [profile.serviceTypes]
  );

  const displayImageSrc = resolveImageUrl(imagePreview, PROFILE_PLACEHOLDER);

  const inputClass =
    'form-field text-base rounded-lg';

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(getUserImage(user));
    }
  };

  const toggleServiceType = (service) => {
    setProfile((prev) => {
      const existing = Array.isArray(prev.serviceTypes) ? prev.serviceTypes : [];
      const next = existing.includes(service)
        ? existing.filter((s) => s !== service)
        : [...existing, service];
      return { ...prev, serviceTypes: next };
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const userId = resolveUserId(user);

    if (!userId) {
      toast.error('User id not found');
      return;
    }

    setSavingProfile(true);
    try {
      const payload = {
        name: profile.fullName,
        fullName: profile.fullName,
        organizationName: profile.organizationName,
        organisationName: profile.organizationName,
        providerBusinessName: profile.organizationName,
        organization: profile.organizationName,
        clubName: profile.organizationName,
        bio: profile.bio,
        aboutOrganization: profile.bio,
        postcode: profile.postcode,
        postCode: profile.postcode,
        postalCode: profile.postcode,
        zip: profile.postcode,
        sessionType: profile.sessionType,
        sportsOffered: selectedSports,
        serviceTypes: selectedServiceTypes,
        email: profile.email,
        phone: profile.phone,
      };

      console.log('Submitting profile update with payload:', payload);

      let result;
      if (imageFile) {
        const form = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          const finalValue = Array.isArray(value) ? JSON.stringify(value) : (value ?? '');
          form.append(key, finalValue);
        });
        form.append('avatar', imageFile);
        result = await updateUserProfile(userId, form);
      } else {
        result = await updateUserProfile(userId, payload);
      }

      console.log('Profile update result:', result);

      if (result?.success) {
        if (result?.user) {
          dispatch(hydrateAuth({ user: result.user }));
          setProfile(normalizeProfileFromUser(result.user));
        }
        if (fetchMe) {
          await fetchMe();
        }
      }
    } finally {
      setSavingProfile(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imageFile) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview, imageFile]);

  useEffect(() => {
    setProfile((prev) => normalizeProfileFromUser(user, prev));
    setImagePreview(getUserImage(user));
    setImageFile(null);
  }, [user]);

  return (
    <section className="rounded-lg border border-[#D4E3E2] bg-white">
      <form className="space-y-8 p-6" onSubmit={handleProfileSubmit}>
        <div className="space-y-5">
          {/* Profile Image with Camera Overlay */}
          <div className="relative mb-8 h-30 w-30">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100">
              <img
                src={displayImageSrc}
                alt="Profile"
                className="h-full w-full object-cover"
                onError={(e) => handleImageLoadError(e, PROFILE_PLACEHOLDER)}
              />
            </div>
            <label
              htmlFor="imgInput"
              className="absolute right-1 bottom-1 cursor-pointer rounded-full border border-gray-200 bg-white p-1.5 shadow-md transition-all hover:bg-gray-50"
            >
              <FiCamera size={14} className="text-gray-600" />
              <input
                type="file"
                id="imgInput"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <div>
            <label className="mb-2 block text-base font-medium text-[#1D1D1D]">
              Organization or Coach Name
            </label>
            <input
              name="organizationName"
              value={profile.organizationName}
              onChange={handleProfileChange}
              className={inputClass}
              placeholder="Woking Warriors FC"
            />
          </div>

          <div>
            <label className="mb-2 block text-base font-medium text-[#1D1D1D]">
              About your organisation
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleProfileChange}
              className={`${inputClass} min-h-40`}
              placeholder="Write about bio"
            />
          </div>

          <div>
            <p className="mb-2 text-base font-medium text-[#1D1D1D]">I'm joining as</p>
            <div className="flex flex-wrap gap-2">
              {joiningAsOptions.map((option) => (
                <label
                  key={option}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#B7D8D5] px-3 py-2 text-sm text-[#1D1D1D]"
                >
                  <input
                    type="checkbox"
                    checked={selectedServiceTypes.includes(option)}
                    onChange={() => toggleServiceType(option)}
                    className="h-3.5 w-3.5"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-base font-medium text-[#1D1D1D]">Postcode</label>
            <input
              name="postcode"
              value={profile.postcode}
              onChange={handleProfileChange}
              className={inputClass}
              placeholder="SW1"
            />
          </div>

       
        </div>

        <div className="space-y-5 pt-6">
          <div>
            <label className="mb-2 block text-base font-medium text-[#1D1D1D]">Full Name</label>
            <input
              name="fullName"
              value={profile.fullName}
              onChange={handleProfileChange}
              className={inputClass}
              placeholder="Enter Your Full Name"
            />
          </div>

          <div>
            <label className="mb-2 block text-base font-medium text-[#1D1D1D]">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className={inputClass}
              placeholder="Write your email"
            />
          </div>

          <div>
            <label className="mb-2 block text-base font-medium text-[#1D1D1D]">Phone Number</label>
            <input
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              className={inputClass}
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="rounded-lg" type="submit" variant="primary" disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ProviderProfileSection;
