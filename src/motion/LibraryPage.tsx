import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import '@/styles/all-hub.css'
import {
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  MOTION_BY_ID,
  MOTIONS,
  type MotionCategory,
  type MotionDef,
} from './catalog'
import { cxTrack, LeadGateProvider, useLeadGate } from './lead-gate'
import { MotionNav, WorkshopBand } from './MotionNav'
import { MotionPreview } from './previews'

/* /motion/biblioteca na linguagem CX App Light: canvas claro, filtros em
   pílulas brancas com hairline, cards do app com a mini-tela escura do
   motion dentro. Clicar abre o detalhe com prompt + código (copiar passa
   pelo lead gate). */

function MotionModal({ def, onClose }: { def: MotionDef; onClose: () => void }) {
  const { gate } = useLeadGate()
  const [copied, setCopied] = useState<'prompt' | 'code' | null>(null)

  const copy = (kind: 'prompt' | 'code') => {
    gate(() => {
      try {
        navigator.clipboard?.writeText(kind === 'prompt' ? def.prompt : def.code)
      } catch {}
      cxTrack('prompt_copy', { motion: def.id, origin: 'library', kind })
      setCopied(kind)
      setTimeout(() => setCopied(null), 1800)
    }, `copy:${def.id}`)
  }

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', esc)
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ background: 'rgba(20, 23, 26, 0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.97, y: 12 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="max-h-[86vh] w-full max-w-[560px] overflow-y-auto rounded-[var(--cxa-radius)] bg-[var(--cxa-paper)] p-6 text-[var(--cxa-ink)] shadow-[var(--cxa-shadow-lift)] sm:p-7"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[var(--cxa-hairline)] bg-[var(--cxa-paper)] px-2.5 py-1 font-semibold text-[10.5px] text-[var(--cxa-ink-soft)] uppercase tracking-wider">
              <i
                className="size-1.5 rounded-full"
                style={{ background: CATEGORY_COLORS[def.category] }}
              />
              {CATEGORY_LABELS[def.category]}
            </span>
            <h3 className="font-semibold text-[24px] tracking-[-0.02em]">
              {def.name}
            </h3>
            <p className="mt-1 text-[13.5px] text-[var(--cxa-ink-soft)]">
              {def.desc}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="cxa-circle !size-8 shrink-0 text-[13px]"
          >
            ✕
          </button>
        </div>

        <MotionPreview id={def.id} className="mb-6" />

        <p className="mb-2 font-semibold text-[12px] text-[var(--cxa-ink)] uppercase tracking-wider">
          Prompt para vibe codar
        </p>
        <p className="mb-3 rounded-[var(--cxa-radius-sm)] border border-[var(--cxa-hairline)] bg-[var(--cxa-subtle)] p-4 text-[13.5px] text-[var(--cxa-ink)] leading-relaxed">
          {def.prompt}
        </p>
        <button
          type="button"
          onClick={() => copy('prompt')}
          className="cxa-pill-gradient mb-6 w-full justify-center"
        >
          {copied === 'prompt' ? 'Prompt copiado ✓' : 'Copiar prompt'}
        </button>

        <p className="mb-2 font-semibold text-[12px] text-[var(--cxa-ink)] uppercase tracking-wider">
          Código de exemplo
        </p>
        <pre className="mb-3 overflow-x-auto rounded-[var(--cxa-radius-sm)] bg-[#14171a] p-4 text-[12px] text-slate-200 leading-relaxed">
          <code>{def.code}</code>
        </pre>
        <button
          type="button"
          onClick={() => copy('code')}
          className="cxa-pill-outline w-full justify-center"
        >
          {copied === 'code' ? 'Código copiado ✓' : 'Copiar código'}
        </button>
      </motion.div>
    </motion.div>
  )
}

