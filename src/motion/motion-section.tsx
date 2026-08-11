import {
  AnimatePresence,
  motion,
  type TargetAndTransition,
} from 'framer-motion'
import { useMemo, useState } from 'react'
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  MOTION_BY_ID,
  MOTIONS,
  type MotionDef,
} from './catalog'
import { cxTrack, useLeadGate } from './lead-gate'
import { MotionPreview } from './previews'

/* Cada bloco da página /motion vem embrulhado aqui: o wrapper aplica o motion
   de entrada escolhido, e um botão flutuante fixo à direita do bloco conta
   qual motion está em uso e deixa trocar por outro para ver como fica.
   Trocar/copiar passa pelo lead gate. */

type Fx = {
  initial: TargetAndTransition
  animate: TargetAndTransition
  overlay?: 'grain' | 'aurora' | 'leak' | 'flare' | 'particles'
}

const SPRING = { type: 'spring', stiffness: 90, damping: 18 } as const
const EASE_OUT = { duration: 0.7, ease: [0.16, 1, 0.3, 1] } as const

/* Tradução de cada motion do catálogo para um efeito aplicável a uma SEÇÃO
   inteira. Efeitos de textura viram overlays; os demais, variantes de entrada. */
const FX: Record<string, Fx> = {
  'kinetic-type': {
    initial: { scale: 0.92, rotate: -2, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1, transition: SPRING },
  },
  typewriter: {
    initial: { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
    animate: {
      clipPath: 'inset(0 0% 0 0)',
      transition: { duration: 1.1, ease: 'linear' },
    },
  },
  'matrix-decode': {
    initial: { opacity: 0, filter: 'blur(10px) saturate(3)' },
    animate: {
      opacity: 1,
      filter: 'blur(0px) saturate(1)',
      transition: { duration: 0.9 },
    },
  },
  'karaoke-captions': {
    initial: { clipPath: 'inset(0 100% 0 0)' },
    animate: {
      clipPath: 'inset(0 0% 0 0)',
      transition: { duration: 1.4, ease: 'easeInOut' },
    },
  },
  'neon-glow': {
    initial: { opacity: 0, filter: 'brightness(3) blur(6px)' },
    animate: {
      opacity: 1,
      filter: 'brightness(1) blur(0px)',
      transition: { duration: 0.9, ease: 'easeOut' },
    },
  },
  'gradient-fill': {
    initial: { opacity: 0, filter: 'hue-rotate(90deg) saturate(2)' },
    animate: {
      opacity: 1,
      filter: 'hue-rotate(0deg) saturate(1)',
      transition: { duration: 1.1 },
    },
  },
  'count-up': {
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { ...EASE_OUT, duration: 1.2 } },
  },
  'bar-race': {
    initial: { x: -80, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: SPRING },
  },
  'stock-ticker': {
    initial: { y: 24, opacity: 0, skewY: 2 },
    animate: { y: 0, opacity: 1, skewY: 0, transition: EASE_OUT },
  },
  'line-draw': {
    initial: { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
    animate: {
      clipPath: 'inset(0 0 0% 0)',
      opacity: 1,
      transition: { duration: 1.2, ease: 'easeInOut' },
    },
  },
  'progress-bars': {
    initial: { scaleX: 0, opacity: 0, transformOrigin: 'left' },
    animate: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  },
  countdown: {
    initial: { rotateX: -55, opacity: 0, transformPerspective: 900 },
    animate: { rotateX: 0, opacity: 1, transition: { duration: 0.7, ease: 'backOut' } },
  },
  crossfade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1.0, ease: 'easeInOut' } },
  },
  glitch: {
    initial: { opacity: 0, x: -8, filter: 'hue-rotate(120deg)' },
    animate: {
      opacity: [0, 1, 0.4, 1],
      x: [-8, 6, -3, 0],
      filter: ['hue-rotate(120deg)', 'hue-rotate(0deg)'],
      transition: { duration: 0.5, times: [0, 0.3, 0.6, 1] },
    },
  },
  'light-leak': {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8 } },
    overlay: 'leak',
  },
  'zoom-punch': {
    initial: { scale: 1.28, opacity: 0, filter: 'blur(8px)' },
    animate: {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.45, ease: [0.22, 1.4, 0.36, 1] },
    },
  },
  'whip-pan': {
    initial: { x: '60%', opacity: 0, filter: 'blur(18px)' },
    animate: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  },
  'radial-split': {
    initial: { clipPath: 'circle(0% at 50% 50%)' },
    animate: {
      clipPath: 'circle(140% at 50% 50%)',
      transition: { duration: 0.9, ease: [0.83, 0, 0.17, 1] },
    },
  },
  'grid-wipe': {
    initial: { clipPath: 'inset(0 0 0 0 round 0)', opacity: 0, scale: 0.98 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  },
  'warp-dissolve': {
    initial: { opacity: 0, scale: 1.06, skewX: 3, filter: 'blur(16px)' },
    animate: {
      opacity: 1,
      scale: 1,
      skewX: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.9 },
    },
  },
  'flash-cut': {
    initial: { opacity: 0, filter: 'brightness(4)' },
    animate: {
      opacity: 1,
      filter: 'brightness(1)',
      transition: { duration: 0.35, ease: 'easeOut' },
    },
  },
  'beat-cut': {
    initial: { scale: 1.05, opacity: 0 },
    animate: {
      scale: [1.05, 1],
      opacity: [0, 1],
      transition: { duration: 0.16, ease: 'linear' },
    },
  },
  'film-grain': {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8 } },
    overlay: 'grain',
  },
  'lens-flare': {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8 } },
    overlay: 'flare',
  },
  aurora: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1.2 } },
    overlay: 'aurora',
  },
  particles: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: EASE_OUT },
    overlay: 'particles',
  },
  'shader-dissolve': {
    initial: { opacity: 0, filter: 'contrast(2) blur(6px)' },
    animate: {
      opacity: 1,
      filter: 'contrast(1) blur(0px)',
      transition: { duration: 1.0 },
    },
  },
  '3d-extrude': {
    initial: { rotateX: 18, y: 60, opacity: 0, transformPerspective: 1000 },
    animate: { rotateX: 0, y: 0, opacity: 1, transition: SPRING },
  },
  'clone-wall': {
    initial: { scale: 0.9, rotateY: 12, opacity: 0, transformPerspective: 1000 },
    animate: { scale: 1, rotateY: 0, opacity: 1, transition: SPRING },
  },
  'lens-warp': {
    initial: { scale: 1.15, opacity: 0, filter: 'blur(4px)' },
    animate: {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  },
  'code-typing': {
    initial: { clipPath: 'inset(0 100% 0 0)' },
    animate: {
      clipPath: 'inset(0 0% 0 0)',
      transition: { duration: 1.3, ease: 'linear' },
    },
  },
  'code-diff': {
    initial: { height: 'auto', opacity: 0, y: -12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.08 },
    },
  },
  'code-morph': {
    initial: { opacity: 0, scale: 0.97 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', damping: 30, stiffness: 120 },
    },
  },
  'code-scroll': {
    initial: { y: 80, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 1.0, ease: 'linear' } },
  },
  'cursor-demo': {
    initial: { opacity: 0, scale: 0.985 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  },
  'phone-mockup': {
    initial: { rotateY: -18, y: 40, opacity: 0, transformPerspective: 900 },
    animate: { rotateY: 0, y: 0, opacity: 1, transition: SPRING },
  },
  'app-showcase': {
    initial: { x: 120, opacity: 0, scale: 0.94 },
    animate: { x: 0, opacity: 1, scale: 1, transition: SPRING },
  },
  'logo-assemble': {
    initial: { scale: 0.8, rotate: -5, opacity: 0 },
    animate: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 120, damping: 14 },
    },
  },
  'lower-thirds': {
    initial: { y: '30%', opacity: 0, transformOrigin: 'left' },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  },
  'camcorder-hud': {
    initial: { opacity: 0, filter: 'contrast(1.6) brightness(1.4)' },
    animate: {
      opacity: 1,
      filter: 'contrast(1) brightness(1)',
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  },
  'map-route': {
    initial: { clipPath: 'inset(0 100% 0 0)', opacity: 0.4 },
    animate: {
      clipPath: 'inset(0 0% 0 0)',
      opacity: 1,
      transition: { duration: 1.3, ease: 'easeInOut' },
    },
  },
  'hand-drawn': {
    initial: { opacity: 0, rotate: -1.5, scale: 0.985 },
    animate: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  },
}

