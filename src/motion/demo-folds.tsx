import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type MotionDef,
} from './catalog'
import { cxTrack, useLeadGate } from './lead-gate'

/* Dobras de exemplo dos motions — inseridas ao vivo na página quando a
   pessoa escolhe um motion no painel. Cada dobra demonstra o efeito com
   conteúdo que faz sentido para aquele tipo (count-up mostra números,
   typewriter escreve a headline, transição troca cenas…), sempre no design
   system CX Light da própria página. O efeito acontece SÓ aqui dentro. */

/* ── utilitários ── */

function useTick(ms: number, run = true): number {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    const id = setInterval(() => setN(v => v + 1), ms)
    return () => clearInterval(id)
  }, [ms, run])
  return n
}

function useLoopKey(everyMs: number): number {
  /* re-monta um bloco animado de tempos em tempos para o efeito repetir */
  return useTick(everyMs)
}

const INK = 'var(--cxa-ink)'
const SOFT = 'var(--cxa-ink-soft)'

/* Cartão branco padrão do app */
function Card({
  children,
  className = '',
  dark = false,
}: {
  children: React.ReactNode
  className?: string
  dark?: boolean
}) {
  return (
    <div
      className={`overflow-hidden rounded-[var(--cxa-radius)] ${dark ? '' : 'border border-[var(--cxa-hairline)]'} shadow-[var(--cxa-shadow)] ${className}`}
      style={{ background: dark ? 'var(--cxa-dark)' : 'var(--cxa-paper)' }}
    >
      {children}
    </div>
  )
}

/* ── TEXTO ── */

function KineticFold() {
  const key = useLoopKey(4200)
  const words = ['Design', 'que', 'se', 'move', 'com', 'intenção.']
  return (
    <h3
      key={key}
      className="cxa-headline text-center text-[34px] sm:text-[52px]"
      style={{ color: INK }}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="mr-[0.28em] inline-block"
          initial={{ scale: 0.7, rotate: -5, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: i * 0.09,
          }}
        >
          {i === 3 ? <span className="cxa-hero-underline">{w}</span> : w}
        </motion.span>
      ))}
    </h3>
  )
}

function TypewriterFold() {
  const phrases = [
    'Páginas que se escrevem sozinhas.',
    'Headlines que prendem o olhar.',
    'Design Viral.',
  ]
  const t = useTick(65)
  const total = phrases.reduce((a, p) => a + p.length + 24, 0)
  let cursor = t % total
  let text = ''
  for (const p of phrases) {
    const span = p.length + 24
    if (cursor < span) {
      text = p.slice(0, Math.min(cursor + 1, p.length))
      break
    }
    cursor -= span
  }
  return (
    <h3 className="cxa-headline text-center text-[30px] sm:text-[46px]" style={{ color: INK }}>
      {text}
      <span className="mv-caret !bg-[var(--cxa-accent)]" style={{ height: '0.9em', width: '0.45em' }} />
    </h3>
  )
}

const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&'
function MatrixFold() {
  const target = 'MOVIMENTO É CONVERSÃO'
  const t = useTick(60)
  const cycle = t % 60
  const locked = Math.min(cycle, target.length)
  const txt = target
    .split('')
    .map((c, i) =>
      i < locked || c === ' '
        ? c
        : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)],
    )
    .join('')
  return (
    <Card dark className="flex items-center justify-center px-6 py-16">
      <p className="mv-mono text-center text-[20px] text-emerald-400 tracking-[0.2em] sm:text-[32px]">
        {txt}
      </p>
    </Card>
  )
}

function KaraokeFold() {
  const words = 'Cada palavra acende na hora certa e o olho segue o ritmo.'.split(' ')
  const t = useTick(420)
  const on = t % (words.length + 4)
  return (
    <h3 className="cxa-headline mx-auto max-w-[760px] text-center text-[28px] leading-[1.2] sm:text-[40px]">
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="mr-[0.28em] inline-block transition-colors duration-300"
          style={{ color: i <= on ? INK : '#c3c8ce' }}
        >
          {i === on ? <span className="cxa-hero-underline">{w}</span> : w}
        </span>
      ))}
    </h3>
  )
}

function NeonFold() {
  return (
    <Card dark className="flex items-center justify-center px-6 py-16">
      <span className="mv-neon !text-[40px] sm:!text-[64px]" style={{ fontSize: 48 }}>
        VIRAL
      </span>
    </Card>
  )
}

function GradientFold() {
  return (
    <h3
      className="cxa-headline text-center text-[34px] sm:text-[54px]"
      style={{
        background:
          'linear-gradient(90deg, var(--cxa-g1), var(--cxa-g2), var(--cxa-g3), var(--cxa-g1))',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        animation: 'mv-grad-slide 5s linear infinite',
      }}
    >
      O degradê percorre o texto sem parar.
    </h3>
  )
}

/* ── DATA ── */

