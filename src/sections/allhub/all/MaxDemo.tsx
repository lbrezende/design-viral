import {
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  CircleAlert,
  Cog,
  Loader2,
  type LucideIcon,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react'
import {
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  EXTRA_TASKS,
  EXTRA_TASKS_EN,
  EXTRA_TASKS_ES,
  PREFILLED_PROMPT_EN,
  PREFILLED_PROMPT_ES,
  PREFILLED_PROMPT_PT,
  STREAM,
  STREAM_EN,
  STREAM_ES,
  type StreamStepType,
  TOP_TASKS,
  TOP_TASKS_EN,
  TOP_TASKS_ES,
  type WeeklyTask,
} from '@/sections/max/weekly-data'
import { copyFor, type HubCopy, type Lang } from '../i18n'
import { CX_APP, usePrefersReducedMotion } from './CxAppUI'

/* A demonstração do Max dentro do hub.
 *
 * O gatilho é a mesma conversa que existe no /max: pergunta já escrita, botão
 * que dispara. O que muda é PARA ONDE ela abre: aqui a resposta entra num
 * painel lateral, não numa tela cheia. É a anatomia do painel do Max de
 * dentro do produto, vestida com os tokens claros do hub, porque a promessa da
 * página é "a IA opera a plataforma" e ver o painel do produto vale mais que
 * ver uma tela de marketing sobre ele.
 *
 * O conteúdo (as 3 melhores ações e os sinais) e a SEQUÊNCIA em que ele chega
 * vêm de weekly-data.ts, o mesmo arquivo que alimenta a seção do /max. Uma
 * fonte só: os dois lugares tocam a mesma resposta.
 *
 * A resposta não chega de uma vez: cada sonda roda, vira "Concluído" e só
 * então o bloco que ela produziu se revela. Isso não é enfeite, é o que a
 * página está afirmando, que a IA VARRE a base antes de responder. Em
 * prefers-reduced-motion o painel já abre com tudo pronto e nenhum tempo roda.
 */

/* Ângulos por onde a setinha entra, um por volta. Ela sempre APONTA para o
   botão, que está à direita dela: o giro é o balanço da mão, não a direção.
   Números escolhidos para o gesto ficar vivo sem virar hélice. */
const GIROS_DA_SETA = [0, -18, 12, -8, 22, -26]

/* O intervalo entre uma volta e outra. A animação dura 1500ms, então sobra um
   respiro antes de a próxima começar: seta que pisca sem parar vira ruído e o
   olho aprende a ignorar. */
const PAUSA_DA_SETA = 2600

/** Cada idioma com o seu conteúdo: pergunta, sondas e cartões. */
function dadosPara(lang: Lang) {
  if (lang === 'en') {
    return {
      pergunta: PREFILLED_PROMPT_EN,
      top: TOP_TASKS_EN,
      extras: EXTRA_TASKS_EN,
      sequencia: STREAM_EN,
    }
  }
  if (lang === 'es') {
    return {
      pergunta: PREFILLED_PROMPT_ES,
      top: TOP_TASKS_ES,
      extras: EXTRA_TASKS_ES,
      sequencia: STREAM_ES,
    }
  }
  return {
    pergunta: PREFILLED_PROMPT_PT,
    top: TOP_TASKS,
    extras: EXTRA_TASKS,
    sequencia: STREAM,
  }
}

/* A setinha que chama o clique.
 *
 * O cartão parece leitura, não convite: sem alguém apontando, a pessoa lê a
 * pergunta e rola a página. Cada volta entra por um ângulo diferente para o
 * olho não acostumar e parar de ver.
 *
 * Ela é decorativa de propósito (aria-hidden): quem usa leitor de tela já
 * recebe o botão com rótulo próprio, e anunciar uma seta piscando só atrapalha.
 * Some no instante em que o painel abre, porque aí ela não tem mais trabalho.
 */
function SetaQueAponta({ ativa }: { ativa: boolean }) {
  const reduced = usePrefersReducedMotion()
  const [volta, setVolta] = useState(0)

  useEffect(() => {
    if (!ativa || reduced) return
    const relogio = setInterval(() => setVolta(v => v + 1), PAUSA_DA_SETA)
    return () => clearInterval(relogio)
  }, [ativa, reduced])

  if (!ativa) return null

  return (
    <span
      aria-hidden="true"
      // `key` na volta: remontar é o que faz a animação rodar de novo, e é
      // também o que troca o ângulo de entrada.
      key={volta}
      className="cxa-seta pointer-events-none absolute right-full mr-2 hidden sm:block"
      style={
        {
          color: volta % 2 === 0 ? CX_APP.teal : CX_APP.green,
          '--seta-giro': `${GIROS_DA_SETA[volta % GIROS_DA_SETA.length]}deg`,
        } as React.CSSProperties
      }
    >
      <ArrowRight size={26} strokeWidth={2.4} />
    </span>
  )
}

/* A seção do Max prende a caixa no meio da tela e entrega a rolagem para os
   exemplos.

   Quem chega aqui vinha rolando depressa e passava reto: a caixa aparecia,
   sumia, e a pessoa nunca lia o que dá pra pedir. Agora a seção tem trilho
   próprio — a caixa fica presa no centro enquanto a rolagem move os exemplos,
   que sobem e desaparecem por baixo dela. Quando o último passa, o trilho
   acaba e a página volta a rolar normalmente.

   O tamanho do trilho é o tempo de contato: 260vh dá cerca de duas telas e
   meia de rolagem parada na caixa — o suficiente para ler os seis exemplos
   sem virar sequestro de rolagem. */
const TRILHO_DO_MAX = '260vh'

/* Altura de cada exemplo (pílula + respiro) e quantos ficam visíveis na
   janela. São medidas fixas porque a fita é movida em pixels: derivar do DOM
   a cada quadro custaria layout e o número não muda. */
const ALTURA_DO_EXEMPLO = 42
const EXEMPLOS_VISIVEIS = 3

const trava01 = (v: number) => Math.min(1, Math.max(0, v))
const faixa = (v: number, a: number, b: number) => trava01((v - a) / (b - a))

/** Progresso 0→1 da seção enquanto o trilho passa pela tela. */
function useProgressoDoTrilho(reduced: boolean) {
  const ref = useRef<HTMLElement>(null)
  const quadro = useRef<number | null>(null)
  const [progresso, setProgresso] = useState(reduced ? 1 : 0)

  useEffect(() => {
    if (reduced) {
      setProgresso(1)
      return
    }
    const calcula = () => {
      quadro.current = null
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      // trilho útil = altura da seção menos a tela que fica presa
      const curso = Math.max(1, r.height - window.innerHeight)
      setProgresso(trava01(-r.top / curso))
    }
    const aoRolar = () => {
      if (quadro.current) return
      quadro.current = requestAnimationFrame(calcula)
    }
    calcula()
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('resize', aoRolar)
    return () => {
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('resize', aoRolar)
      if (quadro.current) cancelAnimationFrame(quadro.current)
    }
  }, [reduced])

  return { ref, progresso }
}

/* Os exemplos do que dá pra pedir, subindo por baixo da caixa.

   Eles existem porque o campo sozinho não ensina o alcance: quem chega lê UMA
   pergunta sobre dinheiro parado e conclui que a IA só faz relatório. Passando
   um a um, a mesma área mostra funil, automação, recuperação, área de membros
   e pipeline sem ocupar meia tela.

   A fita inteira fica no HTML e só o recorte visível muda, então quem lê por
   leitor de tela recebe os seis de uma vez — que é a leitura melhor. A máscara
   no topo é o que faz o exemplo sumir POR BAIXO da caixa, em vez de ser
   cortado por uma borda dura. */
function ExemplosQueSobem({
  exemplos,
  progresso,
  reduced,
}: {
  exemplos: readonly string[]
  progresso: number
  reduced: boolean
}) {
  const janela = ALTURA_DO_EXEMPLO * EXEMPLOS_VISIVEIS
  const total = ALTURA_DO_EXEMPLO * exemplos.length
  const curso = Math.max(0, total - janela)
  /* A fita só começa a andar depois que a caixa assentou, e para antes do fim
     do trilho — o resto é o respiro antes de a página soltar. */
  const andado = faixa(progresso, 0.16, 0.86) * curso

  if (reduced) {
    return (
      <ul className="mt-4 flex flex-wrap justify-center gap-2">
        {exemplos.map(texto => (
          <li key={texto}>
            <Exemplo texto={texto} />
          </li>
        ))}
      </ul>
    )
  }

  const mascara = 'linear-gradient(180deg, transparent 0%, #000 24%, #000 100%)'

  return (
    <div
      className="mx-auto mt-3 overflow-hidden"
      style={{
        height: janela,
        maskImage: mascara,
        WebkitMaskImage: mascara,
      }}
    >
      <ul
        className="flex flex-col items-center"
        style={{ transform: `translate3d(0, ${-andado.toFixed(1)}px, 0)` }}
      >
        {exemplos.map(texto => (
          <li
            key={texto}
            className="flex shrink-0 items-center"
            style={{ height: ALTURA_DO_EXEMPLO }}
          >
            <Exemplo texto={texto} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function Exemplo({ texto }: { texto: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px]"
      style={{
        borderColor: CX_APP.hairline,
        background: CX_APP.surface,
        color: CX_APP.inkSoft,
      }}
    >
      <Sparkles aria-hidden="true" size={12} style={{ color: CX_APP.teal }} />
      {texto}
    </span>
  )
}

/* As tintas de acento do painel.
 *
 * O teal e o verde do design system (CX_APP.teal, CX_APP.green) são cores de
 * SUPERFÍCIE: brilham em degradê e em bolinha, mas ficam perto de 1.8:1 como
 * texto sobre branco. Onde a mesma informação precisa ser LIDA (rótulo do
 * número grande, valor em dinheiro, selos) entra a versão escura da mesma
 * família, que passa 4.5:1 sobre papel. */
const TEAL_ESCURO = '#0F6E64'
const VERDE_ESCURO = '#177245'
const AMBAR_ESCURO = '#875200'
const VERMELHO_ESCURO = '#B3261E'
const AZUL_ESCURO = '#0B5FAE'

/** Fundo do painel para blocos que precisam se destacar do papel branco. */
const PAPEL_FRIO = '#F7F8F9'

/* Os selos de status dos cartões.
 *
 * A referência é escura e usa rose/sky/amber/emerald em tinta CLARA. Aqui o
 * fundo é papel branco, então a mesma família de cor aparece na versão escura.
 * O ícone anda junto da cor porque cor sozinha não é sinal para quem não
 * distingue matiz.
 */
const SELO_DO_STATUS: Record<
  WeeklyTask['status'],
  {
    tinta: string
    chave: keyof HubCopy['maxDemo']['painel']['status']
    Icone: LucideIcon
  }
> = {
  urgent: { tinta: VERMELHO_ESCURO, chave: 'urgente', Icone: CircleAlert },
  opportunity: { tinta: AZUL_ESCURO, chave: 'oportunidade', Icone: TrendingUp },
  warning: { tinta: AMBAR_ESCURO, chave: 'atencao', Icone: AlertTriangle },
  ready: { tinta: VERDE_ESCURO, chave: 'pronto', Icone: CheckCircle2 },
}

export function MaxDemo({ lang = 'pt' }: { lang?: Lang }) {
  const t = copyFor(lang)
  const reduced = usePrefersReducedMotion()
  const [aberto, setAberto] = useState(false)
  const { pergunta } = dadosPara(lang)
  const { ref: trilhoRef, progresso } = useProgressoDoTrilho(reduced)

  /* A caixa entra vindo de baixo e ganhando corpo: é a rolagem que revela
     ela, em vez de ela já estar pronta quando a seção chega. Assenta rápido
     (18% do trilho) porque o resto do curso pertence aos exemplos. */
  const entrada = faixa(progresso, 0, 0.18)
  const estiloDaCaixa = reduced
    ? undefined
    : {
        opacity: 0.25 + entrada * 0.75,
        transform: `translate3d(0, ${((1 - entrada) * 48).toFixed(1)}px, 0)`,
        willChange: 'transform, opacity',
      }

  return (
    <section
      ref={trilhoRef}
      id="max-demo"
      style={{
        background: CX_APP.bg,
        ...(reduced ? {} : { minHeight: TRILHO_DO_MAX }),
      }}
    >
      {/* O palco fica preso no centro da tela enquanto o trilho passa: é o
          que dá tempo de contato com a caixa antes de a página seguir. */}
      <div
        className={
          reduced
            ? 'cxa-shell pt-0 pb-16 sm:pb-20'
            : 'cxa-shell sticky top-0 flex min-h-svh flex-col justify-center py-10'
        }
      >
        {/* Sem rótulo e sem título aqui de propósito: a frase-manifesto logo
            acima já disse o que a IA faz, e repetir a promessa em forma de
            headline empurraria o campo pra fora da tela. O que a pessoa
            precisa ver depois de ler a frase é o campo, não outro texto. */}
        {/* Sem <Reveal> aqui: a entrada da caixa agora vem da rolagem, e os
            dois gatilhos brigavam — o Reveal trava opacity 1 assim que a seção
            entra em cena, o que apagava a transparência de entrada. */}
        <div className="mx-auto w-full max-w-[720px]" style={estiloDaCaixa}>
          <div
            className="overflow-hidden rounded-[18px] border"
            style={{
              borderColor: CX_APP.hairline,
              background: CX_APP.surface,
              boxShadow: CX_APP.shadow,
            }}
          >
            <div
              className="flex items-center gap-2 border-b px-4 py-3"
              style={{ borderColor: CX_APP.hairline }}
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full"
                style={{ background: CX_APP.teal }}
              />
              <span
                className="font-medium text-[13px]"
                style={{ color: CX_APP.ink }}
              >
                {t.maxDemo.painel.titulo}
              </span>
              <span className="text-[13px]" style={{ color: CX_APP.inkSoft }}>
                · {t.maxDemo.modulo}
              </span>
            </div>

            <div className="px-4 py-4 sm:px-5">
              <p className="text-[12px]" style={{ color: CX_APP.inkSoft }}>
                {t.maxDemo.autor}
              </p>

              <div
                className="mt-2 rounded-[12px] border px-4 py-3.5 text-left text-[15px] leading-[1.5]"
                style={{
                  borderColor: CX_APP.hairline,
                  background: '#F7F8F9',
                  color: CX_APP.ink,
                }}
              >
                {pergunta}
              </div>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span
                  className="flex items-center gap-2 text-[13px]"
                  style={{ color: CX_APP.inkSoft }}
                >
                  <Sparkles aria-hidden="true" size={14} />
                  {t.maxDemo.dica}
                </span>

                <span className="relative flex items-center max-sm:w-full">
                  <SetaQueAponta ativa={!aberto} />

                  <button
                    type="button"
                    onClick={() => setAberto(true)}
                    className="cxa-pill-gradient justify-center max-sm:w-full"
                  >
                    {t.maxDemo.acao}
                    <ArrowUp aria-hidden="true" size={16} />
                  </button>
                </span>
              </div>
            </div>
          </div>

          <ExemplosQueSobem
            exemplos={t.maxDemo.exemplos}
            progresso={progresso}
            reduced={reduced}
          />
        </div>
      </div>

      <PainelDoMax
        aberto={aberto}
        aoFechar={() => setAberto(false)}
        lang={lang}
        reduced={reduced}
      />
    </section>
  )
}

/** Estados possíveis de uma sonda dentro da sequência. */
type EstadoDaSonda = 'loading' | 'done'

/** O bloco de textos do painel, tal como vem do i18n. */
type CopyDoPainel = HubCopy['maxDemo']['painel']

function PainelDoMax({
  aberto,
  aoFechar,
  lang,
  reduced,
}: {
  aberto: boolean
  aoFechar: () => void
  lang: Lang
  reduced: boolean
}) {
  const t = copyFor(lang)
  const copy = t.maxDemo.painel
  const { pergunta, top, extras, sequencia } = dadosPara(lang)
  const idTitulo = useId()

  const [etapa, setEtapa] = useState(-1)
  const refFechar = useRef<HTMLButtonElement>(null)
  const refPainel = useRef<HTMLDivElement>(null)
  const refRolagem = useRef<HTMLDivElement>(null)
  const focoAnterior = useRef<HTMLElement | null>(null)
  const acompanhaOFim = useRef(true)

  /* Onde a sequência começa. Em movimento reduzido ela nasce no ÚLTIMO passo:
     a resposta inteira já está na tela e nenhum relógio chega a existir.
     Fechar volta para -1 porque quem reabre veio ver a varredura, não o
     resultado dela. */
  useEffect(() => {
    if (!aberto) {
      setEtapa(-1)
      return
    }
    acompanhaOFim.current = true
    setEtapa(reduced ? sequencia.length - 1 : 0)
  }, [aberto, reduced, sequencia])

  /* O avanço: um timeout por passo, limpo antes do próximo e no desmonte.
     Sem essa limpeza, fechar o painel no meio da varredura deixaria a
     sequência correndo contra um componente que já saiu da tela. */
  useEffect(() => {
    if (!aberto || reduced) return
    if (etapa < 0 || etapa >= sequencia.length - 1) return
    const relogio = window.setTimeout(
      () => setEtapa(atual => atual + 1),
      sequencia[etapa].duration,
    )
    return () => window.clearTimeout(relogio)
  }, [aberto, reduced, etapa, sequencia])

  /* Quem manda na caixa: quem lê ou a resposta que está chegando.
     Só GESTO humano solta a caixa do fim. Medir pelo evento 'scroll' seria
     mais curto e estaria errado: a rolagem automática também dispara
     'scroll', e a caixa se soltaria sozinha. Voltar ao rodapé reata. */
  useEffect(() => {
    if (!aberto) return
    const caixa = refRolagem.current
    if (!caixa) return

    function aoGesto() {
      if (!caixa) return
      const distanciaDoFim =
        caixa.scrollHeight - caixa.scrollTop - caixa.clientHeight
      acompanhaOFim.current = distanciaDoFim < 48
    }

    caixa.addEventListener('wheel', aoGesto, { passive: true })
    caixa.addEventListener('touchmove', aoGesto, { passive: true })
    return () => {
      caixa.removeEventListener('wheel', aoGesto)
      caixa.removeEventListener('touchmove', aoGesto)
    }
  }, [aberto])

  /* A resposta cresce para baixo e a caixa acompanha, para que o bloco recém
     chegado seja o que está na tela. Quem rolou para cima para reler um
     cartão fica onde parou. */
  useEffect(() => {
    if (!aberto || etapa < 0) return
    if (!acompanhaOFim.current) return
    const caixa = refRolagem.current
    if (!caixa) return
    caixa.scrollTo({
      top: caixa.scrollHeight,
      behavior: reduced ? 'auto' : 'smooth',
    })
  }, [aberto, etapa, reduced])

  /* Foco presa dentro do painel, Esc fecha, e o foco volta para o botão que
     abriu. É a mesma fiação de qualquer diálogo: sem ela, quem usa teclado
     continua navegando a página atrás de um painel que cobre a tela. */
  useEffect(() => {
    if (!aberto) return
    focoAnterior.current = document.activeElement as HTMLElement | null
    const quadro = requestAnimationFrame(() => refFechar.current?.focus())

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        aoFechar()
        return
      }
      if (evento.key !== 'Tab') return

      const alvos = refPainel.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      if (!alvos || alvos.length === 0) return
      const primeiro = alvos[0]
      const ultimo = alvos[alvos.length - 1]

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primeiro.focus()
      }
    }

    document.addEventListener('keydown', aoTeclar)
    const rolagemAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      cancelAnimationFrame(quadro)
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = rolagemAnterior
      focoAnterior.current?.focus()
    }
  }, [aberto, aoFechar])

  /* Em que pé está cada sonda no passo atual. Reconstruído a partir da
     sequência (e não guardado em estado) para que reabrir o painel não possa
     herdar sondas concluídas de uma execução anterior. */
  const sondas = useMemo(() => {
    const mapa: Record<string, EstadoDaSonda> = {}
    for (let i = 0; i <= etapa; i++) {
      const passo = sequencia[i]
      if (!passo?.toolId) continue
      if (passo.type === 'tool') mapa[passo.toolId] = 'loading'
      if (passo.type === 'tool-done') mapa[passo.toolId] = 'done'
    }
    return mapa
  }, [etapa, sequencia])

  const rotuloDaSonda = (id: string) =>
    sequencia.find(passo => passo.toolId === id && passo.type === 'tool')
      ?.label ?? ''

  const chegou = (tipo: StreamStepType) =>
    sequencia.slice(0, etapa + 1).some(passo => passo.type === tipo)

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Área de toque para fechar. Fora da árvore de acessibilidade porque o
          botão de fechar e o Esc já cobrem quem não usa ponteiro. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={aoFechar}
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{ background: 'rgba(20, 23, 26, 0.28)' }}
      />

      <div
        ref={refPainel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        className="absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col border-l"
        style={{
          borderColor: CX_APP.hairline,
          background: CX_APP.surface,
          animation: reduced
            ? undefined
            : 'cxa-painel-entra 260ms cubic-bezier(.4,0,.2,1)',
        }}
      >
        <header
          className="flex shrink-0 items-start gap-3 border-b px-5 py-4"
          style={{ borderColor: CX_APP.hairline }}
        >
          <span
            aria-hidden="true"
            className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px]"
            style={{ background: CX_APP.accent, color: CX_APP.ink }}
          >
            <Sparkles size={17} />
          </span>

          <span className="min-w-0 flex-1">
            <span
              id={idTitulo}
              className="block font-semibold text-[17px]"
              style={{ color: CX_APP.ink }}
            >
              {copy.titulo}
            </span>
            <span
              className="block text-[13px]"
              style={{ color: CX_APP.inkSoft }}
            >
              {copy.subtitulo}
            </span>
          </span>

          <button
            ref={refFechar}
            type="button"
            onClick={aoFechar}
            aria-label={copy.fechar}
            className="flex size-9 shrink-0 items-center justify-center rounded-full transition-colors"
            style={{ color: CX_APP.inkSoft }}
          >
            <X aria-hidden="true" size={18} />
          </button>
        </header>

        <div
          className="flex shrink-0 items-center justify-between gap-3 border-b px-5 py-2.5"
          style={{ borderColor: CX_APP.hairline }}
        >
          <span className="text-[13px]" style={{ color: CX_APP.teal }}>
            {copy.voltar}
          </span>
          <span
            className="flex items-center gap-2 text-[11px] tracking-wide"
            style={{ color: CX_APP.inkSoft }}
          >
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full"
              style={{ background: CX_APP.green }}
            />
            {copy.squad}
          </span>
        </div>

        <p
          className="shrink-0 border-b px-5 py-2 text-[12px]"
          style={{
            borderColor: CX_APP.hairline,
            background: PAPEL_FRIO,
            color: CX_APP.inkSoft,
          }}
        >
          {copy.trilha}
        </p>

        <div
          ref={refRolagem}
          className="min-h-0 flex-1 overflow-y-auto px-5 py-5"
        >
          <p className="text-[12px]" style={{ color: CX_APP.inkSoft }}>
            {t.maxDemo.autor}
          </p>
          <p
            className="mt-1 text-[15px] leading-[1.5]"
            style={{ color: CX_APP.ink }}
          >
            {pergunta}
          </p>

          <p
            className="mt-5 flex items-center gap-1.5 font-semibold text-[12px]"
            style={{ color: CX_APP.inkSoft }}
          >
            <Sparkles aria-hidden="true" size={13} />
            {copy.marca}
          </p>

          {/* A resposta, na ordem em que a sequência entrega. Cada sonda
              aparece buscando, vira concluída, e só então o bloco que ela
              produziu entra: é essa alternância que mostra que houve
              varredura, e não um texto pronto esperando o clique. */}
          <div className="mt-2 flex flex-col gap-3">
            {sondas.main ? (
              <PilulaDeFerramenta
                rotulo={rotuloDaSonda('main')}
                estado={sondas.main}
                copy={copy}
              />
            ) : null}

            {chegou('greeting') ? (
              <Revela>
                <p
                  className="font-semibold text-[14px] leading-[1.5]"
                  style={{ color: CX_APP.ink }}
                >
                  {copy.saudacao}
                </p>
              </Revela>
            ) : null}

            {chegou('money') ? (
              <Revela>
                <NumeroGrande copy={copy} />
              </Revela>
            ) : null}

            {chegou('section-top') ? (
              <Revela>
                <TituloDeSecao
                  titulo={copy.tituloTop}
                  apoio={copy.subtituloTop}
                />
              </Revela>
            ) : null}

            {sondas.s1 ? (
              <PilulaDeFerramenta
                rotulo={rotuloDaSonda('s1')}
                estado={sondas.s1}
                copy={copy}
              />
            ) : null}
            {chegou('play-1') ? (
              <Revela>
                <CartaoTarefa tarefa={top[0]} principal copy={copy} />
              </Revela>
            ) : null}

            {sondas.s2 ? (
              <PilulaDeFerramenta
                rotulo={rotuloDaSonda('s2')}
                estado={sondas.s2}
                copy={copy}
              />
            ) : null}
            {chegou('play-2') ? (
              <Revela>
                <CartaoTarefa tarefa={top[1]} principal copy={copy} />
              </Revela>
            ) : null}

            {sondas.s3 ? (
              <PilulaDeFerramenta
                rotulo={rotuloDaSonda('s3')}
                estado={sondas.s3}
                copy={copy}
              />
            ) : null}
            {chegou('play-3') ? (
              <Revela>
                <CartaoTarefa tarefa={top[2]} principal copy={copy} />
              </Revela>
            ) : null}

            {chegou('section-signals') ? (
              <Revela>
                <TituloDeSecao titulo={copy.tituloSinais} />
              </Revela>
            ) : null}

            {sondas.se ? (
              <PilulaDeFerramenta
                rotulo={rotuloDaSonda('se')}
                estado={sondas.se}
                copy={copy}
              />
            ) : null}
            {chegou('task-emergency') ? (
              <Revela>
                <CartaoTarefa tarefa={extras[0]} copy={copy} />
              </Revela>
            ) : null}

            {sondas.so ? (
              <PilulaDeFerramenta
                rotulo={rotuloDaSonda('so')}
                estado={sondas.so}
                copy={copy}
              />
            ) : null}
            {chegou('task-opportunity') ? (
              <Revela>
                <CartaoTarefa tarefa={extras[1]} copy={copy} />
              </Revela>
            ) : null}

            {sondas.sl ? (
              <PilulaDeFerramenta
                rotulo={rotuloDaSonda('sl')}
                estado={sondas.sl}
                copy={copy}
              />
            ) : null}
            {chegou('task-leak') ? (
              <Revela>
                <CartaoTarefa tarefa={extras[2]} copy={copy} />
              </Revela>
            ) : null}

            {chegou('cta') ? (
              <Revela>
                <Fechamento copy={copy} />
              </Revela>
            ) : null}
          </div>
        </div>

        <footer
          className="shrink-0 border-t px-5 py-4"
          style={{ borderColor: CX_APP.hairline }}
        >
          <div
            className="flex items-center gap-3 rounded-[12px] border px-3.5 py-3"
            style={{ borderColor: CX_APP.hairline, background: PAPEL_FRIO }}
          >
            <span
              className="min-w-0 flex-1 truncate text-[13px]"
              style={{ color: CX_APP.inkSoft }}
            >
              {copy.placeholder}
            </span>
            <span
              aria-hidden="true"
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-[12px]"
              style={{ background: CX_APP.accent, color: CX_APP.ink }}
            >
              {copy.enviar}
            </span>
          </div>
          <p className="mt-2 text-[12px]" style={{ color: CX_APP.inkSoft }}>
            {copy.nota}
          </p>
        </footer>
      </div>
    </div>
  )
}

