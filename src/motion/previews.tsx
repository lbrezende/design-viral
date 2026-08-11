import { useEffect, useRef, useState } from 'react'
import { CATEGORY_COLORS, MOTION_BY_ID } from './catalog'
import './motion.css'

/* Miniaturas animadas dos 42 motions — mesmo papel dos tiles do poster
   "Every Motion": mostrar o efeito funcionando, não uma imagem estática.
   Cada mini é autocontida (CSS em motion.css + estado local quando precisa). */

function useTick(ms: number, run = true): number {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    const id = setInterval(() => setN(v => v + 1), ms)
    return () => clearInterval(id)
  }, [ms, run])
  return n
}

/* ── minis com estado ── */

function TypewriterMini() {
  const words = ['render()', 'animate()', 'deploy()']
  const t = useTick(90)
  const word = words[Math.floor(t / 14) % words.length]
  const len = Math.min(t % 14, word.length)
  return (
    <span className="mv-mono text-[11cqh] text-cyan-200">
      {word.slice(0, len)}
      <i className="mv-caret" />
    </span>
  )
}

const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
function MatrixDecodeMini() {
  const target = 'DESIGN VIRAL'
  const t = useTick(70)
  const cycle = t % 40
  const locked = Math.min(cycle, target.length)
  const txt = target
    .split('')
    .map((c, i) =>
      i < locked || c === ' '
        ? c
        : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)],
    )
    .join('')
  return <span className="mv-mono text-[10cqh] tracking-widest text-emerald-300">{txt}</span>
}

function CountUpMini() {
  const t = useTick(40)
  const cycle = (t % 90) / 60
  const p = Math.min(cycle, 1)
  const eased = 1 - 2 ** (-10 * p)
  return (
    <span className="font-extrabold text-[18cqh] text-emerald-300 tabular-nums">
      {Math.round(100000 * eased).toLocaleString('pt-BR')}
    </span>
  )
}

