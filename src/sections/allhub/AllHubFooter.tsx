import { Link, useLocation } from '@tanstack/react-router'
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import { CX_ICONS } from './ClickmaxIcons'
import { ECOSYSTEM, FEATURES, MODULE_LINKS, type ModuleId } from './data'
import { copyFor, counterpartPath, type Lang, localizedPath } from './i18n'

/* Rodapé compartilhado das rotas novas do hub (/all, /oficial, /parceiros e
   as 12 páginas de módulo). Copiado por composição (não importado de
   nenhuma rota existente).

   Agora é o MAPA DO SITE do ecossistema inteiro, não só uma lista curta:
   - Módulos: os 12 módulos nativos (MODULE_LINKS, rota localizada).
   - Funcionalidades: as ~32 features de FEATURES (data.ts) — cada uma
     linka pro módulo que a cobre.
   - Ecossistema: as 83 páginas de content/ai-ecosystem.json, nome + link
     externo, num grid compacto.
   - Institucional: para quem constrói, legal, contato, endereço, sociais
     e seletor de idioma — mantidos como já existiam.

   Fecha com uma dobra de marca (CxOrbFold): a mesma linguagem visual da
   dobra "Funil de venda" do site principal — esfera escura central com o
   wordmark CX em degradê, halo e ícones em cards escuros ligados por
   linhas tracejadas — em escala reduzida pro rodapé.

   Todos os textos vêm de i18n.ts; os hrefs internos usam localizedPath
   pra apontar pra rota certa no idioma da página atual. */

const LEGAL_HREFS = [
  '/politica-de-privacidade',
  '/termos-de-uso',
  '/concentimento-de-cookies',
  'mailto:suporte@clickmax.io',
]
const BUILDER_HREFS = [
  '#capacidades',
  '#pricing',
  '/videos',
  '/changelog',
  '/suporte',
]

/* Pilares centrais da operação exibidos nos cards do orb — o resto do
   ecossistema (os outros módulos, as features e as 83 páginas) já está
   navegável no mapa do site logo acima. */
const ORB_MODULE_IDS: ModuleId[] = [
  'funnels',
  'paginas',
  'mensagens',
  'crm',
  'checkout',
  'automacoes',
]

type FooterItem = { label: string; href: string; external?: boolean }

function FooterLink({ label, href, external }: FooterItem) {
  const className =
    'font-normal text-[13px] text-white/55 transition-colors hover:text-white'
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label} <span aria-hidden>↗</span>
      </a>
    )
  }
  if (href.startsWith('/') && !href.includes('#')) {
    return (
      <Link to={href} className={className}>
        {label}
      </Link>
    )
  }
  return (
    <a href={href} className={className}>
      {label}
    </a>
  )
}

