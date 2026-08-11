/* Os dados da demonstração do Max: o que a IA responde quando alguém pergunta
   onde está o dinheiro parado na semana.
 *
 * Moram aqui, e não dentro da tela, porque duas telas mostram o mesmo conteúdo:
 * a seção do /max e o painel lateral do /all. Duas cópias divergiriam no
 * primeiro ajuste de número.
 */

export const PREFILLED_PROMPT_PT =
  'Que dinheiro estou perdendo nessa semana com meus contatos?'
export const PREFILLED_PROMPT_EN =
  'What revenue am I leaving on the table this week with my contacts?'
export const PREFILLED_PROMPT_ES =
  '¿Cuánto dinero estoy dejando sobre la mesa esta semana con mis contactos?'

export type TaskStatus = 'ready' | 'urgent' | 'opportunity' | 'warning'

export type WeeklyTask = {
  id: string
  status: TaskStatus
  title: string
  category?: string
  detail: string
  money?: string
}

/** Top 3 ranked actions the AI surfaces for the week (ordered by impact). */
export const TOP_TASKS: WeeklyTask[] = [
  {
    id: 'play-1',
    status: 'ready',
    title: 'Em 48 horas: R$ 14.892',
    category: 'Pagamentos travados: Pix e boleto sem pagamento',
    detail:
      '68 pessoas geraram Pix ou boleto nos últimos 2 dias e ainda não pagaram. Janela curta: a memória da intenção de compra ainda está fresca. Um WhatsApp lembrete + Pix com 5% off recupera, em média, 22 dos 68 antes das 48 horas fecharem.',
    money: 'R$ 14.892',
  },
  {
    id: 'play-2',
    status: 'ready',
    title: 'Em 14 dias: R$ 127.808',
    category: 'Cliente esperando o próximo passo',
    detail:
      '142 alunos terminaram o curso principal nos últimos 60 dias e ninguém ofereceu nada novo. É o momento de maior intenção de compra da jornada. Um funil de webinário de ascensão em 14 dias captura essa janela, e 64% historicamente fecham o Programa Anual.',
    money: 'R$ 127.808',
  },
  {
    id: 'play-3',
    status: 'ready',
    title: 'Em 7 dias: R$ 67.940',
    category: 'Reunião caída na agenda do time',
    detail:
      'Peçanha e Carol têm 8 reuniões marcadas que não aconteceram e ninguém remarcou. Em 7 dias o lead ainda lembra do contexto e fecha. Passado isso, a taxa cai pela metade e vira lead frio.',
    money: 'R$ 67.940',
  },
]

export const TOP_TASKS_EN: WeeklyTask[] = [
  {
    id: 'play-1',
    status: 'ready',
    title: 'In 48 hours: R$ 14.892',
    category: 'Stuck payments: Pix and boleto with no payment',
    detail:
      '68 people generated a Pix or boleto in the last 2 days and still have not paid. Short window: the memory of purchase intent is still fresh. A WhatsApp reminder + Pix with 5% off recovers, on average, 22 of the 68 before the 48-hour window closes.',
    money: 'R$ 14.892',
  },
  {
    id: 'play-2',
    status: 'ready',
    title: 'In 14 days: R$ 127.808',
    category: 'Customer waiting for the next step',
    detail:
      '142 students finished the main course in the last 60 days and nobody offered them anything new. This is the highest purchase-intent moment in the journey. An ascension webinar funnel in 14 days captures that window, and 64% historically close the Annual Program.',
    money: 'R$ 127.808',
  },
  {
    id: 'play-3',
    status: 'ready',
    title: 'In 7 days: R$ 67.940',
    category: 'Missed meetings on the team calendar',
    detail:
      'Peçanha and Carol have 8 scheduled meetings that never happened and nobody followed up. At 7 days the lead still remembers the context and closes. After that, the rate drops in half and the lead goes cold.',
    money: 'R$ 67.940',
  },
]

