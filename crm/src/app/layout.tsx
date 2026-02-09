import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'RealCRM - CRM Inmobiliario',
  description: 'CRM para gestionar leads, propiedades y oportunidades inmobiliarias',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="font-sans">
        <Sidebar />
        <main className="ml-[260px] min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
