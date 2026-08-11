import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  MOTIONS,
} from './catalog'
import { cxTrack, useLeadGate, workshopUrl } from './lead-gate'
import { MotionPreview } from './previews'

/* Headline do /motion no espírito do poster "Every Motion": os 42 motions em
   gráficos VIVOS mostrando como cada um funciona. Cada tile é clicável —
   clicar abre a biblioteca (gateada) com o prompt daquele efeito. */

export function MotionHero() {
  const { gate } = useLeadGate()

  return (
    <div className="relative overflow-hidden bg-[#070a1c] text-slate-100">
      {/* fundo aurora sutil */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="fx-aurora absolute inset-0">
          <i />
          <i />
          <i />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 pt-16 pb-14 sm:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <p className="mb-3 font-semibold text-[12px] text-cyan-300 uppercase tracking-[0.22em]">
            Design Viral · UX Motion
          </p>
          <h1 className="mx-auto max-w-[780px] font-extrabold text-[34px] leading-[1.08] tracking-tight sm:text-[52px]">
            Todos os <span className="mv-grad">motions</span> que a IA pode
            fazer pelo seu site
          </h1>
          <p className="mx-auto mt-4 max-w-[560px] text-[15.5px] text-slate-400 leading-relaxed">
            42 tipos de animação, cada um com o prompt pronto para vibe codar.
            Esta página inteira é o playground: veja o motion de cada bloco e
            troque ao vivo para ver como fica.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                gate(() => {
                  cxTrack('library_open', { origin: 'hero' })
                  window.location.assign('/motion/biblioteca')
                }, 'library:hero')
              }
              className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-semibold text-[14px] text-slate-950 transition-transform hover:scale-[1.03]"
            >
              Biblioteca Completa de Animações
            </button>
            <a
              href={workshopUrl('hero')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => cxTrack('workshop_click', { placement: 'hero' })}
              className="rounded-full border border-indigo-400/40 px-6 py-3 font-semibold text-[14px] text-slate-200 transition-colors hover:border-cyan-400/60 hover:text-white"
            >
              Participe do workshop →
            </a>
          </div>

          {/* legenda de categorias, como no poster */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
            {CATEGORIES.map(c => (
              <span
                key={c}
                className="flex items-center gap-1.5 text-[11px] text-slate-400"
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

        {/* grid dos 42, todos animando de verdade */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {MOTIONS.map((m, i) => (
            <motion.button
              key={m.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '80px' }}
              transition={{ duration: 0.45, delay: (i % 5) * 0.05 }}
              onClick={() =>
                gate(() => {
                  cxTrack('library_open', { origin: 'hero_tile', motion: m.id })
                  window.location.assign(`/motion/biblioteca?motion=${m.id}`)
                }, `tile:${m.id}`)
              }
              className="group text-left transition-transform hover:scale-[1.03]"
              title={`${m.name} — clique para ver o prompt`}
            >
              <MotionPreview id={m.id} />
            </motion.button>
          ))}
        </div>

        <p className="mt-6 text-center text-[12.5px] text-slate-500">
          42 tipos. Um prompt para cada. Clique em qualquer um para pegar o
          código e usar no seu projeto.{' '}
          <Link
            to="/motion/biblioteca"
            className="text-cyan-300 underline-offset-2 hover:underline"
          >
            Ver a biblioteca completa
          </Link>
        </p>
      </div>
    </div>
  )
}
