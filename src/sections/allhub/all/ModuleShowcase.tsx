import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { CX_ICONS, type CxIconName } from '../ClickmaxIcons'
import { copyFor, type Lang, localizedPath } from '../i18n'
import { Reveal } from '../Reveal'
import { VideoAutoplay } from '../VideoAutoplay'
import type { CxIconComponent } from './CxAppUI'

/* Showcase de módulos — rail esquerdo sticky com os CÍRCULOS da sidebar do app
   Clickmax (ícones reais de ClickmaxIcons.tsx: branco 46px / ativo #1A1A1A com
   ícone branco). Conteúdo: título + botão pill "Descobrir X ›" na mesma linha
   com hairline acima/abaixo, proposta de valor, player full-width, bullets,
   frase de efeito e chips de capacidades. Mobile (< lg): rail vira chips
   horizontais sticky-top.

   TEXTOS E VÍDEOS: são os REAIS de clickmax.io/videos — title, desc, bullets,
   quote e id do YouTube copiados do array VIDEOS de src/sections/amanda/
   Videos.tsx (mesma fonte dos decks), casados 1:1 com os 12 módulos do hub.

   PLAYER: caixa em 14/9 = proporção EXATA das gravações (medido nas thumbs do
   YouTube: conteúdo 1120x720 dentro do canvas 1280x720). Caixa 16/9 sobrava
   83px de tarja preta de cada lado — era a reclamação do cliente. Sem moldura
   decorativa em volta: o player ocupa 100% da largura da coluna. */

/* Só estrutura: id, ícone do app, rota e vídeo. Rótulo, título, descrição,
   bullets, quote e chips vêm do dicionário (i18n.ts → moduleShowcase.items),
   keyed pelo mesmo id — nada de texto hardcoded aqui. */
type ModuleId = keyof ReturnType<typeof copyFor>['moduleShowcase']['items']

interface ModuleDef {
  id: ModuleId
  icon: CxIconName
  path: string
  video: string
}

const MODULES: ModuleDef[] = [
  // Ordem pedida pelo cliente; lida em 2 colunas (linha = par de módulos):
  //   Funis · Automações | Checkout · Insights | Mensagens · CRM
  //   Quiz · Membros     | Integrações · Domínios | Páginas
  { id: 'funnels', icon: 'funnels', path: '/funnels', video: 'CjUDOihd2pY' },
  {
    id: 'automacoes',
    icon: 'flows',
    path: '/automacoes',
    video: 'TwMV1aQX3gU',
  },
  { id: 'checkout', icon: 'sales', path: '/checkout', video: 'Sm7Ca-CCY2E' },
  { id: 'insights', icon: 'geral', path: '/insights', video: 'OnKBzC36T1U' },
  {
    id: 'mensagens',
    icon: 'messages',
    path: '/mensagens',
    video: 'Qegari4Pg2o',
  },
  { id: 'crm', icon: 'leads', path: '/crm', video: 'LBtEU2IO5nw' },
  { id: 'quizz', icon: 'products', path: '/quizz', video: 'mjPVHSyT12A' },
  {
    id: 'membros',
    icon: 'membersarea',
    path: '/membros',
    video: 'xfYUaogs1As',
  },
  {
    id: 'integracoes',
    icon: 'integrations',
    path: '/integracoes',
    video: 'XyGyZFSSScU',
  },
  /* Sem vídeo dedicado a domínios em clickmax.io/videos — entra a visão
     geral da plataforma (lqN1MTlAwUQ) com copy do próprio módulo. */
  { id: 'dominios', icon: 'domains', path: '/dominios', video: 'lqN1MTlAwUQ' },
  { id: 'paginas', icon: 'pages', path: '/paginas', video: 'ICRmg0hXsyk' },
  /* LinkProtect saiu do rail a pedido do cliente — a rota /linkprotect
     continua existindo e linkada no rodapé. */
]

/* Botão redondo da sidebar do app: branco, ícone cinza; ativo = quase-preto
   com ícone branco. Sem borda, sombra suave. */
const CIRCLE_SHADOW =
  '0 1px 2px rgba(20,20,19,.04), 0 8px 24px -16px rgba(20,20,19,.18)'

