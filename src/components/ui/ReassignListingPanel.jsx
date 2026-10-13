import React, { useEffect, useState } from 'react';
import { ArrowRightLeft, Check, Copy, Search, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { GET, PATCH } from '../../services/httpMethods';
import { ENDPOINT } from '../../services/httpEndpoint';

const SEARCH_DEBOUNCE_MS = 300;

const providerLabel = (user) =>
  user?.organizationName || user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Unnamed';

const inviteLabel = (user) => {
  if (!user?.invitedAt) return '';
  return user?.termsAcceptedAt ? 'Joined via invite' : 'Invite pending';
};

/**
 * Admin: copy the listing's preview link and move the listing to another
 * provider account of the same type (sport provider ↔ sport provider, service ↔ service).
 */
const ReassignListingPanel = ({ listingId, listingType = 'sport', currentOwner, onReassigned, className = '' }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const previewUrl = listingId
    ? `${window.location.origin}/${listingType === 'service' ? 'services' : 'discover'}/${listingId}`
    : '';
  const providerType = listingType === 'service' ? 'service provider' : 'sport provider';

  useEffect(() => {
    if (!open || !listingId) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await GET(
          ENDPOINT.USERS.REASSIGN_CANDIDATES(listingId),
          search.trim() ? { search: search.trim() } : {},
          controller.signal
        );
        const payload = response?.data?.data || response?.data || {};
        setCandidates(Array.isArray(payload.candidates) ? payload.candidates : []);
      } catch (error) {
        if (error?.name === 'CanceledError' || error?.name === 'AbortError') return;
        toast.error(error?.response?.data?.message || 'Failed to load providers');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, search, listingId]);

  if (!listingId) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy the link');
    }
  };

  const closePicker = () => {
    setOpen(false);
    setSearch('');
    setSelectedId('');
  };

  const handleReassign = async () => {
    const target = candidates.find((user) => user.id === selectedId);
    if (!target) return;

    const result = await Swal.fire({
      title: 'Reassign this listing?',
      text: `The listing will move to ${providerLabel(target)} and their contact details will be used on it.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, reassign',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0F766E',
      cancelButtonColor: '#6b7280',
    });
    if (!result.isConfirmed) return;

    setSaving(true);
    try {
      const response = await PATCH(ENDPOINT.USERS.REASSIGN_LISTING(listingId), { providerId: target.id });
      toast.success(response?.data?.message || 'Listing reassigned');
      closePicker();
      onReassigned?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to reassign listing');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 md:p-5 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <ArrowRightLeft className="mt-0.5 h-5 w-5 shrink-0 text-[#0F766E]" />
          <div className="min-w-0">
            <p className="text-base font-semibold text-gray-900">Provider & preview</p>
            <p className="text-sm text-gray-600">
              Owned by{' '}
              <span className="font-medium text-gray-900">{currentOwner?.name || 'Unknown provider'}</span>
              {currentOwner?.email ? <span className="break-all"> ({currentOwner.email})</span> : null}
            </p>
          </div>
        </div>
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-btn-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Reassign to provider
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-lg bg-[#E7F1F1] p-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#117b73]">Preview link</p>
          <p className="truncate text-sm text-gray-800" title={previewUrl}>
            {previewUrl}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#117b73] bg-white px-3 py-1.5 text-sm font-medium text-[#117b73] transition-colors hover:bg-[#d5e8e7]"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Anyone with this link can view the listing, even before it is approved.
      </p>

      {open ? (
        <div className="mt-4 rounded-lg border border-gray-200 p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900">Choose the {providerType} account</p>
            <button
              type="button"
              onClick={closePicker}
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, organisation or email"
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20"
              autoFocus
            />
          </div>

          <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-100">
            {loading ? (
              <p className="p-3 text-sm text-gray-500">Loading providers...</p>
            ) : candidates.length === 0 ? (
              <p className="p-3 text-sm text-gray-500">No matching {providerType} accounts found.</p>
            ) : (
              candidates.map((user) => {
                const invite = inviteLabel(user);
                const selected = selectedId === user.id;
                return (
                  <label
                    key={user.id}
                    className={`flex cursor-pointer items-start gap-3 border-b border-gray-100 p-3 last:border-b-0 ${
                      selected ? 'bg-[#E7F1F1]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reassign-provider"
                      checked={selected}
                      onChange={() => setSelectedId(user.id)}
                      className="mt-1 accent-[#0F766E]"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-gray-900">{providerLabel(user)}</span>
                      <span className="block break-all text-xs text-gray-600">{user.email}</span>
                      {invite ? (
                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                            user.termsAcceptedAt ? 'bg-[#e6f2f1] text-[#117b73]' : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {invite}
                        </span>
                      ) : null}
                    </span>
                  </label>
                );
              })
            )}
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closePicker}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReassign}
              disabled={!selectedId || saving}
              className="rounded-lg bg-btn-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
            >
              {saving ? 'Reassigning…' : 'Reassign listing'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ReassignListingPanel;
