import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Mantis — AI Product Support',
  description: 'Intelligent diagnostic assistant for any product. Voice, image, and text troubleshooting powered by your product manual.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#0C0C0E', color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}>
        <div className="min-h-screen bg-grid bg-radial">
          <Navbar />
          <main>{children}</main>
        </div>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: { background: '#1A1A1F', border: '1px solid rgba(255,255,255,0.10)', color: '#fff' }
          }}
        />
      </body>
    </html>
  )
}
