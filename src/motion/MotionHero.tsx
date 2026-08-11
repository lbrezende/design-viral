import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import '@/styles/all-hub.css'
import {
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  MOTIONS,
} from './catalog'
import { cxTrack, useLeadGate, workshopUrl } from './lead-gate'
import { MotionPreview } from './previews'

/* Headline do /motion na linguagem CX App Light do hub duplicado: canvas
   cinza-claro degradê, headline ink com o sublinhado no degradê do app,
   pílulas de CTA e os 42 motions como "mini-telas" escuras dentro de cards
   brancos com hairline — cada tile abre a biblioteca com o prompt. */

export function MotionHero() {
  const { gate } = useLeadGate()

  return (
    <div className="cxa relative overflow-hidden">
      <div className="cxa-shell pt-16 pb-16 sm:pt-20">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <p className="cxa-eyebrow mb-4">Design Viral · UX Motion</p>
          <h1 className="cxa-headline mx-auto max-w-[820px] text-[38px] text-[var(--cxa-ink)] sm:text-[56px]">
            Todos os <span className="cxa-hero-underline">motions</span> que a
            IA pode fazer pelo seu site
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] text-[15.5px] text-[var(--cxa-ink-soft)] leading-relaxed">
            42 tipos de animação, cada um com o prompt pronto para vibe codar.
            Esta página inteira é o playground: veja o motion de cada bloco e
            troque ao vivo para ver como fica.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                gate(() => {
                  cxTrack('library_open', { origin: 'hero' })
                  window.location.assign('/motion/biblioteca')
                }, 'library:hero')
              }
              className="cxa-pill-gradient"
            >
              Biblioteca Completa de Animações
            </button>
            <a
              href={workshopUrl('hero')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => cxTrack('workshop_click', { placement: 'hero' })}
              className="cxa-pill-outline"
            >
              Participe do workshop →
            </a>
          </div>

          {/* legenda de categorias, como no poster */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
            {CATEGORIES.map(c => (
              <span
                key={c}
                className="flex items-center gap-1.5 text-[11.5px] text-[var(--cxa-ink-soft)]"
              >
                <i
                  className="size-1.5 rounded-full"
                  style={{ background: CATEGORY_COLORS[c] }}
                />
                {CATEGORY_LABELS[c]}
              </span>
            ))}
          </div>
        </motion.div>

        {/* grid dos 42: mini-telas escuras em cards brancos do app */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {MOTIONS.map((m, i) => (
            <motion.button
              key={m.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '80px' }}
              transition={{ duration: 0.4, delay: (i % 5) * 0.04 }}
              onClick={() =>
                gate(() => {
                  cxTrack('library_open', { origin: 'hero_tile', motion: m.id })
                  window.location.assign(`/motion/biblioteca?motion=${m.id}`)
                }, `tile:${m.id}`)
              }
              className="cxa-tile group rounded-[var(--cxa-radius-sm)] p-2 text-left"
              title={`${m.name} — clique para ver o prompt`}
            >
              <MotionPreview id={m.id} bare className="!rounded-[8px]" />
              <span className="mt-2 flex items-center justify-between px-1 pb-0.5">
                <span className="truncate font-medium text-[12px] text-[var(--cxa-ink)] tracking-[-0.01em]">
                  {m.name}
                </span>
                <i
                  className="ml-2 size-1.5 shrink-0 rounded-full"
                  style={{ background: CATEGORY_COLORS[m.category] }}
                />
              </span>
            </motion.button>
          ))}
        </div>

        <p className="mt-7 text-center text-[13px] text-[var(--cxa-ink-soft)]">
          42 tipos. Um prompt para cada. Clique em qualquer um para pegar o
          código e usar no seu projeto.{' '}
          <Link
            to="/motion/biblioteca"
            className="font-semibold text-[var(--cxa-ink)] underline decoration-[var(--cxa-accent)] decoration-2 underline-offset-2"
          >
            Ver a biblioteca completa
          </Link>
        </p>
      </div>
    </div>
  )
}
