export type DocumentStatus = 'uploading' | 'processing' | 'completed' | 'failed'
export type DocumentType = 'pdf' | 'docx' | 'txt' | 'image'

export interface Document {
  id: string
  name: string
  type: DocumentType
  size: number
  pages: number
  uploadedAt: string
  status: DocumentStatus
  summary?: DocumentSummary
  issues?: Issue[]
  missingFields?: MissingField[]
}

export interface DocumentSummary {
  shortSummary: string
  keyPoints: string[]
  importantDates: DateEntry[]
  names: string[]
  amounts: AmountEntry[]
  deadlines: string[]
  entities: string[]
  actionItems: string[]
}

export interface DateEntry {
  label: string
  value: string
}

export interface AmountEntry {
  label: string
  value: string
}

export interface Issue {
  id: string
  type: 'conflict' | 'missing' | 'warning' | 'info'
  title: string
  description: string
  severity: 'high' | 'medium' | 'low'
  documentIds?: string[]
}

export interface MissingField {
  fieldName: string
  isPresent: boolean
  importance: 'required' | 'recommended' | 'optional'
}

export interface ComparisonResult {
  documentA: Document
  documentB: Document
  differences: ComparisonDifference[]
  summary: string
  matchScore: number
}

export interface ComparisonDifference {
  category: string
  valueA: string
  valueB: string
  status: 'match' | 'conflict' | 'added' | 'removed' | 'changed'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  sourceDocuments?: { id: string; name: string; excerpt: string }[]
}

export interface SearchResult {
  documentId: string
  documentName: string
  documentType: DocumentType
  snippet: string
  relevanceScore: number
  pageNumber?: number
}

export interface Insight {
  id: string
  type: 'action' | 'warning' | 'info' | 'success'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  relatedDocuments?: string[]
  actions?: SmartAction[]
}

export interface SmartAction {
  id: string
  label: string
  description: string
  completed: boolean
}

export interface DashboardStats {
  totalDocuments: number
  processedDocuments: number
  importantIssues: number
  pendingActions: number
}
