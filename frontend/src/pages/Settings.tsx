import { useState } from 'react'
import { Save, Key, Database, Cpu, Bell, Shield, Moon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gpt-4o')
  const [notifications, setNotifications] = useState(true)
  const [autoProcess, setAutoProcess] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const handleSave = () => {
    toast.success('Settings saved successfully')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Configure your InfoLens environment</p>
      </div>

      <div className="space-y-5">
        {/* AI Configuration */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={16} className="text-primary-500" />
            <h2 className="text-sm font-semibold text-slate-900">AI Configuration</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">
                AI Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="input"
              >
                <option value="gpt-4o">GPT-4o (Recommended)</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">
                API Key
              </label>
              <div className="relative">
                <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="input pl-9"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Your API key is stored securely and never shared. Set via environment variable for production.
              </p>
            </div>
          </div>
        </div>

        {/* Document Processing */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Database size={16} className="text-primary-500" />
            <h2 className="text-sm font-semibold text-slate-900">Document Processing</h2>
          </div>
          <div className="space-y-3">
            <ToggleSetting
              label="Auto-process on upload"
              description="Automatically extract and analyze documents after upload"
              value={autoProcess}
              onChange={setAutoProcess}
            />
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">
                Max File Size
              </label>
              <select className="input">
                <option>10 MB</option>
                <option selected>50 MB</option>
                <option>100 MB</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5 block">
                OCR Language
              </label>
              <select className="input">
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
                <option>Multi-language</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-primary-500" />
            <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
          </div>
          <div className="space-y-3">
            <ToggleSetting
              label="Processing complete"
              description="Notify when document analysis is complete"
              value={notifications}
              onChange={setNotifications}
            />
            <ToggleSetting
              label="Conflict alerts"
              description="Alert when conflicts are detected between documents"
              value={true}
              onChange={() => {}}
            />
            <ToggleSetting
              label="Missing information"
              description="Alert when important fields are missing"
              value={true}
              onChange={() => {}}
            />
          </div>
        </div>

        {/* Security */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-primary-500" />
            <h2 className="text-sm font-semibold text-slate-900">Security</h2>
          </div>
          <div className="space-y-3">
            <ToggleSetting
              label="Require authentication"
              description="Users must log in to access documents"
              value={true}
              onChange={() => {}}
            />
            <ToggleSetting
              label="Secure document access"
              description="Encrypt documents at rest and in transit"
              value={true}
              onChange={() => {}}
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Moon size={16} className="text-primary-500" />
            <h2 className="text-sm font-semibold text-slate-900">Appearance</h2>
          </div>
          <ToggleSetting
            label="Dark Mode"
            description="Switch to dark theme (coming soon)"
            value={darkMode}
            onChange={setDarkMode}
            disabled
          />
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} className="btn-primary px-6">
            <Save size={15} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function ToggleSetting({
  label,
  description,
  value,
  onChange,
  disabled,
}: {
  label: string
  description: string
  value: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
          value ? 'bg-primary-500' : 'bg-slate-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}
