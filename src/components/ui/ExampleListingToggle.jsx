import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { PATCH } from '../../services/httpMethods';
import { ENDPOINT } from '../../services/httpEndpoint';

/**
 * Admin: marks a listing as an "Example listing" so visitors can open it
 * from the public cards without logging in.
 */
const ExampleListingToggle = ({ entityType = 'service', entityId, isExample = false, onChange, className = '' }) => {
  const [saving, setSaving] = useState(false);

  if (!entityId) return null;

  const endpoints = entityType === 'event' ? ENDPOINT.EVENTS : ENDPOINT.SERVICES;

  const handleToggle = async () => {
    const next = !isExample;
    setSaving(true);
    try {
      const response = await PATCH(endpoints.SET_EXAMPLE(entityId), { isExample: next });
      const payload = response?.data || response;
      toast.success(payload?.message || (next ? 'Marked as example listing' : 'No longer an example listing'));
      onChange?.(next);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update example listing');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between md:p-5 ${className}`}
    >
      <div className="flex gap-3">
        <Eye className="mt-0.5 h-5 w-5 shrink-0 text-[#0F766E]" />
        <div>
          <p className="text-base font-semibold text-gray-900">Example listing</p>
          <p className="text-sm text-gray-600">
            Visitors can open example listings from the public pages without logging in. All other listings still
            need login.
          </p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isExample}
        aria-label="Example listing"
        onClick={handleToggle}
        disabled={saving}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center self-end rounded-full transition-colors disabled:opacity-60 sm:self-auto ${
          isExample ? 'bg-[#0F766E]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
            isExample ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default ExampleListingToggle;
