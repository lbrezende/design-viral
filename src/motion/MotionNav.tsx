import { Link } from '@tanstack/react-router'
import { cxTrack, useLeadGate, workshopUrl } from './lead-gate'

/* Nav do /motion: mesmo desenho da nav do hub duplicado (sticky, hairline,
   blur), mas com a identidade Design Viral e o item "Exemplos de todas as
   animações" pedido no briefing. */

const LINKS = [
  { label: 'Motions ao vivo', href: '/motion#page' },
  { label: 'Como funciona', href: '/motion#demo' },
  { label: 'Workshop', href: '/motion#workshop' },
]

export function MotionNav() {
  const { gate } = useLeadGate()

  return (
    <header className="sticky top-0 z-50 border-white/10 border-b bg-[#070a1c]/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link to="/motion" className="flex items-center gap-2" aria-label="Design Viral">
          <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 font-extrabold text-[13px] text-slate-950">
            DV
          </span>
          <span className="font-semibold text-[14px] text-slate-100 tracking-[-0.01em]">
            design<span className="text-cyan-300">viral</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="font-medium text-[13px] text-slate-400 transition-colors hover:text-white"
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
            className="font-medium text-[13px] text-cyan-300 transition-colors hover:text-cyan-200"
          >
            Exemplos de todas as animações
          </button>
        </nav>

        <a
          href={workshopUrl('nav')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => cxTrack('workshop_click', { placement: 'nav' })}
          className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 font-semibold text-[12.5px] text-slate-950 transition-transform hover:scale-[1.03]"
        >
          Participe do workshop
        </a>
      </div>
    </header>
  )
}

/* Faixa de CTA do workshop, usada em vários pontos da página. */
export function WorkshopBand({ placement }: { placement: string }) {
  return (
    <div id={placement === 'mid' ? 'workshop' : undefined} className="bg-[#070a1c] px-4 py-14 text-center">
      <p className="mb-2 font-semibold text-[11px] text-violet-300 uppercase tracking-[0.2em]">
        Workshop ao vivo
      </p>
      <h3 className="mx-auto max-w-[620px] font-bold text-[26px] text-slate-100 leading-tight sm:text-[32px]">
        Aprenda a criar essas animações com IA no workshop de Design Engineer
      </h3>
      <p className="mx-auto mt-3 max-w-[480px] text-[14.5px] text-slate-400">
        Do prompt ao deploy: como transformar qualquer página parada em uma
        experiência viva — sem virar especialista em motion.
      </p>
      <a
        href={workshopUrl(placement)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => cxTrack('workshop_click', { placement })}
        className="mt-6 inline-block rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-8 py-3.5 font-semibold text-[15px] text-slate-950 transition-transform hover:scale-[1.03]"
      >
        Participe do workshop que vai acontecer →
      </a>
    </div>
  )
}
