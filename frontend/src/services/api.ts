import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.detail || err.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export const documentsApi = {
  upload: (formData: FormData) =>
    api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: () => api.get('/documents'),
  getById: (id: string) => api.get(`/documents/${id}`),
  summarize: (id: string) => api.post(`/documents/${id}/summarize`),
  delete: (id: string) => api.delete(`/documents/${id}`),
}

export const chatApi = {
  sendMessage: (message: string, documentIds?: string[]) =>
    api.post('/chat', { message, document_ids: documentIds }),
}

export const compareApi = {
  compare: (docAId: string, docBId: string) =>
    api.post('/compare', { document_a_id: docAId, document_b_id: docBId }),
}

export const searchApi = {
  search: (query: string) => api.get(`/search?q=${encodeURIComponent(query)}`),
}

export const insightsApi = {
  getAll: () => api.get('/insights'),
}

export const issuesApi = {
  getAll: () => api.get('/issues'),
}

export default api
