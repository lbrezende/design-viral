import { useLocation } from '@tanstack/react-router'
import { CX } from '@/components/icons'
import { copyFor, counterpartPath, type Lang, localizedPath } from './i18n'

/* Nav light compartilhada entre as rotas novas do hub (/oficial, /all,
   /parceiros, páginas de módulo) — ver docs/ALL-HUB-SPEC.md ("CX Light Grid").
   Recebe os links de âncora da própria página + o CTA de trial + as
   bandeirinhas 🇧🇷/🇺🇸 (mesmo padrão das landings do ecossistema), que trocam
   entre a rota atual e a equivalente no outro idioma. */
export type AllHubNavLink = {
  label: string
  href: string
}

const TRIAL_URL = 'https://payments.clickmax.io/ab7CbHkWPK?a=etMmF32vLD'
const SALES_WA_BASE = 'https://wa.me/5511968665849?text='

/** WhatsApp de vendas com a mensagem no idioma do visitante. */
export function salesWhatsapp(lang: Lang): string {
  return `${SALES_WA_BASE}${encodeURIComponent(copyFor(lang).nav.salesWhatsappText)}`
}

export function AllHubNav({
  links,
  lang = 'pt',
}: {
  links: AllHubNavLink[]
  lang?: Lang
}) {
  const t = copyFor(lang)
  const loc = useLocation()
  const ptHref = counterpartPath(loc.pathname, 'pt')
  const enHref = counterpartPath(loc.pathname, 'en')
  const esHref = counterpartPath(loc.pathname, 'es')

  return (
    <header className="cxa cxa-nav sticky top-0 z-40 border-[var(--cxa-hairline)] border-b backdrop-blur">
      <div className="cxa-shell flex h-16 items-center justify-between gap-4">
        {/* O logo das páginas do hub volta para o HUB (/all), não para a home
            do site — quem entra por uma sub-página navega o ecossistema. */}
        <a
          href={localizedPath('/all', lang)}
          className="flex items-center gap-2"
          aria-label="Clickmax"
        >
          <CX className="h-[13px] w-auto" />
          <span className="font-medium text-[14px] text-[var(--cxa-ink)] tracking-[-0.01em]">
            clickmax
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map(link => (
            <a
              key={link.href}
              href={localizedPath(link.href, lang)}
              className="font-medium text-[13px] text-[var(--cxa-ink-soft)] transition-colors hover:text-[var(--cxa-ink)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Mobile: só o ícone de chat (abre o WhatsApp de vendas) — o texto
              "Falar com vendas" quebrava em duas linhas e empurrava o topo. */}
          <a
            href={salesWhatsapp(lang)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.salesCta}
            title={t.nav.salesCta}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--cxa-hairline)] bg-white text-[var(--cxa-ink)] sm:hidden"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href={salesWhatsapp(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="cxa-pill-outline !px-4 !py-2 !hidden text-[12.5px] sm:!inline-flex"
          >
            {t.nav.salesCta}
          </a>
          <a
            href={TRIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cxa-pill-gradient !px-4 !py-2 shrink-0 whitespace-nowrap text-[12.5px]"
          >
            {t.nav.trialCta}
          </a>

          {/* Bandeirinhas 🇧🇷/🇺🇸/🇪🇸: mesma pílula das landings do ecossistema. */}
          <div className="ml-1 flex items-center gap-0.5 rounded-full border border-[var(--cxa-hairline)] bg-white/70 p-0.5">
            <a
              href={ptHref}
              aria-label={t.nav.ptLabel}
              title={t.nav.ptLabel}
              aria-current={lang === 'pt' ? 'true' : undefined}
              className="rounded-full px-1.5 py-0.5 text-[13px] leading-none transition-opacity"
              style={{ opacity: lang === 'pt' ? 1 : 0.45 }}
            >
              🇧🇷
            </a>
            <a
              href={enHref}
              aria-label={t.nav.enLabel}
              title={t.nav.enLabel}
              aria-current={lang === 'en' ? 'true' : undefined}
              className="rounded-full px-1.5 py-0.5 text-[13px] leading-none transition-opacity"
              style={{ opacity: lang === 'en' ? 1 : 0.45 }}
            >
              🇺🇸
            </a>
            <a
              href={esHref}
              aria-label={t.nav.esLabel}
              title={t.nav.esLabel}
              aria-current={lang === 'es' ? 'true' : undefined}
              className="rounded-full px-1.5 py-0.5 text-[13px] leading-none transition-opacity"
              style={{ opacity: lang === 'es' ? 1 : 0.45 }}
            >
              🇪🇸
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

export const ALLHUB_TRIAL_URL = TRIAL_URL
/** Mantido para compatibilidade com imports antigos (rota PT). */
export const ALLHUB_SALES_WA = salesWhatsapp('pt')