function StockTickerMini() {
  const [pts, setPts] = useState<number[]>(() =>
    Array.from({ length: 24 }, (_, i) => 30 + Math.sin(i / 3) * 8),
  )
  useEffect(() => {
    const id = setInterval(() => {
      setPts(prev => {
        const last = prev[prev.length - 1]
        const next = Math.max(8, Math.min(52, last + (Math.random() - 0.48) * 9))
        return [...prev.slice(1), next]
      })
    }, 300)
    return () => clearInterval(id)
  }, [])
  const up = pts[pts.length - 1] >= pts[pts.length - 2]
  const d = pts.map((y, x) => `${(x / (pts.length - 1)) * 100},${60 - y}`).join(' ')
  return (
    <svg viewBox="0 0 100 60" className="h-[70%] w-[80%]" preserveAspectRatio="none">
      <title>ticker</title>
      <polyline
        points={d}
        fill="none"
        stroke={up ? '#34d399' : '#f87171'}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle
        cx="100"
        cy={60 - pts[pts.length - 1]}
        r="2.5"
        fill={up ? '#34d399' : '#f87171'}
      >
        <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

function BarRaceMini() {
  const t = useTick(1500)
  const base = [
    [70, 45, 58],
    [40, 78, 52],
    [62, 50, 85],
  ][t % 3]
  const rows = base
    .map((v, i) => ({ v, c: ['#34d399', '#6ee7ff', '#c084fc'][i] }))
    .sort((a, b) => b.v - a.v)
  return (
    <div className="flex w-[70%] flex-col gap-[8px]">
      {rows.map(r => (
        <div
          key={r.c}
          className="h-[9px] rounded"
          style={{
            width: `${r.v}%`,
            background: r.c,
            transition: 'width 1.1s cubic-bezier(.22,1,.36,1)',
          }}
        />
      ))}
    </div>
  )
}

function CountdownMini() {
  const t = useTick(1000)
  const s = 59 - (t % 60)
  return (
    <div className="mv-mono flex items-baseline gap-1 text-[14cqh] text-emerald-300">
      <span>00</span>
      <span className="opacity-50">:</span>
      <span>01</span>
      <span className="opacity-50">:</span>
      <span
        key={s}
        style={{
          display: 'inline-block',
          animation: 'mv-line-in .3s cubic-bezier(.16,1,.3,1)',
        }}
      >
        {String(s).padStart(2, '0')}
      </span>
    </div>
  )
}

function CodeTypingMini() {
  const code = 'const fx = motion()'
  const t = useTick(120)
  const len = (t % (code.length + 8)) + 1
  const shown = code.slice(0, Math.min(len, code.length))
  return (
    <div className="mv-codebox mv-mono">
      <span className="tk-kw">const</span> <span className="tk-fn">fx</span>
      {shown.length > 8 ? ' = ' : ''}
      {shown.length > 11 ? <span className="tk-str">{shown.slice(11)}</span> : null}
      <i className="mv-caret" style={{ height: '0.9em', width: '0.45em' }} />
    </div>
  )
}

function CodeMorphMini() {
  const t = useTick(1800)
  const a = t % 2 === 0
  return (
    <div className="mv-codebox mv-mono" style={{ width: '82%' }}>
      <span className="tk-kw">{a ? 'function' : 'const'}</span>{' '}
      <span
        className="tk-fn"
        style={{ transition: 'all .5s', display: 'inline-block' }}
      >
        {a ? 'render' : 'render = '}
      </span>
      <span className="tk-str">{a ? '() {…}' : '() => …'}</span>
    </div>
  )
}

/* ── mini estático por CSS, escolhido pelo id ── */

function CssMini({ id }: { id: string }) {
  switch (id) {
    case 'kinetic-type':
      return (
        <div className="mv-kinetic flex gap-2">
          <span>BIG</span>
          <span>BOLD</span>
          <span>WORD</span>
        </div>
      )
    case 'karaoke-captions':
      return <span className="mv-karaoke">A LEGENDA ACENDE PALAVRA A PALAVRA</span>
    case 'neon-glow':
      return <span className="mv-neon">GLOW</span>
    case 'gradient-fill':
      return <span className="mv-grad">GRADIENT FILL</span>
    case 'line-draw':
      return (
        <svg viewBox="0 0 100 50" className="mv-linedraw h-[70%] w-[78%]" preserveAspectRatio="none">
          <title>line</title>
          <path
            d="M2 44 C 20 40, 26 18, 40 22 S 60 38, 72 24 S 90 6, 98 8"
            fill="none"
            stroke="#6ee7ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ ['--len' as string]: 160 }}
          />
        </svg>
      )
    case 'progress-bars':
      return (
        <div className="mv-progress">
          <i />
          <i />
          <i />
        </div>
      )
    case 'crossfade':
      return (
        <>
          <div className="mv-cross mv-cross--b" />
          <div className="mv-cross mv-cross--a" />
        </>
      )
    case 'glitch':
      return (
        <span className="mv-glitch" data-text="GLITCH">
          GLITCH
        </span>
      )
    case 'light-leak':
      return (
        <>
          <div className="absolute inset-[22%_26%] rounded-lg bg-gradient-to-br from-violet-600 to-indigo-800" />
          <div className="mv-leak" />
        </>
      )
    case 'zoom-punch':
      return <div className="mv-zoom" />
    case 'whip-pan':
      return <div className="mv-whip" />
    case 'radial-split':
      return <div className="mv-radial" />
    case 'grid-wipe':
      return (
        <div className="mv-gridwipe">
          {GRID_ORDER.map((d, i) => (
            <i key={`gw-${i}-${d}`} style={{ ['--d' as string]: d }} />
          ))}
        </div>
      )
    case 'warp-dissolve':
      return <div className="mv-warp" />
    case 'flash-cut':
      return (
        <>
          <div className="mv-flash-scene" />
          <div className="mv-flash-white" />
        </>
      )
    case 'beat-cut':
      return <div className="mv-beat" />
    case 'film-grain':
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
          <div
            className="mv-grain"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
            }}
          />
        </>
      )
    case 'lens-flare':
      return (
        <>
          <div className="mv-flare" />
          <div className="mv-flare-line" />
        </>
      )
    case 'aurora':
      return (
        <div className="mv-aurora absolute inset-0">
          <i />
          <i />
          <i />
        </div>
      )
    case 'particles':
      return (
        <div className="absolute inset-0">
          {PARTICLES.map(p => (
            <i
              key={p.k}
              className="mv-particles absolute"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                ['--s' as string]: `${p.s}px`,
                ['--o' as string]: p.o,
                ['--t' as string]: `${p.t}s`,
                ['--dx' as string]: `${p.dx}px`,
                ['--dy' as string]: `${p.dy}px`,
                position: 'absolute',
                width: `${p.s}px`,
                height: `${p.s}px`,
                borderRadius: '50%',
                background: '#fbbf24',
                opacity: p.o,
                animation: `mv-float-p ${p.t}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      )
    case 'shader-dissolve':
      return <div className="mv-shader" />
    case '3d-extrude':
      return (
        <div className="mv-extrude">
          <i />
          <i />
          <i />
        </div>
      )
    case 'clone-wall':
      return (
        <div className="mv-clonewall">
          {GRID_ORDER.map((d, i) => (
            <i key={`cw-${i}-${d}`} style={{ ['--d' as string]: d }} />
          ))}
        </div>
      )
    case 'lens-warp':
      return (
        <>
          <div className="mv-lenswarp-grid" />
          <div className="mv-lenswarp-lens" />
        </>
      )
    case 'code-diff':
      return (
        <div className="mv-codebox mv-mono" style={{ width: '82%' }}>
          <div className="mv-diff-del">- opacity: 0</div>
          <div className="mv-diff-add">+ opacity: 1</div>
          <div className="mv-diff-add">+ scale: spring()</div>
        </div>
      )
    case 'code-scroll':
      return (
        <div className="mv-codescroll">
          <div>
            {[0, 1].map(rep => (
              <pre key={`rep-${rep}`} className="mv-mono">
                {CODE_SCROLL_TEXT}
              </pre>
            ))}
          </div>
        </div>
      )
    case 'cursor-demo':
      return (
        <>
          <div className="absolute inset-[16%] grid grid-cols-2 gap-2">
            <div className="mv-ui-btn" />
            <div className="mv-ui-btn opacity-50" />
            <div className="mv-ui-btn opacity-50" />
            <div className="mv-ui-btn" />
          </div>
          <div className="mv-cursor">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
              <title>cursor</title>
              <path d="M1 1l5 13 2-5.5L13.5 6 1 1z" fill="#e2e8f0" stroke="#0b0f23" />
            </svg>
          </div>
        </>
      )
    case 'phone-mockup':
      return (
        <div className="mv-phone">
          <i>
            <span style={{ background: 'rgba(129,140,248,.5)' }} />
            <span style={{ background: 'rgba(110,231,255,.4)' }} />
            <span style={{ background: 'rgba(192,132,252,.4)' }} />
          </i>
        </div>
      )
    case 'app-showcase':
      return (
        <div className="mv-showcase">
          {['#818cf8', '#6ee7ff', '#c084fc', '#34d399'].map(c => (
            <i key={c} style={{ background: `linear-gradient(160deg, ${c}55, ${c}22)`, border: `1px solid ${c}66` }} />
          ))}
        </div>
      )
    case 'logo-assemble':
      return (
        <div className="mv-assemble">
          <i />
          <i />
          <i />
          <i />
        </div>
      )
    case 'lower-thirds':
      return (
        <div className="mv-lower">
          <b />
          <u>
            <span>DESIGN VIRAL</span>
          </u>
        </div>
      )
    case 'camcorder-hud':
      return (
        <div className="mv-hud">
          <i />
          <i />
          <i />
          <i />
          <span className="rec mv-mono">REC</span>
        </div>
      )
    case 'map-route':
      return (
        <svg viewBox="0 0 100 56" className="mv-route h-[75%] w-[80%]">
          <title>rota</title>
          <path
            d="M0 8h100M0 22h100M0 36h100M0 50h100M14 0v56M38 0v56M62 0v56M86 0v56"
            stroke="rgba(129,140,248,.15)"
            strokeWidth="1"
          />
          <path
            className="route"
            d="M8 46 C 24 44, 28 26, 44 28 S 68 38, 78 22 S 88 12, 90 12"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <g className="pin">
            <circle cx="90" cy="12" r="4" fill="#34d399" />
            <circle cx="90" cy="12" r="7" fill="none" stroke="#34d399" strokeOpacity=".4" />
          </g>
        </svg>
      )
    case 'hand-drawn':
      return (
        <svg viewBox="0 0 100 56" className="mv-doodle h-[75%] w-[80%]" fill="none">
          <title>rabisco</title>
          <path
            d="M30 28 C 26 14, 48 8, 62 14 S 82 30, 66 40 S 30 44, 28 32 S 34 20, 44 20"
            stroke="#fbbf24"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ ['--len' as string]: 200 }}
          />
          <path
            d="M12 46 C 30 50, 60 50, 88 46"
            stroke="#fbbf24"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ ['--len' as string]: 90 }}
          />
        </svg>
      )
    default:
      return null
  }
}

const GRID_ORDER = [
  7, 3, 9, 1, 11, 5, 2, 10, 0, 8, 4, 6, 6, 4, 8, 0, 10, 2, 5, 11, 1, 9, 3, 7,
]

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  k: `p${i}`,
  x: (i * 37 + 11) % 92,
  y: (i * 53 + 7) % 88,
  s: 2 + (i % 3),
  o: 0.35 + ((i * 17) % 50) / 100,
  t: 4 + (i % 5),
  dx: 6 + ((i * 13) % 18),
  dy: 5 + ((i * 7) % 14),
}))

const CODE_SCROLL_TEXT = `export const fx = {
  in: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
  spring: { damping: 22 },
}
const stagger = 0.08
for (const el of items) {
  animate(el, fx.show)
}
`

const STATEFUL: Record<string, () => React.ReactElement> = {
  typewriter: TypewriterMini,
  'matrix-decode': MatrixDecodeMini,
  'count-up': CountUpMini,
  'stock-ticker': StockTickerMini,
  'bar-race': BarRaceMini,
  countdown: CountdownMini,
  'code-typing': CodeTypingMini,
  'code-morph': CodeMorphMini,
}

/** Miniatura viva de um motion. `bare` remove moldura/label (uso no hero). */
export function MotionPreview({
  id,
  bare = false,
  className = '',
}: {
  id: string
  bare?: boolean
  className?: string
}) {
  const def = MOTION_BY_ID[id]
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  /* As minis com JS só rodam quando visíveis (42 timers simultâneos fora da
     tela derrubariam o scroll). CSS animations o navegador já pausa sozinho. */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { rootMargin: '120px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!def) return null
  const Stateful = STATEFUL[id]

  return (
    <div ref={ref} className={`mv-tile ${className}`}>
      <div className="mv-stage">
        {visible ? (Stateful ? <Stateful /> : <CssMini id={id} />) : null}
      </div>
      {!bare && (
        <>
          <span className="mv-tile__label">{def.name}</span>
          <span
            className="mv-tile__cat"
            style={{ background: CATEGORY_COLORS[def.category] }}
          />
        </>
      )}
    </div>
  )
}