/* Mesma lista em espanhol: mesmos ids, mesma ordem, mesmos números. */
export const TOP_TASKS_ES: WeeklyTask[] = [
  {
    id: 'play-1',
    status: 'ready',
    title: 'En 48 horas: R$ 14.892',
    category: 'Pagos trabados: Pix y boleto sin pagar',
    detail:
      '68 personas generaron un Pix o boleto en los últimos 2 días y todavía no pagaron. Ventana corta: la intención de compra sigue fresca. Un recordatorio por WhatsApp + Pix con 5% de descuento recupera, en promedio, 22 de las 68 antes de que se cierren las 48 horas.',
    money: 'R$ 14.892',
  },
  {
    id: 'play-2',
    status: 'ready',
    title: 'En 14 días: R$ 127.808',
    category: 'Cliente esperando el siguiente paso',
    detail:
      '142 alumnos terminaron el curso principal en los últimos 60 días y nadie les ofreció nada nuevo. Es el momento de mayor intención de compra de todo el recorrido. Un embudo de webinar de ascenso en 14 días captura esa ventana, y el 64% históricamente cierra el Programa Anual.',
    money: 'R$ 127.808',
  },
  {
    id: 'play-3',
    status: 'ready',
    title: 'En 7 días: R$ 67.940',
    category: 'Reuniones caídas en la agenda del equipo',
    detail:
      'Peçanha y Carol tienen 8 reuniones agendadas que nunca ocurrieron y nadie las reprogramó. A los 7 días el lead todavía recuerda el contexto y cierra. Pasado ese punto, la tasa cae a la mitad y el lead se enfría.',
    money: 'R$ 67.940',
  },
]

/** Three "signals": items that need attention but aren't direct money-now plays. */
export const EXTRA_TASKS: WeeklyTask[] = [
  {
    id: 'emergency',
    status: 'urgent',
    title: 'Emergência do dia',
    detail:
      'Maria Santos está parada há 96 horas com uma proposta de R$ 9.997 nas mãos do Peçanha. Lead com score 92 que pediu a proposta e está esperando retorno. Cada hora de silêncio aqui esfria a venda, e isso precisa de ação humana hoje.',
  },
  {
    id: 'opportunity',
    status: 'opportunity',
    title: 'Oportunidade do mês',
    detail:
      'O anúncio LR-14 traz clientes que valem 14× a média da sua base, mas está rodando com pouca verba (89 entradas em 12 meses). Triplicar o orçamento dele pode adicionar +R$ 82K/mês de receita, sem mexer em mais nada.',
  },
  {
    id: 'leak',
    status: 'warning',
    title: 'Vazamento estrutural',
    detail:
      'A sequência automática de Continuidade Premium pós-Mentoria não está configurada. Quando você oferece essa sequência, 38% compra. Hoje só 12% dos compradores de Mentoria recebem. Configurar uma vez destrava R$ 82.000/ano.',
  },
]

export const EXTRA_TASKS_EN: WeeklyTask[] = [
  {
    id: 'emergency',
    status: 'urgent',
    title: "Today's emergency",
    detail:
      "Maria Santos has been sitting on a R$ 9.997 proposal for 96 hours, and it's in Peçanha's hands. Lead with a score of 92 who requested the proposal and is waiting for a reply. Every hour of silence here cools the sale, and it needs human action today.",
  },
  {
    id: 'opportunity',
    status: 'opportunity',
    title: "Month's opportunity",
    detail:
      "Ad LR-14 brings in customers worth 14x your base average, but it's running on a small budget (89 entries in 12 months). Tripling its budget could add +R$ 82K/month in revenue, without changing anything else.",
  },
  {
    id: 'leak',
    status: 'warning',
    title: 'Structural leak',
    detail:
      'The Premium Continuity automatic sequence post-Coaching is not set up. When you offer this sequence, 38% buy. Today only 12% of Coaching buyers receive it. Setting it up once unlocks R$ 82.000/year.',
  },
]

