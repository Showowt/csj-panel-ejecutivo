export const metadata = {
  title: 'CSJ Panel Ejecutivo — Inteligencia Institucional',
  description: 'Panel de control ejecutivo para la Gerencia General de Administración y Finanzas. Corte Suprema de Justicia de El Salvador.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Source Sans 3', sans-serif", background: '#0A1628' }}>{children}</body>
    </html>
  )
}
