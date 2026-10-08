import clsx from 'clsx'
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react'
import type { DocumentStatus } from '../../types'

interface StatusBadgeProps {
  status: DocumentStatus
  className?: string
}

const statusConfig = {
  completed: { label: 'Processed', icon: CheckCircle2, classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  processing: { label: 'Processing', icon: Loader2, classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  uploading: { label: 'Uploading', icon: Clock, classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  failed: { label: 'Failed', icon: XCircle, classes: 'bg-red-50 text-red-700 border-red-200' },
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
        config.classes,
        className
      )}
    >
      <Icon size={11} className={status === 'processing' ? 'animate-spin' : ''} />
      {config.label}
    </span>
  )
}
