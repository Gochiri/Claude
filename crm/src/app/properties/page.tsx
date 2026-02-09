'use client'

import { useState } from 'react'
import { mockProperties } from '@/data/mock'
import { Property } from '@/types'
import { SearchIcon, PlusIcon, BedIcon, BathIcon, AreaIcon, PropertyIcon, XIcon } from '@/components/icons'

const typeLabels: Record<Property['type'], string> = {
  apartment: 'Departamento',
  house: 'Casa',
  land: 'Terreno',
  commercial: 'Comercial',
  office: 'Oficina',
  warehouse: 'Galpón',
}

const operationLabels: Record<Property['operation'], { label: string; color: string }> = {
  sale: { label: 'Venta', color: 'bg-blue-100 text-blue-700' },
  rent: { label: 'Alquiler', color: 'bg-green-100 text-green-700' },
  temporary_rent: { label: 'Alquiler temporal', color: 'bg-purple-100 text-purple-700' },
}

const statusLabels: Record<Property['status'], { label: string; color: string }> = {
  available: { label: 'Disponible', color: 'bg-green-100 text-green-700' },
  reserved: { label: 'Reservada', color: 'bg-yellow-100 text-yellow-700' },
  sold: { label: 'Vendida', color: 'bg-gray-100 text-gray-600' },
  rented: { label: 'Alquilada', color: 'bg-gray-100 text-gray-600' },
}

export default function PropertiesPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [operationFilter, setOperationFilter] = useState<string>('all')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showForm, setShowForm] = useState(false)

  const filtered = mockProperties.filter(p => {
    const matchesSearch = search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || p.type === typeFilter
    const matchesOp = operationFilter === 'all' || p.operation === operationFilter
    return matchesSearch && matchesType && matchesOp
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propiedades</h1>
          <p className="text-gray-500 text-sm mt-1">{mockProperties.length} propiedades en total</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
              Grilla
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
            >
              Lista
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <PlusIcon size={16} />
            Nueva propiedad
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por titulo, barrio o direccion..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los tipos</option>
          <option value="apartment">Departamento</option>
          <option value="house">Casa</option>
          <option value="land">Terreno</option>
          <option value="commercial">Comercial</option>
          <option value="office">Oficina</option>
        </select>
        <select
          value={operationFilter}
          onChange={(e) => setOperationFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas las operaciones</option>
          <option value="sale">Venta</option>
          <option value="rent">Alquiler</option>
          <option value="temporary_rent">Alquiler temporal</option>
        </select>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(property => {
            const op = operationLabels[property.operation]
            const st = statusLabels[property.status]
            return (
              <div
                key={property.id}
                onClick={() => setSelectedProperty(property)}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Image placeholder */}
                <div className="h-44 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
                  <PropertyIcon className="text-blue-200" size={48} />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${op.color}`}>
                      {op.label}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${st.color}`}>
                      {st.label}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-lg font-bold text-blue-600 mb-1">
                    {property.currency} {property.price.toLocaleString()}
                    {property.operation !== 'sale' && <span className="text-sm font-normal text-gray-400">/mes</span>}
                  </p>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{property.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{property.address}, {property.neighborhood}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {property.bedrooms !== undefined && (
                      <div className="flex items-center gap-1">
                        <BedIcon size={14} />
                        <span>{property.bedrooms} {property.bedrooms === 1 ? 'dorm' : 'dorms'}</span>
                      </div>
                    )}
                    {property.bathrooms !== undefined && (
                      <div className="flex items-center gap-1">
                        <BathIcon size={14} />
                        <span>{property.bathrooms} {property.bathrooms === 1 ? 'bano' : 'banos'}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <AreaIcon size={14} />
                      <span>{property.area} m2</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Propiedad</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Operacion</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Precio</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Barrio</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(property => (
                <tr
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">{property.title}</p>
                    <p className="text-xs text-gray-400">{property.address}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{typeLabels[property.type]}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${operationLabels[property.operation].color}`}>
                      {operationLabels[property.operation].label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-blue-600">
                    {property.currency} {property.price.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusLabels[property.status].color}`}>
                      {statusLabels[property.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{property.neighborhood}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Property Detail */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedProperty(null)} />
          <div className="relative w-full max-w-lg bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold">Detalle de propiedad</h2>
              <button onClick={() => setSelectedProperty(null)} className="text-gray-400 hover:text-gray-600">
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                <PropertyIcon className="text-blue-200" size={64} />
              </div>

              <div className="flex gap-2 mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${operationLabels[selectedProperty.operation].color}`}>
                  {operationLabels[selectedProperty.operation].label}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusLabels[selectedProperty.status].color}`}>
                  {statusLabels[selectedProperty.status].label}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedProperty.title}</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {selectedProperty.currency} {selectedProperty.price.toLocaleString()}
                {selectedProperty.operation !== 'sale' && <span className="text-base font-normal text-gray-400">/mes</span>}
              </p>
              <p className="text-sm text-gray-500 mb-4">{selectedProperty.address}, {selectedProperty.neighborhood}, {selectedProperty.city}</p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {selectedProperty.bedrooms !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <BedIcon size={20} className="mx-auto text-gray-400 mb-1" />
                    <p className="text-sm font-semibold">{selectedProperty.bedrooms}</p>
                    <p className="text-xs text-gray-400">Dormitorios</p>
                  </div>
                )}
                {selectedProperty.bathrooms !== undefined && (
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <BathIcon size={20} className="mx-auto text-gray-400 mb-1" />
                    <p className="text-sm font-semibold">{selectedProperty.bathrooms}</p>
                    <p className="text-xs text-gray-400">Banos</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <AreaIcon size={20} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-sm font-semibold">{selectedProperty.area} m2</p>
                  <p className="text-xs text-gray-400">Superficie</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Descripcion</h4>
                <p className="text-sm text-gray-600">{selectedProperty.description}</p>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Caracteristicas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProperty.features.map(f => (
                    <span key={f} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">{f}</span>
                  ))}
                </div>
              </div>

              {selectedProperty.ownerName && (
                <div className="mb-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Propietario</h4>
                  <p className="text-sm text-gray-600">{selectedProperty.ownerName}</p>
                  {selectedProperty.ownerPhone && (
                    <p className="text-sm text-gray-400">{selectedProperty.ownerPhone}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Property Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Nueva propiedad</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <XIcon size={20} />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titulo</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Depto 3 amb en Belgrano" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="apartment">Departamento</option>
                    <option value="house">Casa</option>
                    <option value="land">Terreno</option>
                    <option value="commercial">Comercial</option>
                    <option value="office">Oficina</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Operacion</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="sale">Venta</option>
                    <option value="rent">Alquiler</option>
                    <option value="temporary_rent">Alquiler temporal</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio (USD)</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (m2)</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direccion</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Calle y numero" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barrio</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Barrio" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ciudad" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                <textarea rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Descripcion de la propiedad..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Guardar propiedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
