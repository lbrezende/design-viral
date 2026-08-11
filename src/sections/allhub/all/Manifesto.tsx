import { useEffect, useRef, useState } from 'react'
import { CxDomains, CxFlows, CxProducts } from '../ClickmaxIcons'
import { copyFor, type Lang } from '../i18n'
import { CX_APP, CxIconCircle, usePrefersReducedMotion } from './CxAppUI'

/* Manifesto — a animação principal do hub. Track sticky de ~300vh com 3
   fases controladas por um único scroll-progress (rAF):
   Fase 1 (0→0.3): o resíduo do mosaico do Hero sai pela esquerda enquanto o
     parágrafo-manifesto aparece pequeno, posicionado à direita.
   Fase 2 (0.3→0.85): o parágrafo CRESCE (scale + recentraliza) até ocupar a
     tela cheia, centralizado; 3 ícones do app (produto, fluxos, domínios) no
     círculo branco padrão aparecem acima dele.
   Fase 3 (0.85→1): estado final segura — o stage é position:sticky e a
     seção seguinte (LogosAndCases) tem z-index maior + margem negativa, então
     "rola por cima" dele quando o sticky libera.
   Superfícies e cores nos tokens do app (cinza claro, círculos brancos,
   acento teal → verde → lima no resíduo do mosaico). */

const MOSAIC_PALETTE = [
  CX_APP.teal,
  CX_APP.green,
  CX_APP.lime,
  CX_APP.limeBright,
  `color-mix(in srgb, ${CX_APP.teal} 55%, ${CX_APP.green})`,
  CX_APP.inkStrong,
]

const MOSAIC_REMNANT = Array.from({ length: 14 }, (_, i) => ({
  key: `tile-${i}`,
  color: MOSAIC_PALETTE[(i * 5) % MOSAIC_PALETTE.length],
}))

const MANIFESTO_ICONS = [
  { key: 'produtos', icon: CxProducts },
  { key: 'fluxos', icon: CxFlows },
  { key: 'dominios', icon: CxDomains },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t))
}

export function Manifesto({ lang = 'pt' }: { lang?: Lang }) {
  const t = copyFor(lang)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const reduced = usePrefersReducedMotion()
  const frame = useRef<number | null>(null)

  useEffect(() => {
    if (reduced) {
      setProgress(1)
      return
    }
    const compute = () => {
      frame.current = null
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const p = total <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / total))
      setProgress(p)
    }
    const onScroll = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [reduced])

  // Fase 1: 0 → 0.3 · Fase 2: 0.3 → 0.85 · Fase 3 (hold): 0.85 → 1
  const phase1 = reduced ? 1 : Math.min(1, progress / 0.3)
  const phase2 = reduced ? 1 : Math.min(1, Math.max(0, (progress - 0.3) / 0.55))

  const mosaicX = reduced ? -100 : -phase1 * 130
  const mosaicOpacity = reduced ? 0 : 1 - phase1

  const paragraphOpacity = reduced ? 1 : lerp(0, 1, phase1)
  const paragraphScale = reduced ? 1 : lerp(0.42, 1, phase2)
  const paragraphOffsetX = reduced ? 0 : lerp(24, 0, phase2)
  const iconsOpacity = reduced ? 1 : Math.max(0, (phase2 - 0.4) / 0.6)

  return (
    <section
      ref={wrapRef}
      className="relative"
      style={{ height: reduced ? undefined : '300vh' }}
    >
      <div
        className="sticky top-16 flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden border-t"
        style={{ background: CX_APP.bg, borderTopColor: CX_APP.hairline }}
      >
        {/* resíduo do mosaico do Hero — sai pela esquerda na fase 1 */}
        <div
          className="absolute top-0 right-0 left-0 flex h-[16vh] gap-[3px] px-[3px] pt-[3px]"
          style={{
            transform: `translateX(${mosaicX}%)`,
            opacity: mosaicOpacity,
          }}
          aria-hidden="true"
        >
          {MOSAIC_REMNANT.map(tile => (
            <div
              key={tile.key}
              className="flex-1 rounded-[4px]"
              style={{ background: tile.color }}
            />
          ))}
        </div>

        {/* 3 ícones do app no círculo padrão — aparecem acima do parágrafo na fase 2 */}
        <div
          className="mb-6 flex items-center gap-4"
          style={{
            opacity: iconsOpacity,
            transform: `translateY(${(1 - iconsOpacity) * 10}px)`,
          }}
        >
          {MANIFESTO_ICONS.map(item => (
            <CxIconCircle
              key={item.key}
              icon={item.icon}
              size={46}
              iconSize={20}
            />
          ))}
        </div>

        <p
          className="cxa-headline max-w-[24ch] px-8 text-center text-[24px] sm:text-[38px] lg:text-[50px]"
          style={{
            transform: `scale(${paragraphScale}) translateX(${paragraphOffsetX}%)`,
            opacity: paragraphOpacity,
            transformOrigin: 'center center',
            color: CX_APP.ink,
          }}
        >
          {t.manifesto.text}
        </p>
      </div>
    </section>
  )
}
