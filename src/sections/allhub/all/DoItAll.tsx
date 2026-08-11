import { type CSSProperties, useEffect, useRef, useState } from 'react'
import {
  CxFlows,
  CxFunnels,
  CxGeral,
  CxLeads,
  CxPages,
  CxSales,
} from '../ClickmaxIcons'
import { copyFor, type Lang, localizedPath } from '../i18n'
import { Reveal } from '../Reveal'
import {
  CX_APP,
  CxIconCircle,
  type CxIconComponent,
  usePrefersReducedMotion,
} from './CxAppUI'

/* "Faça tudo com o Clickmax." — mosaico escalonado: grade 6×3 de células
   quadradas, cards ADJACENTES (gap 0, cantos retos, hairline colapsada por
   -mr/-mb px), ícone REAL do app dentro do círculo branco (mesma linguagem da
   sidebar) no topo e título+descrição ancorados na BASE do card, tiles cinza
   preenchendo a composição, crop-marks nas interseções e dois losangos
   vazados. Composição espelhada a pedido do cliente: vendas online à
   esquerda, templates à direita, automações deslocada para não formar um
   retângulo cheio na vertical com a IA aplicada.

   ANIMAÇÃO DE QUEDA: mecânica idêntica à do bloco de referência — a peça
   entra 300px acima, aterrissa e dá um squash & stretch a partir da borda de
   baixo. Não é scrubbed: um IntersectionObserver marca a seção uma única vez
   e o escalonamento vem do CSS, `(--n − --i) × 60ms`, com --i crescendo do
   topo para a base — assim a BASE cai primeiro e a queda sobe (ordem pedida
   pelo cliente). Os losangos brotam com scale em vez de cair. O CSS mora em
   all-hub.css (.cxa-fall / .cxa-fall-pop) e prefers-reduced-motion desliga
   tudo, inclusive por lá. */

/* Estrutura do mosaico — só layout/ícone/rota. Título e descrição de cada
   bloco vêm do dicionário (i18n.ts), keyed por `key`. */
type BlockKey = keyof ReturnType<typeof copyFor>['doItAll']['blocks']

/* Para que lado o miolo branco desliza no hover. A escolha não é decorativa:
   cada peça descobre o acento pelo lado em que ela encosta num vizinho, e as
   quatro direções aparecem ao menos uma vez para o mosaico não repetir o
   mesmo gesto seis vezes. */
type Direcao = 'esquerda' | 'direita' | 'cima' | 'baixo'

const DESLOCAMENTO: Record<Direcao, { x: string; y: string }> = {
  esquerda: { x: '-40px', y: '0px' },
  direita: { x: '40px', y: '0px' },
  cima: { x: '0px', y: '-36px' },
  baixo: { x: '0px', y: '36px' },
}

interface Block {
  key: BlockKey
  path: string
  icon: CxIconComponent
  color: string
  area: string
  direcao: Direcao
}

const BLOCKS: Block[] = [
  {
    key: 'ia-aplicada',
    path: '/insights',
    icon: CxGeral,
    color: CX_APP.teal,
    area: 'lg:col-start-3 lg:col-span-2 lg:row-start-1',
    direcao: 'esquerda',
  },
  {
    key: 'marketing',
    path: '/paginas',
    icon: CxPages,
    color: CX_APP.green,
    area: 'lg:col-start-4 lg:col-span-1 lg:row-start-2',
    direcao: 'baixo',
  },
  {
    key: 'comercial',
    path: '/crm',
    icon: CxLeads,
    color: CX_APP.lime,
    area: 'lg:col-start-3 lg:col-span-1 lg:row-start-2',
    direcao: 'cima',
  },
  {
    key: 'vendas-online',
    path: '/checkout',
    icon: CxSales,
    color: CX_APP.teal,
    area: 'lg:col-start-1 lg:col-span-1 lg:row-start-2',
    direcao: 'direita',
  },
  {
    key: 'templates',
    path: '/funnels',
    icon: CxFunnels,
    color: CX_APP.green,
    area: 'lg:col-start-6 lg:col-span-1 lg:row-start-3',
    direcao: 'baixo',
  },
  {
    key: 'automacoes',
    path: '/automacoes',
    icon: CxFlows,
    color: CX_APP.lime,
    area: 'lg:col-start-4 lg:col-span-2 lg:row-start-3',
    direcao: 'cima',
  },
]

/* tiles cinza que fecham a composição (só desktop) */
const FILLERS = [
  'lg:col-start-5 lg:row-start-2',
  'lg:col-start-1 lg:row-start-3',
  'lg:col-start-2 lg:row-start-3',
  'lg:col-start-3 lg:row-start-3',
]

/* crop-marks: [left%, top%] sobre a grade 6×3 */
const MARKS: Array<[number, number]> = [
  [83.333, 33.333],
  [16.666, 33.333],
  [66.666, 66.666],
  [16.666, 66.666],
  [33.333, 100],
]

/* Ordem de queda: as peças são indexadas pela posição visual (linha, depois
   coluna). O CSS inverte — quem tem o maior --i cai primeiro —, então a linha
   de baixo aterrissa antes da do meio, e a do meio antes do topo. Os dois
   losangos ficam nas pontas da sequência (0 e n). */
function cellOrder(area: string) {
  const row = Number(area.match(/row-start-(\d)/)?.[1] ?? 1)
  const col = Number(area.match(/col-start-(\d)/)?.[1] ?? 1)
  return row * 10 + col
}