/* Círculo do menu novo do app (redesign CX2026, web/user/.../app-sidebar).
   Em repouso é branco com um leve relevo e um anel de 1px; selecionado é
   #1F2123 com sheen interno (branco 24%→0 de cima para baixo) e borda em
   gradiente. Os valores são os do app, não uma aproximação. */
const RAIL_ICON_RELIEF =
  'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 100%), #fff'
const RAIL_ICON_RING = '0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)'
const RAIL_ICON_ACTIVE: CSSProperties = {
  border: '1px solid transparent',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%) padding-box, linear-gradient(#1F2123, #1F2123) padding-box, linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.06) 100%) border-box',
  boxShadow: '0 1px 3px rgba(0,0,0,0.14)',
}

/* Linha do menu: círculo à esquerda, palavra ao lado, uma embaixo da outra.
   Ativa = pílula clara envolvendo o círculo escuro — igual ao Nvl1 do app. */
function RailRow({
  icon: Icon,
  label,
  href,
  active,
}: {
  icon: CxIconComponent
  label: string
  href: string
  active: boolean
}) {
  return (
    <a
      href={href}
      aria-current={active ? 'true' : undefined}
      className="group flex h-10 shrink-0 items-center gap-2.5 rounded-full border border-transparent py-1 pr-4 pl-1 font-medium text-[12px] leading-normal transition-colors"
      style={{
        background: active ? '#F1F2F4' : 'transparent',
        color: '#1F2123',
      }}
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-transparent transition-colors"
        style={
          active
            ? { ...RAIL_ICON_ACTIVE, color: '#FFFFFF' }
            : {
                background: RAIL_ICON_RELIEF,
                boxShadow: RAIL_ICON_RING,
                color: '#5F6773',
              }
        }
      >
        <Icon size={15} />
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </a>
  )
}

