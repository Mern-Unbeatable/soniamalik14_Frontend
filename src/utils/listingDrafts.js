import { DELETE, GET, POST, PUT } from '../services/httpMethods';
import { ENDPOINT } from '../services/httpEndpoint';

export const DRAFT_KIND = {
  SERVICE: 'SERVICE',
  EVENT: 'EVENT',
};

const isFile = (value) => typeof File !== 'undefined' && value instanceof File;

/** Form values that can be stored as JSON; picked files are uploaded separately. */
export const toDraftData = (form = {}) =>
  Object.fromEntries(Object.entries(form).filter(([, value]) => !isFile(value)));

export const getDraftErrorMessage = (error, fallback = 'Could not save the draft') =>
  error?.response?.data?.message || error?.message || fallback;

export async function fetchDrafts(kind) {
  const response = await GET(ENDPOINT.DRAFTS.LIST, { kind });
  return Array.isArray(response?.data?.data) ? response.data.data : [];
}

/**
 * Creates the draft, or updates it when draftId is given.
 * files: { image?: File, logo?: File }
 */
export async function saveDraft({ kind, draftId, title, data, files = {} }) {
  const payload = new FormData();
  payload.append('kind', kind);
  payload.append('title', title || '');
  payload.append('data', JSON.stringify(data || {}));
  Object.entries(files).forEach(([field, file]) => {
    if (isFile(file)) payload.append(field, file);
  });

  const response = draftId
    ? await PUT(ENDPOINT.DRAFTS.DETAIL(draftId), payload)
    : await POST(ENDPOINT.DRAFTS.LIST, payload);
  return response?.data?.data;
}

export async function deleteDraft(draftId) {
  await DELETE(ENDPOINT.DRAFTS.DETAIL(draftId));
}

export const formatDraftSavedAt = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