const FALL_ORDER = [...BLOCKS.map(b => b.area), ...FILLERS].sort(
  (a, b) => cellOrder(a) - cellOrder(b),
)
const FALL_MAX = FALL_ORDER.length + 1
const fallIndex = (area: string) => FALL_ORDER.indexOf(area) + 1

/** Marca a seção uma única vez, quando ela entra em cena. */
function useInView(reduced: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (reduced) {
      setSeen(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -20% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return { ref, seen }
}

export function DoItAll({ lang = 'pt' }: { lang?: Lang }) {
  const t = copyFor(lang)
  const reduced = usePrefersReducedMotion()
  const { ref, seen } = useInView(reduced)
  /* Cor do bloco sob o ponteiro. Os tiles cinza acendem nela, então o mosaico
     inteiro responde ao hover em vez de só a peça tocada. */
  const [aceso, setAceso] = useState<string | null>(null)

  return (
    <section
      id="do-it-all"
      className="cxa-section"
      style={{ background: CX_APP.bg, borderTopColor: CX_APP.hairline }}
    >
      <div className="cxa-shell py-16 sm:py-24">
        <Reveal className="text-center">
          <span className="cxa-eyebrow" style={{ color: CX_APP.inkSoft }}>
            {t.doItAll.eyebrow}
          </span>
          <h2
            className="cxa-headline mt-4 text-[28px] sm:text-[42px]"
            style={{ color: CX_APP.ink }}
          >
            {t.doItAll.headline}
          </h2>
        </Reveal>

        <div
          ref={ref}
          className={`relative mx-auto mt-14 max-w-[1120px] ${seen ? 'cxa-fall-in' : ''}`}
          style={{ '--n': FALL_MAX } as CSSProperties}
        >
          {/* losangos vazados */}
          <span
            aria-hidden="true"
            className="cxa-fall-pop pointer-events-none absolute hidden size-16 rotate-45 border lg:block"
            style={
              {
                left: '72%',
                top: 'calc(33.333% - 2rem)',
                borderColor: CX_APP.hairline,
                '--i': 0,
              } as CSSProperties
            }
          />
          <span
            aria-hidden="true"
            className="cxa-fall-pop pointer-events-none absolute hidden size-16 rotate-45 border lg:block"
            style={
              {
                left: '-1rem',
                top: 'calc(83% - 2rem)',
                borderColor: CX_APP.hairline,
                '--i': FALL_MAX,
              } as CSSProperties
            }
          />

          <div className="grid grid-cols-1 gap-3 lg:aspect-[2/1] lg:grid-cols-6 lg:grid-rows-3 lg:gap-0">
            {FILLERS.map(area => (
              <div
                key={area}
                aria-hidden="true"
                data-aceso={aceso ? 'true' : 'false'}
                className={`cxa-fall cxa-filler lg:-mr-px lg:-mb-px hidden lg:block ${area}`}
                style={
                  {
                    background: 'linear-gradient(180deg,#E9ECEF,#E1E5E9)',
                    '--filler-accent': aceso ?? 'transparent',
                    '--i': fallIndex(area),
                  } as CSSProperties
                }
              />
            ))}

            {BLOCKS.map(block => {
              const Icon = block.icon
              const copy = t.doItAll.blocks[block.key]
              return (
                <a
                  key={block.key}
                  href={localizedPath(block.path, lang)}
                  onMouseEnter={() => setAceso(block.color)}
                  onMouseLeave={() => setAceso(null)}
                  // Quem chega pelo teclado vê o mesmo mosaico aceso de quem
                  // chega pelo ponteiro.
                  onFocus={() => setAceso(block.color)}
                  onBlur={() => setAceso(null)}
                  className={`cxa-doit cxa-fall group lg:-mr-px lg:-mb-px rounded-[18px] lg:rounded-none ${block.area}`}
                  style={
                    {
                      '--block-accent': block.color,
                      '--doit-x': DESLOCAMENTO[block.direcao].x,
                      '--doit-y': DESLOCAMENTO[block.direcao].y,
                      '--i': fallIndex(block.area),
                    } as CSSProperties
                  }
                >
                  <span className="cxa-doit-inner flex h-full w-full flex-col justify-between rounded-[18px] p-5 lg:rounded-none">
                    <CxIconCircle icon={Icon} size={44} iconSize={20} />

                    <span className="mt-16 flex flex-col gap-1 lg:mt-0">
                      <span
                        className="font-medium text-[21px] leading-[1.15] tracking-[-0.02em]"
                        style={{ color: CX_APP.ink }}
                      >
                        {copy.title}
                      </span>
                      {copy.desc ? (
                        <span
                          className="max-w-[30ch] text-[13.5px] leading-[1.45]"
                          style={{ color: CX_APP.inkSoft }}
                        >
                          {copy.desc}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </a>
              )
            })}
          </div>

          {/* crop-marks nas interseções da grade */}
          {MARKS.map(([l, top]) => (
            <span
              key={`${l}-${top}`}
              aria-hidden="true"
              className="pointer-events-none absolute hidden size-[5px] lg:block"
              style={{
                left: `calc(${l}% - 2.5px)`,
                top: `calc(${top}% - 2.5px)`,
                background: CX_APP.ink,
                opacity: seen ? 1 : 0,
                transition: 'opacity 600ms ease-out 700ms',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
