import alanPhoto from '@/sections/amanda/assets/results/alan_hover.webp'
import gilbertoPhoto from '@/sections/amanda/assets/results/gilberto_hover.webp'
import haylaPhoto from '@/sections/amanda/assets/results/hayla_hover.webp'
import leandroPhoto from '@/sections/amanda/assets/results/leandro_hover.webp'
import pedroPhoto from '@/sections/amanda/assets/results/pedro_hover.webp'
import robsonPhoto from '@/sections/amanda/assets/results/robson_hover.webp'
import { copyFor, type Lang } from '../i18n'
import { Reveal } from '../Reveal'
import { CX_APP } from './CxAppUI'

/* Prova social — MESMO formato das 83 páginas do ecossistema (ex.:
   prooffirstmax.vercel.app): grade de 6 cards com foto à esquerda, resultado
   em destaque, nome, depoimento e tags. As fotos são as coloridas (_hover)
   com DUOTONE na cor do design system (grayscale + overlay em
   mix-blend-mode:color) — aqui o tom é o teal do app. Esta é a seção que
   "rola por cima" do Manifesto sticky (z-index + margem negativa). */

interface Case {
  photo: string
  name: string
  result: Record<Lang, string>
  body: Record<Lang, string>
  tags: Record<Lang, string[]>
}

const CASES: Case[] = [
  {
    photo: pedroPhoto,
    name: 'Pedro Lotz',
    result: {
      pt: 'R$ 40k a 70k/dia',
      en: 'R$40k to 70k/day',
      es: 'R$ 40k a 70k/día',
    },
    body: {
      pt: 'Pedro Lotz não investia em tráfego e entendeu que acionar a própria base de leads, dentro dos 800 mil seguidores, era o caminho mais fácil pra faturar mais.',
      en: "Pedro Lotz wasn't buying traffic and realized that activating his own lead base, inside his 800k followers, was the easiest path to higher revenue.",
      es: 'Pedro Lotz no invertía en tráfico y entendió que activar su propia base de leads, dentro de sus 800 mil seguidores, era el camino más fácil para facturar más.',
    },
    tags: {
      pt: ['Personal trainer', 'Nicho fitness', '800 mil seguidores'],
      en: ['Personal trainer', 'Fitness niche', '800k followers'],
      es: ['Personal trainer', 'Nicho fitness', '800 mil seguidores'],
    },
  },
  {
    photo: leandroPhoto,
    name: 'Leandro Rezende',
    result: {
      pt: 'R$ 550 mil/mês',
      en: 'R$550k/month',
      es: 'R$ 550 mil/mes',
    },
    body: {
      pt: 'Leandro Rezende identificou a chance de vender mais high tickets de pós-graduação para uma base altamente qualificada que não recebia ofertas nos funis de ticket médio.',
      en: 'Leandro Rezende spotted the chance to sell more high-ticket graduate programs to a highly qualified base that never received offers in his mid-ticket funnels.',
      es: 'Leandro Rezende identificó la oportunidad de vender más high tickets de posgrado a una base muy calificada que no recibía ofertas en los embudos de ticket medio.',
    },
    tags: {
      pt: ['Professor universitário', 'Nicho design', '150 mil seguidores'],
      en: ['University professor', 'Design niche', '150k followers'],
      es: ['Profesor universitario', 'Nicho diseño', '150 mil seguidores'],
    },
  },
  {
    photo: alanPhoto,
    name: 'Alan Nicolas',
    result: { pt: 'R$ 270 mil', en: 'R$270k', es: 'R$ 270 mil' },
    body: {
      pt: 'Alan Nicolas usou audiências cruzadas de interessados em inteligência artificial e vendeu R$ 270.000 com o Clickmax.',
      en: 'Alan Nicolas used cross-audiences of people interested in artificial intelligence and sold R$ 270,000 with Clickmax.',
      es: 'Alan Nicolas usó audiencias cruzadas de interesados en inteligencia artificial y vendió R$ 270.000 con Clickmax.',
    },
    tags: {
      pt: ['Infoprodutor', 'Inteligência artificial', '+300 mil seguidores'],
      en: ['Course creator', 'Artificial intelligence', '300k+ followers'],
      es: ['Infoproductor', 'Inteligencia artificial', '+300 mil seguidores'],
    },
  },
  {
    photo: robsonPhoto,
    name: 'Robson Souza',
    result: { pt: '+ R$ 100 mil', en: '+R$100k', es: '+ R$ 100 mil' },
    body: {
      pt: 'Robson Souza aproveitou uma hype que viralizou com seus cortes de R$ 6 mil e vendeu mais de R$ 100.000 em ingressos para um público pro qual criou um movimento novo.',
      en: 'Robson Souza rode a viral wave from his R$ 6k video cuts and sold over R$ 100,000 in tickets to an audience he built a whole new movement for.',
      es: 'Robson Souza aprovechó un hype que se viralizó con sus cortes de R$ 6 mil y vendió más de R$ 100.000 en entradas para un público al que le creó un movimiento nuevo.',
    },
    tags: {
      pt: ['Infoprodutor', 'Nicho beleza', '+2 mi seguidores'],
      en: ['Course creator', 'Beauty niche', '2M+ followers'],
      es: ['Infoproductor', 'Nicho belleza', '+2 mi seguidores'],
    },
  },
  {
    photo: gilbertoPhoto,
    name: 'Gilberto Prado',
    result: {
      pt: 'R$ 450 mil/mês',
      en: 'R$450k/month',
      es: 'R$ 450 mil/mes',
    },
    body: {
      pt: 'Gilberto Prado aplicou os funis de workshop pago para revitalizar o negócio, que vinha de lançamentos gratuitos, com retorno de investimento de 10×.',
      en: 'Gilberto Prado applied paid-workshop funnels to revive a business coming from free launches, with a 10× return on investment.',
      es: 'Gilberto Prado aplicó embudos de taller pago para revitalizar el negocio, que venía de lanzamientos gratuitos, con un retorno de 10× sobre la inversión.',
    },
    tags: {
      pt: ['Designer', 'Nicho design', '+50 mil seguidores'],
      en: ['Designer', 'Design niche', '50k+ followers'],
      es: ['Diseñador', 'Nicho diseño', '+50 mil seguidores'],
    },
  },
  {
    photo: haylaPhoto,
    name: 'Hayla Rodrigues',
    result: {
      pt: 'Múltiplos 5 dígitos',
      en: 'Multiple five figures',
      es: 'Múltiples 5 cifras',
    },
    body: {
      pt: 'Hayla Rodrigues migrou área de membros, páginas de vendas e o one-click buy em apenas 2 dias e rodou uma campanha de múltiplos cinco dígitos que antes ela não teria acesso.',
      en: "Hayla Rodrigues migrated her members area, sales pages and one-click buy in just 2 days and ran a multiple-five-figure campaign she couldn't have run before.",
      es: 'Hayla Rodrigues migró área de miembros, páginas de ventas y el one-click buy en solo 2 días y corrió una campaña de múltiples cinco cifras a la que antes no tenía acceso.',
    },
    tags: {
      pt: ['Infoprodutora', 'Financeiro & mindset', '+100 mil seguidores'],
      en: ['Course creator', 'Finance & mindset', '100k+ followers'],
      es: ['Infoproductora', 'Finanzas y mindset', '+100 mil seguidores'],
    },
  },
]

