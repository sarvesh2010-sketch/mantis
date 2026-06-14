'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Upload, MessageSquare, CheckCircle, Zap, Shield, Brain, ArrowRight, Terminal, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import { CATEGORIES } from '@/types'
import { Footer } from '@/components/layout/Footer'
import { HeroCanvas } from '@/components/HeroCanvas'

/* ============================================
   ANIMATION VARIANTS
   ============================================ */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] } },
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] } },
}

/* ============================================
   HERO SECTION
   ============================================ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <HeroCanvas />
      
      {/* Fallback CSS orbs to ensure nice layering and lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(99,86,245,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute top-1/3 -left-20 w-[400px] h-[400px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(123,108,247,0.05) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: 'rgba(99, 86, 245, 0.1)',
            border: '1px solid rgba(99, 86, 245, 0.2)',
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-sm font-medium text-brand-400">Powered by MOSS · Sub-10ms retrieval</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
        >
          Your product,{' '}
          <br />
          <span className="gradient-text">always understood.</span>
        </motion.h1>

        {/* Sub-text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg text-text-secondary max-w-xl mx-auto mt-6"
        >
          The only support platform where the AI thinks like a technician — not a search engine.
          Voice, image, and text troubleshooting powered by your product&apos;s manual.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(99,86,245,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary text-base px-8 py-3.5 flex items-center gap-2"
            >
              Browse Products <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <Link href="/signup?role=company">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-secondary text-base px-8 py-3.5"
            >
              List Your Product
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 mt-20"
        >
          {[
            { value: '<10ms', label: 'Retrieval Speed' },
            { value: '100%', label: 'Manual-Grounded' },
            { value: 'Voice + Image', label: 'Troubleshooting' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.1 + i * 0.15, type: 'spring', stiffness: 300 }}
                className="text-3xl font-bold text-white font-mono"
              >
                {stat.value}
              </motion.span>
              <span className="text-sm text-text-muted mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, #0C0C0E, transparent)' }} />
    </section>
  )
}

/* ============================================
   HOW IT WORKS
   ============================================ */
const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload your manual',
    desc: 'Companies upload PDFs, service docs, and links. Mantis indexes everything in under 60 seconds using MOSS.',
  },
  {
    icon: MessageSquare,
    step: '02',
    title: 'Describe the issue',
    desc: 'Users type, speak, or photograph the problem. The assistant reads the symptom like an experienced technician.',
  },
  {
    icon: CheckCircle,
    step: '03',
    title: 'Get a diagnosis',
    desc: 'Mantis asks follow-up questions, narrows root causes, and cites the exact manual section for every recommendation.',
  },
]

function HowItWorks() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="section-heading">
            How Mantis works
          </motion.h2>
          <motion.p variants={fadeInUp} className="section-sub mx-auto mt-4">
            Three simple steps from problem to solution
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="card-hover p-8 relative group"
            >
              {/* Step number with glow */}
              <div className="absolute top-6 right-6 text-5xl font-bold text-brand-500/10 group-hover:text-brand-500/20 transition-colors duration-300">
                {s.step}
              </div>
              
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-5 group-hover:bg-brand-500/20 transition-colors duration-300">
                <s.icon className="w-6 h-6 text-brand-400" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">{s.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================
   CATEGORIES
   ============================================ */
function CategoriesSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.h2 variants={fadeInUp} className="section-heading">
            Browse by product type
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.value} variants={scaleIn}>
              <Link href={`/products?category=${cat.value}`}>
                <motion.div
                  whileHover={{
                    y: -4,
                    borderColor: 'rgba(99,86,245,0.4)',
                    boxShadow: '0 0 20px rgba(99,86,245,0.15)',
                  }}
                  className="card p-6 text-center cursor-pointer transition-all duration-300"
                >
                  <span className="text-4xl block mb-3">{cat.icon}</span>
                  <span className="text-sm font-medium text-text-secondary">{cat.label}</span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================
   FEATURES / TRUST SECTION
   ============================================ */
function TrustSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div variants={fadeInUp}>
              <h2 className="section-heading text-3xl md:text-4xl mb-6">
                Built on technology that{' '}
                <span className="gradient-text-brand">never makes things up</span>
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                Every answer is grounded in your actual product documentation. MOSS retrieves
                the most relevant sections in under 10 milliseconds using hybrid semantic + keyword
                search. GPT-4o then generates a diagnosis — citing specific pages and sections.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: Zap, text: 'Sub-10ms retrieval with MOSS hybrid search' },
                  { icon: Shield, text: '100% manual-grounded — no hallucinations' },
                  { icon: Brain, text: '6-step diagnostic workflow like a real technician' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                      <f.icon className="w-4 h-4 text-brand-400" />
                    </div>
                    <span className="text-sm text-text-secondary">{f.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Terminal */}
            <motion.div variants={scaleIn}>
              <div className="card p-1 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border-subtle">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="text-xs text-text-muted ml-2 font-mono">moss-query.ts</span>
                </div>
                <div className="p-5 font-mono text-xs leading-6" style={{ background: '#0D0D10' }}>
                  <div className="text-text-muted">{'// Query MOSS for relevant documentation'}</div>
                  <div>
                    <span className="text-purple-400">const</span>
                    <span className="text-white"> results </span>
                    <span className="text-purple-400">= await</span>
                    <span className="text-yellow-300"> moss</span>
                    <span className="text-white">.query(</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-green-400">&quot;scooter engine won&apos;t start&quot;</span>
                    <span className="text-white">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-white">{'{ '}</span>
                    <span className="text-blue-300">top_k</span>
                    <span className="text-white">: </span>
                    <span className="text-orange-400">5</span>
                    <span className="text-white">{', '}</span>
                    <span className="text-blue-300">hybrid</span>
                    <span className="text-white">: </span>
                    <span className="text-orange-400">true</span>
                    <span className="text-white">{' }'}</span>
                  </div>
                  <div><span className="text-white">);</span></div>
                  <div className="mt-3 text-text-muted">{'// Response:'}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-white">5 results in </span>
                    <span className="text-green-400 font-semibold">3.1ms</span>
                  </div>
                  <div className="text-text-muted pl-4">
                    → Page 42: &quot;Check spark plug connection...&quot;
                  </div>
                  <div className="text-text-muted pl-4">
                    → Page 18: &quot;Fuse F3 troubleshooting...&quot;
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================
   CTA SECTION
   ============================================ */
function CTASection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center p-12 md:p-16 rounded-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(99,86,245,0.1) 0%, rgba(12,12,14,1) 50%, rgba(99,86,245,0.1) 100%)',
            border: '1px solid rgba(99,86,245,0.2)',
          }}
        >
          <Sparkles className="w-10 h-10 text-brand-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to transform your product support?
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto mb-8">
            Join companies using Mantis to deliver instant, accurate diagnostics to their customers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup?role=company">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(99,86,245,0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary text-base px-8 py-3.5 flex items-center gap-2"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-secondary text-base px-8 py-3.5"
              >
                Explore Products
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ============================================
   LANDING PAGE
   ============================================ */
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <CategoriesSection />
      <TrustSection />
      <CTASection />
      <Footer />
    </>
  )
}
