import { type ComponentType, useEffect, useState } from 'react'

/* Tokens e primitivas visuais do app Clickmax usados nas seções de texto do
   hub /all (Do it all, prova social, ecossistema, manifesto, bandas e CTA).
   Os valores vêm do design system do produto — não inventar variações:
   fundo cinza-claro levemente degradê, superfícies brancas com raio 16-20px e
   sombra suave, hairline #E6E8EB, acento gráfico teal → verde → lima.
   O CÍRCULO é o mesmo da sidebar do app: 44-48px, branco, ícone cinza; no
   estado ativo vira quase-preto com ícone branco. Sem borda. */

export const CX_APP = {
  bg: 'linear-gradient(180deg,#F4F5F6,#EDEFF1)',
  surface: '#FFFFFF',
  ink: '#14171A',
  inkSoft: '#6B7280',
  inkStrong: '#1A1A1A',
  hairline: '#E6E8EB',
  iconIdle: '#8A8F98',
  accent: 'linear-gradient(90deg,#5CD3C4,#8BE07A,#C8F244)',
  teal: '#5CD3C4',
  green: '#8BE07A',
  lime: '#C8F244',
  limeBright: '#D4FF3F',
  shadow: '0 1px 2px rgba(20,20,19,.04), 0 8px 24px -16px rgba(20,20,19,.18)',
} as const

/** Assinatura dos ícones reais do app (ClickmaxIcons.tsx). */
export type CxIconComponent = ComponentType<{
  size?: number
  className?: string
}>

/** Círculo padrão do app (igual ao rail/sidebar do Clickmax). */
export function CxIconCircle({
  icon: Icon,
  size = 44,
  iconSize = 20,
  active = false,
  onDark = false,
  className = '',
}: {
  icon: CxIconComponent
  size?: number
  iconSize?: number
  active?: boolean
  /** Em fundo escuro o círculo continua branco — só a sombra some. */
  onDark?: boolean
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: active ? CX_APP.inkStrong : CX_APP.surface,
        color: active ? '#FFFFFF' : CX_APP.iconIdle,
        boxShadow: onDark ? 'none' : CX_APP.shadow,
      }}
    >
      <Icon size={iconSize} />
    </span>
  )
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}
