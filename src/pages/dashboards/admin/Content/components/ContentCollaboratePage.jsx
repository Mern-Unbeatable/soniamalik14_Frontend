import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ImagePlus, X } from 'lucide-react';
import { GET, PATCH, POST } from '../../../../../services/httpMethods';
import { ENDPOINT } from '../../../../../services/httpEndpoint';
import { toast } from 'react-toastify';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'image'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'list',
  'indent',
  'align',
  'link',
  'image',
];

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

const ContentCollaboratePage = () => {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    sectionTitle: '',
    sectionSubTitle: '',
    sportTitle: '',
    sportSubTitle: '',
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
    sportsProviderRemoved: false,
    supportRemoved: false,
    brandRemoved: false,
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
            sectionTitle: latest?.sectionTitle || '',
            sectionSubTitle: latest?.sectionSubTitle || '',
            sportTitle: latest?.sportTitle || '',
            sportSubTitle: latest?.sportSubTitle || '',
            sportsProviderDescription: latest?.sportsProviderDescription || '',
            supportDescription: latest?.supportDescription || '',
            brandDescription: latest?.brandDescription || '',
          });
          setImages((prev) => ({
            ...prev,
            sportsProviderPreview: latest?.sportsProviderImg || '',
            supportPreview: latest?.supportImg || '',
            brandPreview: latest?.brandImg || '',
            sportsProviderRemoved: false,
            supportRemoved: false,
            brandRemoved: false,
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
    const removedKeyMap = {
      sportsProviderFile: 'sportsProviderRemoved',
      supportFile: 'supportRemoved',
      brandFile: 'brandRemoved',
    };
    const removedKey = removedKeyMap[key];
    setImages((prev) => ({ ...prev, [key]: file, [removedKey]: false }));
  };

  const clearFileInput = (key) => {
    const refMap = {
      sportsProviderFile: sportsProviderRef,
      supportFile: supportRef,
      brandFile: brandRef,
    };
    const ref = refMap[key];
    if (ref?.current) ref.current.value = '';
  };

  const handleRemoveImage = (key, previewKey, removedKey) => {
    setImages((prev) => ({
      ...prev,
      [key]: null,
      [previewKey]: '',
      [removedKey]: true,
    }));
    clearFileInput(key);
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
    payload.append('subtitle', form.subtitle || '');
    payload.append('description', form.description || '');
    payload.append('sectionTitle', form.sectionTitle || '');
    payload.append('sectionSubTitle', form.sectionSubTitle || '');
    payload.append('sportTitle', form.sportTitle || '');
    payload.append('sportSubTitle', form.sportSubTitle || '');
    payload.append('sportsProviderDescription', form.sportsProviderDescription || '');
    payload.append('supportDescription', form.supportDescription || '');
    payload.append('brandDescription', form.brandDescription || '');
    if (images.sportsProviderFile) payload.append('sportsProviderImg', images.sportsProviderFile);
    if (images.supportFile) payload.append('supportImg', images.supportFile);
    if (images.brandFile) payload.append('brandImg', images.brandFile);
    if (images.sportsProviderRemoved && !images.sportsProviderFile) payload.append('sportsProviderImg', '');
    if (images.supportRemoved && !images.supportFile) payload.append('supportImg', '');
    if (images.brandRemoved && !images.brandFile) payload.append('brandImg', '');

    try {
      setSaving(true);
      if (collaborateSectionId) {
        await PATCH(ENDPOINT.HOMEPAGE.SECTION_DETAIL(collaborateSectionId), payload);
      } else {
        await POST(ENDPOINT.HOMEPAGE.SECTIONS, payload);
      }
      toast.success('Collaborate content saved');
      setImages((prev) => ({
        ...prev,
        sportsProviderRemoved: false,
        supportRemoved: false,
        brandRemoved: false,
      }));
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
            <input
              value={form.subtitle}
              onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
              className="w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-base font-medium text-gray-900">Description</label>
            <ReactQuill
              className="collab-quill collab-quill-main"
              theme="snow"
              modules={quillModules}
              formats={quillFormats}
              value={form.description}
              onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
            />
          </div>
        </div>
      </div>

      {renderImageUploader(
        'Sport Provider section',
        sportsProviderPreview,
        () => sportsProviderRef.current?.click(),
        () => handleRemoveImage('sportsProviderFile', 'sportsProviderPreview', 'sportsProviderRemoved')
      )}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <label className="mb-2 block text-base font-medium text-gray-900">Sport Provider Title</label>
        <input
          type="text"
          value={form.sectionTitle}
          onChange={(e) => setForm((prev) => ({ ...prev, sectionTitle: e.target.value }))}
          className="mb-6 w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
        />
        <label className="mb-2 block text-base font-medium text-gray-900">Sport Provider Description</label>
        <ReactQuill
          className="collab-quill collab-quill-desc"
          theme="snow"
          modules={quillModules}
          formats={quillFormats}
          value={form.sportsProviderDescription}
          onChange={(value) => setForm((prev) => ({ ...prev, sportsProviderDescription: value }))}
        />
      </div>

      {renderImageUploader(
        'Supporting section',
        supportPreview,
        () => supportRef.current?.click(),
        () => handleRemoveImage('supportFile', 'supportPreview', 'supportRemoved')
      )}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <label className="mb-2 block text-base font-medium text-gray-900">Professional Support Title</label>
        <input
          type="text"
          value={form.sectionSubTitle}
          onChange={(e) => setForm((prev) => ({ ...prev, sectionSubTitle: e.target.value }))}
          className="mb-6 w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
        />
        <label className="mb-2 block text-base font-medium text-gray-900">Supporting Description</label>
        <ReactQuill
          className="collab-quill collab-quill-desc"
          theme="snow"
          modules={quillModules}
          formats={quillFormats}
          value={form.supportDescription}
          onChange={(value) => setForm((prev) => ({ ...prev, supportDescription: value }))}
        />
      </div>

      {renderImageUploader(
        'Brand section',
        brandPreview,
        () => brandRef.current?.click(),
        () => handleRemoveImage('brandFile', 'brandPreview', 'brandRemoved')
      )}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <label className="mb-2 block text-base font-medium text-gray-900">Brand Title</label>
        <input
          type="text"
          value={form.sportTitle}
          onChange={(e) => setForm((prev) => ({ ...prev, sportTitle: e.target.value }))}
          className="mb-4 w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
        />
        <label className="mb-2 block text-base font-medium text-gray-900">Brand Subtitle</label>
        <input
          type="text"
          value={form.sportSubTitle}
          onChange={(e) => setForm((prev) => ({ ...prev, sportSubTitle: e.target.value }))}
          className="mb-6 w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
        />
        <label className="mb-2 block text-base font-medium text-gray-900">Brand Description</label>
        <ReactQuill
          className="collab-quill collab-quill-desc"
          theme="snow"
          modules={quillModules}
          formats={quillFormats}
          value={form.brandDescription}
          onChange={(value) => setForm((prev) => ({ ...prev, brandDescription: value }))}
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

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .collab-quill .ql-toolbar {
              border-radius: 10px 10px 0 0;
              background: #ffffff;
            }
            .collab-quill .ql-container {
              border-radius: 0 0 10px 10px;
              background: #f5f5f5;
            }
            .collab-quill-main .ql-editor {
              min-height: 170px;
              max-height: 170px;
              overflow-y: auto;
            }
            .collab-quill-desc .ql-editor {
              min-height: 150px;
              max-height: 150px;
              overflow-y: auto;
            }
          `,
        }}
      />
    </div>
  );
};

export default ContentCollaboratePage;
