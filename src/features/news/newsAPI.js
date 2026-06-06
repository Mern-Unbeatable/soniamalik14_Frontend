import axiosInstance from '../../services/axiosInstance'
import { ENDPOINT } from '../../services/httpEndpoint'

// Normalize a single API item → fields expected by NewsCard (img, desc)
const normalizeNewsItem = (item) => {
  if (!item || typeof item !== 'object') return item;
  return {
    ...item,
    img: item.img || item.image || '',
    desc: item.desc || item.excerpt || item.content || '',
  };
};

// Extract items array from various backend response shapes
const extractNewsList = (resp) => {
  // shape: { success, data, pagination: { limit: [...] } }
  const items =
    resp?.pagination?.limit ||
    resp?.items ||
    resp?.results ||
    (Array.isArray(resp?.data) ? resp.data : null) ||
    (Array.isArray(resp) ? resp : []);
  return (Array.isArray(items) ? items : []).map(normalizeNewsItem);
};

// Fetch all news
export const fetchNews = async () => {
  const resp = await axiosInstance.get(ENDPOINT.NEWS.LIST)
  return extractNewsList(resp?.data ?? resp)
}

// Create new news
export const createNews = async (newsItem) => {
  const payloadImage = newsItem.image ?? newsItem.img ?? null
  if (payloadImage && typeof payloadImage === 'object' && payloadImage instanceof File) {
    const form = new FormData()
    form.append('title', newsItem.title || '')
    form.append('content', newsItem.desc || '')
    form.append('excerpt', newsItem.desc || '')
    form.append('status', newsItem.status || 'PUBLISHED')
    form.append('image', payloadImage)

    const resp = await axiosInstance.post(ENDPOINT.NEWS.CREATE, form)
    return normalizeNewsItem(resp?.data ?? resp)
  }

  const jsonPayload = {
    title: newsItem.title || '',
    content: newsItem.desc || newsItem.content || '',
    excerpt: newsItem.desc || newsItem.excerpt || '',
    status: newsItem.status || 'PUBLISHED',
    image: payloadImage || ''
  }

  const resp = await axiosInstance.post(ENDPOINT.NEWS.CREATE, jsonPayload)
  return normalizeNewsItem(resp?.data ?? resp)
}

// Update news
export const updateNews = async ({ id, data }) => {
  const payloadImage = data.image ?? data.img ?? null
  if (payloadImage && typeof payloadImage === 'object' && payloadImage instanceof File) {
    const form = new FormData()
    form.append('title', data.title || '')
    form.append('content', data.desc || data.content || '')
    form.append('excerpt', data.desc || data.excerpt || '')
    form.append('status', data.status || 'PUBLISHED')
    form.append('image', payloadImage, payloadImage.name || 'upload')

    const resp = await axiosInstance.put(ENDPOINT.NEWS.UPDATE(id), form)
    const normalized = normalizeNewsItem(resp?.data ?? resp)
    return { id, data: normalized }
  }

  const jsonPayload = {
    title: data.title || '',
    content: data.desc || data.content || '',
    excerpt: data.desc || data.excerpt || '',
    status: data.status || 'PUBLISHED',
    image: payloadImage || ''
  }

  const resp = await axiosInstance.put(ENDPOINT.NEWS.UPDATE(id), jsonPayload)
  const normalized = normalizeNewsItem(resp?.data ?? resp)
  return { id, data: normalized }
}

// Delete news
export const deleteNews = async (id) => {
  await axiosInstance.delete(ENDPOINT.NEWS.DELETE(id))
  return id
}
