import rotasDoEcossistema from '../../../content/feature-routes.json'
import { ECOSYSTEM } from '../data'
import { copyFor, type Lang } from '../i18n'
import { Reveal } from '../Reveal'
import { CX_APP } from './CxAppUI'

/* Ecossistema IA — grade compacta com as 83 páginas de
   src/content/ai-ecosystem.json (thumbnail + nome + feature + seta, link
   externo). Sem filtro/chips: é tudo junto, um catálogo só — decisão do
   cliente. Exatamente 3 colunas por linha no desktop (2 tablet, 1 mobile):
   o thumbnail precisa ficar grande o bastante pra ser LIDO, não só
   decorativo. Thumbnails SVG (src/content/thumbs/<slug>.svg) importados via
   glob — cada um já tem a proporção 640×400 (16:10) igual ao aspect-ratio do
   card, então object-cover nunca corta o texto.

   O link aponta para DENTRO do clickmax.io: /feature/<nome> para as 19
   funcionalidades e /caso/<nome> para os 64 casos por segmento. O mapa mora em
   src/content/feature-routes.json e o mesmo arquivo gera as rewrites do deploy,
   então nome de rota só existe num lugar. Quem clica nunca vê vercel.app. */

/* Um conjunto de thumbs por idioma: quem navega em espanhol vê o card em
   espanhol. Antes existia só a versão PT e o grid inteiro aparecia em
   português no meio de uma página em ES. */
const thumbModules = import.meta.glob('../../../content/thumbs/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>
const thumbModulesEn = import.meta.glob('../../../content/thumbs-en/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>
const thumbModulesEs = import.meta.glob('../../../content/thumbs-es/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

/** slug do site -> rota interna do clickmax.io. */
const ROTA_POR_SLUG: Record<string, string> = Object.fromEntries(
  rotasDoEcossistema.map(r => [r.slug, r.rota]),
)

const porSlug = (mods: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(mods).map(([path, url]) => {
      const slug = path.split('/').pop()?.replace('.svg', '') ?? path
      return [slug, url]
    }),
  )

const THUMBS: Record<Lang, Record<string, string>> = {
  pt: porSlug(thumbModules),
  en: porSlug(thumbModulesEn),
  es: porSlug(thumbModulesEs),
}

export function EcosystemGrid({ lang = 'pt' }: { lang?: Lang }) {
  const t = copyFor(lang)
  return (
    <section
      id="ecossistema"
      className="cxa-section"
      style={{ background: CX_APP.bg, borderTopColor: CX_APP.hairline }}
    >
      <div className="cxa-shell py-16 sm:py-24">
        <Reveal className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[56ch]">
            <span
              className="cxa-eyebrow inline-flex items-center gap-2"
              style={{ color: CX_APP.inkSoft }}
            >
              <span
                aria-hidden="true"
                className="inline-block h-[6px] w-[18px] rounded-full"
                style={{ background: CX_APP.accent }}
              />
              {t.ecosystem.eyebrowPrefix}
              {ECOSYSTEM.length}
              {t.ecosystem.eyebrowSuffix}
            </span>
            <h2
              className="cxa-headline mt-4 text-[28px] sm:text-[42px]"
              style={{ color: CX_APP.ink }}
            >
              {t.ecosystem.headline}
            </h2>
          </div>

          <p
            className="max-w-[46ch] text-[15px] leading-[1.55]"
            style={{ color: CX_APP.inkSoft }}
          >
            {t.ecosystem.subheadline}
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM.map(item => {
            const thumb = THUMBS[lang][item.slug] ?? THUMBS.pt[item.slug]
            /* O idioma viaja no link. Sem isso, quem estava lendo em
               espanhol caía na versão portuguesa da página do ângulo e
               precisava escolher o idioma de novo. */
            const base = ROTA_POR_SLUG[item.slug] ?? item.url
            const rota =
              lang === 'pt' || !base.startsWith('/')
                ? base
                : `${base}?lang=${lang}`
            return (
              <a
                key={item.slug}
                href={rota}
                className="cxa-angle-card group flex flex-col overflow-hidden rounded-[18px]"
                style={{
                  borderColor: CX_APP.hairline,
                  background: CX_APP.surface,
                  boxShadow: CX_APP.shadow,
                }}
              >
                <div
                  className="aspect-[16/10] w-full overflow-hidden border-b"
                  style={{
                    borderColor: CX_APP.hairline,
                    background: '#F4F5F6',
                  }}
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={item.h1 || item.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center px-4 text-[12px]"
                      style={{ color: CX_APP.inkSoft }}
                    >
                      {item.name}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span
                      className="truncate font-medium text-[13.5px]"
                      style={{ color: CX_APP.ink }}
                    >
                      {item.name}
                    </span>
                    <span
                      className="truncate text-[12px]"
                      style={{ color: CX_APP.inkSoft }}
                    >
                      {item.feature}
                    </span>
                  </span>
                  {/* Ghost button do Clickmax (pílula contornada) no lugar do
                      glifo ↗ — o card inteiro continua clicável. */}
                  <span
                    className="cxa-ghost shrink-0"
                    style={{ borderColor: CX_APP.hairline, color: CX_APP.ink }}
                  >
                    {t.ecosystem.cardCta}
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