export function LogosAndCases({ lang = 'pt' }: { lang?: Lang }) {
  const t = copyFor(lang)

  return (
    <section
      className="-mt-6 sm:-mt-10 relative z-10 overflow-hidden rounded-t-[28px] shadow-[0_-24px_48px_-24px_rgba(20,20,19,0.18)]"
      style={{ background: CX_APP.bg }}
    >
      {/* fio de acento do app no topo da seção */}
      <div
        aria-hidden="true"
        className="h-[3px] w-full"
        style={{ background: CX_APP.accent }}
      />

      <div className="cxa-shell py-16 sm:py-24">
        <Reveal className="max-w-[64ch]">
          <span
            className="cxa-eyebrow inline-flex items-center gap-2"
            style={{
              textTransform: 'none',
              letterSpacing: '0.01em',
              fontSize: 12.5,
              color: CX_APP.inkSoft,
            }}
          >
            <span
              aria-hidden="true"
              className="inline-block h-[6px] w-[18px] rounded-full"
              style={{ background: CX_APP.accent }}
            />
            {t.socialProof.eyebrow}
          </span>
          <h2
            className="cxa-headline mt-4 max-w-[24ch] text-[26px] sm:text-[40px]"
            style={{ color: CX_APP.ink }}
          >
            {t.socialProof.headline}
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {CASES.map(c => (
            <Reveal key={c.name}>
              <article
                className="flex h-full gap-5 rounded-[18px] p-5"
                style={{ background: CX_APP.surface, boxShadow: CX_APP.shadow }}
              >
                {/* foto colorida + duotone na cor do design system */}
                <span
                  className="relative block aspect-[3/4] w-[112px] shrink-0 overflow-hidden rounded-xl sm:w-[132px]"
                  style={{ background: CX_APP.bg, isolation: 'isolate' }}
                >
                  <img
                    src={c.photo}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    style={{
                      filter: 'grayscale(1) contrast(1.06) brightness(1.03)',
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: CX_APP.teal,
                      mixBlendMode: 'color',
                      opacity: 0.34,
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, transparent 45%, rgba(92,211,196,0.18) 100%)',
                    }}
                  />
                </span>

                <div className="flex min-w-0 flex-col gap-1.5 py-1">
                  <span
                    className="font-medium text-[21px] leading-none tracking-[-0.01em]"
                    style={{
                      background: CX_APP.accent,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {c.result[lang]}
                  </span>
                  <span
                    className="font-semibold text-[14px]"
                    style={{ color: CX_APP.ink }}
                  >
                    {c.name}
                  </span>
                  <p
                    className="text-[13px] leading-[1.55]"
                    style={{ color: CX_APP.inkSoft }}
                  >
                    {c.body[lang]}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {c.tags[lang].map(tag => (
                      <span
                        key={tag}
                        className="rounded-full px-2.5 py-1 text-[11px]"
                        style={{
                          border: `1px solid ${CX_APP.hairline}`,
                          color: CX_APP.inkSoft,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
