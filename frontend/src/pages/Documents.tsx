import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Upload,
  Search,
  Filter,
  FileText,
  Trash2,
  Eye,
  ChevronRight,
  X,
  SortAsc,
} from 'lucide-react'
import { format } from 'date-fns'
import { useDocumentStore } from '../store/documentStore'
import FileTypeIcon from '../components/ui/FileTypeIcon'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import UploadModal from '../components/documents/UploadModal'
import type { DocumentStatus, DocumentType } from '../types'
import toast from 'react-hot-toast'

const TYPE_FILTERS: { label: string; value: DocumentType | 'all' }[] = [
  { label: 'All Types', value: 'all' },
  { label: 'PDF', value: 'pdf' },
  { label: 'DOCX', value: 'docx' },
  { label: 'TXT', value: 'txt' },
  { label: 'Image', value: 'image' },
]

const STATUS_FILTERS: { label: string; value: DocumentStatus | 'all' }[] = [
  { label: 'All Status', value: 'all' },
  { label: 'Processed', value: 'completed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Uploading', value: 'uploading' },
  { label: 'Failed', value: 'failed' },
]

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function Documents() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { documents, fetchDocuments, deleteDocument } = useDocumentStore()
  const [showUpload, setShowUpload] = useState(false)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date')

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const filtered = documents
    .filter((d) => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'all' || d.type === typeFilter
      const matchStatus = statusFilter === 'all' || d.status === statusFilter
      return matchSearch && matchType && matchStatus
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return b.size - a.size
    })

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Delete "${name}"?`)) {
      try {
        await deleteDocument(id)
        toast.success('Document deleted')
      } catch (error) {
        toast.error('Failed to delete document')
      }
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Documents</h1>
          <p className="text-sm text-slate-500 mt-0.5">{documents.length} documents uploaded</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="btn-primary">
          <Upload size={15} />
          Upload
        </button>
      </div>

      {/* Filters bar */}
      <div className="card p-3 mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name..."
            className="w-full pl-8 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DocumentType | 'all')}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {TYPE_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | 'all')}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <SortAsc size={14} className="text-slate-400" />
          {(['date', 'name', 'size'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors capitalize ${
                sortBy === s ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Document grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={search ? 'No matching documents' : 'No documents yet'}
          description={
            search
              ? `No documents match "${search}". Try a different search term.`
              : 'Upload your first document to get started with AI-powered analysis.'
          }
          action={
            !search && (
              <button onClick={() => setShowUpload(true)} className="btn-primary">
                <Upload size={15} /> Upload Documents
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              onClick={() => navigate(`/documents/${doc.id}`)}
              className="card p-4 cursor-pointer hover:shadow-card-hover transition-all duration-200 group"
            >
              <div className="flex items-start gap-3 mb-3">
                <FileTypeIcon type={doc.type} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">{formatBytes(doc.size)}</span>
                    <span className="text-slate-200">·</span>
                    <span className="text-xs text-slate-400">{doc.pages}p</span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(doc.id, doc.name, e)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <StatusBadge status={doc.status} />
                <span className="text-xs text-slate-400">
                  {format(new Date(doc.uploadedAt), 'MMM d, h:mm a')}
                </span>
              </div>

              {doc.issues && doc.issues.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <span className="text-xs text-amber-600 font-medium">
                    ⚠️ {doc.issues.length} issue{doc.issues.length > 1 ? 's' : ''} found
                  </span>
                </div>
              )}

              {doc.summary && (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {doc.summary.shortSummary}
                  </p>
                </div>
              )}

              <div className="mt-3 flex items-center gap-2">
                <button className="flex-1 btn-secondary text-xs py-1.5 justify-center">
                  <Eye size={12} /> Preview
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/documents/${doc.id}`) }}
                  className="flex-1 btn-primary text-xs py-1.5 justify-center"
                >
                  View Details <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  )
}
