import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ALLHUB_TRIAL_URL } from '../AllHubNav'
import { CX_ICONS, type CxIconName } from '../ClickmaxIcons'
import { FEATURES, type ModuleId } from '../data'
import { copyFor, type Lang } from '../i18n'

/* Hero do hub /all — coreografia "do centro para fora".
 *
 * Estado inicial (p = 0): headline gigante à esquerda, texto de apoio +
 * CTAs à direita (separados por hairline) e o campo de blocos ocupando a
 * metade de baixo. Tudo em opacidade cheia — nenhum texto nasce lavado.
 *
 * Ao rolar (track sticky de 200vh, progresso próprio via rAF +
 * getBoundingClientRect, sem libs):
 *   - o campo de blocos DESCE e sai por baixo;
 *   - a headline desliza para a ESQUERDA;
 *   - o texto/CTAs deslizam para a DIREITA;
 *   - no CENTRO, a frase-manifesto entra pequena e cresce até dominar
 *     a tela.
 *
 * `prefers-reduced-motion: reduce` desliga a coreografia inteira: vira um
 * hero estático em fluxo normal, com a frase-manifesto impressa entre as
 * colunas e o campo de blocos, tudo legível e sem transform.
 */

/* Células do campo: quadrados lisos nas cores do degradê do app
   (teal → verde → lima) + neutros (branco / cinza-claro). Sem pixel-art. */
const CELL_COLORS: Record<string, string> = {
  a: '#5CD3C4',
  b: '#6FD9A6',
  c: '#8BE07A',
  d: '#A6E866',
  e: '#C8F244',
  f: '#D4FF3F',
  w: '#FFFFFF',
  g: '#EDEFF1',
}

const TINTS = ['a', 'b', 'c', 'd', 'e', 'f', 'w', 'g'] as const

/* FEATURES (as ~32 features do Clickmax, não só os 12 módulos) e ModuleId
   agora moram em ../data.ts — compartilhados com o mapa de features do
   rodapé (AllHubFooter.tsx). `to` = âncora da seção de módulo
   (ModuleShowcase) que cobre a feature — clicar no bloquinho rola direto
   pra ela. Rótulo PT/EN vem do próprio FeatureLink (a maioria não existe
   em moduleLabels — i18n.ts cobre só os 12 módulos). */

type Cell = {
  id: string
  color: string
  neutral: boolean
  label?: string
  icon?: CxIconName
  to?: ModuleId
}

/* Campo = features (célula branca com ícone + nome) intercaladas com
   células lisas de cor. Total fixo: o embaralhamento só troca posições. */
const FILLERS_PER_FEATURE = 1.6
const TOTAL_CELLS = Math.round(FEATURES.length * (1 + FILLERS_PER_FEATURE))

function buildCells(lang: Lang): Cell[] {
  const out: Cell[] = []
  let f = 0
  for (let i = 0; i < TOTAL_CELLS; i++) {
    // distribui as features de forma espaçada, sem duas coladas
    const isFeature =
      f < FEATURES.length && i % Math.round(1 + FILLERS_PER_FEATURE) === 1
    if (isFeature) {
      const feat = FEATURES[f++]
      out.push({
        id: `f-${feat.pt}`,
        color: CELL_COLORS.w,
        neutral: true,
        label: feat[lang],
        icon: feat.icon,
        to: feat.to,
      })
    } else {
      const char = TINTS[(i * 5 + 3) % TINTS.length]
      out.push({
        id: `c-${i}`,
        color: CELL_COLORS[char],
        neutral: char === 'w' || char === 'g',
      })
    }
  }
  // sobrou feature? entra no lugar de células lisas do fim
  for (let i = out.length - 1; i >= 0 && f < FEATURES.length; i--) {
    if (out[i].label) continue
    const feat = FEATURES[f++]
    out[i] = {
      id: `f-${feat.pt}`,
      color: CELL_COLORS.w,
      neutral: true,
      label: feat[lang],
      icon: feat.icon,
      to: feat.to,
    }
  }
  return out
}

