'use client'

import { mockContacts, mockOpportunities, mockProperties, mockConversations } from '@/data/mock'
import { PIPELINE_STAGES } from '@/types'
import { ContactsIcon, PropertyIcon, DollarIcon, ChatIcon, TrendingUpIcon, CalendarIcon } from '@/components/icons'

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string; icon: React.ComponentType<{ className?: string; size?: number }>; color: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="text-white" size={20} />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const activeOpps = mockOpportunities.filter(o => !['closed_won', 'closed_lost'].includes(o.stage))
  const totalPipelineValue = activeOpps.reduce((sum, o) => sum + o.value, 0)
  const newLeadsThisMonth = mockContacts.filter(c => {
    const d = new Date(c.createdAt)
    return d.getMonth() === 1 && d.getFullYear() === 2026
  }).length
  const unreadConvos = mockConversations.reduce((sum, c) => sum + c.unreadCount, 0)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen general de tu negocio inmobiliario</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Contactos totales" value={mockContacts.length} sub={`${newLeadsThisMonth} nuevos este mes`} icon={ContactsIcon} color="bg-blue-500" />
        <StatCard label="Oportunidades activas" value={activeOpps.length} sub={`USD ${totalPipelineValue.toLocaleString()} en pipeline`} icon={TrendingUpIcon} color="bg-purple-500" />
        <StatCard label="Propiedades" value={mockProperties.length} sub={`${mockProperties.filter(p => p.status === 'available').length} disponibles`} icon={PropertyIcon} color="bg-green-500" />
        <StatCard label="Mensajes sin leer" value={unreadConvos} sub={`${mockConversations.length} conversaciones activas`} icon={ChatIcon} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold mb-4">Pipeline de ventas</h2>
          <div className="space-y-3">
            {PIPELINE_STAGES.map(stage => {
              const stageOpps = mockOpportunities.filter(o => o.stage === stage.id)
              const stageValue = stageOpps.reduce((sum, o) => sum + o.value, 0)
              return (
                <div key={stage.id} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
                  <span className="text-sm text-gray-700 flex-1">{stage.label}</span>
                  <span className="text-sm font-medium text-gray-500">{stageOpps.length}</span>
                  {stageValue > 0 && (
                    <span className="text-xs text-gray-400">USD {stageValue.toLocaleString()}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold mb-4">Actividad reciente</h2>
          <div className="space-y-4">
            {mockConversations.slice(0, 5).map(conv => (
              <div key={conv.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                  conv.channel === 'whatsapp' ? 'bg-green-500' :
                  conv.channel === 'instagram' ? 'bg-pink-500' :
                  conv.channel === 'email' ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  {conv.contactName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{conv.contactName}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      conv.channel === 'whatsapp' ? 'bg-green-100 text-green-700' :
                      conv.channel === 'instagram' ? 'bg-pink-100 text-pink-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {conv.channel}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(conv.lastMessageAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold mb-4">Proximas acciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeOpps.filter(o => o.stage === 'visit_scheduled' || o.stage === 'negotiation' || o.stage === 'proposal').map(opp => (
            <div key={opp.id} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400">
                  Cierre esperado: {new Date(opp.expectedCloseDate).toLocaleDateString('es-AR')}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">{opp.title}</p>
              <p className="text-xs text-gray-500 mt-1">{opp.notes}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-semibold text-blue-600">
                  {opp.currency} {opp.value.toLocaleString()}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  opp.stage === 'proposal' ? 'bg-orange-100 text-orange-700' :
                  opp.stage === 'negotiation' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {PIPELINE_STAGES.find(s => s.id === opp.stage)?.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