export function ModuleShowcase({ lang = 'pt' }: { lang?: Lang }) {
  const t = copyFor(lang)
  const [active, setActive] = useState<ModuleId>(MODULES[0].id)
  const chipsRef = useRef<HTMLElement>(null)

  /* A régua de chips (mobile) acompanha o scroll vertical andando na
     horizontal: o módulo ativo é levado para a primeira posição à esquerda. */
  useEffect(() => {
    const nav = chipsRef.current
    if (!nav) return
    const chip = nav.querySelector<HTMLElement>(`[data-chip="${active}"]`)
    if (!chip) return
    const left = chip.offsetLeft - nav.offsetLeft
    if (Math.abs(nav.scrollLeft - left) > 4) {
      nav.scrollTo({ left, behavior: 'smooth' })
    }
  }, [active])
  const refs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const compute = () => {
      const line = window.innerHeight * 0.35
      let current: ModuleId = MODULES[0].id
      for (const m of MODULES) {
        const el = refs.current[m.id]
        if (el && el.getBoundingClientRect().top <= line) current = m.id
      }
      setActive(current)
    }
    compute()
    window.addEventListener('scroll', compute, true)
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute, true)
      window.removeEventListener('resize', compute)
    }
  }, [])

  return (
    <section id="modulos" className="cxa-section">
      <div className="cxa-shell py-16 sm:py-24">
        <Reveal className="max-w-[56ch]">
          <span className="cxa-eyebrow">{t.moduleShowcase.eyebrow}</span>
          <h2 className="cxa-headline mt-4 text-[28px] sm:text-[42px]">
            {t.moduleShowcase.headline}
          </h2>
        </Reveal>

        {/* Chips horizontais sticky-top — mobile/tablet (< lg).
            A régua acompanha o scroll VERTICAL andando na HORIZONTAL: o
            módulo ativo é sempre trazido para a primeira posição à esquerda. */}
        <nav
          ref={chipsRef}
          className="-mx-6 sticky top-16 z-20 mt-8 flex gap-2 overflow-x-auto scroll-smooth bg-[var(--cxa-canvas)]/95 px-6 py-3 backdrop-blur lg:hidden"
        >
          {MODULES.map(m => {
            const Icon = CX_ICONS[m.icon]
            const on = active === m.id
            return (
              <a
                key={m.id}
                href={`#${m.id}`}
                data-chip={m.id}
                className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-[12px] transition-colors"
                style={{
                  background: on ? '#1A1A1A' : '#FFFFFF',
                  color: on ? '#FFFFFF' : '#6B7280',
                  boxShadow: CIRCLE_SHADOW,
                }}
              >
                <Icon size={14} />
                {t.moduleLabels[m.id]}
              </a>
            )
          })}
        </nav>

        {/* Rail de módulos no estilo do menu novo do app (redesign CX2026):
            ícone circular à esquerda, palavra ao lado, um item embaixo do
            outro. A versão anterior era círculo com o rótulo EMBAIXO em duas
            colunas — os nomes ficavam desalinhados entre si e a leitura
            zigue-zagueava. Em linha, os onze módulos cabem numa coluna só e o
            rótulo sempre começa no mesmo x. */}
        <div className="mt-6 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-[212px_1fr] lg:gap-10">
          <nav className="hidden lg:block">
            <ul className="sticky top-24 flex max-h-[calc(100svh-7rem)] flex-col gap-0.5 overflow-y-auto py-1">
              {MODULES.map(m => (
                <li key={m.id}>
                  <RailRow
                    icon={CX_ICONS[m.icon]}
                    label={t.moduleLabels[m.id]}
                    href={`#${m.id}`}
                    active={active === m.id}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex min-w-0 flex-col gap-20">
            {MODULES.map(m => {
              const copy = t.moduleShowcase.items[m.id]
              const label = t.moduleLabels[m.id]
              return (
                <div
                  key={m.id}
                  id={m.id}
                  ref={el => {
                    refs.current[m.id] = el
                  }}
                  className="scroll-mt-28"
                >
                  <span className="cxa-eyebrow">
                    {t.moduleShowcase.modulePrefix}
                    {label}
                  </span>

                  <div className="mt-3 flex flex-col gap-4 border-[var(--cxa-hairline)] border-y py-5 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="cxa-headline text-[26px] sm:text-[38px]">
                      {copy.title}
                    </h3>
                    <a
                      href={localizedPath(m.path, lang)}
                      className="cxa-pill-outline shrink-0 self-start sm:self-auto"
                    >
                      {t.moduleShowcase.discoverPrefix}
                      {label}
                      {t.moduleShowcase.discoverSuffix}
                    </a>
                  </div>

                  <p className="mt-4 max-w-[62ch] font-medium text-[15px] text-[var(--cxa-ink)] leading-[1.5] sm:text-[17px]">
                    {copy.desc}
                  </p>

                  {/* Player full-width da coluna, na proporção exata da gravação
                    (14/9) — sem caixa decorativa em volta, sem tarja preta. */}
                  <div className="mt-6 w-full">
                    <VideoAutoplay
                      youtubeId={m.video}
                      label={copy.title}
                      ratio="14 / 9"
                      className="shadow-[0_1px_2px_rgba(20,20,19,0.04),0_8px_24px_-16px_rgba(20,20,19,0.18)]"
                    />
                  </div>

                  {copy.bullets.length ? (
                    <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                      {copy.bullets.map(b => (
                        <li
                          key={b}
                          className="flex gap-2.5 text-[14px] text-[var(--cxa-ink-soft)] leading-[1.55] sm:text-[15px]"
                        >
                          <span
                            aria-hidden
                            className="mt-[7px] size-1.5 shrink-0 rounded-full"
                            style={{
                              background:
                                'linear-gradient(90deg, var(--cxa-g1), var(--cxa-g3))',
                            }}
                          />
                          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: texto estático do deck (negrito <b>) */}
                          <span dangerouslySetInnerHTML={{ __html: b }} />
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {copy.quote ? (
                    <p className="mt-5 max-w-[62ch] border-[var(--cxa-ink)] border-l-2 pl-3 font-medium text-[15px] text-[var(--cxa-ink)] italic leading-[1.5] sm:text-[16px]">
                      {copy.quote}
                    </p>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {copy.chips.map(chip => (
                      <span
                        key={chip}
                        className="rounded-full border border-[var(--cxa-hairline)] px-3 py-1 text-[12px] text-[var(--cxa-ink-soft)] tracking-[-0.01em]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