function FxOverlay({ kind }: { kind: NonNullable<Fx['overlay']> }) {
  if (kind === 'grain') return <div className="fx-overlay fx-grain" />
  if (kind === 'leak')
    return (
      <div className="fx-overlay">
        <div className="fx-leak" />
      </div>
    )
  if (kind === 'flare')
    return (
      <div className="fx-overlay">
        <div className="fx-flare" />
      </div>
    )
  if (kind === 'aurora')
    return (
      <div className="fx-overlay fx-aurora">
        <i />
        <i />
        <i />
      </div>
    )
  return (
    <div className="fx-overlay">
      {Array.from({ length: 16 }, (_, i) => (
        <i
          // biome-ignore lint/suspicious/noArrayIndexKey: lista estática
          key={i}
          className="fx-particles"
          style={{
            position: 'absolute',
            left: `${(i * 41 + 13) % 96}%`,
            top: `${(i * 29 + 17) % 92}%`,
            ['--s' as string]: `${2 + (i % 4)}px`,
            ['--o' as string]: 0.3 + ((i * 23) % 50) / 100,
            ['--t' as string]: `${5 + (i % 6)}s`,
            ['--dx' as string]: `${8 + ((i * 11) % 22)}px`,
            ['--dy' as string]: `${6 + ((i * 7) % 16)}px`,
          }}
        />
      ))}
    </div>
  )
}

