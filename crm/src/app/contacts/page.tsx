'use client'

import { useState } from 'react'
import { mockContacts, mockTeamMembers } from '@/data/mock'
import { Contact } from '@/types'
import { SearchIcon, PlusIcon, FilterIcon, MailIcon, PhoneIcon, WhatsAppIcon, XIcon } from '@/components/icons'

const statusLabels: Record<Contact['status'], { label: string; color: string }> = {
  new: { label: 'Nuevo', color: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Contactado', color: 'bg-yellow-100 text-yellow-700' },
  qualified: { label: 'Calificado', color: 'bg-green-100 text-green-700' },
  unqualified: { label: 'No calificado', color: 'bg-gray-100 text-gray-600' },
}

const sourceLabels: Record<Contact['source'], string> = {
  website: 'Sitio web',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  facebook: 'Facebook',
  referral: 'Referido',
  portal: 'Portal inmobiliario',
  other: 'Otro',
}

export default function ContactsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showForm, setShowForm] = useState(false)

  const filtered = mockContacts.filter(c => {
    const matchesSearch = search === '' ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contactos</h1>
          <p className="text-gray-500 text-sm mt-1">{mockContacts.length} contactos en total</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <PlusIcon size={16} />
          Nuevo contacto
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o telefono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los estados</option>
          <option value="new">Nuevo</option>
          <option value="contacted">Contactado</option>
          <option value="qualified">Calificado</option>
          <option value="unqualified">No calificado</option>
        </select>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacto</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Origen</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Agente</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((contact) => {
              const status = statusLabels[contact.status]
              const agent = mockTeamMembers.find(m => m.id === contact.assignedTo)
              return (
                <tr
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{contact.firstName} {contact.lastName}</p>
                        <p className="text-xs text-gray-400">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{sourceLabels[contact.source]}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{agent?.name || 'Sin asignar'}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {contact.tags.length > 2 && (
                        <span className="text-xs text-gray-400">+{contact.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400">
                    {new Date(contact.createdAt).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Contact Detail Slide-over */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedContact(null)} />
          <div className="relative w-full max-w-md bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Detalle del contacto</h2>
              <button onClick={() => setSelectedContact(null)} className="text-gray-400 hover:text-gray-600">
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {selectedContact.firstName[0]}{selectedContact.lastName[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedContact.firstName} {selectedContact.lastName}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusLabels[selectedContact.status].color}`}>
                    {statusLabels[selectedContact.status].label}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <MailIcon size={16} className="text-gray-400" />
                  <span>{selectedContact.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <PhoneIcon size={16} className="text-gray-400" />
                  <span>{selectedContact.phone}</span>
                </div>
                {selectedContact.whatsapp && (
                  <div className="flex items-center gap-3 text-sm">
                    <WhatsAppIcon size={16} className="text-green-500" />
                    <span>{selectedContact.whatsapp}</span>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Origen</h4>
                <p className="text-sm text-gray-600">{sourceLabels[selectedContact.source]}</p>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedContact.tags.map(tag => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Notas</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedContact.notes}</p>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Agente asignado</h4>
                <p className="text-sm text-gray-600">
                  {mockTeamMembers.find(m => m.id === selectedContact.assignedTo)?.name || 'Sin asignar'}
                </p>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-600">
                  <WhatsAppIcon size={16} />
                  WhatsApp
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600">
                  <MailIcon size={16} />
                  Email
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200">
                  <PhoneIcon size={16} />
                  Llamar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Contact Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Nuevo contacto</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <XIcon size={20} />
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nombre" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Apellido" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="email@ejemplo.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                <input type="tel" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+54 11 ..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="website">Sitio web</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="referral">Referido</option>
                  <option value="portal">Portal inmobiliario</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Detalles sobre el contacto..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Guardar contacto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
