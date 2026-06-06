import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Camera, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../../../../services/authService';
import ChangePassword from './ChangePassword';

const AccountDetails = () => {
  const { user, fetchMe } = useAuth();
  const fileInputRef = useRef(null);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    postcode: '',
    address: '',
    region: '',
    city: '',
    avatar: '',
  });
  const hydratedUserIdRef = useRef(null);

  const normalizeProfile = (profile) => {
    const normalized = {
      firstName:
        profile?.firstName ||
        profile?.givenName ||
        profile?.first_name ||
        profile?.name?.split(' ')?.[0] ||
        profile?.fullName?.split(' ')?.[0] ||
        '',
      lastName:
        profile?.lastName ||
        profile?.familyName ||
        profile?.last_name ||
        profile?.name?.split(' ')?.slice(1).join(' ') ||
        profile?.fullName?.split(' ')?.slice(1).join(' ') ||
        '',
      email: profile?.email || profile?.emailAddress || '',
      phone: profile?.phone || profile?.phoneNumber || profile?.mobile || '',
      postcode: profile?.postcode || profile?.zip || profile?.postalCode || '',
      address:
        profile?.address ||
        profile?.streetAddress ||
        profile?.addressLine1 ||
        profile?.addressLine2 ||
        '',
      region: profile?.region || profile?.state || profile?.province || '',
      city: profile?.city || profile?.town || '',
      avatar: profile?.avatar || profile?.image || profile?.profileImage || '',
    };
    console.log('normalizeProfile result:', normalized);
    return normalized;
  };

  const resolveUserId = (profile) =>
    profile?.id || profile?._id || profile?.userId || profile?.user_id || profile?.data?.id || profile?.data?._id || profile?.data?.userId || null;

  const userId = useMemo(() => resolveUserId(user), [user]);

  const resolvedProfile = useMemo(() => user?.data?.user || user?.profile || user?.data || user || null, [user]);

  const mergeProfile = useCallback((current, next) => {
    const normalizedNext = normalizeProfile(next);

    return {
      firstName: normalizedNext.firstName || current.firstName,
      lastName: normalizedNext.lastName || current.lastName,
      email: normalizedNext.email || current.email,
      phone: normalizedNext.phone || current.phone,
      postcode: normalizedNext.postcode || current.postcode,
      address: normalizedNext.address || current.address,
      region: normalizedNext.region || current.region,
      city: normalizedNext.city || current.city,
      avatar: normalizedNext.avatar || current.avatar,
    };
  }, []);

  useEffect(() => {
    if (!resolvedProfile) {
      return;
    }

    console.log('resolvedProfile:', resolvedProfile);
    setFormData((current) => mergeProfile(current, resolvedProfile));
  }, [resolvedProfile, mergeProfile]);

  useEffect(() => {
    // Update profileImage whenever formData.avatar changes
    if (formData.avatar) {
      console.log('✅ profileImage updated with avatar:', formData.avatar);
      setProfileImage(formData.avatar);
    }
  }, [formData.avatar]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId || hydratedUserIdRef.current === userId) {
        return;
      }

      setLoadingProfile(true);
      try {
        const response = await getUserProfile(userId);
        console.log('getUserProfile response:', response);
        
        // Extract the actual user object from the response wrapper
        const profile = response?.user || response?.data || response;
        console.log('selected profile:', profile);

        if (profile) {
          console.log('profile.avatar:', profile?.avatar);
          setFormData((current) => mergeProfile(current, profile));
          if (profile?.avatar) {
  setProfileImage(profile.avatar);
}
        }

        hydratedUserIdRef.current = userId;
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [userId, resolvedProfile, mergeProfile]);

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result;
      setProfileImage(imageDataUrl);
      // Update formData.avatar with the data URL
      setFormData((prev) => ({ ...prev, avatar: imageDataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    hydratedUserIdRef.current = userId || hydratedUserIdRef.current;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error('User id not found');
      return;
    }

    setSavingProfile(true);
    try {
      // Build payload with only non-empty values
      const payload = {};
      
      const firstName = formData.firstName?.trim();
      const lastName = formData.lastName?.trim();
      const email = formData.email?.trim();
      const phone = formData.phone?.trim();
      const postcode = formData.postcode?.trim();
      const address = formData.address?.trim();
      const region = formData.region?.trim();
      const city = formData.city?.trim();

      // Only add fields that have values
      if (firstName) payload.firstName = firstName;
      if (lastName) payload.lastName = lastName;
      if (email) payload.email = email;
      if (phone) payload.phone = phone;
      if (postcode) payload.postcode = postcode;
      if (address) payload.address = address;
      if (region) payload.region = region;
      if (city) payload.city = city;

      // Add full name if either first or last name exists
      if (firstName || lastName) {
        payload.name = [firstName, lastName].filter(Boolean).join(' ').trim();
      }

      // Add avatar if file exists
      if (imageFile) {
        const formDataPayload = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          formDataPayload.append(key, value);
        });
        formDataPayload.append('avatar', imageFile);
        
        console.log('Uploading FormData with avatar:', imageFile.name);

        const result = await updateUserProfile(userId, formDataPayload);
        if (result?.success) {
          // Extract the new avatar URL from the response
          const updatedUser = result?.user;
          const newAvatarUrl = updatedUser?.avatar || updatedUser?.image || updatedUser?.profileImage;
          
          if (newAvatarUrl) {
            console.log('Avatar uploaded successfully:', newAvatarUrl);
            setFormData((prev) => ({ ...prev, avatar: newAvatarUrl }));
            setProfileImage(newAvatarUrl);
          }
          
          setImageFile(null);
          await fetchMe();
        }
      } else {
        // Send JSON payload if no image
        const result = await updateUserProfile(userId, payload);
        if (result?.success) {
          await fetchMe();
        }
      }
    } finally {
      setSavingProfile(false);
    }
  };

  

  return (
    <div className="dashboardPy dashboardSpaceY">
      {/* ACCOUNT SETTING SECTION */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider">Account Setting</h2>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-8">
          {/* Profile Picture */}
          <div className="relative w-40 h-40 shrink-0">
            <img
              src={profileImage }
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
            <button
              type="button"
              onClick={handleProfilePictureClick}
              className="absolute bottom-2 right-2 bg-white border border-gray-200 p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Form Fields */}
          <form className="grow grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleProfileSubmit}>
            <div className="space-y-1">
              <label className="text-base text-gray-700">First name</label>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleProfileChange}
                className="w-full p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-600 text-gray-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-base text-gray-700">Last name</label>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleProfileChange}
                className="w-full p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-600 text-gray-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-base text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleProfileChange}
                className="w-full p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-600 text-gray-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-base text-gray-700">Phone Number</label>
              <input
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleProfileChange}
                className="w-full p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-600 text-gray-600"
              />
            </div>

            {/* Location Selects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
              <div className="space-y-1">
                <label className="text-base text-gray-700">Region/State</label>
                <div className="relative">
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleProfileChange}
                    className="w-full appearance-none p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-600 text-gray-600 bg-white"
                  >
                    <option value="">Select region</option>
                    <option>Albama</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-base text-gray-700">City</label>
                <div className="relative">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleProfileChange}
                    className="w-full appearance-none p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-600 text-gray-700 font-bold bg-white"
                  >
                    <option value="">Select city</option>
                    <option>Montgomery</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-base text-gray-700">Postcode</label>
                <input
                  name="postcode"
                  type="text"
                  value={formData.postcode}
                  onChange={handleProfileChange}
                  className="w-full p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-600 text-gray-700 font-bold"
                />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-base text-gray-700">Address</label>
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleProfileChange}
                className="w-full p-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-600 text-gray-600"
              />
            </div>

            <div className="pt-4 md:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={savingProfile || loadingProfile}
                className="bg-[#147A73] text-white px-6 py-2.5 rounded-sm font-bold text-sm uppercase hover:bg-[#0d5e58] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ChangePassword />
    </div>
  );
};

export default AccountDetails;