function useCountUp(end: number, ms: number, replayKey: number): number {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf = 0
    const t0 = performance.now()
    const step = (now: number) => {
      const p = Math.min((now - t0) / ms, 1)
      setV(Math.round(end * (1 - 2 ** (-10 * p))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [end, ms, replayKey])
  return v
}

function CountUpFold() {
  const key = useLoopKey(5000)
  const a = useCountUp(4200000, 1400, key)
  const b = useCountUp(12847, 1400, key)
  const c = useCountUp(97, 1400, key)
  const stats = [
    { v: `R$ ${(a / 1000000).toFixed(1).replace('.', ',')}M`, l: 'faturados com páginas vivas' },
    { v: b.toLocaleString('pt-BR'), l: 'leads capturados em motion' },
    { v: `${c}%`, l: 'das pessoas rolam até o fim' },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(s => (
        <Card key={s.l} className="px-6 py-8 text-center">
          <p className="cxa-headline text-[36px] tabular-nums sm:text-[44px]" style={{ color: INK }}>
            {s.v}
          </p>
          <p className="mt-2 text-[13px]" style={{ color: SOFT }}>
            {s.l}
          </p>
        </Card>
      ))}
    </div>
  )
}

function BarRaceFold() {
  const t = useTick(1600)
  const rounds = [
    [82, 64, 45, 30],
    [58, 88, 39, 52],
    [70, 50, 90, 41],
  ]
  const vals = rounds[t % rounds.length]
  const rows = [
    { n: 'Instagram', c: 'var(--cxa-g1)' },
    { n: 'YouTube', c: 'var(--cxa-g2)' },
    { n: 'Workshop', c: 'var(--cxa-g3)' },
    { n: 'Indicação', c: 'var(--cxa-accent)' },
  ]
    .map((r, i) => ({ ...r, v: vals[i] }))
    .sort((x, y) => y.v - x.v)
  return (
    <Card className="mx-auto max-w-[680px] p-6 sm:p-8">
      <p className="mb-4 font-semibold text-[13px]" style={{ color: INK }}>
        De onde chegam os leads — disputando ao vivo
      </p>
      <div className="flex flex-col gap-3">
        {rows.map(r => (
          <motion.div layout key={r.n} transition={{ type: 'spring', damping: 26 }}>
            <div className="mb-1 flex justify-between text-[12px]" style={{ color: SOFT }}>
              <span>{r.n}</span>
              <span className="tabular-nums">{r.v}%</span>
            </div>
            <div className="h-[10px] overflow-hidden rounded-full bg-[var(--cxa-subtle)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${r.v}%`,
                  background: r.c,
                  transition: 'width 1.2s cubic-bezier(.22,1,.36,1)',
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

function TickerFold() {
  const [pts, setPts] = useState<number[]>(() =>
    Array.from({ length: 40 }, (_, i) => 50 + Math.sin(i / 4) * 14),
  )
  useEffect(() => {
    const id = setInterval(() => {
      setPts(prev => {
        const last = prev[prev.length - 1]
        const next = Math.max(12, Math.min(88, last + (Math.random() - 0.46) * 12))
        return [...prev.slice(1), next]
      })
    }, 280)
    return () => clearInterval(id)
  }, [])
  const up = pts[pts.length - 1] >= pts[pts.length - 2]
  const d = pts.map((y, x) => `${(x / (pts.length - 1)) * 100},${100 - y}`).join(' ')
  return (
    <Card className="mx-auto max-w-[680px] p-6 sm:p-8">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="font-semibold text-[13px]" style={{ color: INK }}>
          Conversão da página · tempo real
        </p>
        <p
          className="mv-mono font-semibold text-[15px] tabular-nums"
          style={{ color: up ? '#16a34a' : '#dc2626' }}
        >
          {(pts[pts.length - 1] / 10).toFixed(1)}% {up ? '↑' : '↓'}
        </p>
      </div>
      <svg viewBox="0 0 100 100" className="h-[180px] w-full" preserveAspectRatio="none">
        <title>ticker</title>
        <polyline
          points={d}
          fill="none"
          stroke={up ? '#16a34a' : '#dc2626'}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </Card>
  )
}

function LineDrawFold() {
  const key = useLoopKey(4000)
  return (
    <Card className="mx-auto max-w-[680px] p-6 sm:p-8">
      <p className="mb-4 font-semibold text-[13px]" style={{ color: INK }}>
        Engajamento depois do motion — a linha se desenha
      </p>
      <svg key={key} viewBox="0 0 100 48" className="w-full" preserveAspectRatio="none" style={{ height: 180 }}>
        <title>linha</title>
        <path
          d="M2 44 C 20 42, 28 30, 40 28 S 62 24, 74 14 S 92 6, 98 4"
          fill="none"
          stroke="url(#dvgrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          style={{
            strokeDasharray: 160,
            strokeDashoffset: 160,
            animation: 'mv-draw 2.4s cubic-bezier(.4,0,.2,1) forwards',
            ['--len' as string]: 160,
          }}
        />
        <defs>
          <linearGradient id="dvgrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--cxa-g1)" />
            <stop offset=".5" stopColor="var(--cxa-g2)" />
            <stop offset="1" stopColor="var(--cxa-g3)" />
          </linearGradient>
        </defs>
      </svg>
    </Card>
  )
}

function ProgressFold() {
  const key = useLoopKey(4200)
  const rows = [
    { n: 'Atenção na primeira dobra', v: 92 },
    { n: 'Rolagem até o meio', v: 74 },
    { n: 'Clique no CTA', v: 38 },
  ]
  return (
    <Card key={key} className="mx-auto max-w-[680px] p-6 sm:p-8">
      <div className="flex flex-col gap-5">
        {rows.map((r, i) => (
          <div key={r.n}>
            <div className="mb-1.5 flex justify-between text-[12.5px]">
              <span style={{ color: INK }}>{r.n}</span>
              <span className="tabular-nums" style={{ color: SOFT }}>
                {r.v}%
              </span>
            </div>
            <div className="h-[9px] overflow-hidden rounded-full bg-[var(--cxa-subtle)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${r.v}%`,
                  background: 'var(--cxa-gradient)',
                  transformOrigin: 'left',
                  transform: 'scaleX(0)',
                  animation: `mv-fill 1.1s cubic-bezier(.16,1,.3,1) ${i * 0.15}s forwards`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function CountdownFold() {
  const t = useTick(1000)
  const target = useRef(Date.now() + 3 * 86400000 + 7 * 3600000)
  const left = Math.max(0, target.current - Date.now())
  const d = Math.floor(left / 86400000)
  const h = Math.floor((left % 86400000) / 3600000)
  const m = Math.floor((left % 3600000) / 60000)
  const s = Math.floor((left % 60000) / 1000)
  const parts = [
    { v: String(d).padStart(2, '0'), l: 'dias' },
    { v: String(h).padStart(2, '0'), l: 'horas' },
    { v: String(m).padStart(2, '0'), l: 'min' },
    { v: String(s).padStart(2, '0'), l: 'seg' },
  ]
  void t
  return (
    <div className="text-center">
      <p className="mb-5 font-medium text-[14px]" style={{ color: SOFT }}>
        O workshop começa em
      </p>
      <div className="flex items-start justify-center gap-3 sm:gap-4">
        {parts.map(p => (
          <div key={p.l} className="flex flex-col items-center gap-2">
            <Card className="flex h-[72px] w-[64px] items-center justify-center sm:h-[86px] sm:w-[78px]" >
              <span className="cxa-headline overflow-hidden text-[30px] tabular-nums sm:text-[38px]" style={{ color: INK, perspective: 400 }}>
                <motion.span
                  key={p.v}
                  className="inline-block"
                  initial={{ rotateX: -80, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: 'backOut' }}
                >
                  {p.v}
                </motion.span>
              </span>
            </Card>
            <span className="text-[11px]" style={{ color: SOFT }}>
              {p.l}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── TRANSITIONS: palco com duas cenas trocando pelo efeito escolhido ── */

function SceneA() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'var(--cxa-gradient)' }}
    >
      <p className="cxa-headline text-[26px] text-[var(--cxa-ink)] sm:text-[38px]">
        Cena A
      </p>
    </div>
  )
}
function SceneB() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'var(--cxa-dark)' }}
    >
      <p className="cxa-headline text-[26px] text-white sm:text-[38px]">Cena B</p>
    </div>
  )
}

import type { TargetAndTransition } from 'framer-motion'

type StageFx = {
  initial: TargetAndTransition
  animate: TargetAndTransition
  exit: TargetAndTransition
  duration?: number
  overlay?: 'flash' | 'leak' | 'grid'
}

const STAGE_FX: Record<string, StageFx> = {
  crossfade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    duration: 0.8,
  },
  glitch: {
    initial: { opacity: 0, x: -10, filter: 'hue-rotate(90deg)' },
    animate: {
      opacity: [0, 1, 0.4, 1],
      x: [-10, 8, -4, 0],
      filter: ['hue-rotate(90deg)', 'hue-rotate(0deg)'],
    },
    exit: { opacity: 0, x: 8 },
    duration: 0.45,
  },
  'light-leak': {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    duration: 0.9,
    overlay: 'leak',
  },
  'zoom-punch': {
    initial: { scale: 1.3, opacity: 0, filter: 'blur(10px)' },
    animate: { scale: 1, opacity: 1, filter: 'blur(0px)' },
    exit: { scale: 0.96, opacity: 0 },
    duration: 0.4,
  },
  'whip-pan': {
    initial: { x: '100%', filter: 'blur(18px)' },
    animate: { x: 0, filter: 'blur(0px)' },
    exit: { x: '-100%', filter: 'blur(18px)' },
    duration: 0.3,
  },
  'radial-split': {
    initial: { clipPath: 'circle(0% at 50% 50%)' },
    animate: { clipPath: 'circle(120% at 50% 50%)' },
    exit: { opacity: 0.2 },
    duration: 0.8,
  },
  'grid-wipe': {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    duration: 0.5,
    overlay: 'grid',
  },
  'warp-dissolve': {
    initial: { opacity: 0, scale: 1.08, skewX: 4, filter: 'blur(14px)' },
    animate: { opacity: 1, scale: 1, skewX: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.06, skewX: -3, filter: 'blur(14px)' },
    duration: 0.7,
  },
  'flash-cut': {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
    duration: 0.01,
    overlay: 'flash',
  },
  'beat-cut': {
    initial: { scale: 1.05 },
    animate: { scale: 1 },
    exit: { scale: 1 },
    duration: 0.12,
  },
}

function TransitionFold({ id }: { id: string }) {
  const fx = STAGE_FX[id] ?? STAGE_FX.crossfade
  const period = id === 'beat-cut' ? 1000 : 2600
  const t = useTick(period)
  const showA = t % 2 === 0
  return (
    <Card dark className="relative mx-auto aspect-[16/7] max-w-[820px]">
      <AnimatePresence mode={id === 'whip-pan' ? 'sync' : 'popLayout'}>
        <motion.div
          key={showA ? 'a' : 'b'}
          className="absolute inset-0"
          initial={fx.initial}
          animate={fx.animate}
          exit={fx.exit}
          transition={{ duration: fx.duration ?? 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {showA ? <SceneA /> : <SceneB />}
        </motion.div>
      </AnimatePresence>
      {fx.overlay === 'flash' && (
        <motion.div
          key={`f${t}`}
          className="pointer-events-none absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.35, times: [0, 0.2, 1] }}
        />
      )}
      {fx.overlay === 'leak' && (
        <motion.div
          key={`l${t}`}
          className="pointer-events-none absolute inset-0"
          initial={{ x: '-100%' }}
          animate={{ x: '120%' }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          style={{
            background:
              'radial-gradient(circle, rgba(251,191,36,.75), rgba(217,70,239,.35), transparent 70%)',
            filter: 'blur(40px)',
            mixBlendMode: 'screen',
          }}
        />
      )}
      {fx.overlay === 'grid' && (
        <div className="pointer-events-none absolute inset-0 grid grid-cols-8 grid-rows-4">
          {Array.from({ length: 32 }, (_, i) => (
            <motion.i
              // biome-ignore lint/suspicious/noArrayIndexKey: grade estática
              key={`${t}-${i}`}
              className="block"
              style={{ background: 'var(--cxa-canvas)' }}
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 0.4, delay: ((i * 7) % 32) * 0.02, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </Card>
  )
}

/* ── TEXTURE ── */

function TextureFold({ id }: { id: string }) {
  const dark = id === 'film-grain' || id === 'lens-flare'
  return (
    <Card dark={dark} className="relative mx-auto aspect-[16/7] max-w-[820px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <p
          className="cxa-headline px-6 text-center text-[24px] sm:text-[36px]"
          style={{ color: dark ? '#fff' : INK }}
        >
          Textura dá vida ao que era chapado.
        </p>
      </div>
      {id === 'film-grain' && <div className="fx-overlay fx-grain !absolute" />}
      {id === 'lens-flare' && (
        <div className="fx-overlay !absolute">
          <div className="fx-flare" />
        </div>
      )}
      {id === 'aurora' && (
        <div className="fx-overlay fx-aurora !absolute opacity-60">
          <i />
          <i />
          <i />
        </div>
      )}
      {id === 'particles' && (
        <div className="fx-overlay !absolute">
          {Array.from({ length: 18 }, (_, i) => (
            <i
              // biome-ignore lint/suspicious/noArrayIndexKey: lista estática
              key={i}
              className="fx-particles"
              style={{
                position: 'absolute',
                left: `${(i * 37 + 9) % 96}%`,
                top: `${(i * 29 + 15) % 90}%`,
                background: 'var(--cxa-accent)',
                ['--s' as string]: `${3 + (i % 4)}px`,
                ['--o' as string]: 0.35 + ((i * 23) % 45) / 100,
                ['--t' as string]: `${5 + (i % 6)}s`,
                ['--dx' as string]: `${10 + ((i * 11) % 24)}px`,
                ['--dy' as string]: `${8 + ((i * 7) % 18)}px`,
              }}
            />
          ))}
        </div>
      )}
      {id === 'shader-dissolve' && (
        <div
          className="absolute inset-0"
          style={{
            background: 'var(--cxa-gradient)',
            WebkitMaskImage: 'radial-gradient(circle, #000 40%, transparent 60%)',
            maskImage: 'radial-gradient(circle, #000 40%, transparent 60%)',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            animation: 'mv-dissolve-mask 4s ease-in-out infinite',
            mixBlendMode: 'multiply',
          }}
        />
      )}
    </Card>
  )
}

/* ── 3D ── */

function ExtrudeFold() {
  const ref = useRef<HTMLDivElement>(null)
  const [rot, setRot] = useState({ x: 0, y: 0 })
  return (
    <div
      ref={ref}
      className="mx-auto max-w-[520px]"
      onMouseMove={e => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        setRot({ x: -y * 14, y: x * 14 })
      }}
      onMouseLeave={() => setRot({ x: 0, y: 0 })}
      style={{ perspective: 900 }}
    >
      <div
        className="rounded-[var(--cxa-radius)] border border-[var(--cxa-hairline)] bg-[var(--cxa-paper)] p-8 shadow-[var(--cxa-shadow-lift)] transition-transform duration-150"
        style={{
          transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <p
          className="cxa-headline text-[26px]"
          style={{ color: INK, transform: 'translateZ(40px)' }}
        >
          Passe o mouse aqui
        </p>
        <p className="mt-2 text-[13.5px]" style={{ color: SOFT, transform: 'translateZ(24px)' }}>
          As camadas deste card vivem em profundidades diferentes — o texto
          flutua 40px acima da superfície.
        </p>
        <span
          className="cxa-pill-gradient mt-5 !py-2 text-[13px]"
          style={{ transform: 'translateZ(56px)' }}
        >
          Efeito 3D extrude
        </span>
      </div>
    </div>
  )
}

function CloneWallFold() {
  return (
    <Card className="mx-auto max-w-[680px] p-8">
      <div
        className="grid grid-cols-10 gap-2"
        style={{ perspective: 700, transform: 'perspective(700px) rotateX(14deg)' }}
      >
        {Array.from({ length: 40 }, (_, i) => {
          const col = i % 10
          const row = Math.floor(i / 10)
          const d = Math.hypot(col - 4.5, row - 1.5)
          return (
            <i
              // biome-ignore lint/suspicious/noArrayIndexKey: grade estática
              key={i}
              className="block aspect-square rounded-[6px]"
              style={{
                background: 'var(--cxa-accent)',
                animation: 'mv-wave 2.2s ease-in-out infinite',
                animationDelay: `${d * 110}ms`,
              }}
            />
          )
        })}
      </div>
    </Card>
  )
}

function LensWarpFold() {
  return (
    <Card className="relative mx-auto aspect-[16/7] max-w-[820px]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in srgb, var(--cxa-accent) 30%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--cxa-accent) 30%, transparent) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 aspect-square w-[34%] rounded-full border"
        style={{
          borderColor: 'var(--cxa-accent)',
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--cxa-accent) 18%, transparent), transparent 70%)',
          backdropFilter: 'blur(1.5px) saturate(1.5)',
          animation: 'mv-lenswarp-move 5s ease-in-out infinite',
          scale: 1.08,
        }}
      />
    </Card>
  )
}

/* ── CODE: janela de editor ── */

function EditorWindow({ children }: { children: React.ReactNode }) {
  return (
    <Card dark className="mx-auto max-w-[680px]">
      <div className="flex items-center gap-1.5 border-white/10 border-b px-4 py-3">
        <i className="size-2.5 rounded-full bg-[#ff5f57]" />
        <i className="size-2.5 rounded-full bg-[#febc2e]" />
        <i className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="mv-mono ml-2 text-[11px] text-white/40">motion.tsx</span>
      </div>
      <div className="mv-mono p-5 text-[13px] leading-[1.9] sm:text-[14px]">
        {children}
      </div>
    </Card>
  )
}

const TYPE_CODE = [
  { t: 'const', c: '#f97316' },
  { t: ' fx', c: '#6ee7ff' },
  { t: ' = ', c: '#cbd5e1' },
  { t: 'spring', c: '#6ee7ff' },
  { t: '({ damping: ', c: '#cbd5e1' },
  { t: '20', c: '#34d399' },
  { t: ' })', c: '#cbd5e1' },
]
function CodeTypingFold() {
  const full = TYPE_CODE.map(s => s.t).join('')
  const t = useTick(80)
  const len = (t % (full.length + 14)) + 1
  let rest = Math.min(len, full.length)
  return (
    <EditorWindow>
      <span className="text-white/40">1&nbsp;&nbsp;</span>
      {TYPE_CODE.map((seg, i) => {
        const take = Math.max(0, Math.min(rest, seg.t.length))
        rest -= take
        return (
          <span key={`${i}-${seg.t}`} style={{ color: seg.c }}>
            {seg.t.slice(0, take)}
          </span>
        )
      })}
      <span className="mv-caret" style={{ height: '1em', width: '0.5em' }} />
    </EditorWindow>
  )
}

function CodeDiffFold() {
  const key = useLoopKey(3600)
  const lines = [
    { s: '-', t: "  transition: 'none'", del: true },
    { s: '+', t: "  transition: 'spring(20)'", del: false },
    { s: '+', t: '  stagger: 0.08', del: false },
  ]
  return (
    <EditorWindow>
      <div key={key}>
        <div className="text-white/60">&nbsp;&nbsp;{'animate({'}</div>
        {lines.map((l, i) => (
          <motion.div
            key={l.t}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.35, duration: 0.3 }}
            className="overflow-hidden"
            style={{
              background: l.del ? 'rgba(248,113,113,.15)' : 'rgba(52,211,153,.15)',
              color: l.del ? '#fca5a5' : '#6ee7b7',
              textDecoration: l.del ? 'line-through' : 'none',
            }}
          >
            {l.s}
            {l.t}
          </motion.div>
        ))}
        <div className="text-white/60">&nbsp;&nbsp;{'})'}</div>
      </div>
    </EditorWindow>
  )
}

function CodeMorphFold() {
  const t = useTick(2200)
  const arrow = t % 2 === 1
  return (
    <EditorWindow>
      <motion.div layout className="flex flex-wrap items-center">
        {!arrow && (
          <motion.span layoutId="kw" style={{ color: '#f97316' }}>
            function&nbsp;
          </motion.span>
        )}
        {arrow && (
          <motion.span layoutId="kw" style={{ color: '#f97316' }}>
            const&nbsp;
          </motion.span>
        )}
        <motion.span layoutId="name" style={{ color: '#6ee7ff' }}>
          animar
        </motion.span>
        <motion.span layoutId="args" style={{ color: '#cbd5e1' }}>
          (el)
        </motion.span>
        {arrow && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ color: '#f97316' }}
          >
            &nbsp;=&gt;
          </motion.span>
        )}
        <motion.span layoutId="body" style={{ color: '#cbd5e1' }}>
          &nbsp;{'{ … }'}
        </motion.span>
      </motion.div>
    </EditorWindow>
  )
}

const SCROLL_LINES = [
  'export const fx = {',
  '  in: { opacity: 0, y: 24 },',
  '  show: { opacity: 1, y: 0 },',
  "  ease: [0.16, 1, 0.3, 1],",
  '}',
  'for (const el of sections) {',
  '  observe(el, () => animate(el, fx.show))',
  '}',
  'const stagger = 0.08',
  'animate(headline, { scale: [0.9, 1] })',
]
function CodeScrollFold() {
  return (
    <EditorWindow>
      <div
        className="max-h-[220px] overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(transparent, #000 18%, #000 82%, transparent)',
          WebkitMaskImage:
            'linear-gradient(transparent, #000 18%, #000 82%, transparent)',
        }}
      >
        <div style={{ animation: 'mv-roll 16s linear infinite' }}>
          {[0, 1].map(rep => (
            <div key={`rep-${rep}`}>
              {SCROLL_LINES.map((l, i) => (
                <div key={`${rep}-${l}`} className="whitespace-pre text-white/70">
                  <span className="text-white/30">
                    {String(i + 1).padStart(2, ' ')}&nbsp;&nbsp;
                  </span>
                  {l}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </EditorWindow>
  )
}

/* ── INTERFACE ── */

function CursorDemoFold() {
  const t = useTick(4400)
  const phase = t % 2
  return (
    <Card className="relative mx-auto max-w-[560px] p-7">
      <p className="font-semibold text-[15px]" style={{ color: INK }}>
        Receba a biblioteca completa
      </p>
      <div className="mt-4 flex flex-col gap-2.5">
        <div className="dv-input !bg-[var(--cxa-subtle)] text-[13px]" style={{ color: SOFT }}>
          seu@email.com
        </div>
        <span
          className="cxa-pill-gradient w-fit !py-2.5 text-[13px] transition-transform"
          style={{ transform: phase ? 'scale(0.97)' : 'scale(1)' }}
        >
          {phase ? 'Enviado ✓' : 'Quero receber'}
        </span>
      </div>
      {/* cursor fantasma percorrendo a UI */}
      <div
        className="pointer-events-none absolute z-10"
        style={{
          left: '30%',
          top: '30%',
          animation: 'mv-cursor-tour 4.4s ease-in-out infinite',
        }}
      >
        <svg width="18" height="20" viewBox="0 0 14 16" fill="none">
          <title>cursor</title>
          <path d="M1 1l5 13 2-5.5L13.5 6 1 1z" fill="#14171a" stroke="#fff" />
        </svg>
        <span
          className="absolute inset-[-12px] rounded-full border-2"
          style={{
            borderColor: 'var(--cxa-accent)',
            animation: 'mv-ripple 4.4s ease-out infinite',
          }}
        />
      </div>
    </Card>
  )
}

function PhoneFold() {
  const t = useTick(2600)
  const screens = ['var(--cxa-g1)', 'var(--cxa-g2)', 'var(--cxa-g3)']
  return (
    <div className="flex justify-center" style={{ perspective: 900 }}>
      <div
        className="relative w-[190px] overflow-hidden rounded-[34px] border-[10px] border-[#14171a] bg-white shadow-[var(--cxa-shadow-lift)]"
        style={{ aspectRatio: '9/18', animation: 'mv-phone-float 5s ease-in-out infinite alternate' }}
      >
        <div className="absolute top-1.5 left-1/2 h-[5px] w-[36%] -translate-x-1/2 rounded-full bg-[#14171a]" />
        <AnimatePresence mode="popLayout">
          <motion.div
            key={t % 3}
            className="absolute inset-[10%] flex flex-col gap-2"
            initial={{ y: '60%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-60%', opacity: 0 }}
            transition={{ type: 'spring', damping: 24 }}
          >
            <div
              className="h-[34%] rounded-xl"
              style={{ background: `color-mix(in srgb, ${screens[t % 3]} 55%, white)` }}
            />
            <div className="h-[10px] w-[80%] rounded bg-[var(--cxa-subtle)]" />
            <div className="h-[10px] w-[55%] rounded bg-[var(--cxa-subtle)]" />
            <div
              className="mt-auto h-[38px] rounded-full"
              style={{ background: 'var(--cxa-gradient)' }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function ShowcaseFold() {
  const t = useTick(2400)
  const active = t % 3
  const colors = ['var(--cxa-g1)', 'var(--cxa-g2)', 'var(--cxa-g3)']
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      {colors.map((c, i) => (
        <motion.div
          key={c}
          animate={{
            scale: i === active ? 1 : 0.86,
            opacity: i === active ? 1 : 0.55,
            y: i === active ? 0 : 10,
          }}
          transition={{ type: 'spring', damping: 22 }}
          className="w-[150px] rounded-2xl border border-[var(--cxa-hairline)] bg-[var(--cxa-paper)] p-3 shadow-[var(--cxa-shadow)] sm:w-[180px]"
          style={{ aspectRatio: '9/14' }}
        >
          <div
            className="h-[45%] rounded-lg"
            style={{ background: `color-mix(in srgb, ${c} 55%, white)` }}
          />
          <div className="mt-2 h-[9px] w-[75%] rounded bg-[var(--cxa-subtle)]" />
          <div className="mt-1.5 h-[9px] w-[50%] rounded bg-[var(--cxa-subtle)]" />
        </motion.div>
      ))}
    </div>
  )
}

function LogoAssembleFold() {
  const key = useLoopKey(3800)
  const parts = [
    { x: -160, y: -90, r: -120, c: 'var(--cxa-g1)' },
    { x: 160, y: -70, r: 90, c: 'var(--cxa-g2)' },
    { x: -120, y: 90, r: -60, c: 'var(--cxa-g3)' },
    { x: 140, y: 80, r: 140, c: 'var(--cxa-accent)' },
  ]
  return (
    <div key={key} className="flex flex-col items-center gap-4 py-2">
      <div className="grid grid-cols-2 gap-2">
        {parts.map((p, i) => (
          <motion.i
            key={p.c + String(i)}
            className="block size-10 rounded-lg sm:size-12"
            style={{ background: p.c }}
            initial={{ x: p.x, y: p.y, rotate: p.r, opacity: 0 }}
            animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: i * 0.08 }}
          />
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="font-semibold text-[15px] tracking-[-0.01em]"
        style={{ color: INK }}
      >
        designviral
      </motion.p>
    </div>
  )
}

function LowerThirdsFold() {
  const key = useLoopKey(4200)
  return (
    <Card dark className="relative mx-auto aspect-[16/7] max-w-[820px]">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(150deg, #23262b, #14171a)' }}
      />
      <div key={key} className="absolute bottom-7 left-7">
        <div
          className="h-[6px] w-[240px] rounded-full"
          style={{
            background: 'var(--cxa-gradient)',
            transformOrigin: 'left',
            animation: 'mv-lower-bar 4.2s cubic-bezier(.16,1,.3,1) infinite',
          }}
        />
        <div className="overflow-hidden">
          <p
            className="mt-2 font-semibold text-[20px] text-white"
            style={{ animation: 'mv-lower-txt 4.2s ease infinite' }}
          >
            Leandro Rezende
          </p>
        </div>
        <div className="overflow-hidden">
          <p
            className="text-[13px] text-white/60"
            style={{ animation: 'mv-lower-txt 4.2s .12s ease infinite' }}
          >
            Design Engineer · Workshop UX Motion
          </p>
        </div>
      </div>
    </Card>
  )
}

function CamcorderFold() {
  const t = useTick(1000 / 30)
  const f = t % 30
  const s = Math.floor(t / 30) % 60
  const m = Math.floor(t / 1800) % 60
  return (
    <Card dark className="relative mx-auto aspect-[16/7] max-w-[820px]">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(150deg, #1d2126, #101317)' }}
      />
      <div className="absolute inset-[8%]">
        {[
          'top-0 left-0 border-r-0 border-b-0',
          'top-0 right-0 border-l-0 border-b-0',
          'bottom-0 left-0 border-r-0 border-t-0',
          'bottom-0 right-0 border-l-0 border-t-0',
        ].map(pos => (
          <i key={pos} className={`absolute size-5 border-2 border-white/70 ${pos}`} />
        ))}
        <span className="mv-mono absolute top-0 right-8 flex items-center gap-2 font-semibold text-[13px] text-white">
          <i
            className="size-2.5 rounded-full bg-red-500"
            style={{ animation: 'mv-rec 1s step-end infinite' }}
          />
          REC
        </span>
        <span className="mv-mono absolute bottom-0 left-8 text-[13px] text-white/80 tabular-nums">
          00:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}:
          {String(f).padStart(2, '0')}
        </span>
        <span className="mv-mono absolute right-8 bottom-0 text-[12px] text-white/50">
          ▮▮▮▯ 4K · 30fps
        </span>
      </div>
    </Card>
  )
}

function MapRouteFold() {
  const key = useLoopKey(4200)
  return (
    <Card className="mx-auto max-w-[680px] p-4">
      <svg key={key} viewBox="0 0 100 52" className="w-full">
        <title>rota</title>
        <path
          d="M0 10h100M0 24h100M0 38h100M12 0v52M34 0v52M56 0v52M78 0v52"
          stroke="var(--cxa-hairline)"
          strokeWidth="0.6"
        />
        <path
          d="M8 44 C 24 42, 30 26, 46 28 S 70 36, 80 20 S 90 10, 92 10"
          fill="none"
          stroke="var(--cxa-accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="4 3"
          style={{
            strokeDashoffset: 120,
            animation: 'mv-route-draw 4.2s ease-in-out forwards',
          }}
        />
        <circle cx="8" cy="44" r="2.6" fill="var(--cxa-ink)" />
        <g style={{ animation: 'mv-pin-drop 4.2s ease forwards' }}>
          <circle cx="92" cy="10" r="3.2" fill="var(--cxa-g2)" />
          <circle cx="92" cy="10" r="6" fill="none" stroke="var(--cxa-g2)" strokeOpacity=".4" />
        </g>
      </svg>
    </Card>
  )
}

function HandDrawnFold() {
  const key = useLoopKey(4200)
  return (
    <div key={key} className="relative mx-auto w-fit px-8 py-6 text-center">
      <h3 className="cxa-headline text-[30px] sm:text-[44px]" style={{ color: INK }}>
        O <span className="relative inline-block">detalhe<svg
            className="pointer-events-none absolute inset-[-38%] h-[176%] w-[176%]"
            viewBox="0 0 100 60"
            fill="none"
          >
            <title>círculo</title>
            <path
              d="M30 30 C 24 12, 52 6, 68 12 S 92 32, 72 44 S 28 50, 24 36 S 32 18, 46 18"
              stroke="var(--cxa-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                strokeDasharray: 220,
                strokeDashoffset: 220,
                animation: 'mv-route-draw 1.4s .3s ease-out forwards',
                ['--len' as string]: 220,
              }}
            />
          </svg></span>{' '}
        que ninguém esquece
      </h3>
      <svg className="mx-auto mt-2 h-[14px] w-[240px]" viewBox="0 0 100 8" fill="none">
        <title>sublinhado</title>
        <path
          d="M4 5 C 30 7, 70 2, 96 5"
          stroke="var(--cxa-g2)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            strokeDasharray: 95,
            strokeDashoffset: 95,
            animation: 'mv-route-draw 1s 1.2s ease-out forwards',
          }}
        />
      </svg>
    </div>
  )
}

/* ── dispatcher ── */

function DemoContent({ id }: { id: string }) {
  switch (id) {
    case 'kinetic-type':
      return <KineticFold />
    case 'typewriter':
      return <TypewriterFold />
    case 'matrix-decode':
      return <MatrixFold />
    case 'karaoke-captions':
      return <KaraokeFold />
    case 'neon-glow':
      return <NeonFold />
    case 'gradient-fill':
      return <GradientFold />
    case 'count-up':
      return <CountUpFold />
    case 'bar-race':
      return <BarRaceFold />
    case 'stock-ticker':
      return <TickerFold />
    case 'line-draw':
      return <LineDrawFold />
    case 'progress-bars':
      return <ProgressFold />
    case 'countdown':
      return <CountdownFold />
    case 'film-grain':
    case 'lens-flare':
    case 'aurora':
    case 'particles':
    case 'shader-dissolve':
      return <TextureFold id={id} />
    case '3d-extrude':
      return <ExtrudeFold />
    case 'clone-wall':
      return <CloneWallFold />
    case 'lens-warp':
      return <LensWarpFold />
    case 'code-typing':
      return <CodeTypingFold />
    case 'code-diff':
      return <CodeDiffFold />
    case 'code-morph':
      return <CodeMorphFold />
    case 'code-scroll':
      return <CodeScrollFold />
    case 'cursor-demo':
      return <CursorDemoFold />
    case 'phone-mockup':
      return <PhoneFold />
    case 'app-showcase':
      return <ShowcaseFold />
    case 'logo-assemble':
      return <LogoAssembleFold />
    case 'lower-thirds':
      return <LowerThirdsFold />
    case 'camcorder-hud':
      return <CamcorderFold />
    case 'map-route':
      return <MapRouteFold />
    case 'hand-drawn':
      return <HandDrawnFold />
    default:
      return <TransitionFold id={id} />
  }
}

/* ── a dobra completa, inserida na página ── */

export function DemoFold({
  def,
  onRemove,
}: {
  def: MotionDef
  onRemove: () => void
}) {
  const { gate } = useLeadGate()
  const [copied, setCopied] = useState(false)

  const copyPrompt = () => {
    gate(() => {
      try {
        navigator.clipboard?.writeText(`${def.prompt}\n\n// Exemplo:\n${def.code}`)
      } catch {}
      cxTrack('prompt_copy', { motion: def.id, origin: 'demo_fold' })
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }, `copy:${def.id}`)
  }

  return (
    <motion.section
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="cxa-section overflow-hidden"
      style={{ background: 'var(--cxa-canvas-grad)' }}
    >
      <div className="cxa-shell py-14 sm:py-16">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="cxa-eyebrow mb-1.5 flex items-center gap-1.5">
              <i
                className="size-1.5 rounded-full"
                style={{ background: CATEGORY_COLORS[def.category] }}
              />
              Dobra de exemplo · {CATEGORY_LABELS[def.category]}
            </p>
            <h2
              className="cxa-headline text-[24px] sm:text-[30px]"
              style={{ color: INK }}
            >
              {def.name}
            </h2>
            <p className="mt-1 max-w-[440px] text-[13.5px]" style={{ color: SOFT }}>
              {def.desc}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={copyPrompt} className="cxa-ghost !py-2">
              {copied ? 'Prompt copiado ✓' : 'Copiar prompt deste efeito'}
            </button>
            <button
              type="button"
              onClick={onRemove}
              aria-label="Remover esta dobra"
              title="Remover esta dobra"
              className="cxa-circle !size-9 text-[13px]"
            >
              ✕
            </button>
          </div>
        </div>

        <DemoContent id={def.id} />
      </div>
    </motion.section>
  )
}
