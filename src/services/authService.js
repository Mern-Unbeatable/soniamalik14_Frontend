import { GET, POST, PUT } from './httpMethods';
import { ENDPOINT } from './httpEndpoint';
import { toast } from 'react-toastify';

/**
 * Common change password service function
 * @param {string} currentPassword - User's current password
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Confirmation of new password
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  // Validation
  if (!currentPassword || !currentPassword.trim()) {
    const msg = 'Current password is required';
    toast.error(msg);
    return { success: false, message: msg };
  }

  if (!newPassword || newPassword.length < 6) {
    const msg = 'New password must be at least 6 characters';
    toast.error(msg);
    return { success: false, message: msg };
  }

  if (newPassword !== confirmPassword) {
    const msg = 'New password and confirm password do not match';
    toast.error(msg);
    return { success: false, message: msg };
  }

  try {
    const payload = {
      currentPassword,
      newPassword,
    };

    const res = await POST(ENDPOINT.AUTH.CHANGE_PASSWORD, payload);
    const body = res?.data ?? res;
    const message = body?.message || 'Password changed successfully';
    toast.success(message);
    return { success: true, message };
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Failed to change password';
    toast.error(message);
    // eslint-disable-next-line no-console
    console.error('[authService][changePassword] error:', err);
    return { success: false, message };
  }
};

/**
 * Common update user profile service function
 * @param {string} userId - User ID
 * @param {Object} userData - User data to update (firstName, lastName, email, phone, address, etc.)
 * @returns {Promise<{success: boolean, message?: string, user?: Object}>}
 */
export const updateUserProfile = async (userId, userData) => {
  // Basic validation
  if (!userId) {
    const msg = 'User ID is required';
    toast.error(msg);
    return { success: false, message: msg };
  }

  // Handle both FormData and regular objects
  const isFormData = userData instanceof FormData;
  const isEmpty = isFormData ? false : (!userData || Object.keys(userData).length === 0);

  if (isEmpty) {
    const msg = 'No data to update';
    toast.error(msg);
    return { success: false, message: msg };
  }

  try {
    const res = await PUT(ENDPOINT.USER.UPDATE(userId), userData);
    const body = res?.data ?? res;
    const isSuccess = body?.success !== undefined ? Boolean(body.success) : true;
    const message = body?.message || (isSuccess ? 'Profile updated successfully' : 'Failed to update profile');

    if (!isSuccess) {
      toast.error(message);
      return { success: false, message };
    }

    // Extract user from nested structure: { success, message, data: { user, token } }
    const updatedUser = body?.data?.user || body?.user || body?.profile || body?.data?.profile || body?.data || body;
    toast.success(message);
    return { success: true, message, user: updatedUser };
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Failed to update profile';
    toast.error(message);
    // eslint-disable-next-line no-console
    console.error('[authService][updateUserProfile] error:', err);
    return { success: false, message };
  }
};

/**
 * Fetch user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, message?: string, user?: Object}>}
 */
export const getUserProfile = async (userId) => {
  if (!userId) {
    const msg = 'User ID is required';
    toast.error(msg);
    return { success: false, message: msg };
  }

  try {
    const res = await GET(ENDPOINT.USER.UPDATE(userId));
    const body = res?.data ?? res;
    const user = body?.user || body?.data || body;
    return { success: true, message: body?.message || 'Profile loaded successfully', user };
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Failed to load profile';
    toast.error(message);
    // eslint-disable-next-line no-console
    console.error('[authService][getUserProfile] error:', err);
    return { success: false, message };
  }
};

/**
 * Update user billing address
 * @param {string} userId - User ID
 * @param {Object} billingData - Billing address data
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const updateBillingAddress = async (userId, billingData) => {
  if (!userId) {
    const msg = 'User ID is required';
    toast.error(msg);
    return { success: false, message: msg };
  }

  if (!billingData || Object.keys(billingData).length === 0) {
    const msg = 'No billing address data provided';
    toast.error(msg);
    return { success: false, message: msg };
  }

  try {
    const res = await PUT(ENDPOINT.USER.BILLING_ADDRESS(userId), billingData);
    const body = res?.data ?? res;
    const message = body?.message || 'Billing address updated successfully';
    toast.success(message);
    return { success: true, message };
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || 'Failed to update billing address';
    toast.error(message);
    // eslint-disable-next-line no-console
    console.error('[authService][updateBillingAddress] error:', err);
    return { success: false, message };
  }
};

/**
 * Update user shipping address
 * @param {string} userId - User ID
 * @param {Object} shippingData - Shipping address data
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const updateShippingAddress = async (userId, shippingData) => {
  if (!userId) {
    const msg = 'User ID is required';
    toast.error(msg);
    return { success: false, message: msg };
  }

  if (!shippingData || Object.keys(shippingData).length === 0) {
    const msg = 'No shipping address data provided';
    toast.error(msg);
    return { success: false, message: msg };
  }

  try {
    const res = await PUT(ENDPOINT.USER.SHIPPING_ADDRESS(userId), shippingData);
    const body = res?.data ?? res;
    const message = body?.message || 'Shipping address updated successfully';
    toast.success(message);
    return { success: true, message };
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || 'Failed to update shipping address';
    toast.error(message);
    // eslint-disable-next-line no-console
    console.error('[authService][updateShippingAddress] error:', err);
    return { success: false, message };
  }
};