/* Os mesmos três sinais em espanhol: mesmos ids, mesmos status. */
export const EXTRA_TASKS_ES: WeeklyTask[] = [
  {
    id: 'emergency',
    status: 'urgent',
    title: 'Emergencia del día',
    detail:
      'Maria Santos lleva 96 horas esperando con una propuesta de R$ 9.997 en manos de Peçanha. Es un lead con score 92 que pidió la propuesta y sigue esperando respuesta. Cada hora de silencio enfría la venta, y esto necesita acción humana hoy.',
  },
  {
    id: 'opportunity',
    status: 'opportunity',
    title: 'Oportunidad del mes',
    detail:
      'El anuncio LR-14 trae clientes que valen 14× el promedio de tu base, pero está corriendo con muy poco presupuesto (89 entradas en 12 meses). Triplicar su presupuesto puede sumar +R$ 82K/mes de ingresos, sin mover nada más.',
  },
  {
    id: 'leak',
    status: 'warning',
    title: 'Fuga estructural',
    detail:
      'La secuencia automática de Continuidad Premium post-Mentoría no está configurada. Cuando ofreces esa secuencia, el 38% compra. Hoy solo el 12% de los compradores de Mentoría la recibe. Configurarla una vez destraba R$ 82.000/año.',
  },
]

/* A SEQUÊNCIA da resposta.
 *
 * Mora aqui pelo mesmo motivo dos dados acima: a seção do /max e o painel
 * lateral do /all tocam a MESMA resposta, e duas cópias da sequência
 * divergiriam no primeiro ajuste de tempo.
 */

export type StreamStepType =
  | 'tool'
  | 'tool-done'
  | 'greeting'
  | 'money'
  | 'section-top'
  | 'play-1'
  | 'play-2'
  | 'play-3'
  | 'section-signals'
  | 'task-emergency'
  | 'task-opportunity'
  | 'task-leak'
  | 'cta'

export type StreamStep = {
  type: StreamStepType
  toolId?: string
  label?: string
  /** Milliseconds until the next step kicks in. */
  duration: number
}

/** Sequence the chat plays back after the user clicks the test button.
 *  Each tool runs in "Buscando…" state, then transitions to "Concluído"
 *  and the matching answer block reveals. */
export const STREAM: StreamStep[] = [
  {
    type: 'tool',
    toolId: 'main',
    label: 'Orquestrar 19 análises × ranking de impacto',
    duration: 2200,
  },
  { type: 'tool-done', toolId: 'main', duration: 600 },
  { type: 'greeting', duration: 900 },
  { type: 'money', duration: 1100 },
  { type: 'section-top', duration: 800 },

  {
    type: 'tool',
    toolId: 's1',
    label: 'Analisando pagamentos travados nos últimos 7 dias…',
    duration: 2000,
  },
  { type: 'tool-done', toolId: 's1', duration: 500 },
  { type: 'play-1', duration: 1500 },

  {
    type: 'tool',
    toolId: 's2',
    label: 'Cruzando alunos com curso 80%+ concluído × histórico de oferta…',
    duration: 2300,
  },
  { type: 'tool-done', toolId: 's2', duration: 500 },
  { type: 'play-2', duration: 1500 },

  {
    type: 'tool',
    toolId: 's3',
    label: 'Verificando agenda × reuniões sem follow-up…',
    duration: 1900,
  },
  { type: 'tool-done', toolId: 's3', duration: 500 },
  { type: 'play-3', duration: 1500 },

  { type: 'section-signals', duration: 900 },

  {
    type: 'tool',
    toolId: 'se',
    label: 'Buscando emergências do dia (lead quente parado)…',
    duration: 1700,
  },
  { type: 'tool-done', toolId: 'se', duration: 500 },
  { type: 'task-emergency', duration: 1300 },

  {
    type: 'tool',
    toolId: 'so',
    label: 'Mapeando oportunidades do mês (canal × LTV)…',
    duration: 1700,
  },
  { type: 'tool-done', toolId: 'so', duration: 500 },
  { type: 'task-opportunity', duration: 1300 },

  {
    type: 'tool',
    toolId: 'sl',
    label: 'Identificando vazamentos estruturais…',
    duration: 1700,
  },
  { type: 'tool-done', toolId: 'sl', duration: 500 },
  { type: 'task-leak', duration: 1300 },

  { type: 'cta', duration: 0 },
]

