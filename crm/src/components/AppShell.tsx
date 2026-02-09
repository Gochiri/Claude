'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import { MenuIcon } from './icons'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-30 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
        >
          <MenuIcon size={22} />
        </button>
        <span className="ml-3 font-bold text-gray-900">RealCRM</span>
      </header>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-[260px] min-h-screen pt-14 lg:pt-0">
        {children}
      </main>
    </>
  )
}