/* Embaralhamento contínuo: cada célula ocupa um "slot" da grade e, a cada
   ciclo, alguns pares trocam de lugar. Como o slot vira transform, a troca
   acontece com transição suave — o campo parece se remontando sozinho.
   Sem interação do usuário; desliga com prefers-reduced-motion. */
function useShuffledSlots(count: number, reduced: boolean) {
  const [slots, setSlots] = useState<number[]>(() =>
    Array.from({ length: count }, (_, i) => i),
  )

  useEffect(() => {
    setSlots(Array.from({ length: count }, (_, i) => i))
  }, [count])

  useEffect(() => {
    if (reduced || count < 4) return
    const id = window.setInterval(() => {
      setSlots(prev => {
        const next = [...prev]
        const swaps = 3 + Math.floor(Math.random() * 3)
        for (let s = 0; s < swaps; s++) {
          const a = Math.floor(Math.random() * next.length)
          const b = Math.floor(Math.random() * next.length)
          ;[next[a], next[b]] = [next[b], next[a]]
        }
        return next
      })
    }, 2300)
    return () => window.clearInterval(id)
  }, [count, reduced])

  return slots
}

/* Fileira de círculos do app (padrão da sidebar do Clickmax): branco com
   ícone cinza; o primeiro fica ativo (quase-preto + ícone branco). */
