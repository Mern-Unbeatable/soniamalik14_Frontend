import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { ImagePlus, X } from 'lucide-react';
import { GET, POST } from '../../../../../services/httpMethods';
import { ENDPOINT } from '../../../../../services/httpEndpoint';
import { toast } from 'react-toastify';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

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

const ContentAboutUS = () => {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    founderInfo: '',
  });
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [founderImageFile, setFounderImageFile] = useState(null);
  const [aboutImagePreview, setAboutImagePreview] = useState('');
  const [founderImagePreview, setFounderImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const aboutFileRef = useRef(null);
  const founderFileRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await GET(ENDPOINT.HOMEPAGE.SECTIONS);
        const sections = getSections(response);
        const latest = getLatestByPage(sections, 'ABOUT_US');
        if (latest) {
          setForm({
            title: latest?.title || '',
            subtitle: latest?.subtitle || '',
            description: latest?.description || '',
            founderInfo: latest?.founderInfo || '',
          });
          setAboutImagePreview(latest?.aboutImages?.[0] || latest?.image || '');
          setFounderImagePreview(
            latest?.brandImg && typeof latest.brandImg === 'string' ? latest.brandImg : ''
          );
        }
      } catch (error) {
        console.error('Failed to load ABOUT_US section:', error);
        toast.error('Failed to load About Us content');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const aboutPreview = useMemo(() => {
    if (aboutImageFile instanceof File) return URL.createObjectURL(aboutImageFile);
    return aboutImagePreview;
  }, [aboutImageFile, aboutImagePreview]);

  const founderPreview = useMemo(() => {
    if (founderImageFile instanceof File) return URL.createObjectURL(founderImageFile);
    return founderImagePreview;
  }, [founderImageFile, founderImagePreview]);

  useEffect(() => {
    return () => {
      if (aboutPreview && aboutPreview.startsWith('blob:')) URL.revokeObjectURL(aboutPreview);
      if (founderPreview && founderPreview.startsWith('blob:')) URL.revokeObjectURL(founderPreview);
    };
  }, [aboutPreview, founderPreview]);

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    const payload = new FormData();
    payload.append('page', 'ABOUT_US');
    payload.append('title', form.title.trim());
    payload.append('subtitle', form.subtitle);
    payload.append('description', form.description);
    payload.append('founderInfo', form.founderInfo);
    if (aboutImageFile) payload.append('aboutImages', aboutImageFile);
    if (founderImageFile) payload.append('brandImg', founderImageFile);

    try {
      setSaving(true);
      await POST(ENDPOINT.HOMEPAGE.SECTIONS, payload);
      toast.success('About Us content saved');
    } catch (error) {
      console.error('Failed to save ABOUT_US section:', error);
      toast.error(error?.response?.data?.message || 'Failed to save About Us content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-xl bg-white p-6 text-sm text-gray-600">Loading content...</div>;
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      <input
        ref={aboutFileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => setAboutImageFile(e.target.files?.[0] || null)}
      />
      <input
        ref={founderFileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => setFounderImageFile(e.target.files?.[0] || null)}
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 lg:text-3xl">About Hero section</h2>

        <div
          onClick={() => aboutFileRef.current?.click()}
          className="group relative mb-6 flex h-64 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl bg-[#f5f5f5] transition-colors hover:bg-[#eeeeee] md:h-80"
        >
          {aboutPreview ? (
            <>
              <img src={aboutPreview} alt="About preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setAboutImageFile(null);
                  setAboutImagePreview('');
                }}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <ImagePlus className="mb-3 h-10 w-10 text-[#0f766e]" />
              <span className="text-base font-medium text-gray-700">Upload Hero image</span>
            </>
          )}
        </div>

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
            <ReactQuill
              theme="snow"
              modules={quillModules}
              value={form.subtitle}
              onChange={(value) => setForm((prev) => ({ ...prev, subtitle: value }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-base font-medium text-gray-900">Description</label>
            <ReactQuill
              theme="snow"
              modules={quillModules}
              value={form.description}
              onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 lg:text-3xl">Founder section</h2>
        <div
          onClick={() => founderFileRef.current?.click()}
          className="group relative mb-6 flex h-64 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl bg-[#f5f5f5] transition-colors hover:bg-[#eeeeee] md:h-80"
        >
          {founderPreview ? (
            <>
              <img src={founderPreview} alt="Founder preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFounderImageFile(null);
                  setFounderImagePreview('');
                }}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <ImagePlus className="mb-3 h-10 w-10 text-[#0f766e]" />
              <span className="text-base font-medium text-gray-700">Upload Founder image</span>
            </>
          )}
        </div>

        <div>
          <label className="mb-2 block text-base font-medium text-gray-900">Founder Info</label>
          <ReactQuill
            theme="snow"
            modules={quillModules}
            value={form.founderInfo}
            onChange={(value) => setForm((prev) => ({ ...prev, founderInfo: value }))}
          />
        </div>
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

export default ContentAboutUS;
