'use client'

import { useState } from 'react'
import { mockAutomations } from '@/data/mock'
import { Automation } from '@/types'
import { AutomationIcon, PlusIcon, XIcon, WhatsAppIcon, MailIcon, CheckCircleIcon } from '@/components/icons'

function getActionLabel(type: string): string {
  const labels: Record<string, string> = {
    send_whatsapp: 'Enviar WhatsApp',
    send_email: 'Enviar Email',
    assign_agent: 'Asignar agente',
    move_stage: 'Mover etapa',
    add_tag: 'Agregar tag',
    wait: 'Esperar',
    condition: 'Condicion',
  }
  return labels[type] || type
}

function getActionIcon(type: string) {
  switch (type) {
    case 'send_whatsapp': return <WhatsAppIcon size={14} className="text-green-500" />
    case 'send_email': return <MailIcon size={14} className="text-blue-500" />
    case 'assign_agent': return <UserCircleIcon size={14} className="text-purple-500" />
    case 'add_tag': return <TagIcon size={14} className="text-yellow-500" />
    case 'wait': return <ClockIcon size={14} className="text-gray-400" />
    case 'condition': return <GitBranchIcon size={14} className="text-orange-500" />
    default: return <AutomationIcon size={14} className="text-gray-400" />
  }
}

export default function AutomationsPage() {
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null)
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automatizaciones</h1>
          <p className="text-gray-500 text-sm mt-1">Workflows automaticos para tu negocio</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <PlusIcon size={16} />
          Nueva automatizacion
        </button>
      </div>

      {/* Automations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockAutomations.map(auto => (
          <div
            key={auto.id}
            onClick={() => setSelectedAutomation(auto)}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${auto.active ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <AutomationIcon size={20} className={auto.active ? 'text-blue-600' : 'text-gray-400'} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{auto.name}</h3>
                  <p className="text-xs text-gray-500">{auto.description}</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation() }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  auto.active ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  auto.active ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
              <AutomationIcon size={12} />
              <span>Trigger: {auto.trigger}</span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              {auto.actions.map((action, i) => (
                <div key={action.id} className="flex items-center gap-1">
                  {i > 0 && <span className="text-gray-300">→</span>}
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs text-gray-600">
                    {getActionIcon(action.type)}
                    <span>{getActionLabel(action.type)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
              <span>{auto.executionCount} ejecuciones</span>
              {auto.lastExecuted && (
                <span>Ultima: {new Date(auto.lastExecuted).toLocaleDateString('es-AR')}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Automation Detail Modal */}
      {selectedAutomation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedAutomation(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">{selectedAutomation.name}</h2>
              <button onClick={() => setSelectedAutomation(null)} className="text-gray-400 hover:text-gray-600">
                <XIcon size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">{selectedAutomation.description}</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Trigger</p>
              <p className="text-sm text-gray-700">{selectedAutomation.trigger}</p>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Acciones</p>
              <div className="space-y-2">
                {selectedAutomation.actions.map((action, i) => (
                  <div key={action.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {i + 1}
                      </div>
                      {i < selectedAutomation.actions.length - 1 && (
                        <div className="w-0.5 h-6 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        {getActionIcon(action.type)}
                        <span className="text-sm font-medium text-gray-700">{getActionLabel(action.type)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {Object.entries(action.config).map(([key, val]) => (
                          <p key={key}><span className="text-gray-400">{key}:</span> {val}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
              <span>{selectedAutomation.executionCount} ejecuciones totales</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedAutomation.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {selectedAutomation.active ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* New Automation Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Nueva automatizacion</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <XIcon size={20} />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Bienvenida nuevo lead" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                <textarea rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Que hace esta automatizacion..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trigger (disparador)</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Nuevo contacto creado</option>
                  <option>Oportunidad movida de etapa</option>
                  <option>Sin actividad por X dias</option>
                  <option>Tag agregado</option>
                  <option>Mensaje recibido</option>
                  <option>Programado (cron)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Acciones</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 cursor-pointer hover:border-blue-400 hover:text-blue-500">
                    <PlusIcon size={16} />
                    <span>Agregar accion</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Crear automatizacion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Small inline icons used only here
function UserCircleIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function TagIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

function ClockIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function GitBranchIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  )
}