function copyToClipboard(text: string): void {
  try {
    navigator.clipboard?.writeText(text)
  } catch {
    /* clipboard bloqueado: sem fallback, o painel mostra o texto de qualquer forma */
  }
}

/* ── Painel de troca de motion ── */

function MotionPicker({
  current,
  sectionName,
  onPick,
  onClose,
}: {
  current: MotionDef
  sectionName: string
  onPick: (id: string) => void
  onClose: () => void
}) {
  const { gate } = useLeadGate()
  const [copied, setCopied] = useState(false)

  const copyPrompt = () => {
    gate(() => {
      copyToClipboard(`${current.prompt}\n\n// Exemplo:\n${current.code}`)
      cxTrack('prompt_copy', { motion: current.id, section: sectionName })
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }, `copy:${current.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed top-1/2 right-4 z-[70] w-[340px] max-w-[calc(100vw-2rem)] -translate-y-1/2 overflow-hidden rounded-2xl border border-indigo-400/25 bg-[#0b0f23]/95 text-slate-100 shadow-[0_30px_90px_rgba(0,0,0,.65)] backdrop-blur-xl"
      style={{ maxHeight: 'min(78vh, 640px)' }}
    >
      <div className="flex items-start justify-between gap-3 border-white/10 border-b p-4">
        <div>
          <p className="font-semibold text-[10.5px] text-indigo-300 uppercase tracking-[0.16em]">
            {sectionName}
          </p>
          <p className="mt-0.5 font-bold text-[15px]">
            Motion atual: {current.name}
          </p>
          <p className="mt-0.5 text-[12px] text-slate-400">{current.desc}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="border-white/10 border-b p-4">
        <p className="mb-2 text-[11px] text-slate-500">
          Prompt para vibe codar este efeito:
        </p>
        <p className="mb-3 max-h-[88px] overflow-y-auto rounded-lg bg-white/5 p-3 text-[12px] text-slate-300 leading-relaxed">
          {current.prompt}
        </p>
        <button
          type="button"
          onClick={copyPrompt}
          className="w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 font-semibold text-[13px] text-slate-950 transition-transform hover:scale-[1.01]"
        >
          {copied ? 'Copiado ✓' : 'Copiar prompt + código'}
        </button>
      </div>

      <div className="overflow-y-auto p-4" style={{ maxHeight: '300px' }}>
        <p className="mb-2 text-[11px] text-slate-500">
          Altere para outro pra ver como fica:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {MOTIONS.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => onPick(m.id)}
              className={`rounded-lg border px-2.5 py-2 text-left transition-colors ${
                m.id === current.id
                  ? 'border-cyan-400/60 bg-cyan-400/10'
                  : 'border-white/10 hover:border-white/25 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <i
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ background: CATEGORY_COLORS[m.category] }}
                />
                <span className="truncate font-medium text-[11.5px]">
                  {m.name}
                </span>
              </span>
              <span className="mt-0.5 block text-[10px] text-slate-500">
                {CATEGORY_LABELS[m.category]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Wrapper da seção ── */

export function MotionSection({
  name,
  defaultMotion,
  children,
}: {
  name: string
  defaultMotion: string
  children: React.ReactNode
}) {
  const { gate } = useLeadGate()
  const [motionId, setMotionId] = useState(defaultMotion)
  const [replayKey, setReplayKey] = useState(0)
  const [open, setOpen] = useState(false)

  const def = MOTION_BY_ID[motionId] ?? MOTION_BY_ID[defaultMotion]
  const fx = useMemo(() => FX[def.id] ?? FX.crossfade, [def.id])

  const pick = (id: string) => {
    gate(() => {
      setMotionId(id)
      setReplayKey(k => k + 1)
      cxTrack('motion_swap', { section: name, from: def.id, to: id })
    }, `swap:${id}`)
  }

  return (
    <section className="relative">
      <motion.div
        key={replayKey}
        initial={fx.initial}
        whileInView={fx.animate}
        viewport={{ once: true, amount: 0.12 }}
        className="relative"
      >
        {children}
        {fx.overlay && <FxOverlay kind={fx.overlay} />}
      </motion.div>

      {/* Botão flutuante à direita do bloco: qual motion está em uso aqui */}
      <div className="pointer-events-none absolute inset-y-0 right-3 z-40 hidden items-center md:flex">
        <div className="pointer-events-auto sticky top-1/2">
          <button
            type="button"
            onClick={() => {
              setOpen(v => !v)
              if (!open) cxTrack('motion_chip_open', { section: name, motion: def.id })
            }}
            title={`Aqui está sendo usado o motion "${def.name}". Altere para outro pra ver como fica.`}
            className="group flex items-center gap-2 rounded-full border border-indigo-400/30 bg-[#0b0f23]/90 py-2 pr-3.5 pl-2.5 text-slate-100 shadow-[0_10px_40px_rgba(0,0,0,.45)] backdrop-blur-md transition-all hover:border-cyan-400/50 hover:shadow-[0_10px_40px_rgba(34,211,238,.15)]"
          >
            <i
              className="size-2 rounded-full"
              style={{ background: CATEGORY_COLORS[def.category] }}
            />
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-[11px] text-slate-400 opacity-0 transition-all duration-300 group-hover:max-w-[190px] group-hover:opacity-100">
              Aqui está sendo usado
            </span>
            <span className="whitespace-nowrap font-semibold text-[12px]">
              {def.name}
            </span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10.5px] text-cyan-300">
              trocar
            </span>
          </button>
        </div>
      </div>

      {/* Mobile: chip compacto no rodapé do bloco */}
      <div className="absolute right-3 bottom-3 z-40 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-[#0b0f23]/90 px-3 py-1.5 font-semibold text-[11px] text-slate-100 backdrop-blur-md"
        >
          <i
            className="size-1.5 rounded-full"
            style={{ background: CATEGORY_COLORS[def.category] }}
          />
          {def.name}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <MotionPicker
            current={def}
            sectionName={name}
            onPick={pick}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export { MotionPreview }
