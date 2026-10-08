import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  DollarSign,
  Users,
  Target,
  MessageSquare,
  FileWarning,
  Sparkles,
  Tag,
} from 'lucide-react'
import { format } from 'date-fns'
import { useDocumentStore } from '../store/documentStore'
import { documentsApi } from '../services/api'
import { mockIssues } from '../data/mockData'
import FileTypeIcon from '../components/ui/FileTypeIcon'
import StatusBadge from '../components/ui/StatusBadge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import type { Document } from '../types'

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { documents, fetchDocuments } = useDocumentStore()
  const [doc, setDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDocument = async () => {
      if (!id) return

      try {
        setLoading(true)
        
        // Try to get from store first
        const cached = documents.find((d) => d.id === id)
        if (cached) {
          setDoc(cached)
          setLoading(false)
          return
        }

        // Fetch from API if not in store
        const response = await documentsApi.getById(id)
        setDoc(response.data)
      } catch (error) {
        console.error('Failed to load document:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDocument()
  }, [id, documents])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Loading document..." />
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">Document not found.</p>
        <button onClick={() => navigate('/documents')} className="btn-primary mt-4">
          Back to Documents
        </button>
      </div>
    )
  }

  const docIssues = mockIssues.filter((i) => i.documentIds?.includes(doc.id))

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <button
        onClick={() => navigate('/documents')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-5 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Documents
      </button>

      <div className="flex items-start gap-4 mb-6">
        <FileTypeIcon type={doc.type} size="lg" />
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">{doc.name}</h1>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <StatusBadge status={doc.status} />
            <span className="text-sm text-slate-400">{doc.pages} pages</span>
            <span className="text-sm text-slate-400">
              Uploaded {format(new Date(doc.uploadedAt), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate('/assistant')}
          className="btn-primary"
        >
          <MessageSquare size={15} />
          Ask AI
        </button>
      </div>

      {/* Issues Alert */}
      {docIssues.length > 0 && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-900">
              {docIssues.length} Issue{docIssues.length > 1 ? 's' : ''} Detected
            </h3>
          </div>
          {docIssues.map((issue) => (
            <div key={issue.id} className="mt-2">
              <p className="text-xs font-medium text-amber-800">{issue.title}</p>
              <p className="text-xs text-amber-700 mt-0.5">{issue.description}</p>
            </div>
          ))}
        </div>
      )}

      {doc.status !== 'completed' ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} className="text-primary-500" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">AI Processing in Progress</h3>
          <p className="text-sm text-slate-500 mt-1">
            The AI is analyzing this document. Check back shortly.
          </p>
        </div>
      ) : doc.summary ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Summary */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-primary-500" />
                <h2 className="text-sm font-semibold text-slate-900">AI Summary</h2>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{doc.summary.shortSummary}</p>
            </div>

            {/* Key Points */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target size={16} className="text-primary-500" />
                <h2 className="text-sm font-semibold text-slate-900">Key Points</h2>
              </div>
              <ul className="space-y-2">
                {doc.summary.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-primary-600">{i + 1}</span>
                    </div>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Dates */}
            {doc.summary.importantDates.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={16} className="text-primary-500" />
                  <h2 className="text-sm font-semibold text-slate-900">Important Dates</h2>
                </div>
                <div className="space-y-2">
                  {doc.summary.importantDates.map((d, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <span className="text-sm text-slate-500">{d.label}</span>
                      <span className="text-sm font-medium text-slate-900">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amounts */}
            {doc.summary.amounts.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign size={16} className="text-primary-500" />
                  <h2 className="text-sm font-semibold text-slate-900">Financial Amounts</h2>
                </div>
                <div className="space-y-2">
                  {doc.summary.amounts.map((a, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <span className="text-sm text-slate-500">{a.label}</span>
                      <span className="text-sm font-semibold text-emerald-700">{a.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {doc.summary.actionItems.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={16} className="text-amber-500" />
                  <h2 className="text-sm font-semibold text-slate-900">Recommended Actions</h2>
                </div>
                <div className="space-y-2">
                  {doc.summary.actionItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-amber-50 border border-amber-100">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                      <span className="text-sm text-amber-900">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Names */}
            {doc.summary.names.length > 0 && (
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={15} className="text-primary-500" />
                  <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">People / Orgs</h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {doc.summary.names.map((n, i) => (
                    <span key={i} className="badge-primary text-[11px]">{n}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Entities */}
            {doc.summary.entities.length > 0 && (
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={15} className="text-primary-500" />
                  <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Entities</h2>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {doc.summary.entities.map((e, i) => (
                    <span key={i} className="badge-info text-[11px]">{e}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Deadlines */}
            {doc.summary.deadlines.length > 0 && (
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={15} className="text-amber-500" />
                  <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Deadlines</h2>
                </div>
                <div className="space-y-2">
                  {doc.summary.deadlines.map((d, i) => (
                    <div key={i} className="p-2 bg-amber-50 rounded-lg border border-amber-100">
                      <p className="text-xs text-amber-800">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Fields */}
            {doc.missingFields && doc.missingFields.length > 0 && (
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileWarning size={15} className="text-primary-500" />
                  <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Field Check</h2>
                </div>
                <div className="space-y-1.5">
                  {doc.missingFields.map((f, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs text-slate-700">{f.fieldName}</span>
                      <div className="flex items-center gap-1">
                        {f.importance === 'required' && (
                          <span className="text-[9px] text-slate-400">req</span>
                        )}
                        {f.isPresent ? (
                          <CheckCircle2 size={13} className="text-emerald-500" />
                        ) : (
                          <XCircle size={13} className="text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {doc.missingFields.filter((f) => !f.isPresent).length > 0 && (
                  <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-xs text-red-700 font-medium">
                      ⚠️ {doc.missingFields.filter((f) => !f.isPresent).length} required field
                      {doc.missingFields.filter((f) => !f.isPresent).length > 1 ? 's' : ''} missing
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
