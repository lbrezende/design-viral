import { CxCommunities, CxDomains, CxFunnels } from '../ClickmaxIcons'
import { copyFor, type Lang } from '../i18n'
import { Reveal } from '../Reveal'
import { CX_APP, CxIconCircle, type CxIconComponent } from './CxAppUI'

/* Banda escura full-bleed — respiro entre as seções claras: label no topo,
   statement branco central grande e 3 colunas (barra de acento teal → lima,
   ícone REAL do app no círculo branco, título e parágrafo). */

/* Ícones das 3 colunas — textos em i18n.ts (darkBand.columns), mesma ordem. */
const COLUMN_ICONS: CxIconComponent[] = [CxFunnels, CxDomains, CxCommunities]

export function DarkBand({ lang = 'pt' }: { lang?: Lang }) {
  const t = copyFor(lang)
  const columns = t.darkBand.columns.map((c, i) => ({
    ...c,
    icon: COLUMN_ICONS[i],
  }))

  return (
    <section
      className="border-t"
      style={{
        background: '#14171A',
        borderTopColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div className="cxa-shell py-20 sm:py-28">
        <Reveal className="flex flex-col items-center gap-8 text-center">
          <span
            className="cxa-eyebrow"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            {t.darkBand.eyebrow}
          </span>
          <h2 className="cxa-headline max-w-[20ch] text-[30px] text-white sm:text-[46px]">
            {t.darkBand.headline}
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
          {columns.map(col => (
            <div key={col.title} className="flex flex-col gap-4">
              <span
                aria-hidden="true"
                className="h-[3px] w-10 rounded-full"
                style={{ background: CX_APP.accent }}
              />
              <CxIconCircle icon={col.icon} size={46} iconSize={20} onDark />
              <span className="mt-1 font-medium text-[16px] text-white tracking-[-0.01em]">
                {col.title}
              </span>
              <p
                className="text-[13.5px] leading-[1.6]"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {col.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