/* Cada bloco da resposta entra com opacidade e um deslocamento vertical curto.
   Curto de propósito: o que precisa ficar legível é a ORDEM de chegada, e um
   salto grande transformaria a leitura numa fila de coisas pulando. */
function Revela({ children }: { children: ReactNode }) {
  return <div className="cxa-revela">{children}</div>
}

function PilulaDeFerramenta({
  rotulo,
  estado,
  copy,
}: {
  rotulo: string
  estado: EstadoDaSonda
  copy: CopyDoPainel
}) {
  const buscando = estado === 'loading'

  return (
    <div
      className="cxa-revela flex items-center justify-between gap-3 rounded-[12px] border px-3.5 py-2.5"
      style={{ borderColor: CX_APP.hairline, background: PAPEL_FRIO }}
    >
      <span
        className="flex min-w-0 items-center gap-2 text-[13px]"
        style={{ color: CX_APP.ink }}
      >
        {buscando ? (
          <Loader2
            aria-hidden="true"
            size={14}
            className="shrink-0 animate-spin"
            style={{ color: TEAL_ESCURO }}
          />
        ) : (
          <Cog
            aria-hidden="true"
            size={14}
            className="shrink-0"
            style={{ color: CX_APP.inkSoft }}
          />
        )}
        <span className="truncate font-medium">{rotulo}</span>
      </span>

      {/* `<output>` em vez de um span com role="status": é o elemento que já
          nasce como região viva, e a troca de "Buscando" para "Concluído"
          acontece sozinha, sem ninguém clicar. */}
      <output
        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 font-medium text-[11px] ${
          buscando ? '' : 'cxa-selo-conclui'
        }`}
        style={{
          borderColor: buscando ? `${AMBAR_ESCURO}40` : `${VERDE_ESCURO}40`,
          background: buscando ? `${AMBAR_ESCURO}14` : `${VERDE_ESCURO}14`,
          color: buscando ? AMBAR_ESCURO : VERDE_ESCURO,
        }}
      >
        {buscando ? (
          <>
            <span
              aria-hidden="true"
              className="cxa-pulsa size-1.5 rounded-full"
              style={{ background: AMBAR_ESCURO }}
            />
            {copy.buscando}
          </>
        ) : (
          <>
            <Check aria-hidden="true" size={11} />
            {copy.concluido}
          </>
        )}
      </output>
    </div>
  )
}

/* O número grande. Na referência ele é degradê sobre preto; aqui o degradê
   teal → lima sobre papel branco ficaria ilegível na ponta lima, então o valor
   é tinta cheia e quem carrega o acento é a moldura do cartão. */
function NumeroGrande({ copy }: { copy: CopyDoPainel }) {
  return (
    <div
      className="rounded-[12px] border px-5 py-5"
      style={{
        borderColor: `${CX_APP.teal}80`,
        background: `linear-gradient(135deg, ${CX_APP.teal}24, transparent 70%)`,
      }}
    >
      <p
        className="font-semibold text-[11px] uppercase tracking-[0.12em]"
        style={{ color: TEAL_ESCURO }}
      >
        {copy.dinheiroRotulo}
      </p>
      <p
        className="mt-2 font-bold text-[40px] tabular-nums leading-none sm:text-[48px]"
        style={{ color: CX_APP.ink }}
      >
        {copy.dinheiroValor}
      </p>
      <p className="mt-2 text-[13px]" style={{ color: CX_APP.inkSoft }}>
        {copy.dinheiroApoio}
      </p>
    </div>
  )
}

function TituloDeSecao({ titulo, apoio }: { titulo: string; apoio?: string }) {
  return (
    <div>
      <h3 className="font-semibold text-[13px]" style={{ color: CX_APP.ink }}>
        {titulo}
      </h3>
      {apoio ? (
        <p className="mt-0.5 text-[11px]" style={{ color: CX_APP.inkSoft }}>
          {apoio}
        </p>
      ) : null}
    </div>
  )
}

function CartaoTarefa({
  tarefa,
  principal = false,
  copy,
}: {
  tarefa: WeeklyTask
  /** As 3 melhores ações mostram o valor em dinheiro; os sinais, não. */
  principal?: boolean
  copy: CopyDoPainel
}) {
  const { tinta, chave, Icone } = SELO_DO_STATUS[tarefa.status]

  return (
    <article
      className="rounded-[12px] border px-4 py-3.5"
      style={{
        borderColor: CX_APP.hairline,
        background: CX_APP.surface,
        boxShadow: CX_APP.shadow,
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h4
          className="font-semibold text-[15px] leading-snug"
          style={{ color: CX_APP.ink }}
        >
          {tarefa.title}
        </h4>
        {principal && tarefa.money ? (
          <span
            className="font-bold text-[13px] tabular-nums"
            style={{ color: TEAL_ESCURO }}
          >
            {tarefa.money}
          </span>
        ) : null}
      </div>

      {tarefa.category ? (
        <p className="mt-1 text-[12px]" style={{ color: CX_APP.inkSoft }}>
          {tarefa.category}
        </p>
      ) : null}

      <p
        className="mt-2 text-[13px] leading-[1.55]"
        style={{ color: CX_APP.inkSoft }}
      >
        {tarefa.detail}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium text-[10px]"
          style={{
            borderColor: `${tinta}40`,
            background: `${tinta}14`,
            color: tinta,
          }}
        >
          <Icone aria-hidden="true" size={12} />
          {copy.status[chave]}
        </span>

        {/* O "Aplicar" é a peça do painel do produto, não um controle desta
            página: aqui ele não tem para onde levar. Fica fora da árvore de
            acessibilidade em vez de virar um botão que não faz nada, pelo
            mesmo motivo do "Enviar" do rodapé. */}
        <span
          aria-hidden="true"
          className="inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold text-[11px]"
          style={{ background: CX_APP.accent, color: CX_APP.ink }}
        >
          {copy.aplicar}
          <ArrowRight size={12} />
        </span>
      </div>
    </article>
  )
}

function Fechamento({ copy }: { copy: CopyDoPainel }) {
  return (
    <div
      className="rounded-[12px] border p-4"
      style={{ borderColor: `${CX_APP.teal}80`, background: PAPEL_FRIO }}
    >
      <p className="text-[13px] leading-[1.55]" style={{ color: CX_APP.ink }}>
        {copy.ctaTexto}
      </p>
      <span
        aria-hidden="true"
        className="mt-3 flex items-center justify-between gap-3 rounded-full px-5 py-3 font-semibold text-[14px]"
        style={{ background: CX_APP.accent, color: CX_APP.ink }}
      >
        {copy.ctaBotao}
        <ArrowRight size={16} />
      </span>
    </div>
  )
}
