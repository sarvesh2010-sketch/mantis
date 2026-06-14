'use client'
import Link from 'next/link'
import { Bug } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border-subtle" style={{ background: '#0F0F12' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logo + Tagline */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Bug className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Mantis</span>
            </div>
            <p className="text-sm text-text-muted max-w-xs">
              AI-powered product diagnostics. Like having a senior technician in your pocket.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Platform</span>
              <Link href="/products" className="text-sm text-text-secondary hover:text-white transition-colors">
                Products
              </Link>
              <Link href="/signup?role=company" className="text-sm text-text-secondary hover:text-white transition-colors">
                For Companies
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Resources</span>
              <a href="https://moss.dev" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-white transition-colors">
                MOSS Search
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-white transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-text-muted">
            © 2025 Mantis · Built for PClub × MOSS Hackathon
          </p>
          <p className="text-xs text-text-muted">
            Powered by MOSS · GPT-4o · ElevenLabs
          </p>
        </div>
      </div>
    </footer>
  )
}
