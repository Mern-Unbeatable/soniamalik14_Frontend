import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { ImagePlus, X } from 'lucide-react';
import { GET, PATCH, POST } from '../../../../../services/httpMethods';
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

const ABOUT_IMAGE_SLOTS = 4;

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

const urlToFile = async (url, fallbackName) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const extension = blob.type?.split('/')[1] || 'jpg';
  return new File([blob], `${fallbackName}.${extension}`, { type: blob.type || 'image/jpeg' });
};

const normalizeFounderInfo = (value) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      title: value?.title || '',
      intro: value?.intro || '',
      paragraphs: Array.isArray(value?.paragraphs) ? value.paragraphs : [],
      footerTitle: value?.footerTitle || '',
      image: value?.image || '',
    };
  }

  const asText = String(value || '').trim();
  if (!asText) {
    return { title: '', intro: '', paragraphs: [], footerTitle: '', image: '' };
  }

  const blocks = asText.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
  return {
    title: '',
    intro: blocks[0] || '',
    paragraphs: blocks.slice(1),
    footerTitle: '',
    image: '',
  };
};

const ContentAboutUS = () => {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    founderTitle: '',
    founderIntro: '',
    founderParagraphs: '',
    founderFooterTitle: '',
  });
  const [aboutImageFiles, setAboutImageFiles] = useState(Array(ABOUT_IMAGE_SLOTS).fill(null));
  const [aboutImagePreviews, setAboutImagePreviews] = useState(Array(ABOUT_IMAGE_SLOTS).fill(''));
  const [founderImageFile, setFounderImageFile] = useState(null);
  const [founderImagePreview, setFounderImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutSectionId, setAboutSectionId] = useState('');

  const aboutFileRefs = useRef([]);
  const founderFileRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await GET(ENDPOINT.HOMEPAGE.CONTENT);
        const allSections = response?.data?.data?.homepage?.sections || [];
        const sections = Array.isArray(allSections) ? allSections : getSections(response);
        const latest = getLatestByPage(sections, 'ABOUT_US');
        if (latest) {
          const founderInfo = normalizeFounderInfo(latest?.founderInfo);
          setAboutSectionId(latest?.id || '');
          setForm({
            title: latest?.title || '',
            subtitle: latest?.subtitle || '',
            description: latest?.description || '',
            founderTitle: founderInfo.title || '',
            founderIntro: founderInfo.intro || '',
            founderParagraphs: founderInfo.paragraphs.join('\n'),
            founderFooterTitle: founderInfo.footerTitle || '',
          });
          const existingAboutImages = Array.isArray(latest?.aboutImages) ? latest.aboutImages : [];
          const fallbackImages = latest?.image ? [latest.image] : [];
          const mergedAboutImages = existingAboutImages.length ? existingAboutImages : fallbackImages;
          setAboutImageFiles(Array(ABOUT_IMAGE_SLOTS).fill(null));
          setAboutImagePreviews(
            Array.from({ length: ABOUT_IMAGE_SLOTS }, (_, idx) => mergedAboutImages[idx] || '')
          );
          setFounderImagePreview(
            founderInfo.image ||
              (latest?.brandImg && typeof latest.brandImg === 'string' ? latest.brandImg : '')
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

  const founderPreview = useMemo(() => {
    if (founderImageFile instanceof File) return URL.createObjectURL(founderImageFile);
    return founderImagePreview;
  }, [founderImageFile, founderImagePreview]);

  useEffect(() => {
    return () => {
      if (founderPreview && founderPreview.startsWith('blob:')) URL.revokeObjectURL(founderPreview);
    };
  }, [founderPreview]);

  const handleAboutImageChange = (index, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setAboutImageFiles((prev) => {
        const next = [...prev];
        next[index] = file;
        return next;
      });
      setAboutImagePreviews((prev) => {
        const next = [...prev];
        next[index] = event?.target?.result || '';
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAboutImage = (index) => {
    setAboutImageFiles((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    setAboutImagePreviews((prev) => {
      const next = [...prev];
      next[index] = '';
      return next;
    });
    if (aboutFileRefs.current[index]) aboutFileRefs.current[index].value = '';
  };

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
    const founderParagraphs = String(form.founderParagraphs || '')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
    payload.append(
      'founderInfo',
      JSON.stringify({
        title: form.founderTitle || '',
        intro: form.founderIntro || '',
        paragraphs: founderParagraphs,
        footerTitle: form.founderFooterTitle || '',
      })
    );
    for (let index = 0; index < ABOUT_IMAGE_SLOTS; index += 1) {
      const selectedFile = aboutImageFiles[index];
      const previewUrl = aboutImagePreviews[index];

      if (selectedFile) {
        payload.append('aboutImages', selectedFile);
        continue;
      }

      if (previewUrl && /^https?:\/\//i.test(previewUrl)) {
        try {
          const existingFile = await urlToFile(previewUrl, `about-image-${index + 1}`);
          payload.append('aboutImages', existingFile);
        } catch (error) {
          console.warn('Could not re-append existing about image:', previewUrl, error);
        }
      }
    }
    if (founderImageFile) payload.append('brandImg', founderImageFile);

    try {
      setSaving(true);
      if (aboutSectionId) {
        await PATCH(ENDPOINT.HOMEPAGE.SECTION_DETAIL(aboutSectionId), payload);
      } else {
        const response = await POST(ENDPOINT.HOMEPAGE.SECTIONS, payload);
        const createdId = response?.data?.data?.section?.id || response?.data?.data?.id;
        if (createdId) setAboutSectionId(createdId);
      }
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
      {Array.from({ length: ABOUT_IMAGE_SLOTS }).map((_, index) => (
        <input
          key={`about-image-input-${index}`}
          ref={(el) => {
            aboutFileRefs.current[index] = el;
          }}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleAboutImageChange(index, e.target.files?.[0])}
        />
      ))}
      <input
        ref={founderFileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => setFounderImageFile(e.target.files?.[0] || null)}
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 lg:text-3xl">About Hero section</h2>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {aboutImagePreviews.map((preview, index) => (
            <div
              key={`about-image-slot-${index}`}
              onClick={() => aboutFileRefs.current[index]?.click()}
              className="group relative flex h-44 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl bg-[#f5f5f5] transition-colors hover:bg-[#eeeeee] md:h-52"
            >
              {preview ? (
                <>
                  <img src={preview} alt={`About preview ${index + 1}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAboutImage(index);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <ImagePlus className="mb-2 h-8 w-8 text-[#0f766e]" />
                  <span className="text-sm font-medium text-gray-700">Upload image {index + 1}</span>
                </>
              )}
            </div>
          ))}
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
              className="about-quill about-quill-short"
              theme="snow"
              modules={quillModules}
              value={form.subtitle}
              onChange={(value) => setForm((prev) => ({ ...prev, subtitle: value }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-base font-medium text-gray-900">Description</label>
            <ReactQuill
              className="about-quill"
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
          <label className="mb-2 block text-base font-medium text-gray-900">Founder Title</label>
          <input
            type="text"
            value={form.founderTitle}
            onChange={(e) => setForm((prev) => ({ ...prev, founderTitle: e.target.value }))}
            className="mb-5 w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
          />

          <label className="mb-2 block text-base font-medium text-gray-900">Founder Intro</label>
          <textarea
            value={form.founderIntro}
            onChange={(e) => setForm((prev) => ({ ...prev, founderIntro: e.target.value }))}
            rows={4}
            className="mb-5 w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
          />

          <label className="mb-2 block text-base font-medium text-gray-900">
            Founder Paragraphs (one line per paragraph)
          </label>
          <textarea
            value={form.founderParagraphs}
            onChange={(e) => setForm((prev) => ({ ...prev, founderParagraphs: e.target.value }))}
            rows={6}
            className="mb-5 w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
          />

          <label className="mb-2 block text-base font-medium text-gray-900">Founder Footer Title</label>
          <input
            type="text"
            value={form.founderFooterTitle}
            onChange={(e) => setForm((prev) => ({ ...prev, founderFooterTitle: e.target.value }))}
            className="w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-[#0f766e]/20"
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

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .about-quill .ql-container {
              border-radius: 0 0 10px 10px;
              background: #f5f5f5;
            }
            .about-quill .ql-toolbar {
              border-radius: 10px 10px 0 0;
              background: #ffffff;
            }
            .about-quill .ql-editor {
              min-height: 170px;
              max-height: 170px;
              overflow-y: auto;
              font-size: 15px;
            }
            .about-quill-short .ql-editor {
              min-height: 120px;
              max-height: 120px;
            }
          `,
        }}
      />
    </div>
  );
};

export default ContentAboutUS;
