import {
  CxCommunities,
  CxIntegrations,
  CxProducts,
  CxSales,
} from '../ClickmaxIcons'
import { copyFor, type Lang, localizedPath } from '../i18n'
import { Reveal } from '../Reveal'
import { CX_APP, CxIconCircle, type CxIconComponent } from './CxAppUI'

/* "Sustentado por parceria de verdade." — 4 cards brancos (tokens do app:
   raio 18px, sombra suave, hairline #E6E8EB) com o ícone REAL do app no
   círculo padrão + título embaixo; linka /parceiros. */

/* Ícones dos 4 pilares — títulos e textos vêm de i18n.ts (partnership.pillars),
   na mesma ordem. */
const PILLAR_ICONS: CxIconComponent[] = [
  CxSales,
  CxCommunities,
  CxIntegrations,
  CxProducts,
]

export function Partnership({ lang = 'pt' }: { lang?: Lang }) {
  const t = copyFor(lang)
  const pillars = t.partnership.pillars.map((p, i) => ({
    ...p,
    icon: PILLAR_ICONS[i],
  }))

  return (
    <section
      className="cxa-section"
      style={{ background: CX_APP.bg, borderTopColor: CX_APP.hairline }}
    >
      <div className="cxa-shell py-16 sm:py-24">
        <Reveal className="max-w-[52ch]">
          <span
            className="cxa-eyebrow inline-flex items-center gap-2"
            style={{ color: CX_APP.inkSoft }}
          >
            <span
              aria-hidden="true"
              className="inline-block h-[6px] w-[18px] rounded-full"
              style={{ background: CX_APP.accent }}
            />
            {t.partnership.eyebrow}
          </span>
          <h2
            className="cxa-headline mt-4 text-[28px] sm:text-[42px]"
            style={{ color: CX_APP.ink }}
          >
            {t.partnership.headline}
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(p => (
            <div
              key={p.title}
              className="flex flex-col gap-4 rounded-[18px] border p-6"
              style={{
                background: CX_APP.surface,
                borderColor: CX_APP.hairline,
                boxShadow: CX_APP.shadow,
              }}
            >
              <CxIconCircle icon={p.icon} size={46} iconSize={20} />
              <span
                className="font-medium text-[15px] tracking-[-0.01em]"
                style={{ color: CX_APP.ink }}
              >
                {p.title}
              </span>
              <p
                className="text-[13px] leading-[1.55]"
                style={{ color: CX_APP.inkSoft }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <a
            href={localizedPath('/parceiros', lang)}
            className="cxa-pill-gradient"
            style={{ background: CX_APP.accent, color: CX_APP.ink }}
          >
            {t.partnership.cta}
          </a>
        </div>
      </div>
    </section>
  )
}