function FooterColumn({
  title,
  items,
}: {
  title: string
  items: FooterItem[]
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <span className="cxa-eyebrow text-white/55">{title}</span>
      <ul className="flex flex-col gap-2.5">
        {items.map(item => (
          <li key={item.label}>
            <FooterLink {...item} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Wordmark "cx" com preenchimento em degradê (cores do acento do hub —
 *  --cxa-g1/g2/g3), usado dentro do orb central. Mesmo path vetorial de
 *  @/components/icons (CX): só troca o fill sólido por um gradiente. */
function CxOrbMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 31 15"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cxOrbGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={{ stopColor: 'var(--cxa-g1)' }} />
          <stop offset="55%" style={{ stopColor: 'var(--cxa-g2)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--cxa-g3)' }} />
        </linearGradient>
      </defs>
      <path
        d="M10.2602 9.10682L13.1921 9.88062C12.3473 11.8775 10.6578 14.0741 7.05508 14.0741C1.91192 14.0741 0.421143 9.9555 0.421143 7.1349C0.421143 4.31431 1.91192 0.220703 7.05508 0.220703C10.8069 0.220703 12.4467 2.36735 13.2169 4.56392L10.2354 5.26283C9.68878 3.76517 8.99308 2.7168 7.05508 2.7168C4.71954 2.7168 3.52692 4.6388 3.52692 7.1349C3.52692 9.65597 4.66984 11.553 7.05508 11.553C8.84401 11.553 9.71362 10.4048 10.2602 9.10682Z"
        fill="url(#cxOrbGradient)"
      />
      <path
        d="M19.1516 6.90392L15.068 0.480543H18.692L22.6246 6.90392L18.4655 13.2618H14.8415L19.1516 6.90392Z"
        fill="url(#cxOrbGradient)"
      />
      <path
        d="M26.0977 6.83842L30.1813 13.2618L26.5573 13.2618L22.6246 6.83842L26.7838 0.480543H30.4078L26.0977 6.83842Z"
        fill="url(#cxOrbGradient)"
      />
    </svg>
  )
}

/** Dobra de marca do rodapé — mesma linguagem visual da dobra "Funil de
 *  venda" do site principal (esfera escura central com o wordmark CX em
 *  degradê, halo/glow e ícones em cards escuros ao redor, ligados por
 *  linhas tracejadas), em escala reduzida pra caber num rodapé.
 *
 *  Sem JS de animação: o halo giratório usa só CSS (motion-safe:animate-*),
 *  então prefers-reduced-motion desliga sozinho via media query — não tem
 *  como a animação rodar quando o usuário pediu menos movimento. */
function CxOrbFold({ lang }: { lang: Lang }) {
  const t = copyFor(lang)

  return (
    <div className="flex w-full flex-col items-center gap-10 border-white/8 border-t px-6 py-16 sm:py-20">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="cxa-eyebrow text-white/55">{t.footer.orbEyebrow}</span>
        <h2 className="max-w-[22ch] font-inter font-medium text-2xl text-white leading-[1.15] sm:text-3xl">
          {t.footer.orbTitle}
        </h2>
      </div>

      <div className="flex w-full min-w-0 flex-col items-center">
        {/* Orb: esfera escura + halo + wordmark em degradê */}
        <div className="relative flex size-24 items-center justify-center sm:size-28">
          <div
            aria-hidden
            className="-z-10 absolute inset-[-45%] rounded-full opacity-40 blur-2xl"
            style={{ background: 'var(--cxa-gradient)' }}
          />
          <div
            aria-hidden
            className="-inset-3 absolute rounded-full border border-white/15 border-dashed motion-safe:animate-[spin_16s_linear_infinite] motion-reduce:animate-none"
          />
          <div
            aria-hidden
            className="-inset-6 absolute rounded-full border border-white/8 border-dashed motion-safe:animate-[spin_26s_linear_infinite_reverse] motion-reduce:animate-none"
          />
          <div
            className="relative flex size-full items-center justify-center rounded-full border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_60px_-24px_rgba(0,0,0,0.85)]"
            style={{
              background:
                'radial-gradient(circle at 32% 26%, #2c2c31 0%, #0e0e11 72%)',
            }}
          >
            <CxOrbMark className="h-auto w-10 drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)] sm:w-12" />
          </div>
        </div>

        {/* Linha tracejada: orb -> tronco dos cards */}
        <div
          aria-hidden
          className="h-8 w-px border-white/15 border-l border-dashed sm:h-10"
        />

        {/* Tronco + cards escuros dos módulos, cada um com seu próprio
            "galho" tracejado subindo até o tronco. flex-nowrap +
            overflow-x-auto garante uma única fileira em qualquer largura
            (sem isso, o tronco não alcançaria os cards de uma 2ª linha).
            w-fit + mx-auto: centraliza quando cabe; quando não cabe (telas
            estreitas), a margem automática zera e o scroll começa exatamente
            no primeiro card — sem cortar a primeira coluna pela metade. */}
        <div className="w-full min-w-0 max-w-2xl overflow-x-auto">
          <div className="mx-auto flex w-fit flex-nowrap gap-x-5 border-white/15 border-t border-dashed px-4 sm:gap-x-8">
            {ORB_MODULE_IDS.map(id => {
              const mod = MODULE_LINKS.find(m => m.slug === id)
              if (!mod) return null
              const Icon = CX_ICONS[mod.icon]
              return (
                <a
                  key={id}
                  href={localizedPath(mod.path, lang)}
                  className="group flex w-16 flex-none flex-col items-center gap-2 pt-0 sm:w-20"
                >
                  <span
                    aria-hidden
                    className="h-4 w-px border-white/15 border-l border-dashed sm:h-5"
                  />
                  <span className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-[#1D1D20] text-white/60 transition-colors group-hover:border-white/25 group-hover:text-white sm:size-12">
                    <Icon size={18} />
                  </span>
                  <span className="text-center font-inter text-[11px] text-white/60 leading-tight transition-colors group-hover:text-white">
                    {t.moduleLabels[id]}
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      <p className="max-w-[46ch] text-center font-inter text-[12px] text-white/55">
        {t.footer.tagline}
      </p>
    </div>
  )
}

export function AllHubFooter({ lang = 'pt' }: { lang?: Lang }) {
  const t = copyFor(lang)
  const loc = useLocation()
  const ptHref = counterpartPath(loc.pathname, 'pt')
  const enHref = counterpartPath(loc.pathname, 'en')
  const esHref = counterpartPath(loc.pathname, 'es')

  const modulesItems: FooterItem[] = MODULE_LINKS.map(m => ({
    label: t.moduleLabels[m.slug],
    href: localizedPath(m.path, lang),
  }))

  const featuresItems: FooterItem[] = FEATURES.map(f => ({
    label: f[lang],
    href: localizedPath(`/${f.to}`, lang),
  }))

  const buildersItems: FooterItem[] = t.footer.columns.builders.items.map(
    (label, i) => ({ label, href: BUILDER_HREFS[i] }),
  )

  const legalItems: FooterItem[] = t.footer.columns.legal.items.map(
    (label, i) => ({ label, href: LEGAL_HREFS[i] }),
  )

  return (
    <footer className="bg-[var(--cxa-dark)]">
      {/* Mapa do site: módulos, funcionalidades e institucional */}
      <div className="cxa-shell grid grid-cols-2 gap-x-8 gap-y-10 py-16 sm:grid-cols-4 sm:gap-6">
        <FooterColumn
          title={t.footer.columns.modules.title}
          items={modulesItems}
        />

        <div className="flex flex-col gap-3.5">
          <span className="cxa-eyebrow text-white/55">
            {t.footer.columns.features.title}
          </span>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            {featuresItems.map(item => (
              <li key={item.label}>
                <FooterLink {...item} />
              </li>
            ))}
          </ul>
        </div>

        <FooterColumn
          title={t.footer.columns.builders.title}
          items={buildersItems}
        />
        <FooterColumn title={t.footer.columns.legal.title} items={legalItems} />
      </div>

      {/* Ecossistema completo: as 83 páginas, nome + link externo, num
          grid compacto (visível por padrão — é sitemap e SEO). */}
      <div className="cxa-shell flex flex-col gap-5 border-white/8 border-t py-10">
        <div className="flex flex-col gap-1">
          <span className="cxa-eyebrow text-white/55">
            {t.footer.columns.ecosystem.title}
          </span>
          <p className="max-w-[70ch] font-inter text-[13px] text-white/70">
            {ECOSYSTEM.length}
            {t.footer.columns.ecosystem.countSuffix}
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {ECOSYSTEM.map(item => (
            <li key={item.slug} className="min-w-0">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={item.name}
                className="block truncate font-normal text-[11px] text-white/55 transition-colors hover:text-white"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Dobra de marca — orb CX (halo + wordmark em degradê + cards
          tracejados dos módulos centrais). */}
      <CxOrbFold lang={lang} />

      {/* Faixa final — sociais à esquerda, seletor de idioma à direita. */}
      <div className="cxa-shell flex flex-col items-center gap-5 border-white/8 border-t py-6 sm:flex-row sm:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/clickmax.io/"
              aria-label="Instagram"
            >
              <Instagram className="size-4 text-white/40 transition-colors hover:text-white" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.youtube.com/@clickmaxbr"
              aria-label="YouTube"
            >
              <Youtube className="size-4 text-white/40 transition-colors hover:text-white" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/company/clickmax/"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-4 text-white/40 transition-colors hover:text-white" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.facebook.com/profile.php?id=61570128084403"
              aria-label="Facebook"
            >
              <Facebook className="size-4 text-white/40 transition-colors hover:text-white" />
            </a>
          </div>
          <span className="hidden h-4 w-px bg-white/15 sm:block" />
          <span className="font-normal text-[12px] text-white/55">
            © {new Date().getFullYear()} {t.footer.companySuffix}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden font-normal text-[12px] text-white/55 lg:block">
            {t.footer.address}
          </span>
          <div className="flex items-center gap-1 rounded-full border border-white/15 p-1">
            <a
              href={ptHref}
              aria-label={t.nav.ptLabel}
              title={t.nav.ptLabel}
              className="rounded-full px-2 py-0.5 text-[12px] transition-opacity hover:opacity-100"
              style={{ opacity: lang === 'pt' ? 0.95 : 0.5 }}
            >
              🇧🇷
            </a>
            <a
              href={enHref}
              aria-label={t.nav.enLabel}
              title={t.nav.enLabel}
              className="rounded-full px-2 py-0.5 text-[12px] transition-opacity hover:opacity-100"
              style={{ opacity: lang === 'en' ? 0.95 : 0.5 }}
            >
              🇺🇸
            </a>
            <a
              href={esHref}
              aria-label={t.nav.esLabel}
              title={t.nav.esLabel}
              className="rounded-full px-2 py-0.5 text-[12px] transition-opacity hover:opacity-100"
              style={{ opacity: lang === 'es' ? 0.95 : 0.5 }}
            >
              🇪🇸
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
