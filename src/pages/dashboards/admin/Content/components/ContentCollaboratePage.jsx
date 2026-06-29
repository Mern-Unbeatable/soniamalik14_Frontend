import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { GET, PATCH, POST } from '../../../../../services/httpMethods';
import { ENDPOINT } from '../../../../../services/httpEndpoint';
import { toast } from 'react-toastify';

const getSections = (response) => {
  const payload = response?.data || response;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.sections)) return payload.sections;
  return [];
};

const getLatestByPage = (sections, pageKey) => {
  return sections
    .filter((item) => item?.page === pageKey)
    .sort(
      (a, b) =>
        new Date(b?.updatedAt || b?.createdAt || 0).getTime() -
        new Date(a?.updatedAt || a?.createdAt || 0).getTime()
    )[0];
};

const buildPreview = (file, existing) => {
  if (file instanceof File) return URL.createObjectURL(file);
  return existing || '';
};

const toPlainText = (value = '') =>
  String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();

const ContentCollaboratePage = () => {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    sportsProviderDescription: '',
    supportDescription: '',
    brandDescription: '',
  });
  const [images, setImages] = useState({
    sportsProviderFile: null,
    supportFile: null,
    brandFile: null,
    sportsProviderPreview: '',
    supportPreview: '',
    brandPreview: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [collaborateSectionId, setCollaborateSectionId] = useState('');

  const sportsProviderRef = useRef(null);
  const supportRef = useRef(null);
  const brandRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await GET(ENDPOINT.HOMEPAGE.CONTENT);
        const allSections = response?.data?.data?.homepage?.sections || [];
        const latest = getLatestByPage(
          Array.isArray(allSections) ? allSections : getSections(response),
          'COLLABORATE'
        );
        if (latest) {
          setCollaborateSectionId(latest?.id || '');
          setForm({
            title: latest?.title || '',
            subtitle: latest?.subtitle || '',
            description: latest?.description || '',
            sportsProviderDescription: latest?.sportsProviderDescription || '',
            supportDescription: latest?.supportDescription || '',
            brandDescription: latest?.brandDescription || '',
          });
          setImages((prev) => ({
            ...prev,
            sportsProviderPreview: latest?.sportsProviderImg || '',
            supportPreview: latest?.supportImg || '',
            brandPreview: latest?.brandImg || '',
          }));
        }
      } catch (error) {
        console.error('Failed to load COLLABORATE section:', error);
        toast.error('Failed to load Collaborate content');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const sportsProviderPreview = useMemo(
    () => buildPreview(images.sportsProviderFile, images.sportsProviderPreview),
    [images.sportsProviderFile, images.sportsProviderPreview]
  );
  const supportPreview = useMemo(
    () => buildPreview(images.supportFile, images.supportPreview),
    [images.supportFile, images.supportPreview]
  );
  const brandPreview = useMemo(
    () => buildPreview(images.brandFile, images.brandPreview),
    [images.brandFile, images.brandPreview]
  );

  useEffect(() => {
    return () => {
      [sportsProviderPreview, supportPreview, brandPreview].forEach((url) => {
        if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [sportsProviderPreview, supportPreview, brandPreview]);

  const handleUpload = (key) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImages((prev) => ({ ...prev, [key]: file }));
  };

  const renderImageUploader = (title, preview, onPick, onRemove) => (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900 lg:text-3xl">{title}</h2>
      <div
        onClick={onPick}
        className="group relative mb-6 flex h-64 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl bg-[#f5f5f5] transition-colors hover:bg-[#eeeeee] md:h-80"
      >
        {preview ? (
          <>
            <img src={preview} alt={`${title} preview`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
            >
              <X className="h-5 w-5" />
            </button>
          </>
        ) : (
          <>
            <ImagePlus className="mb-3 h-10 w-10 text-[#0f766e]" />
            <span className="text-base font-medium text-gray-700">Upload image</span>
          </>
        )}
      </div>
    </div>
  );

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    const payload = new FormData();
    payload.append('page', 'COLLABORATE');
    payload.append('title', form.title.trim());
    payload.append('subtitle', toPlainText(form.subtitle));
    payload.append('description', toPlainText(form.description));
    payload.append('sportsProviderDescription', toPlainText(form.sportsProviderDescription));
    payload.append('supportDescription', toPlainText(form.supportDescription));
    payload.append('brandDescription', toPlainText(form.brandDescription));
    if (images.sportsProviderFile) payload.append('sportsProviderImg', images.sportsProviderFile);
    if (images.supportFile) payload.append('supportImg', images.supportFile);
    if (images.brandFile) payload.append('brandImg', images.brandFile);

    try {
      setSaving(true);
      if (collaborateSectionId) {
        await PATCH(ENDPOINT.HOMEPAGE.SECTION_DETAIL(collaborateSectionId), payload);
      } else {
        await POST(ENDPOINT.HOMEPAGE.SECTIONS, payload);
      }
      toast.success('Collaborate content saved');
    } catch (error) {
      console.error('Failed to save COLLABORATE section:', error);
      toast.error(error?.response?.data?.message || 'Failed to save Collaborate content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-xl bg-white p-6 text-sm text-gray-600">Loading content...</div>;
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      <input ref={sportsProviderRef} type="file" accept="image/*" hidden onChange={handleUpload('sportsProviderFile')} />
      <input ref={supportRef} type="file" accept="image/*" hidden onChange={handleUpload('supportFile')} />
      <input ref={brandRef} type="file" accept="image/*" hidden onChange={handleUpload('brandFile')} />

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 lg:text-3xl">Hero section</h2>
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-base font-medium text-gray-900">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-base font-medium text-gray-900">Subtitle</label>
            <textarea
              value={form.subtitle}
              onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-base font-medium text-gray-900">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
            />
          </div>
        </div>
      </div>

      {renderImageUploader(
        'Sport Provider section',
        sportsProviderPreview,
        () => sportsProviderRef.current?.click(),
        () => setImages((prev) => ({ ...prev, sportsProviderFile: null, sportsProviderPreview: '' }))
      )}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <label className="mb-2 block text-base font-medium text-gray-900">Sport Provider Description</label>
        <textarea
          value={form.sportsProviderDescription}
          onChange={(e) => setForm((prev) => ({ ...prev, sportsProviderDescription: e.target.value }))}
          rows={4}
          className="w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
        />
      </div>

      {renderImageUploader(
        'Supporting section',
        supportPreview,
        () => supportRef.current?.click(),
        () => setImages((prev) => ({ ...prev, supportFile: null, supportPreview: '' }))
      )}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <label className="mb-2 block text-base font-medium text-gray-900">Supporting Description</label>
        <textarea
          value={form.supportDescription}
          onChange={(e) => setForm((prev) => ({ ...prev, supportDescription: e.target.value }))}
          rows={4}
          className="w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
        />
      </div>

      {renderImageUploader(
        'Brand section',
        brandPreview,
        () => brandRef.current?.click(),
        () => setImages((prev) => ({ ...prev, brandFile: null, brandPreview: '' }))
      )}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <label className="mb-2 block text-base font-medium text-gray-900">Brand Description</label>
        <textarea
          value={form.brandDescription}
          onChange={(e) => setForm((prev) => ({ ...prev, brandDescription: e.target.value }))}
          rows={4}
          className="w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#0f766e] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0d655d] disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default ContentCollaboratePage;
