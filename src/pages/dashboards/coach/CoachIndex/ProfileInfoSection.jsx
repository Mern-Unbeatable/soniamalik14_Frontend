import React, { useState } from 'react';
import { FiCamera, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../context/AuthContext';
import { updateUserProfile } from '../../../../services/authService';

const sportsOptions = [
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
  'Other',
];

const resolveUserId = (user) => {
  if (!user || typeof user !== 'object') return null;
  return user.id || user._id || user.userId || user.uuid || null;
};

const normalizeSessionType = (value) => {
  const raw = (value || '').toString().trim().toLowerCase();
  if (raw === 'women only' || raw === 'women') return 'women';
  if (raw === 'mixed') return 'mixed';
  return 'women';
};

const formatSessionTypeForApi = (value) => (value === 'mixed' ? 'Mixed' : 'Women Only');

const normalizeProfileFromUser = (user) => ({
  clubName: user?.organizationName || user?.clubName || user?.organization || user?.name || '',
  bio: user?.bio || user?.aboutOrganization || user?.about || '',
  address: user?.address || '',
  postcode: user?.postcode || user?.postCode || user?.postalCode || user?.zip || '',
  sessionType: normalizeSessionType(user?.sessionType),
  sports: user?.sportsOffered || user?.sports || [],
  fullName: user?.firstName || user?.fullName || user?.displayName || user?.name || '',
  email: user?.email || '',
  phone: user?.phone || user?.phoneNumber || '',
});

const ProfileInfoSection = () => {
  const { user, fetchMe } = useAuth();
//   console.log('ProfileInfoSection user data:', user);
  const userId = resolveUserId(user);

  const [profile, setProfile] = useState(() => normalizeProfileFromUser(user));
  console.log('ProfileInfoSection initial profile state:', profile);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [imagePreview, setImagePreview] = useState(user?.avatar || '');

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const toggleSport = (sport) => {
    setProfile((prev) => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter((s) => s !== sport)
        : [...prev.sports, sport],
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error('User ID not found. Please login again.');
      return;
    }

    const payload = {
      name: profile.clubName,
      organizationName: profile.clubName,
      bio: profile.bio,
      aboutOrganization: profile.bio,
      address: profile.address,
      postcode: profile.postcode,
      postCode: profile.postcode,
      postalCode: profile.postcode,
      zip: profile.postcode,
      sessionType: formatSessionTypeForApi(profile.sessionType),
      sportsOffered: profile.sports,
      firstName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
    };

    let requestBody = payload;

    if (avatarFile) {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value ?? '');
        }
      });
      requestBody = formData;
    }

    setIsSaving(true);
    try {
      const result = await updateUserProfile(userId, requestBody);
      console.log('updateUserProfile result:', result);

      if (!result?.success) {
        return;
      }

      const updatedUser = result?.user || {};
      console.log('updateUserProfile updatedUser:', updatedUser);
      const nextProfile = normalizeProfileFromUser(updatedUser);
      setProfile((prev) => ({
        ...prev,
        ...nextProfile,
      }));

      const updatedAvatar = updatedUser?.avatar || updatedUser?.profileImage || updatedUser?.photo;
      if (updatedAvatar) {
        setImagePreview(updatedAvatar);
      }

      setAvatarFile(null);
      await fetchMe();
    } finally {
      setIsSaving(false);
    }
  };

  // Styling constant image er moto
  const inputClass =
    'form-field text-base';
  const labelClass = 'mb-2 block text-base font-medium text-[#1D1D1D]';

  return (
    <section className="rounded-lg bg-white shadow-sm">
      <form className="space-y-6 p-6">
        <div className="relative mb-8 h-30 w-30">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <FiUser className="h-12 w-12 text-gray-400" />
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
              onChange={handleImageSelect}
            />
          </label>
        </div>

        {/* Organization Name */}
        <div>
          <label className={labelClass}>Organization or Coach Name</label>
          <input
            name="clubName"
            value={profile.clubName}
            onChange={handleProfileChange}
            className={inputClass}
            placeholder="Woking Warriors FC"
          />
        </div>

        {/* Bio Section */}
        <div>
          <label className={labelClass}>About your organisation</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleProfileChange}
            className={`${inputClass} min-h-37.5 resize-none`}
            placeholder="Write about club"
          />
        </div>

        {/* Session Type - Checkbox Style like Image */}
        <div>
          <p className={labelClass}>Session Type</p>
          <div className="flex gap-4">
            {['women', 'mixed'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setProfile({ ...profile, sessionType: type })}
                className="flex items-center gap-2 rounded-md bg-[#D1E7E5] px-3 py-1.5 text-sm font-semibold text-[#0F766E]"
              >
                <input
                  type="checkbox"
                  checked={profile.sessionType === type}
                  readOnly
                  className="h-4 w-4 accent-[#0F766E]"
                />
                {type === 'women' ? 'Women Only' : 'Mixed'}
              </button>
            ))}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className={labelClass}>Address</label>
          <input
            name="address"
            value={profile.address}
            onChange={handleProfileChange}
            className={inputClass}
            placeholder="Enter your address"
          />
        </div>

        {/* Postcode */}
        <div>
          <label className={labelClass}>Postcode</label>
          <input
            name="postcode"
            value={profile.postcode}
            onChange={handleProfileChange}
            className={inputClass}
            placeholder="SW1"
          />
        </div>

        {/* Sport Grid - Small Badge Style */}
        <div>
          <p className={labelClass}>Sport</p>
          <div className="flex flex-wrap gap-3">
            {sportsOptions.map((sport) => (
              <button
                key={sport}
                type="button"
                onClick={() => toggleSport(sport)}
                className="flex items-center gap-2 rounded-md border border-transparent bg-[#D1E7E5] px-3 py-1.5 text-sm font-semibold text-[#0F766E]"
              >
                <input
                  type="checkbox"
                  checked={profile.sports.includes(sport)}
                  readOnly
                  className="h-4 w-4 accent-[#0F766E]"
                />
                {sport}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Contact Section */}
        <div className="pt-4">
          <h3 className="mb-6 text-xl font-bold text-[#1D1D1D]">Primary Contact</h3>

          <div className="space-y-6">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                name="fullName"
                value={profile.fullName}
                onChange={handleProfileChange}
                className={inputClass}
                placeholder="Enter Your Full Name"
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                name="email"
                value={profile.email}
                disabled
                className="form-field-readonly text-base"
                placeholder="Write your email"
              />
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                className={inputClass}
                placeholder="enter your phone number"
              />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="pt-4">
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="rounded-md bg-[#0F766E] px-8 py-2.5 font-semibold text-white transition-colors hover:bg-[#0d635d]"
          >
            {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProfileInfoSection;
