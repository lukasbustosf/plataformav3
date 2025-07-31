import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OALabs - Laboratorios de Objetivos de Aprendizaje',
  description: 'Plataforma de laboratorios interactivos para el desarrollo de Objetivos de Aprendizaje con evaluación IA y currículo MINEDUC.',
  keywords: 'laboratorios, objetivos de aprendizaje, educación, chile, MINEDUC, evaluación, IA, OA',
  authors: [{ name: 'OALabs Team' }],
  robots: 'index, follow',
  icons: {
    icon: '/logo/favicon.svg',
    apple: '/logo/favicon.svg',
  },
  openGraph: {
    title: 'OALabs - Laboratorios de Objetivos de Aprendizaje',
    description: 'Transforma el aprendizaje con laboratorios interactivos y evaluación inteligente',
    type: 'website',
    locale: 'es_CL'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-CL" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="skip-link"
          role="button"
          tabIndex={0}
        >
          Ir al contenido principal
        </a>
        
        <Providers>
          <div id="main-content" className="min-h-full">
            {children}
          </div>
          
          {/* Toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: '',
              style: {
                background: '#fff',
                color: '#363636',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff'
                }
              }
            }}
          />
        </Providers>
      </body>
    </html>
  )
} 