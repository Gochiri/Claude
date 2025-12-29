import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { subaccountsAPI } from '../services/api'

export default function Subaccounts() {
  const [subaccounts, setSubaccounts] = useState([])
  const [selectedSub, setSelectedSub] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubaccounts()
  }, [])

  const loadSubaccounts = async () => {
    try {
      const response = await subaccountsAPI.list()
      setSubaccounts(response.data)
    } catch (error) {
      console.error('Failed to load sub-accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Layout><div className="p-8">Loading...</div></Layout>
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sub-accounts</h1>

        {subaccounts.length === 0 ? (
          <div className="card text-center">
            <p className="text-gray-600 mb-4">No sub-accounts found</p>
            <p className="text-sm text-gray-500">
              Sub-accounts will appear here automatically when detected in your GHL dashboard
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subaccounts.map((sub) => (
              <div key={sub.id} className="card">
                <h3 className="text-lg font-semibold mb-2">{sub.name}</h3>
                <p className="text-sm text-gray-600 mb-2">ID: {sub.ghl_subaccount_id}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded ${
                  sub.plan_tier === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                  sub.plan_tier === 'agency' ? 'bg-blue-100 text-blue-800' :
                  sub.plan_tier === 'pro' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {sub.plan_tier.toUpperCase()}
                </span>
                <button
                  onClick={() => setSelectedSub(sub)}
                  className="mt-4 btn btn-primary w-full text-sm"
                >
                  Configure Features
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