const CIRCLES: { id: ModuleId; icon: CxIconName }[] = [
  { id: 'funnels', icon: 'funnels' },
  { id: 'mensagens', icon: 'messages' },
  { id: 'crm', icon: 'leads' },
  { id: 'checkout', icon: 'sales' },
  { id: 'automacoes', icon: 'flows' },
]

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/** Interpola dois hex (#rrggbb) — usado na cor da frase enquanto ela cresce. */
function mixHex(from: string, to: string, t: number): string {
  const p = clamp01(t)
  const a = [1, 3, 5].map(i => Number.parseInt(from.slice(i, i + 2), 16))
  const b = [1, 3, 5].map(i => Number.parseInt(to.slice(i, i + 2), 16))
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * p))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}
/* saída das peças: ease-in-out (o movimento acompanha o dedo/roda) */
const smooth = (n: number) => n * n * (3 - 2 * n)
/* entrada da frase: ease-out (chega rápido e assenta) */
const easeOut = (n: number) => 1 - (1 - n) ** 3

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export function Hero({ lang = 'pt' }: { lang?: Lang }) {
  const t = copyFor(lang)
  const cells = useMemo(() => buildCells(lang), [lang])
  const sectionRef = useRef<HTMLElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  /* grade do campo medida do container: célula ~96px no desktop */
  const [grid, setGrid] = useState({ cols: 12, size: 96 })
  const stageRef = useRef<HTMLDivElement>(null)
  const leadRef = useRef<HTMLParagraphElement>(null)
  const [progress, setProgress] = useState(0)
  const reduced = usePrefersReducedMotion()
  const frame = useRef<number | null>(null)

  /* Alvo da frase de apoio: ela NÃO é substituída por outra — é a própria
     frase do topo direito que cresce e caminha até o centro do palco.

     Ela cresce pela FONTE, não por transform: scale(). Escalar o desenho faz
     o navegador rasterizar o texto no tamanho pequeno e esticar o bitmap, e
     era isso que deixava a frase serrilhada no meio da animação. Mudando o
     font-size, cada quadro é redesenhado do vetor e o texto fica nítido do
     começo ao fim.

     Guardamos o tamanho de origem em px e o fator até o tamanho final; a
     medida é refeita no resize e quando as fontes assentam. */
  const [leadTarget, setLeadTarget] = useState({
    base: 16,
    largura: 0,
    fator: 1,
  })
  const slots = useShuffledSlots(cells.length, reduced)

  useEffect(() => {
    const el = fieldRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      const cols = Math.max(4, Math.round(w / (w < 640 ? 84 : 104)))
      setGrid({ cols, size: w / cols })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (reduced) return
    const measure = () => {
      const lead = leadRef.current
      const stage = stageRef.current
      if (!lead || !stage) return
      const prevT = lead.style.transform
      const prevF = lead.style.fontSize
      const prevW = lead.style.width
      lead.style.transform = 'none'
      lead.style.fontSize = ''
      lead.style.width = ''
      const l = lead.getBoundingClientRect()
      const s = stage.getBoundingClientRect()
      const base = Number.parseFloat(getComputedStyle(lead).fontSize) || 16
      lead.style.transform = prevT
      lead.style.fontSize = prevF
      lead.style.width = prevW
      /* No mobile a frase nasce pequena e SÓ cresce com o scroll; o teto é
         limitado pela largura do palco pra nunca estourar a tela. */
      const isNarrow = window.innerWidth < 640
      const targetW = isNarrow ? s.width * 0.92 : Math.min(880, s.width * 0.78)
      const maxByWidth = targetW / Math.max(1, l.width)
      setLeadTarget({
        base,
        largura: l.width,
        fator: Math.max(1, Math.min(isNarrow ? 1.9 : 2.9, maxByWidth)),
      })
    }
    measure()
    // a primeira medida pode sair errada se as fontes ainda não assentaram
    // (a largura do parágrafo muda) — remede quando elas terminam de carregar
    const raf = requestAnimationFrame(measure)
    document.fonts?.ready.then(measure).catch(() => {})
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    const compute = () => {
      frame.current = null
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      // trilho útil = altura da seção menos a altura do painel sticky
      const travel = Math.max(1, rect.height - window.innerHeight)
      setProgress(clamp01(-rect.top / travel))
    }
    const onScroll = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [reduced])

  /* O translate que leva a frase até o centro é aplicado DEPOIS do layout,
     no próprio nó, porque depende da caixa já com o font-size do quadro. Se
     saísse do render, usaria a medida do quadro anterior e a frase chegaria
     desalinhada no centro. Medimos com o transform zerado e devolvemos. */
  useLayoutEffect(() => {
    if (reduced) return
    const lead = leadRef.current
    const stage = stageRef.current
    if (!lead || !stage) return
    lead.style.transform = 'none'
    const l = lead.getBoundingClientRect()
    const s = stage.getBoundingClientRect()
    const dx = s.left + s.width / 2 - (l.left + l.width / 2)
    const dy = s.top + s.height / 2 - (l.top + l.height / 2)
    lead.style.transform = `translate3d(${(dx * centra).toFixed(2)}px, ${(dy * centra).toFixed(2)}px, 0)`
  })

  // As peças saem primeiro (out); a frase central só ganha corpo depois que
  // o centro esvazia — senão headline e manifesto se sobrepõem no caminho.
  const out = smooth(clamp01(progress / 0.6))
  /* Duas fases, não uma. Antes a frase caminhava até o centro E crescia ao
     mesmo tempo, e no meio do caminho as palavras trocavam de linha — dava
     pra ver a frase se remontando enquanto a pessoa tentava ler.

     Agora: primeiro ela viaja até o centro no tamanho em que estava
     (`centra`), e só depois começa a crescer (`grow`). As duas fases não se
     sobrepõem. */
  const centra = easeOut(clamp01((progress - 0.28) / 0.24))
  const grow = easeOut(clamp01((progress - 0.54) / 0.34))
  const fade = Math.max(0, 1 - out * 1.35)

  const leftStyle = reduced
    ? undefined
    : {
        transform: `translate3d(${-out * 64}%, 0, 0)`,
        opacity: fade,
        willChange: 'transform, opacity',
      }

  // CTAs e círculos saem pela direita; a frase de apoio fica e cresce.
  const rightStyle = reduced
    ? undefined
    : {
        transform: `translate3d(${out * 68}%, 0, 0)`,
        opacity: fade,
        willChange: 'transform, opacity',
      }

  /* A frase começa cinza e alinhada à esquerda; conforme cresce, ganha a cor
     forte da headline ("Toda a sua operação...") e se centraliza. */
  const leadColor = mixHex('#5F6773', '#14171A', grow)
  /* A frase cresce pelo font-size (vetor, sempre nítido). O translate que a
     leva até o centro é aplicado no próprio nó, num efeito de layout, porque
     ele depende da caixa JÁ com o tamanho novo — calcular aqui usaria a
     medida do quadro anterior e a frase chegaria torta ao centro. */
  /* A largura cresce no MESMO fator da fonte. É isso que impede as palavras
     de mudarem de linha enquanto a frase aumenta: se só a fonte crescesse,
     caberia menos texto por linha a cada quadro e o parágrafo se remontaria
     debaixo do olho de quem está lendo. Crescendo os dois juntos, o número de
     caracteres por linha é o mesmo do começo ao fim — o mesmo efeito de um
     scale(), sem a rasterização que borrava o texto. */
  const fator = 1 + (leadTarget.fator - 1) * grow
  const leadStyle = reduced
    ? undefined
    : {
        fontSize: `${(leadTarget.base * fator).toFixed(2)}px`,
        /* LARGURA, não max-width. O parágrafo mora na coluna da direita, que
           tem uns 500px: um max-width maior que isso não faz efeito nenhum,
           porque quem manda é a coluna — a frase continuava presa na largura
           antiga e, com a fonte crescendo, cabia menos texto por linha e as
           linhas se remontavam no meio da leitura (4 viravam 7).

           Com width explícito ela passa por cima da coluna e transborda, o
           que aqui é o certo: ela está sendo levada para o centro do palco,
           não sendo lida dentro da coluna. Como largura e fonte crescem no
           mesmo fator, cada linha guarda exatamente as mesmas palavras do
           começo ao fim. */
        width: leadTarget.largura
          ? `${(leadTarget.largura * fator).toFixed(1)}px`
          : undefined,
        maxWidth: 'none' as const,
        position: 'relative' as const,
        zIndex: 30,
        color: leadColor,
        textAlign: centra > 0.04 ? ('center' as const) : ('left' as const),
      }

  /* Saída do campo: 1ª fita sai pela esquerda, 2ª pela direita, as de baixo
     descem — em vez de tudo descer junto. */
  const fieldW = grid.cols * grid.size
  const exitFor = (row: number) => {
    if (reduced) return 'none'
    if (row === 0) return `translate3d(${-out * fieldW * 1.15}px, 0, 0)`
    if (row === 1) return `translate3d(${out * fieldW * 1.15}px, 0, 0)`
    return `translate3d(0, ${out * grid.size * 5}px, 0)`
  }

  const fieldStyle = reduced
    ? undefined
    : {
        opacity: Math.max(0, 1 - out * 0.55),
        willChange: 'transform, opacity',
      }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="cxa-section relative"
      style={reduced ? undefined : { minHeight: '200vh' }}
    >
      <div
        ref={stageRef}
        className={
          reduced
            ? 'relative flex flex-col pt-10'
            : 'sticky top-16 flex h-[calc(100svh-4rem)] flex-col overflow-hidden'
        }
        /* O palco encolhe conforme a frase termina de crescer. Ele continua
           preso no topo — a frase não se mexe —, mas passa a ocupar menos que
           a tela inteira, e o que sobra embaixo é por onde a caixa do Max
           sobe. Ela entra, encosta na frase, e só então a rolagem leva as
           duas juntas: é o que acontece quando o fim da seção alcança o
           palco e o sticky solta. Sem isso ficava uma tela inteira de vazio
           entre a frase e a caixa. */
        style={
          reduced
            ? undefined
            : { height: `calc(100svh - 4rem - ${(grow * 34).toFixed(1)}svh)` }
        }
      >
        {/* Topo: headline à esquerda | apoio + CTAs à direita */}
        <div className="cxa-shell grid min-h-0 flex-1 grid-cols-1 items-center lg:grid-cols-2">
          <div
            className="flex flex-col justify-center py-6 lg:py-0 lg:pr-12"
            style={leftStyle}
          >
            <span className="cxa-eyebrow">{t.hero.eyebrow}</span>
            {/* As quebras da manchete são escolhidas na copy (headlineLines),
                não pelo navegador: cada linha vem com whitespace-nowrap para
                não rebentar numa quarta linha quando a coluna aperta. O corpo
                cai para 62px no desktop porque é o tamanho em que a linha
                mais longa ainda cabe na metade da grade. */}
            <h1 className="cxa-headline mt-4 text-[34px] text-[var(--cxa-ink)] sm:text-[48px] lg:mt-5 lg:text-[62px]">
              {t.hero.headlineLines.map((line, i) => (
                <span key={line} className="lg:whitespace-nowrap">
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>
          </div>

          <div className="flex flex-col justify-center gap-5 border-[var(--cxa-hairline)] pb-6 lg:gap-6 lg:border-l lg:py-0 lg:pl-12">
            {/* ESTA é a frase que cresce até o centro no scroll (não some
                nem é trocada por outra) — por isso tem transform próprio. */}
            <p
              ref={leadRef}
              className="max-w-[30ch] font-medium text-[17px] leading-[1.35] tracking-[-0.01em] sm:max-w-[42ch] sm:font-normal sm:text-[16px] sm:leading-[1.6] sm:tracking-normal"
              style={leadStyle}
            >
              {t.hero.lead}
            </p>

            <div
              className="flex flex-wrap items-center gap-3"
              style={rightStyle}
            >
              <a
                href={ALLHUB_TRIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cxa-pill-gradient"
              >
                {t.hero.ctaPrimary}
              </a>
              <a href="#modulos" className="cxa-pill-outline">
                {t.hero.ctaSecondary}
              </a>
            </div>

            {/* Círculos do app — mesma linguagem da sidebar do Clickmax.
                Só a partir de lg: em telas curtas o palco sticky não comporta
                a coluna inteira e o conteúdo seria cortado. */}
            <div
              className="hidden flex-wrap items-start gap-4 lg:flex"
              style={rightStyle}
            >
              {CIRCLES.map(({ id, icon }, i) => {
                const Icon = CX_ICONS[icon]
                const label = t.moduleLabels[id]
                return (
                  <div
                    key={id}
                    className="flex w-[62px] flex-col items-center gap-1.5"
                  >
                    <span
                      className="cxa-circle"
                      data-active={i === 0 ? 'true' : 'false'}
                      aria-hidden
                    >
                      <Icon size={20} />
                    </span>
                    <span className="cxa-circle-label">{label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Metade de baixo: campo de features que se remonta sozinho.
            Sem fio em cima: o campo já se separa do texto pelo próprio
            desenho (fileira de cartões com respiro), e o hairline atravessando
            a tela inteira lia como borda de tabela — não como divisão de
            seção. */}
        <div className="relative z-10 shrink-0" style={fieldStyle}>
          <div
            ref={fieldRef}
            className="relative h-[26vh] overflow-hidden px-3 pt-3 sm:px-4 sm:pt-4 lg:h-[38vh]"
          >
            {cells.map((cell, i) => {
              const Icon = cell.icon ? CX_ICONS[cell.icon] : null
              const slot = slots[i] ?? i
              const col = slot % grid.cols
              const row = Math.floor(slot / grid.cols)
              const Tag = cell.to ? 'a' : 'div'
              return (
                /* wrapper = posição do slot (transição do embaralhamento);
                   interno = saída no scroll (sem transição, colado no scroll) */
                <div
                  key={cell.id}
                  className="absolute top-0 left-0"
                  style={{
                    width: grid.size - 6,
                    height: grid.size - 6,
                    transform: `translate3d(${col * grid.size}px, ${row * grid.size}px, 0)`,
                    transition: reduced
                      ? undefined
                      : 'transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
                    willChange: reduced ? undefined : 'transform',
                  }}
                >
                  <Tag
                    {...(cell.to
                      ? { href: `#${cell.to}`, title: cell.label }
                      : { 'aria-hidden': true })}
                    className="cxa-cell h-full w-full"
                    data-neutral={cell.neutral ? '1' : '0'}
                    style={{
                      background: cell.color,
                      transform: exitFor(row),
                      willChange: reduced ? undefined : 'transform',
                    }}
                  >
                    {Icon ? (
                      <Icon size={16} className="text-[var(--cxa-icon)]" />
                    ) : (
                      <span />
                    )}
                    {cell.label && (
                      <span className="cxa-cell-label">{cell.label}</span>
                    )}
                  </Tag>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