export function LibraryPage() {
  const [filter, setFilter] = useState<MotionCategory | 'all'>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    const prev = document.title
    document.title = 'Biblioteca de animações | Design Viral'
    /* deep-link ?motion=<id> abre o detalhe direto (vindo dos tiles do hero) */
    const id = new URLSearchParams(window.location.search).get('motion')
    if (id && MOTION_BY_ID[id]) setOpenId(id)
    return () => {
      document.title = prev
    }
  }, [])

  const shown = useMemo(
    () => (filter === 'all' ? MOTIONS : MOTIONS.filter(m => m.category === filter)),
    [filter],
  )
  const open = openId ? MOTION_BY_ID[openId] : null

  return (
    <LeadGateProvider>
      {/* Pixel do Clickmax: snippet oficial do funil no <head> (index.html) */}
      <div className="cxa min-h-screen">
        <MotionNav />

        <div className="cxa-shell pt-14 pb-20">
          <div className="mb-9 text-center">
            <p className="cxa-eyebrow mb-4">Exemplos de todas as animações</p>
            <h1 className="cxa-headline text-[34px] text-[var(--cxa-ink)] sm:text-[46px]">
              Biblioteca de{' '}
              <span className="cxa-hero-underline">motions</span>
            </h1>
            <p className="mx-auto mt-4 max-w-[520px] text-[14.5px] text-[var(--cxa-ink-soft)] leading-relaxed">
              52 tipos, cada um com prompt e código de exemplo. Filtre por
              categoria e clique para copiar e vibe codar.
            </p>
          </div>

          {/* filtros */}
          <div className="mb-9 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-full border px-4 py-1.5 font-semibold text-[12.5px] transition-colors ${
                filter === 'all'
                  ? 'border-[var(--cxa-ink)] bg-[var(--cxa-dark)] text-white'
                  : 'border-[var(--cxa-hairline)] bg-[var(--cxa-paper)] text-[var(--cxa-ink-soft)] hover:border-[var(--cxa-ink)] hover:text-[var(--cxa-ink)]'
              }`}
            >
              Todos · {MOTIONS.length}
            </button>
            {CATEGORIES.map(c => {
              const n = MOTIONS.filter(m => m.category === c).length
              const active = filter === c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setFilter(c)
                    cxTrack('library_filter', { category: c })
                  }}
                  className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-semibold text-[12.5px] transition-colors ${
                    active
                      ? 'border-[var(--cxa-ink)] bg-[var(--cxa-dark)] text-white'
                      : 'border-[var(--cxa-hairline)] bg-[var(--cxa-paper)] text-[var(--cxa-ink-soft)] hover:border-[var(--cxa-ink)] hover:text-[var(--cxa-ink)]'
                  }`}
                >
                  <i
                    className="size-1.5 rounded-full"
                    style={{ background: CATEGORY_COLORS[c] }}
                  />
                  {CATEGORY_LABELS[c]} · {n}
                </button>
              )
            })}
          </div>

          {/* grid */}
          <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map(m => (
                <motion.button
                  key={m.id}
                  layout
                  type="button"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22 }}
                  onClick={() => {
                    setOpenId(m.id)
                    cxTrack('motion_detail_open', { motion: m.id })
                  }}
                  className="cxa-tile group rounded-[var(--cxa-radius)] p-3 text-left"
                >
                  <MotionPreview id={m.id} bare className="!rounded-[10px]" />
                  <div className="mt-3 flex items-center justify-between px-1 pb-1">
                    <div>
                      <p className="flex items-center gap-1.5 font-semibold text-[14px] text-[var(--cxa-ink)] tracking-[-0.01em]">
                        {m.name}
                        <i
                          className="size-1.5 rounded-full"
                          style={{ background: CATEGORY_COLORS[m.category] }}
                        />
                      </p>
                      <p className="text-[12px] text-[var(--cxa-ink-soft)]">
                        {m.desc}
                      </p>
                    </div>
                    <span className="cxa-ghost ml-3 shrink-0">ver prompt</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <WorkshopBand placement="library" />
      </div>

      <AnimatePresence>
        {open && <MotionModal def={open} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </LeadGateProvider>
  )
}
