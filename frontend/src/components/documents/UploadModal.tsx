import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useDocumentStore } from '../../store/documentStore'
import { documentsApi } from '../../services/api'
import type { DocumentType } from '../../types'

interface UploadModalProps {
  onClose: () => void
}

interface UploadFile {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'processing' | 'done' | 'error'
  progress: number
}

function getDocType(file: File): DocumentType {
  const name = file.name.toLowerCase()
  if (name.endsWith('.pdf')) return 'pdf'
  if (name.endsWith('.docx') || name.endsWith('.doc')) return 'docx'
  if (name.endsWith('.txt')) return 'txt'
  return 'image'
}

export default function UploadModal({ onClose }: UploadModalProps) {
  const { fetchDocuments } = useDocumentStore()
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles: UploadFile[] = accepted.map((file) => ({
      id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      status: 'pending',
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    },
    maxSize: 50 * 1024 * 1024,
    onDropRejected: (rejected) => {
      rejected.forEach((r) => {
        const err = r.errors[0]
        if (err.code === 'file-too-large') toast.error(`${r.file.name} exceeds 50MB limit`)
        else toast.error(`${r.file.name}: ${err.message}`)
      })
    },
  })

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id))

  const uploadToBackend = async (uploadFile: UploadFile) => {
    try {
      setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: 'uploading' } : f)))

      const formData = new FormData()
      formData.append('files', uploadFile.file)

      await documentsApi.upload(formData)

      setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: 'done', progress: 100 } : f)))
    } catch (error) {
      console.error('Upload failed:', error)
      setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: 'error' } : f)))
      throw error
    }
  }

  const handleUploadAll = async () => {
    const pending = files.filter((f) => f.status === 'pending')
    if (!pending.length) return
    
    setIsProcessing(true)
    
    try {
      await Promise.all(pending.map(uploadToBackend))
      toast.success(`${pending.length} document${pending.length > 1 ? 's' : ''} uploaded successfully!`)
      
      // Refresh document list from backend
      await fetchDocuments()
      
      setTimeout(onClose, 1000)
    } catch (error) {
      toast.error('Some documents failed to upload')
    } finally {
      setIsProcessing(false)
    }
  }

  const pendingCount = files.filter((f) => f.status === 'pending').length
  const doneCount = files.filter((f) => f.status === 'done').length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-elevated w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Upload Documents</h2>
            <p className="text-xs text-slate-500 mt-0.5">PDF, DOCX, TXT, Images up to 50MB</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Drop zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? 'border-primary-400 bg-primary-50'
                : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                <Upload size={22} className="text-primary-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {isDragActive ? 'Drop files here' : 'Drop files or click to browse'}
                </p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOCX, TXT, JPG, PNG · Max 50MB each</p>
              </div>
            </div>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {files.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <FileText size={16} className="text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">{f.file.name}</p>
                    <p className="text-xs text-slate-400">
                      {(f.file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                    {(f.status === 'uploading' || f.status === 'processing') && (
                      <div className="mt-1.5 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-300"
                          style={{ width: f.status === 'processing' ? '80%' : `${f.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {f.status === 'pending' && (
                      <button onClick={() => removeFile(f.id)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400">
                        <X size={13} />
                      </button>
                    )}
                    {(f.status === 'uploading' || f.status === 'processing') && (
                      <Loader2 size={14} className="text-primary-500 animate-spin" />
                    )}
                    {f.status === 'done' && <CheckCircle2 size={14} className="text-emerald-500" />}
                    {f.status === 'error' && <AlertCircle size={14} className="text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <p className="text-xs text-slate-500">
            {files.length === 0 ? 'No files selected' : `${files.length} file${files.length > 1 ? 's' : ''} selected`}
            {doneCount > 0 && ` · ${doneCount} processed`}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="btn-secondary text-xs py-2 px-3">
              Cancel
            </button>
            <button
              onClick={handleUploadAll}
              disabled={pendingCount === 0 || isProcessing}
              className="btn-primary text-xs py-2 px-4"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload size={13} />
                  Upload {pendingCount > 0 ? `(${pendingCount})` : ''}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
