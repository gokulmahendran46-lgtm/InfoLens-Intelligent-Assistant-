import { create } from 'zustand'
import type { Document, Issue, Insight, ChatMessage } from '../types'
import { documentsApi, insightsApi, issuesApi } from '../services/api'

interface DocumentStore {
  documents: Document[]
  issues: Issue[]
  insights: Insight[]
  chatMessages: ChatMessage[]
  isLoading: boolean
  uploadProgress: Record<string, number>

  // Data fetching
  fetchDocuments: () => Promise<void>
  fetchInsights: () => Promise<void>
  fetchIssues: () => Promise<void>
  
  // Document operations
  addDocument: (doc: Document) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  removeDocument: (id: string) => void
  deleteDocument: (id: string) => Promise<void>
  setUploadProgress: (id: string, progress: number) => void
  
  // Chat operations
  addChatMessage: (msg: ChatMessage) => void
  clearChat: () => void
  
  // Insight operations
  toggleActionCompleted: (insightId: string, actionId: string) => void
  
  // Loading state
  setLoading: (loading: boolean) => void
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  issues: [],
  insights: [],
  chatMessages: [{
    id: 'msg-welcome',
    sender: 'assistant',
    text: 'Hello! I can help you analyze the uploaded documents. Ask me about deadlines, amounts, or any conflicting information.',
    timestamp: new Date().toISOString()
  }],
  isLoading: false,
  uploadProgress: {},

  // Fetch documents from API
  fetchDocuments: async () => {
    try {
      set({ isLoading: true })
      const response = await documentsApi.getAll()
      set({ documents: response.data, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch documents:', error)
      set({ isLoading: false })
    }
  },

  // Fetch insights from API
  fetchInsights: async () => {
    try {
      const response = await insightsApi.getAll()
      set({ insights: response.data })
    } catch (error) {
      console.error('Failed to fetch insights:', error)
    }
  },

  // Fetch issues from API
  fetchIssues: async () => {
    try {
      const response = await issuesApi.getAll()
      set({ issues: response.data })
    } catch (error) {
      console.error('Failed to fetch issues:', error)
    }
  },

  addDocument: (doc) =>
    set((state) => ({ documents: [doc, ...state.documents] })),

  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),

  removeDocument: (id) =>
    set((state) => ({ documents: state.documents.filter((d) => d.id !== id) })),

  deleteDocument: async (id: string) => {
    try {
      await documentsApi.delete(id)
      set((state) => ({ documents: state.documents.filter((d) => d.id !== id) }))
    } catch (error) {
      console.error('Failed to delete document:', error)
      throw error
    }
  },

  setUploadProgress: (id, progress) =>
    set((state) => ({ uploadProgress: { ...state.uploadProgress, [id]: progress } })),

  addChatMessage: (msg) =>
    set((state) => ({ chatMessages: [...state.chatMessages, msg] })),

  clearChat: () => set({ chatMessages: [{
    id: 'msg-welcome',
    sender: 'assistant',
    text: 'Hello! I can help you analyze the uploaded documents. Ask me about deadlines, amounts, or any conflicting information.',
    timestamp: new Date().toISOString()
  }] }),

  toggleActionCompleted: (insightId, actionId) =>
    set((state) => ({
      insights: state.insights.map((ins) =>
        ins.id === insightId
          ? {
              ...ins,
              actions: ins.actions?.map((act) =>
                act.id === actionId ? { ...act, completed: !act.completed } : act
              ),
            }
          : ins
      ),
    })),

  setLoading: (loading) => set({ isLoading: loading }),
}))