export const STREAM_EN: StreamStep[] = [
  {
    type: 'tool',
    toolId: 'main',
    label: 'Orchestrating 19 analyses × impact ranking',
    duration: 2200,
  },
  { type: 'tool-done', toolId: 'main', duration: 600 },
  { type: 'greeting', duration: 900 },
  { type: 'money', duration: 1100 },
  { type: 'section-top', duration: 800 },

  {
    type: 'tool',
    toolId: 's1',
    label: 'Scanning stuck payments from the last 7 days...',
    duration: 2000,
  },
  { type: 'tool-done', toolId: 's1', duration: 500 },
  { type: 'play-1', duration: 1500 },

  {
    type: 'tool',
    toolId: 's2',
    label: 'Crossing students at 80%+ completion with offer history...',
    duration: 2300,
  },
  { type: 'tool-done', toolId: 's2', duration: 500 },
  { type: 'play-2', duration: 1500 },

  {
    type: 'tool',
    toolId: 's3',
    label: 'Checking calendar for meetings with no follow-up...',
    duration: 1900,
  },
  { type: 'tool-done', toolId: 's3', duration: 500 },
  { type: 'play-3', duration: 1500 },

  { type: 'section-signals', duration: 900 },

  {
    type: 'tool',
    toolId: 'se',
    label: "Looking for today's emergencies (hot lead gone cold)...",
    duration: 1700,
  },
  { type: 'tool-done', toolId: 'se', duration: 500 },
  { type: 'task-emergency', duration: 1300 },

  {
    type: 'tool',
    toolId: 'so',
    label: "Mapping the month's opportunities (channel vs. LTV)...",
    duration: 1700,
  },
  { type: 'tool-done', toolId: 'so', duration: 500 },
  { type: 'task-opportunity', duration: 1300 },

  {
    type: 'tool',
    toolId: 'sl',
    label: 'Identifying structural revenue leaks...',
    duration: 1700,
  },
  { type: 'tool-done', toolId: 'sl', duration: 500 },
  { type: 'task-leak', duration: 1300 },

  { type: 'cta', duration: 0 },
]

/* A mesma sequência em espanhol: só os rótulos mudam. Os tempos, os tipos e os
   toolIds são idênticos aos das outras duas, para os três idiomas tocarem a
   resposta no mesmo ritmo. */
export const STREAM_ES: StreamStep[] = [
  {
    type: 'tool',
    toolId: 'main',
    label: 'Orquestando 19 análisis × ranking de impacto',
    duration: 2200,
  },
  { type: 'tool-done', toolId: 'main', duration: 600 },
  { type: 'greeting', duration: 900 },
  { type: 'money', duration: 1100 },
  { type: 'section-top', duration: 800 },

  {
    type: 'tool',
    toolId: 's1',
    label: 'Analizando pagos trabados de los últimos 7 días…',
    duration: 2000,
  },
  { type: 'tool-done', toolId: 's1', duration: 500 },
  { type: 'play-1', duration: 1500 },

  {
    type: 'tool',
    toolId: 's2',
    label:
      'Cruzando alumnos con 80%+ del curso completado × historial de ofertas…',
    duration: 2300,
  },
  { type: 'tool-done', toolId: 's2', duration: 500 },
  { type: 'play-2', duration: 1500 },

  {
    type: 'tool',
    toolId: 's3',
    label: 'Verificando agenda × reuniones sin seguimiento…',
    duration: 1900,
  },
  { type: 'tool-done', toolId: 's3', duration: 500 },
  { type: 'play-3', duration: 1500 },

  { type: 'section-signals', duration: 900 },

  {
    type: 'tool',
    toolId: 'se',
    label: 'Buscando emergencias del día (lead caliente detenido)…',
    duration: 1700,
  },
  { type: 'tool-done', toolId: 'se', duration: 500 },
  { type: 'task-emergency', duration: 1300 },

  {
    type: 'tool',
    toolId: 'so',
    label: 'Mapeando oportunidades del mes (canal × LTV)…',
    duration: 1700,
  },
  { type: 'tool-done', toolId: 'so', duration: 500 },
  { type: 'task-opportunity', duration: 1300 },

  {
    type: 'tool',
    toolId: 'sl',
    label: 'Identificando fugas estructurales de ingresos…',
    duration: 1700,
  },
  { type: 'tool-done', toolId: 'sl', duration: 500 },
  { type: 'task-leak', duration: 1300 },

  { type: 'cta', duration: 0 },
]
