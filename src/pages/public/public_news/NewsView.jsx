import React, { useEffect, useState, useMemo } from 'react';
import Title from '../../../components/ui/Title';
import NewsList from './components/NewsList';
import Container from '../../../components/layout/Container';
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
        excerpt: a.excerpt ?? a.desc ?? a.summary ?? '',
        image: a.image ?? a.img ?? '',
        date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : a.createdAt ? new Date(a.createdAt).toLocaleDateString() : a.date ?? '',
        content: contentHtml,
        raw: a,
    };
};

const NewsView = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllNews = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await GET(ENDPOINT.NEWS.LIST);
                console.debug('[NewsView] GET', ENDPOINT.NEWS.LIST, response);

                // tolerant extraction of items array from response shapes
                const payload = response?.data ?? response;
                let articles = [];
                if (Array.isArray(payload)) articles = payload;
                else if (Array.isArray(payload.data)) articles = payload.data;
                else if (Array.isArray(payload.data?.data)) articles = payload.data.data;
                else if (Array.isArray(payload.results)) articles = payload.results;
                else if (Array.isArray(payload.pagination?.limit)) articles = payload.pagination.limit;
                else if (Array.isArray(payload.items)) articles = payload.items;

                const normalized = (articles || []).map(normalizeArticle);
                setNewsList(normalized);
            } catch (err) {
                const message = err?.response?.data?.message || err?.message || 'Failed to fetch news';
                console.error('[NewsView] GET error', err);
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllNews();
    }, []);

    const featured = useMemo(() => (newsList.length > 0 ? newsList[0] : null), [newsList]);
    const items = useMemo(() => (newsList.length > 1 ? newsList.slice(1) : []), [newsList]);

    if (loading) return (
        <Container className="py-6 lg:py-8">
            <div className="text-center py-20 text-gray-600">Loading news...</div>
        </Container>
    );

    if (error) return (
        <Container className="py-6 lg:py-8">
            <div className="text-center py-20 text-red-600">{error}</div>
        </Container>
    );

    if (!featured) return (
        <Container className="py-6 lg:py-8">
            <div className="text-center py-20 text-gray-600">No news available</div>
        </Container>
    );

    return (
        <Container className="py-6 lg:py-8">
            <div>
                <Title className={"text-[#0B544E]"}>Latest News</Title>
                <div className="mt-4 lg:mt-6">
                    <NewsList featured={featured} items={items} />
                </div>
            </div>
        </Container>
    );
};

export default NewsView;