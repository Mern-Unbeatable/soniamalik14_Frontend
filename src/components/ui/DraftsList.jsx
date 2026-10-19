import React, { useEffect, useState } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { deleteDraft, fetchDrafts, formatDraftSavedAt, getDraftErrorMessage } from '../../utils/listingDrafts';

/**
 * Unfinished forms saved with "Save as draft". Renders nothing when there are none.
 * Bump `refreshKey` to reload after a draft is saved or submitted.
 */
const DraftsList = ({ kind, onContinue, refreshKey = 0, untitledLabel = 'Untitled draft' }) => {
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchDrafts(kind)
      .then((list) => {
        if (!cancelled) setDrafts(list);
      })
      .catch(() => {
        if (!cancelled) setDrafts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [kind, refreshKey]);

  const handleDelete = async (draft) => {
    const result = await Swal.fire({
      title: 'Delete this draft?',
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#117b73',
      confirmButtonText: 'Delete',
    });
    if (!result.isConfirmed) return;

    try {
      await deleteDraft(draft.id);
      setDrafts((prev) => prev.filter((item) => item.id !== draft.id));
      toast.success('Draft deleted');
    } catch (error) {
      toast.error(getDraftErrorMessage(error, 'Could not delete the draft'));
    }
  };

  if (drafts.length === 0) return null;

  return (
    <section className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <h2 className="mb-1 text-lg font-semibold text-gray-900">Drafts</h2>
      <p className="mb-3 text-sm text-gray-600">
        Drafts are only visible to you. Continue a draft to finish it and submit it for approval.
      </p>
      <ul className="divide-y divide-amber-200">
        {drafts.map((draft) => (
          <li key={draft.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">{draft.title || untitledLabel}</p>
                <p className="text-xs text-gray-500">Last saved {formatDraftSavedAt(draft.updatedAt)}</p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => onContinue?.(draft)}
                className="rounded-md bg-btn-primary px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => handleDelete(draft)}
                aria-label="Delete draft"
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-600 hover:bg-gray-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DraftsList;
