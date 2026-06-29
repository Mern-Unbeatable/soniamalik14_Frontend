import React, { useEffect, useMemo, useState } from 'react';
import { FiCamera, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Button from '../../../../components/ui/Button';
import { updateUserProfile } from '../../../../services/authService';


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

const normalizeProfileFromUser = (user) => ({
  organizationName: user?.organizationName || '',
  bio: user?.bio || user?.aboutOrganization || '',
  postcode: user?.postcode || user?.postCode || user?.postalCode || user?.zip || '',
  sessionType: user?.sessionType || 'women',
  sportsOffered: Array.isArray(user?.sportsOffered) ? user?.sportsOffered : [],
  serviceTypes: Array.isArray(user?.serviceTypes) ? user?.serviceTypes : [],
  fullName: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
});

const ProviderProfileSection = ({ user, fetchMe }) => {
  console.log('ProviderProfileSection user data prop:', user);
  const [profile, setProfile] = useState(() => normalizeProfileFromUser(user));
  console.log('ProviderProfileSection initial profile state:', profile);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.avatar || user?.image || '');
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

  const inputClass =
    'w-full rounded-lg border border-[#D4E3E2] bg-white px-4 py-3 text-base text-[#1D1D1D] outline-none focus:border-[#0F766E]';

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
      setImagePreview(user?.avatar || user?.image || '');
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
        organizationName: profile.organizationName,
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

      if (result?.success) {
        await fetchMe();
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
    setProfile(normalizeProfileFromUser(user));
    setImagePreview(user?.avatar || user?.image || '');
  }, [user]);

  return (
    <section className="rounded-lg border border-[#D4E3E2] bg-white">
      <form className="space-y-8 p-6" onSubmit={handleProfileSubmit}>
        <div className="space-y-5">
          {/* Profile Image with Camera Overlay */}
          <div className="relative mb-8 h-30 w-30">
            <div className="h-full w-full overflow-hidden rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiUser className="w-12 h-12 text-gray-400" />
              )}
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
