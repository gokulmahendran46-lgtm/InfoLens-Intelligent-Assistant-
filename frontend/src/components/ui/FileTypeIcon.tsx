import { FileText, FileImage, File } from 'lucide-react'
import clsx from 'clsx'
import type { DocumentType } from '../../types'

interface FileTypeIconProps {
  type: DocumentType
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const typeConfig = {
  pdf: { icon: FileText, bg: 'bg-red-50', color: 'text-red-500', label: 'PDF' },
  docx: { icon: FileText, bg: 'bg-blue-50', color: 'text-blue-500', label: 'DOCX' },
  txt: { icon: File, bg: 'bg-slate-100', color: 'text-slate-500', label: 'TXT' },
  image: { icon: FileImage, bg: 'bg-emerald-50', color: 'text-emerald-500', label: 'IMG' },
}

const sizeConfig = {
  sm: { wrapper: 'w-8 h-8', icon: 14, text: 'text-[8px]' },
  md: { wrapper: 'w-10 h-10', icon: 18, text: 'text-[9px]' },
  lg: { wrapper: 'w-14 h-14', icon: 24, text: 'text-[10px]' },
}

export default function FileTypeIcon({ type, size = 'md', className }: FileTypeIconProps) {
  const config = typeConfig[type]
  const Icon = config.icon
  const s = sizeConfig[size]

  return (
    <div
      className={clsx(
        'rounded-xl flex flex-col items-center justify-center gap-0.5 flex-shrink-0',
        config.bg,
        s.wrapper,
        className
      )}
    >
      <Icon size={s.icon} className={config.color} />
      <span className={clsx('font-bold leading-none', config.color, s.text)}>{config.label}</span>
    </div>
  )
}
