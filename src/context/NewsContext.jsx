import React, { createContext, useContext, useState, useCallback } from 'react'
import { fetchNews as apiFetchNews, createNews as apiCreateNews, updateNews as apiUpdateNews, deleteNews as apiDeleteNews } from '../features/news/newsAPI'
import axiosInstance from '../services/axiosInstance'

const NewsContext = createContext(null)

export const NewsProvider = ({ children }) => {
  const [newsList, setNewsList] = useState([])
  const [loading, setLoading] = useState(false)

  const loadNews = useCallback(async () => {
    setLoading(true)
    try {
      const list = await apiFetchNews()
      setNewsList(list || [])
    } catch (err) {
      // silence here; callers can show toasts
      // eslint-disable-next-line no-console
      console.error('Failed to load news', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createNews = useCallback(async (payload) => {
    setLoading(true)
    try {
      const created = await apiCreateNews(payload)
      // refresh list after create
      await loadNews()
      return created
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to create news', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [loadNews])

  const updateNews = useCallback(async ({ id, data }) => {
    setLoading(true)
    try {
      const res = await apiUpdateNews({ id, data })
      // refresh to keep normalized shape
      await loadNews()
      return res
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to update news', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [loadNews])

  const deleteNews = useCallback(async (id) => {
    setLoading(true)
    try {
      await apiDeleteNews(id)
      await loadNews()
      return id
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete news', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [loadNews])

  const publishNews = useCallback(async (id) => {
    return axiosInstance.patch(`/api/news/${id}/publish`, {})
  }, [])

  const unpublishNews = useCallback(async (id) => {
    return axiosInstance.patch(`/api/news/${id}/unpublish`, {})
  }, [])

  const bulkPublish = useCallback(async (ids = []) => {
    const results = []
    for (const id of ids) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await publishNews(id)
        results.push({ id, success: true })
      } catch (err) {
        results.push({ id, success: false, error: err })
      }
    }
    await loadNews()
    return results
  }, [publishNews, loadNews])

  const bulkUnpublish = useCallback(async (ids = []) => {
    const results = []
    for (const id of ids) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await unpublishNews(id)
        results.push({ id, success: true })
      } catch (err) {
        results.push({ id, success: false, error: err })
      }
    }
    await loadNews()
    return results
  }, [unpublishNews, loadNews])

  return (
    <NewsContext.Provider value={{ newsList, loading, loadNews, createNews, updateNews, deleteNews, publishNews, unpublishNews, bulkPublish, bulkUnpublish }}>
      {children}
    </NewsContext.Provider>
  )
}

export const useNews = () => {
  const ctx = useContext(NewsContext)
  if (!ctx) throw new Error('useNews must be used within NewsProvider')
  return ctx
}

export default NewsContext
