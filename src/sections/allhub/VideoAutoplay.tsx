import { useEffect, useRef, useState } from 'react'

/* Vídeo YouTube autoplay-mudo quando entra na viewport — usado nas rotas do
   hub (ver docs/ALL-HUB-SPEC.md, mesmo padrão do IntersectionObserver de
   src/sections/amanda/Videos.tsx, simplificado: monta o iframe (autoplay=1&
   mute=1) só quando o card fica visível, e desmonta ao sair — pausa de fato
   e evita gastar banda com vídeos fora de tela). Respeita prefers-reduced-motion
   não montando o iframe até um clique manual. */
export function VideoAutoplay({
  youtubeId,
  label,
  className = '',
  ratio = '16 / 9',
}: {
  youtubeId: string
  label: string
  className?: string
  /** Proporção EXATA da caixa do player. O player do YouTube encaixa o vídeo
   *  dentro do iframe: se a caixa for mais larga que a gravação, sobra TARJA
   *  PRETA nas laterais (pillarbox). As gravações do app Clickmax são 14/9
   *  (medido: 1120x720 dentro da thumb 1280x720) — por isso o hub passa
   *  ratio="14 / 9" e o player preenche 100% da largura, sem tarja. */
  ratio?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    setReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const shouldPlay = (visible && !reducedMotion) || started

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden rounded-2xl border border-[var(--cxa-hairline)] bg-[var(--cxa-dark)] ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {shouldPlay ? (
        <iframe
          /* inset-0 + scale(1.02): o iframe cobre a caixa inteira e o leve
             zoom mata a costura de 1px do letterbox na borda. */
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3`}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          style={{
            border: 'none',
            transform: 'scale(1.02)',
            transformOrigin: 'center',
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="absolute inset-0 flex h-full w-full items-center justify-center"
          aria-label={`Reproduzir: ${label}`}
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-white/10">
            <span className="ml-0.5 h-0 w-0 border-y-[9px] border-y-transparent border-l-[14px] border-l-white" />
          </span>
        </button>
      )}
    </div>
  )
}
