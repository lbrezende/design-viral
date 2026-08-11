import { Link } from '@tanstack/react-router'
import '@/styles/all-hub.css'
import { cxTrack, useLeadGate, workshopUrl } from './lead-gate'

/* Nav do /motion na linguagem CX App Light (mesma da página /all duplicada):
   fundo do canvas translúcido com blur, hairline, texto ink, CTA em pílula
   com o degradê do app. Inclui o item "Exemplos de todas as animações". */

const LINKS = [{ label: 'Exemplo Clickmax', href: '/motion' }]

export function MotionNav() {
  const { gate } = useLeadGate()

  return (
    <header className="cxa cxa-nav sticky top-0 z-50 border-[var(--cxa-hairline)] border-b backdrop-blur">
      <div className="cxa-shell flex h-16 items-center justify-between gap-4">
        <Link
          to="/motion"
          className="flex items-center gap-2"
          aria-label="Design Viral"
        >
          <span
            className="flex size-7 items-center justify-center rounded-lg font-bold text-[12px] text-[var(--cxa-ink)]"
            style={{ background: 'var(--cxa-gradient)' }}
          >
            DV
          </span>
          <span className="font-medium text-[14px] text-[var(--cxa-ink)] tracking-[-0.01em]">
            designviral
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="font-medium text-[13px] text-[var(--cxa-ink-soft)] transition-colors hover:text-[var(--cxa-ink)]"
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() =>
              gate(() => {
                cxTrack('library_open', { origin: 'nav' })
                window.location.assign('/motion/biblioteca')
              }, 'library:nav')
            }
            className="font-semibold text-[13px] text-[var(--cxa-ink)]"
          >
            <span className="cxa-hero-underline">Biblioteca de animações</span>
          </button>
        </nav>

        <a
          href={workshopUrl('nav')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => cxTrack('workshop_click', { placement: 'nav' })}
          className="cxa-pill-gradient !px-4 !py-2 shrink-0 whitespace-nowrap text-[12.5px]"
        >
          Participe do workshop
        </a>
      </div>
    </header>
  )
}

/* Faixa de CTA do workshop: o "respiro escuro" da página, no mesmo desenho
   da DarkBand do /all — quase-preto, texto claro e o lima do app só no CTA. */
export function WorkshopBand({ placement }: { placement: string }) {
  return (
    <div
      id={placement === 'mid' ? 'workshop' : undefined}
      className="px-6 py-16 text-center"
      style={{ background: 'var(--cxa-dark, #1a1a1a)' }}
    >
      <p className="mb-3 font-medium text-[13px] text-white/50 tracking-[-0.01em]">
        Workshop ao vivo · 22 e 23 de agosto, o dia todo
      </p>
      <h3 className="mx-auto max-w-[680px] font-semibold text-[26px] text-white leading-[1.12] tracking-[-0.03em] sm:text-[34px]">
        Construa seu primeiro App com UX e IA do zero{' '}
        <span style={{ color: 'var(--cxa-lime, #d4ff3f)' }}>em 2 dias.</span>
      </h3>
      <p className="mx-auto mt-4 max-w-[520px] text-[14.5px] text-white/60 leading-relaxed">
        Um workshop ao vivo, dias 22 e 23 de agosto, para quem quer usar IA
        para transformar aquela tela parada no Figma em um app 100% funcional
        para o seu portfólio. Tudo na prática, sem escrever uma linha de
        código.
      </p>
      <a
        href={workshopUrl(placement)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => cxTrack('workshop_click', { placement })}
        className="mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-[14.5px] text-[var(--cxa-ink)] transition-transform hover:translate-y-[-2px]"
        style={{ background: 'var(--cxa-lime, #d4ff3f)' }}
      >
        Garantir minha vaga no workshop →
      </a>
    </div>
  )
}
