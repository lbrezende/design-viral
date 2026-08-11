import { ALLHUB_TRIAL_URL } from '../AllHubNav'
import { copyFor, type Lang, localizedPath } from '../i18n'
import { CX_APP } from './CxAppUI'

/* CTA final — banda full-bleed com o degradê do app (teal → verde → lima),
   label no topo + headline grande à esquerda + 2 botões à direita.
   Vem antes do AllHubFooter. */

export function FinalCta({ lang = 'pt' }: { lang?: Lang }) {
  const t = copyFor(lang)
  return (
    <section
      className="w-full"
      style={{ background: 'linear-gradient(100deg,#5CD3C4,#8BE07A,#C8F244)' }}
    >
      <div className="cxa-shell py-16 sm:py-20">
        <span
          className="text-[13px] font-medium tracking-[-0.01em]"
          style={{ color: CX_APP.ink }}
        >
          {t.finalCta.eyebrow}
        </span>

        <div className="mt-5 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2
            className="cxa-headline max-w-[16ch] text-[32px] sm:text-[48px]"
            style={{ color: CX_APP.ink }}
          >
            {t.finalCta.headline}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={ALLHUB_TRIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:-translate-y-0.5 inline-flex items-center gap-2 rounded-full px-[1.6rem] py-[0.85rem] font-semibold text-[14px] text-white transition-transform"
              style={{ background: CX_APP.inkStrong, boxShadow: CX_APP.shadow }}
            >
              {t.finalCta.ctaPrimary}
            </a>
            {/* sem style inline no fundo: o :hover da classe precisa vencer */}
            <a
              href={localizedPath('/parceiros', lang)}
              className="cxa-pill-outline bg-white/80"
            >
              {t.finalCta.ctaSecondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
