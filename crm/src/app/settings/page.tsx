'use client'

import { useState } from 'react'
import { mockBusinessConfig, mockTeamMembers } from '@/data/mock'
import { TeamMember } from '@/types'
import { SettingsIcon, PlusIcon, XIcon, InstagramIcon, FacebookIcon, LinkIcon, UserIcon } from '@/components/icons'

type Tab = 'business' | 'members' | 'integrations'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('business')
  const [showMemberForm, setShowMemberForm] = useState(false)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'business', label: 'Negocio' },
    { id: 'members', label: 'Miembros' },
    { id: 'integrations', label: 'Integraciones' },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuracion</h1>
        <p className="text-gray-500 text-sm mt-1">Administra tu cuenta y preferencias</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Business Config */}
      {activeTab === 'business' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Informacion del negocio</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la empresa</label>
                <input
                  type="text"
                  defaultValue={mockBusinessConfig.name}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={mockBusinessConfig.email}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                  <input
                    type="tel"
                    defaultValue={mockBusinessConfig.phone}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direccion</label>
                <input
                  type="text"
                  defaultValue={mockBusinessConfig.address}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sitio web</label>
                <input
                  type="url"
                  defaultValue={mockBusinessConfig.website}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zona horaria</label>
                  <select
                    defaultValue={mockBusinessConfig.timezone}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                    <option value="America/Bogota">Bogota (GMT-5)</option>
                    <option value="America/Mexico_City">Ciudad de Mexico (GMT-6)</option>
                    <option value="America/Santiago">Santiago (GMT-4)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                  <select
                    defaultValue={mockBusinessConfig.currency}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD - Dolar estadounidense</option>
                    <option value="ARS">ARS - Peso argentino</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <SettingsIcon size={24} className="text-blue-400" />
                  </div>
                  <p className="text-sm text-gray-500">Arrastra tu logo aqui o haz click para subir</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 2MB</p>
                </div>
              </div>

              <button type="button" className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Members */}
      {activeTab === 'members' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Miembros del equipo</h2>
            <button
              onClick={() => setShowMemberForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <PlusIcon size={16} />
              Agregar miembro
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Miembro</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Rol</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Telefono</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mockTeamMembers.map(member => (
                  <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-400">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        member.role === 'admin' ? 'bg-red-100 text-red-700' :
                        member.role === 'manager' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {member.role === 'admin' ? 'Administrador' :
                         member.role === 'manager' ? 'Gerente' : 'Agente'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{member.phone}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        member.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {member.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button className="text-sm text-blue-600 hover:text-blue-800">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Member Modal */}
          {showMemberForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/30" onClick={() => setShowMemberForm(false)} />
              <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Agregar miembro</h2>
                  <button onClick={() => setShowMemberForm(false)} className="text-gray-400 hover:text-gray-600">
                    <XIcon size={20} />
                  </button>
                </div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                    <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nombre y apellido" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="email@empresa.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                    <input type="tel" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+54 11 ..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="agent">Agente</option>
                      <option value="manager">Gerente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowMemberForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Cancelar
                    </button>
                    <button type="button" onClick={() => setShowMemberForm(false)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      Agregar miembro
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Integrations */}
      {activeTab === 'integrations' && (
        <div className="max-w-2xl space-y-4">
          {/* Instagram */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center">
                <InstagramIcon className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Instagram</h3>
                <p className="text-xs text-gray-500">Recibe mensajes directos y comentarios</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Conectado</span>
                <span className="text-xs text-gray-400">{mockBusinessConfig.socialMedia.instagram}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                defaultValue={mockBusinessConfig.socialMedia.instagram}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="@usuario"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Guardar
              </button>
            </div>
          </div>

          {/* Facebook */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <FacebookIcon className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Facebook</h3>
                <p className="text-xs text-gray-500">Messenger y leads de formularios</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Conectado</span>
                <span className="text-xs text-gray-400">{mockBusinessConfig.socialMedia.facebook}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                defaultValue={mockBusinessConfig.socialMedia.facebook}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pagina de Facebook"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Guardar
              </button>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center">
                <LinkIcon className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">LinkedIn</h3>
                <p className="text-xs text-gray-500">Conecta tu perfil profesional</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Conectado</span>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                defaultValue={mockBusinessConfig.socialMedia.linkedin}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Perfil de LinkedIn"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Guardar
              </button>
            </div>
          </div>

          {/* TikTok */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-bold text-lg">
                T
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">TikTok</h3>
                <p className="text-xs text-gray-500">Conecta tu cuenta de TikTok</p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">No conectado</span>
            </div>
            <div className="mt-4">
              <button className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Conectar TikTok
              </button>
            </div>
          </div>

          {/* YouTube */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                YT
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">YouTube</h3>
                <p className="text-xs text-gray-500">Conecta tu canal de YouTube</p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">No conectado</span>
            </div>
            <div className="mt-4">
              <button className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Conectar YouTube
              </button>
            </div>
          </div>

          {/* Portales Inmobiliarios */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                ZP
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Zonaprop / Portales</h3>
                <p className="text-xs text-gray-500">Sincroniza leads de portales inmobiliarios</p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Proximamente</span>
            </div>
          </div>

          {/* Tokko Broker */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                TB
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">Tokko Broker</h3>
                <p className="text-xs text-gray-500">Sincroniza propiedades y contactos desde Tokko</p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Proximamente</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
