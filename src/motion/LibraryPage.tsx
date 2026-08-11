import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ClickmaxPixel } from '@/components/clickmax-pixel'
import {
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  MOTION_BY_ID,
  MOTIONS,
  type MotionCategory,
  type MotionDef,
} from './catalog'
import { CX_PAGE_SLUG, CX_PROJECT_SLUG } from './cx-config'
import { cxTrack, LeadGateProvider, useLeadGate } from './lead-gate'
import { MotionNav, WorkshopBand } from './MotionNav'
import { MotionPreview } from './previews'

/* /motion/biblioteca — a biblioteca completa: os 42 motions com filtros por
   texto, data, transitions, texture, 3D, code e interface. Cada card mostra a
   animação viva; clicar abre o detalhe com prompt + código para vibe codar
   (copiar passa pelo lead gate). */

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
      style={{ background: 'rgba(5,8,22,.8)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="max-h-[86vh] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-indigo-400/25 bg-[#0b0f23] p-6 text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <span
              className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 font-semibold text-[10.5px] uppercase tracking-wider"
              style={{ color: CATEGORY_COLORS[def.category] }}
            >
              <i
                className="size-1.5 rounded-full"
                style={{ background: CATEGORY_COLORS[def.category] }}
              />
              {CATEGORY_LABELS[def.category]}
            </span>
            <h3 className="font-bold text-[24px]">{def.name}</h3>
            <p className="mt-1 text-[13.5px] text-slate-400">{def.desc}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <MotionPreview id={def.id} className="mb-5" />

        <p className="mb-1.5 font-semibold text-[12px] text-slate-300 uppercase tracking-wider">
          Prompt para vibe codar
        </p>
        <p className="mb-3 rounded-xl bg-white/5 p-4 text-[13.5px] text-slate-300 leading-relaxed">
          {def.prompt}
        </p>
        <button
          type="button"
          onClick={() => copy('prompt')}
          className="mb-5 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 font-semibold text-[14px] text-slate-950 transition-transform hover:scale-[1.01]"
        >
          {copied === 'prompt' ? 'Prompt copiado ✓' : 'Copiar prompt'}
        </button>

        <p className="mb-1.5 font-semibold text-[12px] text-slate-300 uppercase tracking-wider">
          Código de exemplo
        </p>
        <pre className="mb-3 overflow-x-auto rounded-xl bg-[#0f172a] p-4 text-[12px] text-slate-300 leading-relaxed">
          <code>{def.code}</code>
        </pre>
        <button
          type="button"
          onClick={() => copy('code')}
          className="w-full rounded-xl border border-indigo-400/40 px-5 py-2.5 font-semibold text-[14px] text-slate-200 transition-colors hover:border-cyan-400/60"
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
      <ClickmaxPixel projectSlug={CX_PROJECT_SLUG} pageSlug={CX_PAGE_SLUG} />
      <div className="min-h-screen bg-[#070a1c] text-slate-100">
        <MotionNav />

        <div className="mx-auto max-w-[1200px] px-4 pt-14 pb-20 sm:px-8">
          <div className="mb-8 text-center">
            <p className="mb-2 font-semibold text-[11px] text-cyan-300 uppercase tracking-[0.2em]">
              Exemplos de todas as animações
            </p>
            <h1 className="font-extrabold text-[30px] tracking-tight sm:text-[42px]">
              Biblioteca de <span className="mv-grad">motions</span>
            </h1>
            <p className="mx-auto mt-3 max-w-[520px] text-[14.5px] text-slate-400">
              42 tipos, cada um com prompt e código de exemplo. Filtre por
              categoria e clique para copiar e vibe codar.
            </p>
          </div>

          {/* filtros */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-full border px-4 py-1.5 font-semibold text-[12.5px] transition-colors ${
                filter === 'all'
                  ? 'border-cyan-400/70 bg-cyan-400/10 text-cyan-200'
                  : 'border-white/15 text-slate-400 hover:border-white/30 hover:text-white'
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
                      ? 'bg-white/10 text-white'
                      : 'border-white/15 text-slate-400 hover:border-white/30 hover:text-white'
                  }`}
                  style={active ? { borderColor: CATEGORY_COLORS[c] } : undefined}
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => {
                    setOpenId(m.id)
                    cxTrack('motion_detail_open', { motion: m.id })
                  }}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition-colors hover:border-indigo-400/40"
                >
                  <MotionPreview id={m.id} />
                  <div className="mt-3 flex items-center justify-between px-1">
                    <div>
                      <p className="font-semibold text-[14px]">{m.name}</p>
                      <p className="text-[12px] text-slate-500">{m.desc}</p>
                    </div>
                    <span className="ml-3 shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-[10.5px] text-slate-400 transition-colors group-hover:bg-cyan-400/15 group-hover:text-cyan-200">
                      ver prompt
                    </span>
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
