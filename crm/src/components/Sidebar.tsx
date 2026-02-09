'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  DashboardIcon,
  ChatIcon,
  ContactsIcon,
  OpportunityIcon,
  PropertyIcon,
  AutomationIcon,
  WhatsAppIcon,
  SettingsIcon,
  XIcon,
} from './icons'

const navItems = [
  { href: '/', label: 'Dashboard', icon: DashboardIcon },
  { href: '/conversations', label: 'Conversaciones', icon: ChatIcon },
  { href: '/contacts', label: 'Contactos', icon: ContactsIcon },
  { href: '/opportunities', label: 'Oportunidades', icon: OpportunityIcon },
  { href: '/properties', label: 'Propiedades', icon: PropertyIcon },
  { href: '/automations', label: 'Automatizaciones', icon: AutomationIcon },
  { href: '/whatsapp', label: 'WhatsApp', icon: WhatsAppIcon },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-[260px] bg-slate-800 text-slate-300 flex flex-col z-50 transition-transform duration-200 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Logo / Brand */}
        <div className="px-5 py-5 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                <PropertyIcon className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-white font-bold text-base leading-tight">RealCRM</h1>
                <p className="text-slate-400 text-xs">Inmobiliaria Premium</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <XIcon size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.href === '/conversations' && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        2
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-slate-700 p-3">
          <Link
            href="/settings"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname.startsWith('/settings')
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <SettingsIcon size={18} />
            <span>Configuracion</span>
          </Link>
          <div className="flex items-center gap-3 px-3 py-3 mt-2">
            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
              MG
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">Maria Gonzalez</p>
              <p className="text-slate-400 text-xs truncate">Administrador</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
