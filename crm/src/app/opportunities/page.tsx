'use client'

import { useState } from 'react'
import { mockOpportunities } from '@/data/mock'
import { Opportunity, PIPELINE_STAGES } from '@/types'
import { DollarIcon, CalendarIcon, PlusIcon, XIcon } from '@/components/icons'

function OpportunityCard({ opp }: { opp: Opportunity }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <p className="text-sm font-medium text-gray-900 mb-1">{opp.contactName}</p>
      <p className="text-xs text-gray-500 mb-2 truncate">{opp.propertyTitle || opp.title}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-blue-600">
          {opp.currency} {opp.value.toLocaleString()}
        </span>
        <span className="text-xs text-gray-400">{opp.probability}%</span>
      </div>
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
        <CalendarIcon size={12} />
        <span>{new Date(opp.expectedCloseDate).toLocaleDateString('es-AR')}</span>
      </div>
    </div>
  )
}

export default function OpportunitiesPage() {
  const [showForm, setShowForm] = useState(false)

  const getStageOpps = (stageId: string) =>
    mockOpportunities.filter(o => o.stage === stageId)

  const totalValue = mockOpportunities
    .filter(o => !['closed_won', 'closed_lost'].includes(o.stage))
    .reduce((sum, o) => sum + o.value, 0)

  const weightedValue = mockOpportunities
    .filter(o => !['closed_won', 'closed_lost'].includes(o.stage))
    .reduce((sum, o) => sum + (o.value * o.probability / 100), 0)

  return (
    <div className="p-6 h-[calc(100vh)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Oportunidades</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pipeline: USD {totalValue.toLocaleString()} total | USD {Math.round(weightedValue).toLocaleString()} ponderado
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <PlusIcon size={16} />
          Nueva oportunidad
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto kanban-scroll">
        <div className="flex gap-4 min-w-max pb-4" style={{ height: 'calc(100vh - 160px)' }}>
          {PIPELINE_STAGES.map(stage => {
            const stageOpps = getStageOpps(stage.id)
            const stageTotal = stageOpps.reduce((s, o) => s + o.value, 0)
            return (
              <div key={stage.id} className="w-72 flex flex-col">
                {/* Stage Header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                  <span className="text-sm font-semibold text-gray-700">{stage.label}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                    {stageOpps.length}
                  </span>
                  {stageTotal > 0 && (
                    <span className="text-xs text-gray-400 ml-auto">
                      USD {stageTotal.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Cards */}
                <div className="flex-1 bg-gray-50 rounded-lg p-2 space-y-2 overflow-y-auto">
                  {stageOpps.map(opp => (
                    <OpportunityCard key={opp.id} opp={opp} />
                  ))}
                  {stageOpps.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-8">Sin oportunidades</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* New Opportunity Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Nueva oportunidad</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <XIcon size={20} />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titulo</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Juan Perez - Depto Belgrano" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar contacto</option>
                  <option value="c1">Roberto Sanchez</option>
                  <option value="c2">Lucia Perez</option>
                  <option value="c3">Martin Diaz</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (USD)</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Etapa</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {PIPELINE_STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha cierre esperada</label>
                <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Detalles de la oportunidad..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Crear oportunidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
