'use client'

import { useState } from 'react'
import { WhatsAppIcon, CheckCircleIcon, AlertCircleIcon, PhoneIcon, LinkIcon, SettingsIcon } from '@/components/icons'

export default function WhatsAppPage() {
  const [connected, setConnected] = useState(false)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp Business</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona tu integracion con WhatsApp Business API</p>
      </div>

      {/* Connection Status Card */}
      <div className={`rounded-xl border-2 p-6 mb-6 ${connected ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${connected ? 'bg-green-500' : 'bg-gray-200'}`}>
            <WhatsAppIcon className={connected ? 'text-white' : 'text-gray-400'} size={28} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{connected ? 'Conectado' : 'No conectado'}</h2>
              {connected ? (
                <CheckCircleIcon className="text-green-500" size={18} />
              ) : (
                <AlertCircleIcon className="text-gray-400" size={18} />
              )}
            </div>
            <p className="text-sm text-gray-500">
              {connected
                ? 'Tu cuenta de WhatsApp Business esta activa y recibiendo mensajes.'
                : 'Conecta tu cuenta de WhatsApp Business para empezar a recibir y enviar mensajes.'}
            </p>
          </div>
          <button
            onClick={() => setConnected(!connected)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              connected
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {connected ? 'Desconectar' : 'Conectar WhatsApp'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <SettingsIcon size={18} className="text-gray-400" />
            Configuracion
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numero de telefono</label>
              <input
                type="tel"
                placeholder="+54 11 5555-0100"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Business API Token</label>
              <input
                type="password"
                placeholder="EAAG..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="https://api.realcrm.com/webhooks/whatsapp"
                  readOnly
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500"
                />
                <button className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  Copiar
                </button>
              </div>
            </div>
            <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Guardar configuracion
            </button>
          </div>
        </div>

        {/* Templates */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ChatIcon size={18} className="text-gray-400" />
            Plantillas de mensajes
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Bienvenida', status: 'approved', text: 'Hola {nombre}! Gracias por contactar a Inmobiliaria Premium...' },
              { name: 'Confirmacion de visita', status: 'approved', text: 'Hola {nombre}, te confirmamos la visita para el {fecha}...' },
              { name: 'Seguimiento post-visita', status: 'pending', text: 'Hola {nombre}, como fue tu experiencia visitando la propiedad...' },
              { name: 'Nueva propiedad', status: 'approved', text: 'Hola {nombre}! Tenemos una nueva propiedad que puede interesarte...' },
            ].map((template, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{template.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    template.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {template.status === 'approved' ? 'Aprobada' : 'Pendiente'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{template.text}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            + Crear nueva plantilla
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Estadisticas del mes</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-xs text-gray-500">Mensajes enviados</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-xs text-gray-500">Mensajes recibidos</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">94%</p>
              <p className="text-xs text-gray-500">Tasa de entrega</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">67%</p>
              <p className="text-xs text-gray-500">Tasa de apertura</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Acciones rapidas</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <WhatsAppIcon size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Envio masivo</p>
                <p className="text-xs text-gray-500">Enviar mensaje a multiples contactos</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <LinkIcon size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Generar link wa.me</p>
                <p className="text-xs text-gray-500">Crear link directo para compartir</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <PhoneIcon size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Verificar numero</p>
                <p className="text-xs text-gray-500">Verificar estado de un numero de WhatsApp</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
