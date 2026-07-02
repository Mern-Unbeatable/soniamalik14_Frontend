import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { ImagePlus, Plus, Trash2, X } from 'lucide-react';
import { DELETE as DELETE_REQUEST, GET, PATCH, POST, PUT } from '../../../../../services/httpMethods';
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

const getCards = (response) => {
  const payload = response?.data || response;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const getLatestByPage = (sections, pageKey) =>
  sections
    .filter((item) => item?.page === pageKey)
    .sort(
      (a, b) =>
        new Date(b?.updatedAt || b?.createdAt || 0).getTime() -
        new Date(a?.updatedAt || a?.createdAt || 0).getTime()
    )[0];

const createLocalCard = () => ({
  id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  title: '',
  subtitle: '',
  description: '',
  image: '',
  imageFile: null,
  isSaving: false,
});

const mapApiCard = (card, idx = 0) => ({
  id: card?.id || `local-${Date.now()}-${idx}`,
  title: card?.title || '',
  subtitle: card?.subtitle || '',
  description: card?.description || '',
  image: card?.image || '',
  imageFile: null,
  isSaving: false,
});

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

const ContentLandingPage = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    sectionTitle: '',
    sectionSubTitle: '',
    sportTitle: '',
    sportSubTitle: '',
  });
  const [heroImagePreview, setHeroImagePreview] = useState('');
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [homeSectionId, setHomeSectionId] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [savingHome, setSavingHome] = useState(false);
  const [savingExplore, setSavingExplore] = useState(false);
  const heroFileRef = useRef(null);
  const cardFileRefs = useRef({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setCardsLoading(true);
        const [sectionsResponse, cardsResponse] = await Promise.all([
          GET(ENDPOINT.HOMEPAGE.SECTIONS),
          GET(ENDPOINT.HOMEPAGE.CARDS),
        ]);

        const latest = getLatestByPage(getSections(sectionsResponse), 'HOME');
        if (latest) {
          setHomeSectionId(latest?.id || '');
          setForm({
            title: latest?.title || '',
            description: latest?.description || '',
            sectionTitle: latest?.sectionTitle || '',
            sectionSubTitle: latest?.sectionSubTitle || '',
            sportTitle: latest?.sportTitle || '',
            sportSubTitle: latest?.sportSubTitle || '',
          });
          setHeroImagePreview(latest?.image || '');
        }

        const mappedCards = getCards(cardsResponse)
          .sort((a, b) => Number(a?.order || 0) - Number(b?.order || 0))
          .map((item, idx) => mapApiCard(item, idx));
        setCards(mappedCards);
      } catch (error) {
        console.error('Failed to load HOME content/cards:', error);
        toast.error('Failed to load landing page data');
      } finally {
        setLoading(false);
        setCardsLoading(false);
      }
    };

    loadData();
  }, []);

  const previewUrl = useMemo(() => {
    if (heroImageFile instanceof File) return URL.createObjectURL(heroImageFile);
    return heroImagePreview;
  }, [heroImageFile, heroImagePreview]);

  useEffect(
    () => () => {
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  const handleInputChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const updateCardState = (cardId, updates) => {
    setCards((prev) => prev.map((item) => (item.id === cardId ? { ...item, ...updates } : item)));
  };

  const handleSaveHomeSection = async () => {
    if (!homeSectionId) {
      toast.error('Home section id not found. Please reload the page.');
      return;
    }

    const payload = new FormData();
    payload.append('id', homeSectionId);
    payload.append('page', 'HOME');
    payload.append('title', form.title.trim());
    payload.append('description', form.description);
    payload.append('sectionTitle', form.sectionTitle.trim());
    payload.append('sectionSubTitle', toPlainText(form.sectionSubTitle));
    payload.append('sportTitle', form.sportTitle.trim());
    payload.append('sportSubTitle', toPlainText(form.sportSubTitle));
    if (heroImageFile) payload.append('image', heroImageFile);

    try {
      setSavingHome(true);
      await PATCH(ENDPOINT.HOMEPAGE.SECTION_DETAIL(homeSectionId), payload);
      toast.success('Landing page content saved');
    } catch (error) {
      console.error('Failed to save HOME section:', error);
      toast.error(error?.response?.data?.message || 'Failed to save content');
    } finally {
      setSavingHome(false);
    }
  };

  const handleSaveExploreSection = async () => {
    if (!homeSectionId) {
      toast.error('Home section id not found. Please reload the page.');
      return;
    }

    if (!form.title.trim()) {
      toast.error('Hero title is required before saving Explore section');
      return;
    }

    const payload = new FormData();
    payload.append('id', homeSectionId);
    payload.append('page', 'HOME');
    payload.append('title', form.title.trim());
    payload.append('description', form.description || '');
    payload.append('sectionTitle', form.sectionTitle.trim());
    payload.append('sectionSubTitle', toPlainText(form.sectionSubTitle));

    try {
      setSavingExplore(true);
      await PATCH(ENDPOINT.HOMEPAGE.SECTION_DETAIL(homeSectionId), payload);
      toast.success('Explore ESSA Hub content saved');
    } catch (error) {
      console.error('Failed to save Explore ESSA Hub content:', error);
      toast.error(error?.response?.data?.message || 'Failed to save Explore section');
    } finally {
      setSavingExplore(false);
    }
  };

  const handleSaveCard = async (card) => {
    if (!card.title.trim() || !card.description.trim()) {
      toast.error('Card title and description are required');
      return;
    }
    const payload = new FormData();
    payload.append('title', card.title.trim());
    payload.append('subtitle', card.subtitle || '');
    payload.append('description', card.description || '');
    if (card.imageFile) payload.append('image', card.imageFile);

    const isExisting = !String(card.id).startsWith('local-');
    updateCardState(card.id, { isSaving: true });
    try {
      const response = isExisting
        ? await PUT(ENDPOINT.HOMEPAGE.CARD_DETAIL(card.id), payload)
        : await POST(ENDPOINT.HOMEPAGE.CARDS, payload);
      const savedCard = response?.data?.data?.card || response?.data?.data;
      const savedCardId = savedCard?.id || card.id;
      let cardDetails = savedCard;
      try {
        const detailResponse = await GET(ENDPOINT.HOMEPAGE.CARD_DETAIL(savedCardId));
        cardDetails = detailResponse?.data?.data?.card || savedCard;
      } catch {
        cardDetails = savedCard;
      }
      if (savedCard?.id) {
        setCards((prev) =>
          prev.map((item) => (item.id === card.id ? mapApiCard(cardDetails) : item))
        );
      }
      toast.success(isExisting ? 'Card updated' : 'Card created');
    } catch (error) {
      console.error('Failed to save card:', error);
      toast.error(error?.response?.data?.message || 'Failed to save card');
    } finally {
      updateCardState(card.id, { isSaving: false });
    }
  };

  const handleDeleteCard = async (card) => {
    const isExisting = !String(card.id).startsWith('local-');
    if (!isExisting) {
      setCards((prev) => prev.filter((item) => item.id !== card.id));
      return;
    }
    try {
      await DELETE_REQUEST(ENDPOINT.HOMEPAGE.CARD_DETAIL(card.id));
      setCards((prev) => prev.filter((item) => item.id !== card.id));
      toast.success('Card deleted');
    } catch (error) {
      console.error('Failed to delete card:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete card');
    }
  };

  if (loading) return <div className="rounded-xl bg-white p-6 text-sm text-gray-600">Loading content...</div>;

  return (
    <div className="space-y-8 pb-12 font-sans">
      <input ref={heroFileRef} type="file" accept="image/*" hidden onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)} />

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 lg:text-3xl">Hero section</h2>
        <div onClick={() => heroFileRef.current?.click()} className="group relative mb-6 flex h-64 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#f5f5f5] md:h-80">
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Hero Preview" className="h-full w-full object-cover" />
              <button type="button" onClick={(e) => { e.stopPropagation(); setHeroImageFile(null); setHeroImagePreview(''); }} className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white"><X className="h-5 w-5" /></button>
            </>
          ) : (
            <ImagePlus className="h-10 w-10 text-[#0f766e]" />
          )}
        </div>
        <div className="space-y-6">
          <input type="text" value={form.title} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none" placeholder="Write title" />
          <ReactQuill className="landing-quill landing-quill-main" theme="snow" modules={quillModules} value={form.description} onChange={(value) => handleInputChange('description', value)} />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 lg:text-3xl">Explore ESSA Hub</h2>
        <div className="space-y-6">
          <input type="text" value={form.sectionTitle} onChange={(e) => handleInputChange('sectionTitle', e.target.value)} className="w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none" placeholder="Section title" />
          <ReactQuill className="landing-quill landing-quill-short" theme="snow" modules={quillModules} value={form.sectionSubTitle} onChange={(value) => handleInputChange('sectionSubTitle', value)} />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSaveExploreSection}
            disabled={savingExplore}
            className="rounded-lg bg-[#0f766e] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {savingExplore ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Cards</h3>
            <button type="button" onClick={() => setCards((prev) => [...prev, createLocalCard()])} className="inline-flex items-center gap-2 rounded-lg bg-[#0f766e] px-4 py-2 text-sm font-medium text-white">
              <Plus className="h-4 w-4" /> Add New Card
            </button>
          </div>

          {cardsLoading ? (
            <p className="text-sm text-gray-600">Loading cards...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {cards.map((card) => (
                <div key={card.id} className="rounded-xl border border-gray-200 bg-[#F8FAFB] p-4">
                  <div onClick={() => cardFileRefs.current[card.id]?.click()} className="relative mb-4 flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                    {card.image ? (
                      <>
                        <img src={card.image} alt={card.title || 'Card'} className="h-full w-full object-cover" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); updateCardState(card.id, { image: '', imageFile: null }); }} className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white"><X className="h-4 w-4" /></button>
                      </>
                    ) : (
                      <ImagePlus className="h-7 w-7 text-[#0f766e]" />
                    )}
                  </div>
                  <input
                    ref={(el) => { if (el) cardFileRefs.current[card.id] = el; }}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (evt) => updateCardState(card.id, { imageFile: file, image: evt.target?.result || '' });
                      reader.readAsDataURL(file);
                    }}
                  />

                  <div className="space-y-3">
                    <input type="text" value={card.title} onChange={(e) => updateCardState(card.id, { title: e.target.value })} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none" placeholder="Card title" />
                    <input type="text" value={card.subtitle} onChange={(e) => updateCardState(card.id, { subtitle: e.target.value })} className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none" placeholder="Card subtitle" />
                    <ReactQuill className="landing-quill landing-quill-card" theme="snow" modules={quillModules} value={card.description} onChange={(value) => updateCardState(card.id, { description: value })} />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => handleSaveCard(card)} disabled={card.isSaving} className="flex-1 rounded-lg bg-[#0f766e] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                      {card.isSaving ? 'Saving...' : 'Save Card'}
                    </button>
                    <button type="button" onClick={() => handleDeleteCard(card)} className="inline-flex items-center justify-center rounded-lg border border-red-300 px-3 text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-2xl font-semibold text-[#0B544E] lg:text-3xl">Find Your Sport</h2>
        <div className="space-y-6">
          <input type="text" value={form.sportTitle} onChange={(e) => handleInputChange('sportTitle', e.target.value)} className="w-full rounded-lg border-none bg-[#f5f5f5] px-4 py-3.5 text-base outline-none" placeholder="Section title" />
          <ReactQuill className="landing-quill landing-quill-short" theme="snow" modules={quillModules} value={form.sportSubTitle} onChange={(value) => handleInputChange('sportSubTitle', value)} />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={handleSaveHomeSection} disabled={savingHome} className="rounded-lg bg-[#0f766e] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {savingHome ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .landing-quill .ql-toolbar {
              border-radius: 10px 10px 0 0;
              background: #ffffff;
            }
            .landing-quill .ql-container {
              border-radius: 0 0 10px 10px;
              background: #f5f5f5;
            }
            .landing-quill-main .ql-editor {
              min-height: 170px;
              max-height: 170px;
              overflow-y: auto;
            }
            .landing-quill-short .ql-editor {
              min-height: 120px;
              max-height: 120px;
              overflow-y: auto;
            }
            .landing-quill-card .ql-editor {
              min-height: 110px;
              max-height: 110px;
              overflow-y: auto;
            }
          `,
        }}
      />
    </div>
  );
};

export default ContentLandingPage;
