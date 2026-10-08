import { useState, useEffect } from 'react'
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Info,
  Target,
  ChevronDown,
  ChevronUp,
  Square,
  CheckSquare,
  TrendingUp,
  FileWarning,
} from 'lucide-react'
import { useDocumentStore } from '../store/documentStore'
import { mockIssues } from '../data/mockData'
import clsx from 'clsx'

const INSIGHT_CONFIG = {
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-500', titleColor: 'text-amber-900' },
  success: { icon: CheckCircle2, bg: 'bg-emerald-50', border: 'border-emerald-200', iconColor: 'text-emerald-500', titleColor: 'text-emerald-900' },
  action: { icon: Target, bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-500', titleColor: 'text-blue-900' },
  info: { icon: Info, bg: 'bg-slate-50', border: 'border-slate-200', iconColor: 'text-slate-500', titleColor: 'text-slate-900' },
}

const ISSUE_CONFIG = {
  conflict: { icon: AlertTriangle, bg: 'bg-red-50', border: 'border-red-200', iconColor: 'text-red-500', badge: 'badge-error' },
  missing: { icon: FileWarning, bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-500', badge: 'badge-warning' },
  warning: { icon: AlertTriangle, bg: 'bg-orange-50', border: 'border-orange-200', iconColor: 'text-orange-500', badge: 'badge-warning' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-500', badge: 'badge-info' },
}

export default function Insights() {
  const { insights, issues, fetchInsights, toggleActionCompleted } = useDocumentStore()
  const allIssues = mockIssues
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['ins-1']))
  const [activeTab, setActiveTab] = useState<'insights' | 'issues'>('insights')

  // Fetch insights on mount
  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totalActions = insights.flatMap((i) => i.actions || []).length
  const completedActions = insights.flatMap((i) => i.actions || []).filter((a) => a.completed).length
  const progressPct = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0

  const highIssues = allIssues.filter((i) => i.severity === 'high')
  const mediumIssues = allIssues.filter((i) => i.severity === 'medium')

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Insights & Actions</h1>
        <p className="text-sm text-slate-500 mt-0.5">AI-generated insights and recommended actions</p>
      </div>

      {/* Progress bar */}
      <div className="card p-4 mb-5 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-700">Actions Progress</span>
            <span className="text-xs font-semibold text-primary-600">{completedActions}/{totalActions} done</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <div className="text-2xl font-bold text-primary-600">{progressPct}%</div>
      </div>

      {/* Case status banner */}
      <div className="p-4 mb-5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-amber-900">
            ⚠️ Student Application Status: Needs Verification
          </h3>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            Gokul Mahendran's admission application requires resolution of:{' '}
            <strong>Date of Birth conflict</strong>, upload of <strong>Community Certificate</strong>,
            and <strong>Application Signature</strong>.
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="badge-success">✓ Name Matched</span>
            <span className="badge-success">✓ Register No. Matched</span>
            <span className="badge-success">✓ Marksheet Available</span>
            <span className="badge-success">✓ Fee Receipt Available</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="badge-error">✕ Community Certificate</span>
            <span className="badge-warning">⚠ DOB Conflict</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5 w-fit">
        <button
          onClick={() => setActiveTab('insights')}
          className={clsx(
            'px-4 py-2 text-xs font-semibold rounded-lg transition-all',
            activeTab === 'insights' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <TrendingUp size={13} className="inline mr-1.5" />
          Insights ({insights.length})
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={clsx(
            'px-4 py-2 text-xs font-semibold rounded-lg transition-all',
            activeTab === 'issues' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <AlertTriangle size={13} className="inline mr-1.5" />
          Issues ({allIssues.length})
        </button>
      </div>

      {activeTab === 'insights' && (
        <div className="space-y-3">
          {insights.map((insight) => {
            const config = INSIGHT_CONFIG[insight.type]
            const Icon = config.icon
            const isOpen = expanded.has(insight.id)
            const insightActions = insight.actions || []
            const completedCount = insightActions.filter((a) => a.completed).length

            return (
              <div
                key={insight.id}
                className={clsx('rounded-xl border overflow-hidden', config.bg, config.border)}
              >
                <button
                  onClick={() => toggle(insight.id)}
                  className="w-full flex items-start gap-3 p-4 text-left"
                >
                  <Icon size={18} className={clsx('flex-shrink-0 mt-0.5', config.iconColor)} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={clsx('text-sm font-semibold', config.titleColor)}>{insight.title}</h3>
                      <div className="flex items-center gap-2">
                        {insightActions.length > 0 && (
                          <span className="text-xs text-slate-500">
                            {completedCount}/{insightActions.length}
                          </span>
                        )}
                        <span
                          className={clsx(
                            'text-[10px] px-2 py-0.5 rounded-full font-medium',
                            insight.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : insight.priority === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-500'
                          )}
                        >
                          {insight.priority}
                        </span>
                        {isOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{insight.description}</p>
                  </div>
                </button>

                {isOpen && insightActions.length > 0 && (
                  <div className="px-4 pb-4 pt-0 border-t border-white/50">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 mt-2">
                      Recommended Actions
                    </p>
                    <div className="space-y-2">
                      {insightActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => toggleActionCompleted(insight.id, action.id)}
                          className="w-full flex items-start gap-3 p-2.5 rounded-xl bg-white/70 hover:bg-white transition-colors text-left"
                        >
                          {action.completed ? (
                            <CheckSquare size={16} className="text-primary-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Square size={16} className="text-slate-300 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p
                              className={clsx(
                                'text-sm font-medium',
                                action.completed ? 'line-through text-slate-400' : 'text-slate-800'
                              )}
                            >
                              {action.label}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="space-y-3">
          {highIssues.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">
                🔴 Critical Issues ({highIssues.length})
              </p>
              {highIssues.map((issue) => {
                const config = ISSUE_CONFIG[issue.type]
                const Icon = config.icon
                return (
                  <div key={issue.id} className={clsx('rounded-xl border p-4 mb-2', config.bg, config.border)}>
                    <div className="flex items-start gap-3">
                      <Icon size={18} className={clsx('flex-shrink-0 mt-0.5', config.iconColor)} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-slate-900">{issue.title}</h3>
                          <span className={clsx(issue.type === 'conflict' ? 'badge-error' : 'badge-warning')}>
                            {issue.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{issue.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {mediumIssues.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
                🟡 Warnings ({mediumIssues.length})
              </p>
              {mediumIssues.map((issue) => {
                const config = ISSUE_CONFIG[issue.type]
                const Icon = config.icon
                return (
                  <div key={issue.id} className={clsx('rounded-xl border p-4 mb-2', config.bg, config.border)}>
                    <div className="flex items-start gap-3">
                      <Icon size={18} className={clsx('flex-shrink-0 mt-0.5', config.iconColor)} />
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-0.5">{issue.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{issue.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
