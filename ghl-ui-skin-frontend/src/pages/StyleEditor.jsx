import { useState, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'
import Layout from '../components/Layout'
import { stylesAPI } from '../services/api'

export default function StyleEditor() {
  const [styles, setStyles] = useState({
    primary_color: '#4F46E5',
    secondary_color: '#10B981',
    accent_color: '#F59E0B',
    sidebar_bg: '#1F2937',
    sidebar_text: '#F9FAFB',
    font_family: 'Inter',
    font_size_base: 14,
    custom_css: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeColorPicker, setActiveColorPicker] = useState(null)

  useEffect(() => {
    loadStyles()
  }, [])

  const loadStyles = async () => {
    try {
      const response = await stylesAPI.get()
      setStyles(response.data)
    } catch (error) {
      console.error('Failed to load styles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      await stylesAPI.update(styles)
      setMessage('Styles saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to save styles')
    } finally {
      setSaving(false)
    }
  }

  const ColorInput = ({ label, field }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center space-x-2">
        <div
          className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer"
          style={{ backgroundColor: styles[field] }}
          onClick={() => setActiveColorPicker(activeColorPicker === field ? null : field)}
        />
        <input
          type="text"
          value={styles[field]}
          onChange={(e) => setStyles({ ...styles, [field]: e.target.value })}
          className="input flex-1"
          placeholder="#000000"
        />
      </div>

      {activeColorPicker === field && (
        <div className="absolute z-10 mt-2">
          <div className="fixed inset-0" onClick={() => setActiveColorPicker(null)} />
          <div className="relative bg-white p-3 rounded-lg shadow-lg">
            <HexColorPicker
              color={styles[field]}
              onChange={(color) => setStyles({ ...styles, [field]: color })}
            />
          </div>
        </div>
      )}
    </div>
  )

  if (loading) {
    return <Layout><div className="p-8">Loading...</div></Layout>
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Style Editor</h1>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}

        <div className="space-y-8">
          {/* Colors Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorInput label="Primary Color" field="primary_color" />
              <ColorInput label="Secondary Color" field="secondary_color" />
              <ColorInput label="Accent Color" field="accent_color" />
              <ColorInput label="Sidebar Background" field="sidebar_bg" />
              <ColorInput label="Sidebar Text" field="sidebar_text" />
            </div>
          </div>

          {/* Typography Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Typography</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={styles.font_family}
                  onChange={(e) => setStyles({ ...styles, font_family: e.target.value })}
                  className="input"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Font Size (px)
                </label>
                <input
                  type="number"
                  value={styles.font_size_base}
                  onChange={(e) => setStyles({ ...styles, font_size_base: parseInt(e.target.value) })}
                  className="input"
                  min="12"
                  max="18"
                />
              </div>
            </div>
          </div>

          {/* Custom CSS Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Custom CSS</h2>
            <textarea
              value={styles.custom_css}
              onChange={(e) => setStyles({ ...styles, custom_css: e.target.value })}
              className="input font-mono text-sm"
              rows="10"
              placeholder="/* Add your custom CSS here */"
            />
            <p className="mt-2 text-sm text-gray-500">
              Advanced users can add custom CSS to further customize the appearance.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
