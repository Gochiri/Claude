import { Link } from 'react-router-dom'
import { Palette, Users, Code } from 'lucide-react'
import Layout from '../components/Layout'

export default function Dashboard() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Style Editor Card */}
          <Link to="/styles" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Palette className="w-8 h-8 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold">Style Editor</h2>
            </div>
            <p className="text-gray-600">
              Customize colors, fonts, and branding for your GHL dashboard
            </p>
          </Link>

          {/* Subaccounts Card */}
          <Link to="/subaccounts" className="card hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold">Sub-accounts</h2>
            </div>
            <p className="text-gray-600">
              Manage feature locks and plans for your client sub-accounts
            </p>
          </Link>

          {/* Installation Card */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Code className="w-8 h-8 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold">Installation</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Add this script to your GHL Agency settings:
            </p>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
              {'<script src="https://cdn.tudominio.com/inject.js"></script>'}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
