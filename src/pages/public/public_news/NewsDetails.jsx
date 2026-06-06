import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Container from '../../../components/layout/Container';
import { FaArrowLeft } from 'react-icons/fa';
import { GET } from '../../../services/httpMethods';
import { ENDPOINT } from '../../../services/httpEndpoint';

const normalizeArticle = (a) => {
  const getContentString = (val) => {
    if (!val && val !== 0) return '';
    if (typeof val === 'string') return val;
    if (val?.rendered && typeof val.rendered === 'string') return val.rendered;
    if (val?.html && typeof val.html === 'string') return val.html;
    try { return JSON.stringify(val); } catch { return ''; }
  };

  let contentHtml = getContentString(a.content) || getContentString(a.body) || getContentString(a.description) || getContentString(a.excerpt) || '';
  const lower = contentHtml.toLowerCase();
  if (lower.includes('constructvisualizerpayload') || lower.startsWith('function ')) {
    contentHtml = getContentString(a.excerpt) || getContentString(a.description) || '';
  }

  return {
    id: a.id,
    title: a.title || a.name || '',
    image: a.image ?? a.img ?? '',
    date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : a.createdAt ? new Date(a.createdAt).toLocaleDateString() : a.date ?? '',
    excerpt: a.excerpt ?? a.desc ?? a.summary ?? '',
    content: contentHtml,
    views: a.views ?? 0,
    authorId: a.authorId ?? a.author ?? null,
    raw: a,
  };
};

const NewsDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Priority 1: use normalized state if available
    if (location.state?.article) {
      setArticle(normalizeArticle(location.state.article));
      return;
    }

    // Priority 2: fetch from API and normalize
    const fetchNewsById = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await GET(ENDPOINT.NEWS.DETAIL(id));
        console.debug('[NewsDetails] GET', ENDPOINT.NEWS.DETAIL(id), response);

        const payload = response?.data ?? response;
        let newsData = null;

        if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
          newsData = payload.data;
        } else if (Array.isArray(payload.data)) {
          newsData = payload.data.find((x) => String(x.id) === String(id)) || payload.data[0];
        } else if (Array.isArray(payload.pagination?.limit)) {
          newsData = payload.pagination.limit.find((x) => String(x.id) === String(id)) || payload.pagination.limit[0];
        } else if (payload?.result) {
          newsData = payload.result;
        } else {
          newsData = payload;
        }

        setArticle(normalizeArticle(newsData));
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || 'Failed to fetch news';
        console.error('[NewsDetails] GET error', err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsById();
  }, [location.state, id]);

  if (loading) {
    return (
      <section className="min-h-screen bg-[#F8FAFC] pb-8">
        <Container>
          <div className="text-center py-20 text-gray-600">Loading article...</div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[#F8FAFC] pb-8">
        <Container>
          <div className="text-center py-20 text-red-600">{error}</div>
        </Container>
      </section>
    );
  }

  if (!article) {
    return (
      <section className="min-h-screen bg-[#F8FAFC] pb-8">
        <Container>
          <div className="text-center py-20 text-gray-600">Article not found</div>
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F8FAFC] pb-8">
      <Container>
        <div className="mx-auto">
          <div className="relative w-full h-80 md:h-175 rounded-md overflow-hidden bg-gray-800 mt-4">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute inset-0 px-6 md:px-12">
              <div className="absolute top-6 left-6 z-20">
                <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 bg-black/50 text-white px-3 py-1.5 rounded-md hover:bg-black/60 transition">
                  <FaArrowLeft />
                  <span className="text-base">Back</span>
                </button>
              </div>

              <div className="h-full flex flex-col justify-center items-start">
                <h1 className="text-[#0B544E] text-3xl md:text-5xl font-bold leading-tight drop-shadow-lg max-w-3xl">{article.title}</h1>

                <div className="mt-4 text-base text-white/80 flex items-center gap-4">
                  <span>{article.date}</span>
                  <span>â€”</span>
                  <span>{article.views ?? 0} views</span>
                </div>
              </div>
            </div>
          </div>

          <article className="mt-8">
            <div className="prose prose-sm md:prose-lg max-w-none text-[#333333]">
              <div dangerouslySetInnerHTML={{ __html: article.content || article.excerpt }} />
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
};

export default NewsDetails;
