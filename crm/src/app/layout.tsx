import type { Metadata } from 'next'
import './globals.css'
import AppShell from '@/components/AppShell'

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
