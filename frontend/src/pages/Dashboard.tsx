import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Upload,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Zap,
  ChevronRight,
} from 'lucide-react'
import { format } from 'date-fns'
import { useDocumentStore } from '../store/documentStore'
import FileTypeIcon from '../components/ui/FileTypeIcon'
import StatusBadge from '../components/ui/StatusBadge'
import UploadModal from '../components/documents/UploadModal'

export default function Dashboard() {
  const navigate = useNavigate()
  const { documents, issues, insights, fetchDocuments, fetchInsights } = useDocumentStore()
  const [showUpload, setShowUpload] = useState(false)

  // Fetch data on mount
  useEffect(() => {
    fetchDocuments()
    fetchInsights()
  }, [fetchDocuments, fetchInsights])

  const stats = {
    total: documents.length,
    processed: documents.filter((d) => d.status === 'completed').length,
    issues: issues.filter((i) => i.severity === 'high').length,
    pending: insights.flatMap((i) => i.actions || []).filter((a) => !a.completed).length,
  }

  const recentDocs = documents.slice(0, 4)
  const criticalIssues = issues.filter((i) => i.severity === 'high').slice(0, 3)
  const topInsights = insights.filter((i) => i.priority === 'high').slice(0, 2)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back 👋</h1>
          <p className="text-slate-500 text-sm mt-1">
            {format(new Date(), 'EEEE, MMMM d yyyy')} · College Administration System
          </p>
        </div>
        <button onClick={() => setShowUpload(true)} className="btn-primary">
          <Upload size={16} />
          Upload Documents
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Documents"
          value={stats.total}
          icon={FileText}
          color="blue"
          onClick={() => navigate('/documents')}
        />
        <StatCard
          label="Processed"
          value={stats.processed}
          icon={CheckCircle2}
          color="emerald"
          onClick={() => navigate('/documents')}
        />
        <StatCard
          label="Important Issues"
          value={stats.issues}
          icon={AlertTriangle}
          color="red"
          highlight={stats.issues > 0}
          onClick={() => navigate('/insights')}
        />
        <StatCard
          label="Pending Actions"
          value={stats.pending}
          icon={Clock}
          color="amber"
          onClick={() => navigate('/insights')}
        />
      </div>

      {/* Demo Scenario Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-5 mb-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-16 w-32 h-32 bg-white rounded-full translate-y-1/2" />
        </div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} fill="white" />
              <span className="text-xs font-semibold uppercase tracking-wide opacity-80">Active Demo Case</span>
            </div>
            <h3 className="text-lg font-bold">Student: Gokul Mahendran</h3>
            <p className="text-sm opacity-80 mt-0.5">B.Tech CSE Application · 4 documents uploaded</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="flex items-center gap-1.5 text-xs bg-white/20 rounded-full px-3 py-1">
                <CheckCircle2 size={11} /> 2 Verified
              </span>
              <span className="flex items-center gap-1.5 text-xs bg-white/20 rounded-full px-3 py-1">
                <AlertCircle size={11} /> 1 Conflict
              </span>
              <span className="flex items-center gap-1.5 text-xs bg-amber-300/30 text-amber-100 rounded-full px-3 py-1 border border-amber-300/40">
                ⚠️ Needs Verification
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/documents/doc-1')}
            className="hidden md:flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            View Details <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Documents */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Recent Documents</h2>
            <button
              onClick={() => navigate('/documents')}
              className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {recentDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => navigate(`/documents/${doc.id}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
              >
                <FileTypeIcon type={doc.type} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {doc.pages} page{doc.pages !== 1 ? 's' : ''} ·{' '}
                    {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={doc.status} />
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Issues + Actions */}
        <div className="space-y-4">
          {/* Critical Issues */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">Important Issues</h2>
              <button
                onClick={() => navigate('/insights')}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                View all
              </button>
            </div>
            <div className="space-y-2">
              {criticalIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-red-50 border border-red-100"
                >
                  <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-900">{issue.title}</p>
                    <p className="text-xs text-red-600 mt-0.5 leading-relaxed line-clamp-2">
                      {issue.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Actions Preview */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">Recommended Actions</h2>
              <button
                onClick={() => navigate('/insights')}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                View all
              </button>
            </div>
            <div className="space-y-2">
              {topInsights[0]?.actions?.slice(0, 3).map((action) => (
                <div key={action.id} className="flex items-start gap-2.5">
                  <div
                    className={`w-4 h-4 rounded border-2 mt-0.5 flex-shrink-0 ${
                      action.completed
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-slate-300'
                    }`}
                  />
                  <p
                    className={`text-xs leading-relaxed ${
                      action.completed ? 'line-through text-slate-400' : 'text-slate-700'
                    }`}
                  >
                    {action.label}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/insights')}
              className="mt-3 w-full text-center text-xs text-primary-600 hover:text-primary-700 font-medium py-1.5 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <TrendingUp size={12} className="inline mr-1" />
              View All Insights & Actions
            </button>
          </div>
        </div>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number
  icon: React.ElementType
  color: 'blue' | 'emerald' | 'red' | 'amber'
  highlight?: boolean
  onClick?: () => void
}

function StatCard({ label, value, icon: Icon, color, highlight, onClick }: StatCardProps) {
  const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-500', text: 'text-blue-900' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', text: 'text-emerald-900' },
    red: { bg: 'bg-red-50', icon: 'text-red-500', text: 'text-red-900' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-500', text: 'text-amber-900' },
  }
  const c = colorMap[color]

  return (
    <button
      onClick={onClick}
      className={`card p-5 text-left hover:shadow-card-hover transition-all duration-200 group ${
        highlight ? 'ring-2 ring-red-200' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center`}>
          <Icon size={18} className={c.icon} />
        </div>
        <ArrowRight
          size={14}
          className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all"
        />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
    </button>
  )
}
