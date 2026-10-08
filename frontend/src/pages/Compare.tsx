import { useState, useEffect } from 'react'
import { GitCompare, ArrowRight, CheckCircle2, AlertTriangle, Plus, Minus, RefreshCw, Loader2 } from 'lucide-react'
import { useDocumentStore } from '../store/documentStore'
import { compareApi } from '../services/api'
import type { ComparisonResult } from '../types'
import FileTypeIcon from '../components/ui/FileTypeIcon'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  match: { label: 'Match', classes: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2, iconClass: 'text-emerald-500' },
  conflict: { label: 'Conflict', classes: 'bg-red-50 text-red-700', icon: AlertTriangle, iconClass: 'text-red-500' },
  added: { label: 'Added', classes: 'bg-blue-50 text-blue-700', icon: Plus, iconClass: 'text-blue-500' },
  removed: { label: 'Removed', classes: 'bg-slate-100 text-slate-600', icon: Minus, iconClass: 'text-slate-400' },
  changed: { label: 'Changed', classes: 'bg-amber-50 text-amber-700', icon: RefreshCw, iconClass: 'text-amber-500' },
}

export default function Compare() {
  const { documents, fetchDocuments } = useDocumentStore()
  const completed = documents.filter((d) => d.status === 'completed')

  const [docAId, setDocAId] = useState('')
  const [docBId, setDocBId] = useState('')
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch documents and set default selections
  useEffect(() => {
    fetchDocuments().then(() => {
      const docs = documents.filter((d) => d.status === 'completed')
      if (docs.length >= 2) {
        setDocAId(docs[0].id)
        setDocBId(docs[docs.length > 2 ? 2 : 1].id)
      }
    })
  }, [fetchDocuments])

  const docA = documents.find((d) => d.id === docAId)
  const docB = documents.find((d) => d.id === docBId)

  const handleCompare = async () => {
    if (!docAId || !docBId || docAId === docBId) return
    
    setLoading(true)
    try {
      const response = await compareApi.compare(docAId, docBId)
      setResult(response.data)
    } catch (error) {
      console.error('Comparison failed:', error)
      toast.error('Failed to compare documents')
    } finally {
      setLoading(false)
    }
  }

  const conflicts = result?.differences.filter((d) => d.status === 'conflict') || []
  const matches = result?.differences.filter((d) => d.status === 'match') || []

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Document Comparison</h1>
        <p className="text-sm text-slate-500 mt-0.5">Select two documents to compare and find differences</p>
      </div>

      {/* Document Selector */}
      <div className="card p-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Doc A */}
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2 block">
              Document A
            </label>
            <select
              value={docAId}
              onChange={(e) => { setDocAId(e.target.value); setResult(null) }}
              className="input"
            >
              <option value="">Select document...</option>
              {completed.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            {docA && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-slate-50 rounded-lg">
                <FileTypeIcon type={docA.type} size="sm" />
                <p className="text-xs text-slate-600 truncate">{docA.name}</p>
              </div>
            )}
          </div>

          {/* VS */}
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
              <GitCompare size={18} className="text-primary-500" />
            </div>
          </div>

          {/* Doc B */}
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2 block">
              Document B
            </label>
            <select
              value={docBId}
              onChange={(e) => { setDocBId(e.target.value); setResult(null) }}
              className="input"
            >
              <option value="">Select document...</option>
              {completed.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            {docB && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-slate-50 rounded-lg">
                <FileTypeIcon type={docB.type} size="sm" />
                <p className="text-xs text-slate-600 truncate">{docB.name}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleCompare}
            disabled={!docAId || !docBId || docAId === docBId || loading}
            className="btn-primary px-8"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <GitCompare size={15} />
                Compare Documents
              </>
            )}
          </button>
        </div>

        {docAId === docBId && docAId && (
          <p className="text-center text-xs text-red-500 mt-2">Please select two different documents</p>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="card p-12 text-center">
          <Loader2 size={32} className="text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-900">AI is analyzing both documents...</p>
          <p className="text-xs text-slate-400 mt-1">Comparing structure, dates, names, and values</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Comparison Summary</h2>
                <p className="text-xs text-slate-500 mt-0.5">{result.summary}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">{result.matchScore}%</div>
                <div className="text-xs text-slate-500">Match Score</div>
              </div>
            </div>

            {/* Score bar */}
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                style={{ width: `${result.matchScore}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="text-xl font-bold text-emerald-700">{matches.length}</div>
                <div className="text-xs text-emerald-600 mt-0.5">Matching</div>
              </div>
              <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                <div className="text-xl font-bold text-red-700">{conflicts.length}</div>
                <div className="text-xs text-red-600 mt-0.5">Conflicts</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="text-xl font-bold text-amber-700">
                  {result.differences.filter((d) => d.status !== 'match').length}
                </div>
                <div className="text-xs text-amber-600 mt-0.5">Differences</div>
              </div>
            </div>
          </div>

          {/* Differences Table */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">Detailed Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide w-1/4">
                      Category
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide w-1/3">
                      {result.documentA.name.slice(0, 25)}...
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide w-1/3">
                      {result.documentB.name.slice(0, 25)}...
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {result.differences.map((diff, i) => {
                    const config = STATUS_CONFIG[diff.status]
                    const StatusIcon = config.icon
                    return (
                      <tr
                        key={i}
                        className={clsx(
                          'transition-colors',
                          diff.status === 'conflict' ? 'bg-red-50/40' : 'hover:bg-slate-50/80'
                        )}
                      >
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-slate-900">{diff.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={clsx(
                              'text-sm',
                              diff.status === 'conflict' ? 'text-red-700 font-medium' : 'text-slate-700'
                            )}
                          >
                            {diff.valueA || <span className="text-slate-300 italic text-xs">—</span>}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={clsx(
                              'text-sm',
                              diff.status === 'conflict' ? 'text-red-700 font-medium' : 'text-slate-700'
                            )}
                          >
                            {diff.valueB || <span className="text-slate-300 italic text-xs">—</span>}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={clsx(
                              'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full',
                              config.classes
                            )}
                          >
                            <StatusIcon size={10} className={config.iconClass} />
                            {config.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conflict callout */}
          {conflicts.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-red-600" />
                <h3 className="text-sm font-semibold text-red-900">
                  ⚠️ {conflicts.length} Information Conflict{conflicts.length > 1 ? 's' : ''} Detected
                </h3>
              </div>
              {conflicts.map((c, i) => (
                <div key={i} className="mt-2 grid grid-cols-2 gap-3">
                  <div className="p-2 bg-white rounded-lg border border-red-100">
                    <p className="text-xs text-slate-500 mb-0.5">{result.documentA.name.split('_')[0]}</p>
                    <p className="text-sm font-medium text-red-800">{c.category}: {c.valueA}</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-red-100">
                    <p className="text-xs text-slate-500 mb-0.5">{result.documentB.name.split('_')[0]}</p>
                    <p className="text-sm font-medium text-red-800">{c.category}: {c.valueB}</p>
                  </div>
                </div>
              ))}
              <p className="text-xs text-red-600 mt-3">
                👆 These conflicts must be resolved before the document is accepted.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
