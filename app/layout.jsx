import { Inter, Source_Sans_3 } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sourceSans = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans' })

export const metadata = {
  title: 'Panel Ejecutivo — Órgano Judicial de El Salvador',
  description: 'Panel de Inteligencia Institucional. Gerencia General de Administración y Finanzas.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${sourceSans.variable}`}>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#080E1A' }}>{children}</body>
    </html>
  )
}
