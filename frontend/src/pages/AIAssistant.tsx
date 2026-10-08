import { useState, useRef, useEffect } from 'react'
import {
  Send,
  MessageSquare,
  Sparkles,
  FileText,
  Loader2,
  Trash2,
  ChevronDown,
} from 'lucide-react'
import { format } from 'date-fns'
import { useDocumentStore } from '../store/documentStore'
import { chatApi } from '../services/api'
import type { ChatMessage } from '../types'
import toast from 'react-hot-toast'

const SUGGESTED_QUESTIONS = [
  'What is the deadline for submission?',
  'What is the total amount paid?',
  'Who is responsible for this case?',
  'What information is missing?',
  'What is the Date of Birth discrepancy?',
  'Is the student eligible for admission?',
]

function parseMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter((c) => c.trim())
      return `<span class="flex gap-4">${cells.map((c) => `<span class="flex-1">${c.trim()}</span>`).join('')}</span>`
    })
}

export default function AIAssistant() {
  const { chatMessages, addChatMessage, clearChat, documents } = useDocumentStore()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [showDocFilter, setShowDocFilter] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, isTyping])

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim()
    if (!msg) return

    setInput('')
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: msg,
      timestamp: new Date().toISOString(),
    }
    addChatMessage(userMsg)
    setIsTyping(true)

    try {
      const response = await chatApi.sendMessage(msg, selectedDocs.length > 0 ? selectedDocs : undefined)
      
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString(),
        sourceDocuments: response.data.source_documents,
      }
      addChatMessage(assistantMsg)
    } catch (error) {
      console.error('Chat error:', error)
      toast.error('Failed to get AI response')
      
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      }
      addChatMessage(errorMsg)
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const completedDocs = documents.filter((d) => d.status === 'completed')

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <Sparkles size={17} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900">AI Assistant</h1>
            <p className="text-xs text-slate-400">Ask questions about your documents</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Document filter */}
          <div className="relative">
            <button
              onClick={() => setShowDocFilter(!showDocFilter)}
              className="btn-secondary text-xs py-2 gap-1.5"
            >
              <FileText size={13} />
              {selectedDocs.length === 0 ? 'All Docs' : `${selectedDocs.length} selected`}
              <ChevronDown size={12} />
            </button>
            {showDocFilter && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-elevated border border-slate-200 z-10 p-2">
                <p className="text-xs text-slate-400 px-2 py-1 font-medium">Filter by document</p>
                {completedDocs.map((doc) => (
                  <label key={doc.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes(doc.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedDocs([...selectedDocs, doc.id])
                        else setSelectedDocs(selectedDocs.filter((id) => id !== doc.id))
                      }}
                      className="accent-primary-500"
                    />
                    <span className="text-xs text-slate-700 truncate">{doc.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <button onClick={clearChat} className="btn-ghost text-xs py-2">
            <Trash2 size={13} />
            Clear
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles size={14} className="text-white" />
              </div>
            )}
            <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-sm'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-card'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }}
                    className="prose prose-sm max-w-none"
                  />
                ) : (
                  msg.content
                )}
              </div>

              {msg.role === 'assistant' && msg.sourceDocuments && msg.sourceDocuments.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1">
                  <FileText size={11} className="text-slate-400" />
                  <span className="text-[11px] text-slate-400">
                    Referenced: {msg.sourceDocuments.map((d) => d.name).join(', ')}
                  </span>
                </div>
              )}

              <span className="text-[10px] text-slate-400">
                {format(new Date(msg.timestamp), 'h:mm a')}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-card">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      <div className="px-6 py-2 flex items-center gap-2 overflow-x-auto flex-shrink-0 border-t border-slate-100">
        <MessageSquare size={12} className="text-slate-400 flex-shrink-0" />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="flex-shrink-0 text-xs px-3 py-1.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-full hover:bg-primary-100 transition-colors font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-6 py-4 bg-white border-t border-slate-200 flex-shrink-0">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your documents..."
              rows={1}
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              style={{ maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
          >
            {isTyping ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
