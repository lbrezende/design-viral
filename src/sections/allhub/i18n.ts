import { useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'

/* ---------------------------------------------------------------------------
 * i18n do hub (/all, /oficial, /parceiros e as 12 páginas de módulo).
 *
 * PORTUGUÊS é o padrão e mora nas rotas atuais (/all, /oficial, ...).
 * INGLÊS e ESPANHOL são VERSÕES DE MARKETING, não tradução literal: é a
 * mesma mensagem reescrita no idioma nativo, com headline curta e verbo
 * forte. Moram sob os prefixos /en e /es (ver HUB_ROUTES abaixo).
 *
 * Nenhum componente de seção pode ter texto hardcoded: tudo vem daqui
 * (ou de modules-content.ts, no caso das 12 landings de módulo).
 * ------------------------------------------------------------------------- */

export type Lang = 'pt' | 'en' | 'es'

/** Espelho PT → EN → ES de cada rota do hub. Fonte única para links internos
 *  localizados, para as bandeirinhas do nav e para o isFunnelRoute do root. */
export const HUB_ROUTES: { pt: string; en: string; es: string }[] = [
  { pt: '/angulos', en: '/en/angles', es: '/es/angulos' },
  { pt: '/all', en: '/en/all', es: '/es/todo' },
  { pt: '/oficial', en: '/en/platform', es: '/es/plataforma' },
  { pt: '/parceiros', en: '/en/partners', es: '/es/socios' },
  { pt: '/funnels', en: '/en/funnels', es: '/es/embudos' },
  { pt: '/paginas', en: '/en/pages', es: '/es/paginas' },
  { pt: '/quizz', en: '/en/quiz', es: '/es/quiz' },
  { pt: '/automacoes', en: '/en/automations', es: '/es/automatizaciones' },
  { pt: '/crm', en: '/en/crm', es: '/es/crm' },
  { pt: '/mensagens', en: '/en/messages', es: '/es/mensajes' },
  { pt: '/checkout', en: '/en/checkout', es: '/es/checkout' },
  { pt: '/membros', en: '/en/members', es: '/es/miembros' },
  { pt: '/insights', en: '/en/insights', es: '/es/insights' },
  { pt: '/dominios', en: '/en/domains', es: '/es/dominios' },
  { pt: '/linkprotect', en: '/en/linkprotect', es: '/es/linkprotect' },
  { pt: '/integracoes', en: '/en/integrations', es: '/es/integraciones' },
]

/** Todos os paths do hub (PT + EN + ES) — usado pelo __root pra renderizar
 *  essas rotas sem o header/footer globais do site. */
export const HUB_PATHS: string[] = HUB_ROUTES.flatMap(r => [r.pt, r.en, r.es])

/** Idioma inferido do path (prefixo /en ou /es), com fallback pt. */
export function langFromPath(pathname: string): Lang {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en'
  if (pathname === '/es' || pathname.startsWith('/es/')) return 'es'
  return 'pt'
}

/** Hook: idioma da rota atual. */
export function useLang(): Lang {
  const loc = useLocation()
  return langFromPath(loc.pathname)
}

/**
 * Traduz um href interno escrito em PT para o idioma alvo. Âncoras (#x),
 * links externos e paths fora do hub voltam inalterados.
 */
export function localizedPath(href: string, lang: Lang): string {
  if (lang === 'pt') return href
  if (!href.startsWith('/')) return href
  const [path, hash] = href.split('#')
  const match = HUB_ROUTES.find(r => r.pt === path)
  if (!match) return href
  const target = lang === 'en' ? match.en : match.es
  return hash ? `${target}#${hash}` : target
}

/**
 * Título da aba por rota. O site não usa react-helmet nem renderiza o
 * `head:` das rotas — troca o document.title no mount e restaura no unmount
 * (mesmo padrão de /oficial e /all).
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const prev = document.title
    document.title = title
    return () => {
      document.title = prev
    }
  }, [title])
}

/** Path equivalente do pathname atual no idioma alvo (bandeirinhas do nav). */
export function counterpartPath(pathname: string, target: Lang): string {
  const match = HUB_ROUTES.find(
    r => r.pt === pathname || r.en === pathname || r.es === pathname,
  )
  if (!match) return pathname
  if (target === 'en') return match.en
  if (target === 'es') return match.es
  return match.pt
}

/* ---------------------------------------------------------------------------
 * Dicionário
 * ------------------------------------------------------------------------- */

const PT = {
  meta: {
    allTitle: 'Clickmax: toda a sua operação em uma plataforma.',
    oficialTitle: 'Clickmax: a operação inteira em uma plataforma.',
    partnersTitle: 'Parceiros: construa em cima do Clickmax',
    partnersDescription:
      'Afiliado com comissão recorrente, agência certificada com replicação de funis, ou dev/integrador com API, MCP e webhooks.',
  },

  /** Rótulos dos 12 módulos — reaproveitados no hero, no showcase e no rodapé. */
  moduleLabels: {
    funnels: 'Funis',
    paginas: 'Páginas',
    quizz: 'Quiz',
    automacoes: 'Automações',
    crm: 'CRM',
    mensagens: 'Mensagens',
    checkout: 'Checkout',
    membros: 'Membros',
    insights: 'Insights',
    dominios: 'Domínios',
    linkprotect: 'LinkProtect',
    integracoes: 'Integrações',
  },

  nav: {
    salesCta: 'Falar com vendas',
    trialCta: 'Começar agora',
    salesWhatsappText:
      'Olá, vim pelo clickmax.io/oficial e quero falar com vendas.',
    ptLabel: 'Português',
    enLabel: 'English',
    esLabel: 'Español',
    links: {
      all: [
        { label: 'Produtos', href: '#do-it-all' },
        { label: 'Ecossistema', href: '#ecossistema' },
        { label: 'Parceiros', href: '/parceiros' },
        { label: 'Oficial', href: '/oficial' },
      ],
      oficial: [
        { label: 'Construído pra quem constrói', href: '#capacidades' },
        { label: 'Automação', href: '#automacao' },
        { label: 'Prova', href: '#prova' },
        { label: 'Preços', href: '#pricing' },
      ],
      partners: [
        { label: 'Oportunidades', href: '#oportunidades' },
        { label: 'Como entrar', href: '#como-entrar' },
        { label: 'Ver tudo', href: '/all' },
      ],
      module: [
        { label: 'O que muda', href: '#beneficios' },
        { label: 'Ângulos', href: '#angulos' },
        { label: 'Ver tudo', href: '/all' },
      ],
    },
  },

  hero: {
    eyebrow: 'Clickmax não é só mais um software.',
    headlineLines: ['Tudo de IA que', 'seu marketing', 'precisa'],
    lead: 'A inteligência artificial que coloca seu marketing no ar via comando de voz e cruza todos os dados das suas páginas, funis, CRM, checkout e mensagens para te ajudar a vender mais.',
    ctaPrimary: 'Começar agora',
    ctaSecondary: 'Ver os módulos',
    manifestoBefore:
      'Ajudamos negócios a atrair mais clientes e vender mais vezes para eles. Tudo em uma só ferramenta de IA integrada que faz todo seu ',
    manifestoHighlight: 'marketing',
    manifestoAfter: '.',
  },

  /* NÃO usado na página: a frase-manifesto aparece UMA única vez, no hero
     (overlay central que cresce no scroll). Mantido só como fonte de texto
     para reduced-motion/SEO caso a seção volte. */
  manifesto: {
    text: 'Ajudamos negócios a atrair mais clientes e vender mais vezes para eles. Tudo em uma só ferramenta de IA integrada que faz todo seu marketing.',
  },

  socialProof: {
    eyebrow: 'O mercado está tendo muito mais resultado.',
    headline:
      'As mesmas receitas não funcionam mais, e a IA está encontrando caminhos que ninguém imaginava.',
    cases: [
      {
        chip: 'Nicho design',
        title: 'Leandro Rezende passa de R$ 550 mil/mês com Clickmax.',
      },
      {
        chip: 'Workshops pagos',
        title:
          'Gilberto Prado tem retorno de 10× trocando lançamento grátis por funil pago.',
      },
    ],
  },

  /** A demonstração do Max, com o painel que abre na lateral. */
  maxDemo: {
    /* Os exemplos giram embaixo do campo: são o repertório do que dá pra pedir.
       Uma lista fixa de seis vira parede de texto; girando, ela cabe em três
       linhas e ainda mostra o alcance. */
    exemplos: [
      'Cria um funil com teste A/B',
      'Cria uma automação no WhatsApp oficial e no e-mail',
      'Cria uma recuperação de vendas',
      'Cria minha área de membros com esses cursos',
      'Cria um pipeline comercial que recebe os leads da página de captura',
      'Cria uma página de vendas e publica no meu domínio',
    ],
    eyebrow: 'Veja na prática',
    headline: 'Experimente a IA do Clickmax',
    headlineSoft: 'clicando no botão abaixo',
    modulo: 'CRM',
    autor: 'Você',
    dica: 'Pesquise em toda a base de clientes',
    acao: 'Clique e teste',
    painel: {
      titulo: 'Max',
      subtitulo: 'dinheiro escondido na base',
      fechar: 'Fechar o painel',
      voltar: 'Voltar ao início',
      squad: 'Squad ativa',
      trilha:
        'Tool execute · 7 sondas em sequência · resposta com dados de exemplo',
      marca: 'Clickmax',
      concluido: 'Concluído',
      buscando: 'Buscando…',
      saudacao: 'Bom dia. Eis o resumo da sua semana.',
      dinheiroRotulo: 'Dinheiro recuperável essa semana',
      dinheiroValor: 'R$ 587.420',
      dinheiroApoio: 'Dinheiro aguardando uma ação sua nessa semana.',
      tituloTop: 'As 3 melhores ações da semana',
      subtituloTop: 'faz nessa ordem, cada item tem 1 botão',
      tituloSinais: 'Sinais que pedem atenção',
      aplicar: 'Aplicar',
      status: {
        urgente: 'Urgente',
        oportunidade: 'Oportunidade',
        atencao: 'Atenção',
        pronto: 'Pronto pra aplicar',
      },
      ctaTexto:
        'Esse resumo fica fixado no topo do seu CRM toda segunda às 8h. Cada item acima tem 1 botão e a IA dispara o fluxo completo. Quer ver isso rodando na sua base?',
      ctaBotao: 'Quero o Max no meu CRM',
      placeholder: 'Pergunte qualquer coisa sobre este workspace…',
      enviar: 'Enviar',
      nota: 'As respostas usam dados de exemplo.',
    },
  },

  doItAll: {
    eyebrow: 'O que dá pra fazer',
    headline: 'Faça tudo com o Clickmax.',
    blocks: {
      'ia-aplicada': {
        title: 'IA aplicada',
        desc: 'Pergunte onde está perdido dinheiro. A IA analisa funis, abandonos, kanbans do comercial e monta estratégias para você com um clique.',
      },
      marketing: {
        title: 'Marketing',
        desc: 'Funis, mensagens, automações e analytics.',
      },
      comercial: {
        title: 'Comercial',
        desc: 'Segmente e venda para leads aquecidos no seu kanban.',
      },
      'vendas-online': {
        title: 'Vendas online',
        desc: 'Upsell, one click buy e recuperação de pix e cartão.',
      },
      templates: {
        title: 'Templates',
        desc: 'Estratégias que mais funcionam no mercado, a um clique de distância.',
      },
      automacoes: {
        title: 'Automações',
        desc: 'Fluxos que atendem, recuperam e vendem sem depender de gente.',
      },
    },
  },

  moduleShowcase: {
    eyebrow: '12 módulos nativos',
    headline: 'Cada módulo, no detalhe.',
    modulePrefix: 'Módulo · ',
    discoverPrefix: 'Descobrir ',
    discoverSuffix: ' ›',
    items: {
      paginas: {
        title: 'Construtor de Páginas',
        desc: 'Veja o analytics e ajuste na hora. Sem dev, guiado pela estrutura que vende.',
        bullets: [
          'Editor visual: <b>captura, vendas, checkout, upsell, downsell e obrigado</b> sem código.',
          'Lança e testa rápido, com <b>menos dependência de devs</b>.',
          'Integra páginas externas e <b>scripts do Clickmax</b>.',
          'Roda direto na <b>Cloud</b>, dentro da mesma operação.',
        ],
        quote: 'Quanto mais rápido você publica, mais rápido valida e vende.',
        chips: ['EDITOR VISUAL', 'ANALYTICS EMBUTIDO', 'PUBLICAÇÃO NA CLOUD'],
      },
      funnels: {
        title: 'Funis de Vendas e Analytics',
        desc: 'Pare de adivinhar onde você perde venda. Veja em tempo real.',
        bullets: [
          'Monte a jornada inteira, <b>da captura à venda</b>, num só lugar.',
          'Veja exatamente <b>em qual etapa</b> o dinheiro está escapando.',
          'Descubra quais páginas convertem mais e onde está o abandono.',
          'Otimize campanha com dado real: <b>mais conversão sem mais tráfego</b>.',
          'Acompanhe receita por etapa e o impacto de cada alteração.',
        ],
        quote: 'Achismo não paga boleto. Dado, sim.',
        chips: ['JORNADA COMPLETA', 'ANALYTICS POR ETAPA', 'RECEITA POR ETAPA'],
      },
      quizz: {
        title: 'Quiz Builder',
        desc: 'O cliente conta o que quer comprar, e você oferece o produto certo.',
        bullets: [
          'Perguntas com <b>lógica condicional</b>: cada resposta muda o caminho e a oferta.',
          'Cálculos por trás das respostas montam o <b>resultado personalizado</b> de cada lead.',
          'Termina em <b>checkout personalizado</b>: ele compra exatamente o que o quiz mostrou.',
          'Cada resposta vira dado: <b>qualifica e segmenta</b> sem ninguém perguntar nada.',
        ],
        quote:
          'Oferta personalizada converte mais. O quiz descobre o que ele quer e vende isso na hora.',
        chips: [
          'LÓGICA CONDICIONAL',
          'RESULTADO PERSONALIZADO',
          'CHECKOUT DIRETO',
        ],
      },
      automacoes: {
        title: 'Fluxos de Mensagens e Automações',
        desc: 'Atenda, recupere e venda no automático: WhatsApp, SMS, email e ligação.',
        bullets: [
          'Escala o atendimento <b>sem contratar mais gente</b>.',
          'Recupera venda perdida sozinho, enquanto você dorme.',
          'Relacionamento contínuo que aumenta <b>retenção e recompra</b>.',
          'Dispara por <b>WhatsApp, SMS, email e ligação</b>.',
          'Velocidade de resposta vira venda no bolso.',
        ],
        quote: 'Quem automatiza vende mais e perde menos.',
        chips: ['FLUXOS POR GATILHO', 'MULTICANAL', 'RODA 24H'],
      },
      mensagens: {
        title: 'Broadcast: SMS, WhatsApp API Oficial, Email e URA',
        desc: 'Dispare uma campanha pra base inteira em minutos.',
        bullets: [
          'Comunicação rápida com a base toda, na hora que quiser.',
          'Ideal para <b>venda pontual, lançamento e divulgação</b>.',
          'Reativa contato inativo e traz gente de volta.',
          'Envia por <b>WhatsApp, SMS, email e ligação</b>.',
          'Métricas de envio para saber o que funcionou.',
        ],
        quote: 'Nem toda venda espera automação. Algumas você dispara hoje.',
        chips: ['WHATSAPP OFICIAL', 'SMS E URA', 'MÉTRICAS DE ENVIO'],
      },
      crm: {
        title: 'CRM Inteligente',
        desc: 'Com tudo unificado, a IA varre os dados e acha quem quer comprar.',
        bullets: [
          'Toda informação do cliente <b>centralizada em um só lugar</b>.',
          'Segmentação avançada por comportamento e histórico.',
          'Oferta mais personalizada = <b>mais conversão</b>.',
          'Visão 360° de cada cliente, do primeiro toque à recompra.',
          'Mais previsibilidade para a operação comercial.',
        ],
        quote: 'Quem conhece o cliente vende mais e atende melhor.',
        chips: ['BASE UNIFICADA', 'SEGMENTAÇÃO AVANÇADA', 'HISTÓRICO 360°'],
      },
      checkout: {
        title: 'Produtos e Ofertas',
        desc: 'Uma oferta só deixa dinheiro na mesa. Venda do jeito que quiser.',
        bullets: [
          'Digital, físico, <b>assinatura, recorrência, trial</b>, mentoria, serviço: tudo.',
          'Toda a operação comercial centralizada num lugar.',
          'Sobe o ticket médio com <b>upsell, downsell e order bump</b>.',
          'Afiliados, coprodutores e parceiros sem dor de cabeça.',
          'Múltiplas ofertas no mesmo funil = <b>20 a 30% de faturamento a mais</b>.',
        ],
        quote: 'Mais ofertas no funil, 20 a 30% a mais com a mesma base.',
        chips: ['UPSELL E ORDER BUMP', 'ASSINATURA E TRIAL', 'MULTI-OFERTA'],
      },
      membros: {
        title: 'Área de Membros',
        desc: 'A entrega vira experiência, e cliente satisfeito compra de novo.',
        bullets: [
          'Cursos, módulos, aulas, arquivos, trailers e <b>certificados</b> num só lugar.',
          'Navegação <b>estilo Netflix</b> com banners e campanhas internas.',
          '<b>Ofertas contextuais</b>: terminou o módulo → oferta; terminou o curso → upsell.',
          'Integrada a Produtos, Checkouts, Funis, CRM e Automações.',
        ],
        quote: 'Vender é metade. A outra metade é fazer o cliente voltar.',
        chips: ['NAVEGAÇÃO STREAMING', 'CERTIFICADOS', 'OFERTA CONTEXTUAL'],
      },
      insights: {
        title: 'MCP e Operação por IA',
        desc: 'Fale o que precisa, ou a IA te diz antes de você pedir.',
        bullets: [
          'Controle <b>toda a plataforma por IA</b>, em linguagem natural.',
          '“Crie um funil pro meu curso”, “monte uma área de membros”: a IA <b>faz</b>.',
          'Cria produto de assinatura, configura automações, monta quiz e pipeline a pedido.',
          'Curva de aprendizado <b>perto de zero</b>, democratiza o uso pro time inteiro.',
        ],
        quote:
          'Em vez de dominar dezenas de telas, fale em linguagem natural. A IA opera por você.',
        chips: ['LINGUAGEM NATURAL', 'MCP NATIVO', 'ZERO CURVA'],
      },
      integracoes: {
        title: 'Pacotes Compartilhados e Replicação',
        desc: 'Replique um negócio inteiro em minutos, sem refazer nada do zero.',
        bullets: [
          'Duplica <b>funis, páginas, produtos, fluxos e automações</b> de uma vez.',
          'Escala operações de afiliados e parceiros mantendo o <b>padrão</b>.',
          'Define o que fica <b>editável</b> e o que fica <b>bloqueado</b>.',
          'Corta o tempo de implementação de semanas pra minutos.',
        ],
        quote:
          'O que levou meses pra montar, você entrega pronto em poucos cliques.',
        chips: [
          'REPLICAÇÃO 1-CLIQUE',
          'PADRÃO GARANTIDO',
          'CONTROLE DE EDIÇÃO',
        ],
      },
      dominios: {
        title: 'Seu domínio, sua operação.',
        desc: 'Publica páginas e funis no seu domínio, com toda a estrutura de tracking e checkout rodando por trás.',
        bullets: [],
        quote: '',
        chips: ['DOMÍNIO PRÓPRIO', 'TRACKING NATIVO', 'SSL AUTOMÁTICO'],
      },
      linkprotect: {
        title: 'Chatbot com IA',
        desc: 'Um atendente treinado no seu negócio respondendo 24h, sem folha de pagamento.',
        bullets: [
          'Assistente <b>treinado com as informações do seu negócio</b>: responde como quem conhece o produto.',
          'Atende <b>24h</b> e derruba o custo operacional do suporte.',
          'Conversa no site <b>captura dados</b> do visitante enquanto atende.',
          'Tudo cai no <b>CRM</b>: vira inteligência comercial, não conversa perdida.',
        ],
        quote:
          'A maioria das dúvidas é repetitiva. A IA responde na hora e ainda captura quem está quente.',
        chips: ['CHATBOT COM IA', 'CAPTURA NO CRM', 'PROTEÇÃO DE LINK'],
      },
    },
  },

  ecosystem: {
    eyebrowPrefix: 'Ecossistema IA · ',
    eyebrowSuffix: ' páginas',
    headline:
      'É como se tivéssemos uma startup para cada uma das situações abaixo, porém todas elas no mesmo lugar.',
    subheadline:
      'Explore casos de uso em que você pode utilizar o Clickmax para vender mais.',
    cardCta: 'Conhecer',
    leadBefore: 'São ',
    leadAfter:
      ' páginas no ar, cada uma atacando um ângulo diferente do mesmo problema: transformar tráfego em receita. Todas rodam sobre o mesmo Clickmax.',
  },

  partnership: {
    eyebrow: 'Parceiros',
    headline: 'Sustentado por parceria de verdade.',
    cta: 'Torne-se parceiro',
    pillars: [
      {
        title: 'Aceleração de casos de uso',
        body: 'Times que já colocaram centenas de operações no ar em semanas, não em trimestres.',
      },
      {
        title: 'Especialistas de elite',
        body: 'Gente certificada em funil, copy, tráfego e automação dentro do Clickmax.',
      },
      {
        title: 'Customização profunda',
        body: 'Integrações sob medida, APIs e fluxos desenhados para o seu modelo de venda.',
      },
      {
        title: 'Ativação enterprise',
        body: 'Migração assistida, governança e suporte dedicado para operações grandes.',
      },
    ],
  },

  darkBand: {
    eyebrow: 'Operações desenhadas para converter.',
    headline:
      'Cada módulo nasce pronto pra vender, sem depender de mais uma ferramenta.',
    columns: [
      {
        title: 'Autoatendimento',
        body: 'Cria conta, monta o primeiro funil e publica sozinho, sem esperar onboarding de ninguém.',
      },
      {
        title: 'Nuvem Clickmax',
        body: 'Roda inteira na nossa infraestrutura: sem servidor pra configurar, sem certificado pra renovar.',
      },
      {
        title: 'Com agências parceiras',
        body: 'Ou implementa com quem já fez isso centenas de vezes: replicação, white-label e suporte dedicado.',
      },
    ],
  },

  finalCta: {
    eyebrow: 'Seja dono do seu futuro.',
    headline: 'Toda a sua operação, rodando ainda hoje.',
    ctaPrimary: 'Começar agora',
    ctaSecondary: 'Torne-se parceiro',
  },

  footer: {
    tagline: 'A operação inteira. Uma plataforma.',
    orbEyebrow: 'Ecossistema CX',
    orbTitle: 'Todo canal, todo dado, na mesma órbita.',
    address: 'Av. Yojiro Takaoka, 4384, Alphaville, Santana de Parnaíba/SP',
    companySuffix: 'Clickmax, INFO TECH TECNOLOGIA LTDA.',
    columns: {
      modules: { title: 'Módulos' },
      features: { title: 'Funcionalidades' },
      builders: {
        title: 'Para quem constrói',
        items: [
          'Capacidades técnicas',
          'Preços',
          'Vídeos do produto',
          'Changelog',
          'Suporte',
        ],
      },
      ecosystem: {
        title: 'Ecossistema IA',
        countSuffix:
          ' páginas ativas, cada uma vendendo um ângulo diferente do mesmo problema.',
      },
      legal: {
        title: 'Legal',
        items: [
          'Política de privacidade',
          'Termos de uso',
          'Cookies',
          'suporte@clickmax.io',
        ],
      },
    },
  },

  moduleLanding: {
    ctaTrial: 'Testar 14 dias grátis',
    ctaAll: 'Ver tudo',
    benefitsEyebrow: 'O que muda na prática',
    anglesEyebrow: 'Ângulos deste módulo',
    anglesLead:
      'Páginas do ecossistema Clickmax construídas em cima desta funcionalidade, cada uma testando um ângulo diferente.',
    angleStartup: 'STARTUP',
    anglePrefix: 'ÂNGULO ',
    seeSite: 'Ver site',
  },

  partners: {
    hero: {
      eyebrow: 'Parceiros',
      headline: 'Construa em cima do Clickmax.',
      lead: 'Três jeitos de entrar: indicando pra quem já vende no digital, operando clientes como agência, ou conectando o Clickmax no resto do stack via API, MCP e webhooks.',
      ctaWhatsapp: 'Falar no WhatsApp',
    },
    whatsappText:
      'Olá, vim pelo clickmax.io/parceiros e quero saber mais sobre virar parceiro (afiliado, agência ou integrador).',
    tracksEyebrow: 'Escolha a trilha',
    tracks: [
      {
        eyebrow: 'PARA QUEM JÁ TEM AUDIÊNCIA',
        title: 'Afiliado',
        desc: 'Indique o Clickmax pra quem já vende no digital e ganha comissão recorrente enquanto o cliente indicado continuar ativo. Sem criar produto, sem sustentar suporte.',
        bullets: [
          'Comissão recorrente mês a mês, não só na venda inicial',
          'Material de venda pronto: página, vídeo e prova social já testados em campanha real',
          'Serve pra quem já promove curso, mentoria, produto digital ou ferramenta pro nicho',
        ],
      },
      {
        eyebrow: 'PARA QUEM OPERA CLIENTES',
        title: 'Agência certificada',
        desc: 'Opere vários clientes numa conta só, com replicação de funil, página, produto e automação. Sem remontar cada operação do zero a cada contrato novo.',
        bullets: [
          'Pacotes compartilhados: duplica funil, página, produto e fluxo pro cliente novo em minutos',
          'Multi-cliente organizado numa única conta, sem misturar dado entre operações',
          'Você decide o que fica editável e o que fica bloqueado pro cliente final',
        ],
      },
      {
        eyebrow: 'PARA QUEM CONSTRÓI EM CIMA',
        title: 'Dev / Integrador',
        desc: 'API, MCP e webhooks pra conectar o Clickmax no resto do stack, ou deixar a IA operar a plataforma inteira por linguagem natural.',
        bullets: [
          'MCP: comanda funil, produto, automação e pipeline via IA, sem interface manual',
          'Webhook em cada evento importante do funil, do checkout e do CRM',
          'API aberta pra integrar com as ferramentas que o cliente já usa',
        ],
      },
    ],
    stepsEyebrow: 'Como entrar',
    steps: [
      {
        n: '01',
        title: 'Fala com a gente',
        desc: 'Chama no WhatsApp e conta rapidamente o que você já opera hoje: audiência, agência ou stack técnico.',
      },
      {
        n: '02',
        title: 'Alinha o formato',
        desc: 'Comissão, replicação de funil ou acesso técnico (API/MCP): o que fizer sentido pra sua operação.',
      },
      {
        n: '03',
        title: 'Começa a rodar',
        desc: 'Acesso liberado, material de apoio na mão, e o primeiro cliente ou indicação já pode entrar.',
      },
    ],
    finalHeadline: 'Escolhe a trilha e chama a gente.',
    finalLead:
      'Sem formulário de 20 campos. É uma conversa no WhatsApp ou um e-mail, e você já sai sabendo os próximos passos.',
  },

  oficial: {
    hero: {
      eyebrow: 'Clickmax / Plataforma',
      headlineLines: ['A operação', 'inteira. Uma', 'plataforma.'],
      lead: 'Funis, páginas, CRM, mensagens, checkout e automações no mesmo banco de dados, com IA operando por MCP.',
      ctaPrimary: 'Comece grátis',
      ctaSecondary: 'Falar com vendas',
      note: '14 dias grátis no Professional. Sem cartão pra começar.',
    },
    capabilities: {
      eyebrow: 'Capacidades técnicas',
      headline: 'Construído para quem constrói.',
      lead: 'Sem página de marqueteiro. Cada capacidade abaixo é um recurso que existe hoje, com o nome técnico que ele tem.',
      items: [
        {
          eyebrow: 'Dev',
          title: 'Desenvolvedores',
          body: 'A plataforma inteira é acessível fora da UI.',
          bullets: [
            'API REST versionada + webhooks por evento (venda, refund, tag, opt-in)',
            'MCP: a IA opera a conta (cria funil, produto, automação) por linguagem natural',
            'SDK de tracking (pixel cx), server-side e client-side, sem sampling',
            'Import de página via HTML/CSS puro, sem lock-in de builder',
          ],
        },
        {
          eyebrow: 'Design',
          title: 'Designers',
          body: 'Sistema de design real, não um construtor de blocos genérico.',
          bullets: [
            'Design tokens exportáveis (cor, tipografia, espaçamento) por projeto',
            'Editor visual com camadas, grid e componentes reutilizáveis',
            'Templates premium prontos pra clonar e customizar em minutos',
            'Styleguide por workspace: consistência entre página, email e checkout',
          ],
        },
        {
          eyebrow: 'Agência',
          title: 'Agências',
          body: 'Uma operação, N clientes. Sem replicar trabalho manual.',
          bullets: [
            'Workspaces multi-cliente com permissão isolada por conta',
            'Replicação de funil inteiro (páginas + automações + produto) em 1 clique',
            'White-label: sem marca Clickmax em nenhuma tela do cliente final',
            'Relatórios consolidados por cliente: receita, funil, canal, tudo num painel',
          ],
        },
      ],
    },
    automation: {
      eyebrow: 'Automação',
      headline: 'Não é agendar mensagem. É roteamento por comportamento.',
      blocks: [
        {
          eyebrow: 'Flows',
          title: 'Fluxos de mensagem e ação por comportamento',
          specifics: [
            {
              k: 'Triggers',
              v: 'carrinho abandonado, pix expirado, tag adicionada, resposta de quiz',
            },
            {
              k: 'Eventos',
              v: 'page view, form submit, purchase, refund, cancelamento',
            },
            {
              k: 'Roteamento',
              v: 'condições AND/OR por comportamento, split test entre caminhos',
            },
          ],
        },
        {
          eyebrow: 'Max · IA',
          title: 'IA operando a conta por MCP',
          specifics: [
            {
              k: 'Comando',
              v: '"crie um funil pro meu curso": a IA monta captura, vendas e checkout',
            },
            {
              k: 'Escopo',
              v: 'cria produto, configura automação, monta quiz e pipeline a pedido',
            },
            {
              k: 'Acesso',
              v: 'mesmo protocolo MCP que orquestra ferramentas externas de IA',
            },
          ],
        },
      ],
    },
    proof: {
      eyebrow: 'Operadores reais',
      headline: 'Quem já roda no Clickmax.',
      count: '+30.100 negócios ativos',
      testimonials: [
        {
          name: 'Pedro Lotz',
          result: 'R$ 40k a 70k/dia',
          body: 'Não investia em tráfego. Ativou a própria base (800 mil seguidores) em vez de comprar audiência nova.',
          tags: ['Personal trainer', 'Fitness'],
        },
        {
          name: 'Leandro Rezende',
          result: 'R$ 550 mil/mês',
          body: 'Vendeu high ticket de pós-graduação pra uma base qualificada que os funis de ticket médio não alcançavam.',
          tags: ['Professor universitário', 'Design'],
        },
        {
          name: 'Alan Nicolas',
          result: 'R$ 270 mil',
          body: 'Cruzou audiências de interessados em inteligência artificial e vendeu R$ 270.000 com o Clickmax.',
          tags: ['Infoprodutor', 'IA'],
        },
        {
          name: 'Robson Souza',
          result: '+R$ 100 mil',
          body: 'Aproveitou uma hype viral e vendeu mais de R$ 100.000 em ingressos pra um público que criou do zero.',
          tags: ['Infoprodutor', 'Beleza'],
        },
        {
          name: 'Gilberto Prado',
          result: 'R$ 450 mil/mês',
          body: 'Trocou lançamento gratuito por funil de workshop pago. Retorno de 10× sobre o investimento.',
          tags: ['Designer'],
        },
        {
          name: 'Hayla Rodrigues',
          result: 'Múltiplos 5 dígitos',
          body: 'Migrou área de membros, páginas e checkout one-click em 2 dias e rodou uma campanha que antes não cabia no orçamento.',
          tags: ['Infoprodutora', 'Financeiro'],
        },
      ],
    },
    pricing: {
      eyebrow: 'Preços',
      headline: 'Um plano por estágio de operação.',
      badge: 'Mais escolhido',
      per: '/mês',
      ctaPrefix: 'Começar com ',
      note: 'Plano anual sai até 30% mais barato. Fale com vendas pra fechar no plano certo pro seu volume.',
      plans: [
        {
          tagline: 'Primeiro funil, primeira escala.',
          items: [
            '1 projeto · 2 funis · 15 páginas',
            '5.000 contatos ativos',
            '5.000 créditos de envio/mês',
            'Sem marca Clickmax',
          ],
        },
        {
          tagline: '14 dias grátis, sem cartão.',
          items: [
            'Funis, páginas e testes A/B ilimitados',
            'CRM e créditos de envio ilimitados',
            'MCP + API + webhooks liberados',
            '3 assentos de equipe',
          ],
        },
        {
          tagline: 'Múltiplos funis, múltiplos produtos.',
          items: [
            'Tudo do Professional, sem limite',
            '40.000 créditos de envio/mês',
            'Multi-cliente + replicação de funil',
            '10 assentos de equipe',
          ],
        },
      ],
    },
    finalCta: {
      headlineLines: ['Pare de somar ferramenta.', 'Comece a somar receita.'],
      ctaPrimary: 'Comece grátis',
      ctaSecondary: 'Falar com vendas',
    },
  },
}

export type HubCopy = typeof PT

/* INGLÊS — versão de marketing, não tradução literal. */
const EN: HubCopy = {
  meta: {
    allTitle: 'Clickmax: your whole operation, one platform.',
    oficialTitle: 'Clickmax: the whole operation, one platform.',
    partnersTitle: 'Partners: build on top of Clickmax',
    partnersDescription:
      'Affiliate with recurring commission, certified agency with one-click funnel replication, or dev/integrator with API, MCP and webhooks.',
  },

  moduleLabels: {
    funnels: 'Funnels',
    paginas: 'Pages',
    quizz: 'Quiz',
    automacoes: 'Automations',
    crm: 'CRM',
    mensagens: 'Messaging',
    checkout: 'Checkout',
    membros: 'Members',
    insights: 'Insights',
    dominios: 'Domains',
    linkprotect: 'LinkProtect',
    integracoes: 'Integrations',
  },

  nav: {
    salesCta: 'Talk to sales',
    trialCta: 'Start now',
    salesWhatsappText:
      'Hi, I came from clickmax.io/en/platform and I want to talk to sales.',
    ptLabel: 'Português',
    enLabel: 'English',
    esLabel: 'Español',
    links: {
      all: [
        { label: 'Products', href: '#do-it-all' },
        { label: 'Ecosystem', href: '#ecossistema' },
        { label: 'Partners', href: '/parceiros' },
        { label: 'Platform', href: '/oficial' },
      ],
      oficial: [
        { label: 'Built for builders', href: '#capacidades' },
        { label: 'Automation', href: '#automacao' },
        { label: 'Proof', href: '#prova' },
        { label: 'Pricing', href: '#pricing' },
      ],
      partners: [
        { label: 'Opportunities', href: '#oportunidades' },
        { label: 'How to join', href: '#como-entrar' },
        { label: 'See everything', href: '/all' },
      ],
      module: [
        { label: 'What changes', href: '#beneficios' },
        { label: 'Angles', href: '#angulos' },
        { label: 'See everything', href: '/all' },
      ],
    },
  },

  hero: {
    eyebrow: 'Clickmax is not just another software.',
    headlineLines: ['Every bit of AI', 'your marketing', 'needs'],
    lead: 'The AI that puts your marketing live by voice command and connects every signal from your pages, funnels, CRM, checkout and messaging so you sell more.',
    ctaPrimary: 'Start now',
    ctaSecondary: 'See the modules',
    manifestoBefore:
      'We help businesses attract more customers and sell to them again and again. All from one integrated AI tool that runs your entire ',
    manifestoHighlight: 'marketing',
    manifestoAfter: '.',
  },

  /* Not rendered: the manifesto line shows ONCE, in the hero overlay. */
  manifesto: {
    text: 'We help businesses attract more customers and sell to them again and again. All from one integrated AI tool that runs your entire marketing.',
  },

  socialProof: {
    eyebrow: 'The market is pulling far bigger numbers.',
    headline:
      'The old playbooks stopped working, and AI is finding routes nobody saw coming.',
    cases: [
      {
        chip: 'Design niche',
        title: 'Leandro Rezende clears R$550k a month on Clickmax.',
      },
      {
        chip: 'Paid workshops',
        title:
          'Gilberto Prado hits 10× return after swapping free launches for a paid funnel.',
      },
    ],
  },

  /** The Max demo, with the panel that opens on the side. */
  maxDemo: {
    /* Os exemplos giram embaixo do campo: são o repertório do que dá pra pedir.
       Uma lista fixa de seis vira parede de texto; girando, ela cabe em três
       linhas e ainda mostra o alcance. */
    exemplos: [
      'Build a funnel with an A/B test',
      'Build an automation on official WhatsApp and email',
      'Build a sales recovery flow',
      'Build my members area with these courses',
      'Build a sales pipeline that catches every lead from the capture page',
      'Build a sales page and publish it on my domain',
    ],
    eyebrow: 'See it live',
    headline: 'Try the Clickmax AI',
    headlineSoft: 'by clicking the button below',
    modulo: 'CRM',
    autor: 'You',
    dica: 'Search across the whole customer base',
    acao: 'Click and test',
    painel: {
      titulo: 'Max',
      subtitulo: 'money hidden in your base',
      fechar: 'Close the panel',
      voltar: 'Back to start',
      squad: 'Squad active',
      trilha: 'Tool execute · 7 probes in sequence · answer uses sample data',
      marca: 'Clickmax',
      concluido: 'Done',
      buscando: 'Searching…',
      saudacao: 'Good morning. Here is your week in review.',
      dinheiroRotulo: 'Recoverable revenue this week',
      dinheiroValor: 'R$ 587.420',
      dinheiroApoio: 'Revenue waiting for one action from you this week.',
      tituloTop: 'The 3 best moves of the week',
      subtituloTop: 'do them in this order, each item has 1 button',
      tituloSinais: 'Signals that need attention',
      aplicar: 'Apply',
      status: {
        urgente: 'Urgent',
        oportunidade: 'Opportunity',
        atencao: 'Heads up',
        pronto: 'Ready to run',
      },
      ctaTexto:
        'This summary is pinned to the top of your CRM every Monday at 8 AM. Each item above has 1 button and the AI fires the full workflow. Want to see this running on your own data?',
      ctaBotao: 'Get Max in my CRM',
      placeholder: 'Ask anything about this workspace…',
      enviar: 'Send',
      nota: 'Answers use sample data.',
    },
  },

  doItAll: {
    eyebrow: 'What you can build',
    headline: 'Do it all with Clickmax.',
    blocks: {
      'ia-aplicada': {
        title: 'Applied AI',
        desc: 'Ask where the money is leaking. Max reads funnels, abandoned carts and your sales kanban, then hands you a plan in one click.',
      },
      marketing: {
        title: 'Marketing',
        desc: 'Pages and funnels with end-to-end analytics.',
      },
      comercial: {
        title: 'Sales',
        desc: 'An opportunity kanban where no lead gets forgotten.',
      },
      'vendas-online': {
        title: 'Online sales',
        desc: 'Upsell, downsell and card recovery built in.',
      },
      templates: {
        title: 'Templates',
        desc: 'Blueprints of the plays that actually work, one click away.',
      },
      automacoes: {
        title: 'Automations',
        desc: 'Flows that answer, recover and sell without another hire.',
      },
    },
  },

  moduleShowcase: {
    eyebrow: '12 native modules',
    headline: 'Every module, up close.',
    modulePrefix: 'Module · ',
    discoverPrefix: 'Explore ',
    discoverSuffix: ' ›',
    items: {
      paginas: {
        title: 'Page Builder',
        desc: 'See the analytics and fix it on the spot. No dev, guided by the structure that sells.',
        bullets: [
          'Visual editor: <b>capture, sales, checkout, upsell, downsell and thank-you</b> pages, zero code.',
          'Ship and test fast, with <b>far less dependency on devs</b>.',
          'Plugs in external pages and <b>Clickmax scripts</b>.',
          'Runs straight on the <b>Cloud</b>, inside the same operation.',
        ],
        quote: 'The faster you publish, the faster you validate and sell.',
        chips: ['VISUAL EDITOR', 'BUILT-IN ANALYTICS', 'CLOUD PUBLISHING'],
      },
      funnels: {
        title: 'Sales Funnels and Analytics',
        desc: 'Stop guessing where the money leaks. Watch it live.',
        bullets: [
          'Build the whole journey, <b>from capture to sale</b>, in one place.',
          'See exactly <b>which step</b> is burning your money.',
          'Find out which pages convert and where people walk away.',
          'Optimize on real data: <b>more conversion without more traffic</b>.',
          'Track revenue per step and the impact of every change.',
        ],
        quote: 'Hunches never paid a bill. Data does.',
        chips: ['FULL JOURNEY', 'STEP-LEVEL ANALYTICS', 'REVENUE PER STEP'],
      },
      quizz: {
        title: 'Quiz Builder',
        desc: 'Your customer tells you what they want to buy, and you offer exactly that.',
        bullets: [
          'Questions with <b>conditional logic</b>: every answer changes the path and the offer.',
          'Scoring behind the answers builds a <b>personalized result</b> for each lead.',
          'Ends in a <b>personalized checkout</b>: they buy precisely what the quiz showed.',
          'Every answer becomes data: <b>qualifies and segments</b> without asking twice.',
        ],
        quote:
          'Personalized offers convert better. The quiz finds what they want and sells it on the spot.',
        chips: ['CONDITIONAL LOGIC', 'PERSONALIZED RESULT', 'DIRECT CHECKOUT'],
      },
      automacoes: {
        title: 'Message Flows and Automations',
        desc: 'Answer, recover and sell on autopilot: WhatsApp, SMS, email and voice.',
        bullets: [
          'Scale support <b>without hiring anyone else</b>.',
          'Recovers lost sales on its own, while you sleep.',
          'Always-on relationship that lifts <b>retention and repeat purchase</b>.',
          'Fires over <b>WhatsApp, SMS, email and voice</b>.',
          'Response speed turns straight into revenue.',
        ],
        quote: 'Whoever automates sells more and loses less.',
        chips: ['TRIGGER-BASED FLOWS', 'MULTICHANNEL', 'RUNS 24/7'],
      },
      mensagens: {
        title: 'Broadcast: SMS, Official WhatsApp API, Email and Voice',
        desc: 'Fire a campaign at your whole base in minutes.',
        bullets: [
          'Reach the entire base fast, whenever you want.',
          'Built for <b>one-off sales, launches and announcements</b>.',
          'Wakes up cold contacts and brings people back.',
          'Sends over <b>WhatsApp, SMS, email and voice</b>.',
          'Delivery metrics so you know what actually worked.',
        ],
        quote: 'Not every sale waits for automation. Some you fire today.',
        chips: ['OFFICIAL WHATSAPP', 'SMS AND VOICE', 'DELIVERY METRICS'],
      },
      crm: {
        title: 'Intelligent CRM',
        desc: 'With everything unified, AI sweeps the data and finds who is ready to buy.',
        bullets: [
          'Every customer detail <b>centralized in one place</b>.',
          'Advanced segmentation by behavior and history.',
          'More personalized offers = <b>more conversion</b>.',
          '360° view of each customer, from first touch to repeat purchase.',
          'More predictability for the sales operation.',
        ],
        quote: 'Know the customer and you sell more while serving better.',
        chips: ['UNIFIED BASE', 'ADVANCED SEGMENTATION', '360° HISTORY'],
      },
      checkout: {
        title: 'Products and Offers',
        desc: 'A single offer leaves money on the table. Sell however you want.',
        bullets: [
          'Digital, physical, <b>subscription, recurring, trial</b>, mentorship, service: all of it.',
          'The whole commercial operation in one place.',
          'Lifts average ticket with <b>upsell, downsell and order bump</b>.',
          'Affiliates, co-producers and partners without the headache.',
          'Multiple offers in the same funnel = <b>20 to 30% more revenue</b>.',
        ],
        quote: 'More offers in the funnel, 20 to 30% more from the same base.',
        chips: [
          'UPSELL AND ORDER BUMP',
          'SUBSCRIPTION AND TRIAL',
          'MULTI-OFFER',
        ],
      },
      membros: {
        title: 'Members Area',
        desc: 'Delivery becomes an experience, and happy customers buy again.',
        bullets: [
          'Courses, modules, lessons, files, trailers and <b>certificates</b> in one place.',
          '<b>Netflix-style</b> browsing with banners and in-app campaigns.',
          '<b>Contextual offers</b>: module finished → offer; course finished → upsell.',
          'Wired into Products, Checkouts, Funnels, CRM and Automations.',
        ],
        quote:
          'Selling is half the job. The other half is making them come back.',
        chips: ['STREAMING NAVIGATION', 'CERTIFICATES', 'CONTEXTUAL OFFERS'],
      },
      insights: {
        title: 'MCP and AI Operations',
        desc: 'Say what you need, or let AI tell you before you ask.',
        bullets: [
          'Run <b>the entire platform through AI</b>, in plain language.',
          '“Build a funnel for my course”, “set up a members area”: the AI <b>does it</b>.',
          'Creates subscription products, configures automations, builds quizzes and pipelines on request.',
          'Learning curve <b>close to zero</b>: the whole team can use it.',
        ],
        quote:
          'Instead of mastering dozens of screens, just say it. The AI operates for you.',
        chips: ['PLAIN LANGUAGE', 'NATIVE MCP', 'ZERO LEARNING CURVE'],
      },
      integracoes: {
        title: 'Shared Packages and Replication',
        desc: 'Clone an entire business in minutes, without rebuilding a thing.',
        bullets: [
          'Duplicates <b>funnels, pages, products, flows and automations</b> in one shot.',
          'Scales affiliate and partner operations while keeping the <b>standard</b>.',
          'You choose what stays <b>editable</b> and what stays <b>locked</b>.',
          'Cuts implementation from weeks to minutes.',
        ],
        quote:
          'What took months to build, you hand over ready in a few clicks.',
        chips: ['ONE-CLICK REPLICATION', 'STANDARD LOCKED IN', 'EDIT CONTROL'],
      },
      dominios: {
        title: 'Your domain, your operation.',
        desc: 'Publish pages and funnels on your own domain, with the whole tracking and checkout stack running behind it.',
        bullets: [],
        quote: '',
        chips: ['CUSTOM DOMAIN', 'NATIVE TRACKING', 'AUTOMATIC SSL'],
      },
      linkprotect: {
        title: 'AI Chatbot',
        desc: 'An agent trained on your business, answering 24/7, off the payroll.',
        bullets: [
          'Assistant <b>trained on your business data</b>: answers like someone who knows the product.',
          'Works <b>24/7</b> and cuts the cost of support.',
          'On-site chat <b>captures visitor data</b> while it answers.',
          'It all lands in the <b>CRM</b>: commercial intelligence, not a lost chat.',
        ],
        quote:
          'Most questions repeat. AI answers instantly and captures whoever is hot.',
        chips: ['AI CHATBOT', 'CAPTURE INTO CRM', 'LINK PROTECTION'],
      },
    },
  },

  ecosystem: {
    eyebrowPrefix: 'AI ecosystem · ',
    eyebrowSuffix: ' pages',
    headline:
      "It's as if we had a startup for every situation below, except all of them live in the same place.",
    subheadline: 'Explore the use cases where Clickmax makes you sell more.',
    cardCta: 'Explore',
    leadBefore: '',
    leadAfter:
      ' pages live, each attacking a different angle of the same problem: turning traffic into revenue. All of them run on the same Clickmax.',
  },

  partnership: {
    eyebrow: 'Partners',
    headline: 'Backed by partnership that shows up.',
    cta: 'Become a partner',
    pillars: [
      {
        title: 'Use-case acceleration',
        body: 'Teams that have put hundreds of operations live in weeks, not quarters.',
      },
      {
        title: 'Elite specialists',
        body: 'People certified in funnels, copy, traffic and automation inside Clickmax.',
      },
      {
        title: 'Deep customization',
        body: 'Tailored integrations, APIs and flows designed around how you sell.',
      },
      {
        title: 'Enterprise activation',
        body: 'Assisted migration, governance and dedicated support for large operations.',
      },
    ],
  },

  darkBand: {
    eyebrow: 'Operations designed to convert.',
    headline: 'Every module ships ready to sell, no extra tool required.',
    columns: [
      {
        title: 'Self-serve',
        body: 'Create the account, build the first funnel and publish on your own. No onboarding queue.',
      },
      {
        title: 'Clickmax Cloud',
        body: 'Runs entirely on our infrastructure: no server to configure, no certificate to renew.',
      },
      {
        title: 'With partner agencies',
        body: 'Or roll it out with people who have done it hundreds of times: replication, white-label and dedicated support.',
      },
    ],
  },

  finalCta: {
    eyebrow: 'Own your future.',
    headline: 'Your entire operation, live today.',
    ctaPrimary: 'Start now',
    ctaSecondary: 'Become a partner',
  },

  footer: {
    tagline: 'The whole operation. One platform.',
    orbEyebrow: 'The CX ecosystem',
    orbTitle: 'Every channel. Every signal. One orbit.',
    address:
      'Av. Yojiro Takaoka, 4384, Alphaville, Santana de Parnaíba/SP, Brazil',
    companySuffix: 'Clickmax, INFO TECH TECNOLOGIA LTDA.',
    columns: {
      modules: { title: 'Modules' },
      features: { title: 'Features' },
      builders: {
        title: 'For builders',
        items: [
          'Technical capabilities',
          'Pricing',
          'Product videos',
          'Changelog',
          'Support',
        ],
      },
      ecosystem: {
        title: 'AI ecosystem',
        countSuffix:
          ' live pages, each one selling a different angle of the same problem.',
      },
      legal: {
        title: 'Legal',
        items: [
          'Privacy policy',
          'Terms of use',
          'Cookies',
          'suporte@clickmax.io',
        ],
      },
    },
  },

  moduleLanding: {
    ctaTrial: 'Start the 14-day trial',
    ctaAll: 'See everything',
    benefitsEyebrow: 'What actually changes',
    anglesEyebrow: 'Angles for this module',
    anglesLead:
      'Clickmax ecosystem pages built on top of this feature, each one testing a different angle.',
    angleStartup: 'STARTUP',
    anglePrefix: 'ANGLE ',
    seeSite: 'Visit site',
  },

  partners: {
    hero: {
      eyebrow: 'Partners',
      headline: 'Build on top of Clickmax.',
      lead: 'Three ways in: refer the people already selling online, run clients as an agency, or wire Clickmax into the rest of the stack through API, MCP and webhooks.',
      ctaWhatsapp: 'Talk on WhatsApp',
    },
    whatsappText:
      'Hi, I came from clickmax.io/en/partners and I want to know more about becoming a partner (affiliate, agency or integrator).',
    tracksEyebrow: 'Pick your track',
    tracks: [
      {
        eyebrow: 'IF YOU ALREADY HAVE AN AUDIENCE',
        title: 'Affiliate',
        desc: 'Refer Clickmax to people already selling online and earn recurring commission for as long as they stay active. No product to build, no support to run.',
        bullets: [
          'Recurring commission every month, not only on the first sale',
          'Sales material ready to go: page, video and social proof already tested in live campaigns',
          'Works if you promote courses, mentorships, digital products or tools in your niche',
        ],
      },
      {
        eyebrow: 'IF YOU RUN CLIENTS',
        title: 'Certified agency',
        desc: 'Run several clients from one account, with funnel, page, product and automation replication. No rebuilding every operation from scratch on each new contract.',
        bullets: [
          'Shared packages: duplicate funnel, page, product and flow for a new client in minutes',
          'Multi-client organized in a single account, with no data bleeding between operations',
          'You decide what stays editable and what stays locked for the end client',
        ],
      },
      {
        eyebrow: 'IF YOU BUILD ON TOP',
        title: 'Dev / Integrator',
        desc: 'API, MCP and webhooks to connect Clickmax to the rest of the stack, or let AI operate the whole platform in plain language.',
        bullets: [
          'MCP: drive funnels, products, automations and pipelines through AI, no manual UI',
          'Webhook on every meaningful funnel, checkout and CRM event',
          'Open API to integrate with the tools your client already uses',
        ],
      },
    ],
    stepsEyebrow: 'How to join',
    steps: [
      {
        n: '01',
        title: 'Talk to us',
        desc: 'Message us on WhatsApp and tell us what you run today: audience, agency or technical stack.',
      },
      {
        n: '02',
        title: 'Agree on the format',
        desc: 'Commission, funnel replication or technical access (API/MCP): whatever fits your operation.',
      },
      {
        n: '03',
        title: 'Start running',
        desc: 'Access unlocked, support material in hand, and the first client or referral can come in.',
      },
    ],
    finalHeadline: 'Pick a track and ping us.',
    finalLead:
      'No 20-field form. One WhatsApp chat or one email, and you leave knowing the next steps.',
  },

  oficial: {
    hero: {
      eyebrow: 'Clickmax / Platform',
      headlineLines: ['The whole', 'operation. One', 'platform.'],
      lead: 'Funnels, pages, CRM, messaging, checkout and automations on the same database, with AI operating over MCP.',
      ctaPrimary: 'Start free',
      ctaSecondary: 'Talk to sales',
      note: '14 days free on Professional. No card to get started.',
    },
    capabilities: {
      eyebrow: 'Technical capabilities',
      headline: 'Built for the people who build.',
      lead: 'No marketing fluff. Every capability below ships today, under the technical name it actually has.',
      items: [
        {
          eyebrow: 'Dev',
          title: 'Developers',
          body: 'The whole platform is reachable outside the UI.',
          bullets: [
            'Versioned REST API + webhooks per event (sale, refund, tag, opt-in)',
            'MCP: AI runs the account (builds funnels, products, automations) in plain language',
            'Tracking SDK (cx pixel), server-side and client-side, no sampling',
            'Import pages as plain HTML/CSS, no builder lock-in',
          ],
        },
        {
          eyebrow: 'Design',
          title: 'Designers',
          body: 'A real design system, not another generic block builder.',
          bullets: [
            'Exportable design tokens (color, type, spacing) per project',
            'Visual editor with layers, grid and reusable components',
            'Premium templates ready to clone and customize in minutes',
            'Per-workspace styleguide: consistency across page, email and checkout',
          ],
        },
        {
          eyebrow: 'Agency',
          title: 'Agencies',
          body: 'One operation, N clients, without redoing the manual work.',
          bullets: [
            'Multi-client workspaces with isolated permissions per account',
            'Replicate an entire funnel (pages + automations + product) in one click',
            'White-label: no Clickmax branding on any end-client screen',
            'Consolidated reports per client: revenue, funnel, channel, one dashboard',
          ],
        },
      ],
    },
    automation: {
      eyebrow: 'Automation',
      headline: 'Not scheduled messages. Behavior-driven routing.',
      blocks: [
        {
          eyebrow: 'Flows',
          title: 'Message and action flows driven by behavior',
          specifics: [
            {
              k: 'Triggers',
              v: 'abandoned cart, expired payment, tag added, quiz answer',
            },
            {
              k: 'Events',
              v: 'page view, form submit, purchase, refund, cancellation',
            },
            {
              k: 'Routing',
              v: 'AND/OR conditions by behavior, split tests between paths',
            },
          ],
        },
        {
          eyebrow: 'Max · AI',
          title: 'AI running the account over MCP',
          specifics: [
            {
              k: 'Command',
              v: '"build a funnel for my course": the AI assembles capture, sales and checkout',
            },
            {
              k: 'Scope',
              v: 'creates products, configures automations, builds quizzes and pipelines on request',
            },
            {
              k: 'Access',
              v: 'the same MCP protocol that orchestrates external AI tools',
            },
          ],
        },
      ],
    },
    proof: {
      eyebrow: 'Real operators',
      headline: 'Who already runs on Clickmax.',
      count: '+30,100 active businesses',
      testimonials: [
        {
          name: 'Pedro Lotz',
          result: 'R$40k to 70k/day',
          body: 'Was not buying traffic. Activated his own base (800,000 followers) instead of paying for a new audience.',
          tags: ['Personal trainer', 'Fitness'],
        },
        {
          name: 'Leandro Rezende',
          result: 'R$550k/month',
          body: 'Sold a high-ticket graduate program to a qualified base that mid-ticket funnels never reached.',
          tags: ['University professor', 'Design'],
        },
        {
          name: 'Alan Nicolas',
          result: 'R$270k',
          body: 'Crossed audiences interested in artificial intelligence and sold R$270,000 with Clickmax.',
          tags: ['Course creator', 'AI'],
        },
        {
          name: 'Robson Souza',
          result: '+R$100k',
          body: 'Rode a viral moment and sold over R$100,000 in tickets to an audience he built from scratch.',
          tags: ['Course creator', 'Beauty'],
        },
        {
          name: 'Gilberto Prado',
          result: 'R$450k/month',
          body: 'Swapped the free launch for a paid workshop funnel. 10× return on spend.',
          tags: ['Designer'],
        },
        {
          name: 'Hayla Rodrigues',
          result: 'Multiple five figures',
          body: 'Migrated members area, pages and one-click checkout in 2 days and ran a campaign her budget could not fit before.',
          tags: ['Course creator', 'Finance'],
        },
      ],
    },
    pricing: {
      eyebrow: 'Pricing',
      headline: 'One plan per stage of your operation.',
      badge: 'Most popular',
      per: '/mo',
      ctaPrefix: 'Start with ',
      note: 'Annual billing saves up to 30%. Talk to sales to land on the right plan for your volume.',
      plans: [
        {
          tagline: 'First funnel, first scale.',
          items: [
            '1 project · 2 funnels · 15 pages',
            '5,000 active contacts',
            '5,000 sending credits/month',
            'No Clickmax branding',
          ],
        },
        {
          tagline: '14 days free, no card.',
          items: [
            'Unlimited funnels, pages and A/B tests',
            'Unlimited CRM and sending credits',
            'MCP + API + webhooks unlocked',
            '3 team seats',
          ],
        },
        {
          tagline: 'Multiple funnels, multiple products.',
          items: [
            'Everything in Professional, uncapped',
            '40,000 sending credits/month',
            'Multi-client + funnel replication',
            '10 team seats',
          ],
        },
      ],
    },
    finalCta: {
      headlineLines: ['Stop stacking tools.', 'Start stacking revenue.'],
      ctaPrimary: 'Start free',
      ctaSecondary: 'Talk to sales',
    },
  },
}

/* ESPANHOL — versão de marketing, não tradução literal. Espanhol neutro
 * (LATAM), sem regionalismo de Espanha nem de um país específico. */
const ES: HubCopy = {
  meta: {
    allTitle: 'Clickmax: toda tu operación en una sola plataforma.',
    oficialTitle: 'Clickmax: la operación completa en una plataforma.',
    partnersTitle: 'Socios: construye sobre Clickmax',
    partnersDescription:
      'Afiliado con comisión recurrente, agencia certificada con replicación de embudos, o dev/integrador con API, MCP y webhooks.',
  },

  moduleLabels: {
    funnels: 'Embudos',
    paginas: 'Páginas',
    quizz: 'Quiz',
    automacoes: 'Automatizaciones',
    crm: 'CRM',
    mensagens: 'Mensajes',
    checkout: 'Checkout',
    membros: 'Miembros',
    insights: 'Insights',
    dominios: 'Dominios',
    linkprotect: 'LinkProtect',
    integracoes: 'Integraciones',
  },

  nav: {
    salesCta: 'Hablar con ventas',
    trialCta: 'Empezar ahora',
    salesWhatsappText:
      'Hola, vengo de clickmax.io/es/plataforma y quiero hablar con ventas.',
    ptLabel: 'Português',
    enLabel: 'English',
    esLabel: 'Español',
    links: {
      all: [
        { label: 'Productos', href: '#do-it-all' },
        { label: 'Ecosistema', href: '#ecossistema' },
        { label: 'Socios', href: '/parceiros' },
        { label: 'Plataforma', href: '/oficial' },
      ],
      oficial: [
        { label: 'Construido para quien construye', href: '#capacidades' },
        { label: 'Automatización', href: '#automacao' },
        { label: 'Pruebas', href: '#prova' },
        { label: 'Precios', href: '#pricing' },
      ],
      partners: [
        { label: 'Oportunidades', href: '#oportunidades' },
        { label: 'Cómo entrar', href: '#como-entrar' },
        { label: 'Ver todo', href: '/all' },
      ],
      module: [
        { label: 'Qué cambia', href: '#beneficios' },
        { label: 'Ángulos', href: '#angulos' },
        { label: 'Ver todo', href: '/all' },
      ],
    },
  },

  hero: {
    eyebrow: 'Clickmax no es solo otro software más.',
    headlineLines: ['Toda la IA que', 'tu marketing', 'necesita'],
    lead: 'La inteligencia artificial que pone tu marketing en marcha por comando de voz y cruza todos los datos de tus páginas, embudos, CRM, checkout y mensajes para ayudarte a vender más.',
    ctaPrimary: 'Empezar ahora',
    ctaSecondary: 'Ver los módulos',
    manifestoBefore:
      'Ayudamos a los negocios a atraer más clientes y venderles más veces. Todo en una sola herramienta de IA integrada que hace todo tu ',
    manifestoHighlight: 'marketing',
    manifestoAfter: '.',
  },

  /* No se renderiza: la frase manifiesto aparece UNA vez, en el hero. */
  manifesto: {
    text: 'Ayudamos a los negocios a atraer más clientes y venderles más veces. Todo en una sola herramienta de IA integrada que hace todo tu marketing.',
  },

  socialProof: {
    eyebrow: 'El mercado está teniendo mucho más resultado.',
    headline:
      'Las recetas de siempre ya no funcionan, y la IA está encontrando caminos que nadie imaginaba.',
    cases: [
      {
        chip: 'Nicho diseño',
        title: 'Leandro Rezende supera los R$ 550 mil al mes con Clickmax.',
      },
      {
        chip: 'Talleres pagos',
        title:
          'Gilberto Prado logra 10× de retorno cambiando el lanzamiento gratuito por un embudo pago.',
      },
    ],
  },

  /** La demo del Max, con el panel que abre al costado. */
  maxDemo: {
    /* Os exemplos giram embaixo do campo: são o repertório do que dá pra pedir.
       Uma lista fixa de seis vira parede de texto; girando, ela cabe em três
       linhas e ainda mostra o alcance. */
    exemplos: [
      'Crea un embudo con prueba A/B',
      'Crea una automatización en WhatsApp oficial y en el correo',
      'Crea una recuperación de ventas',
      'Crea mi área de miembros con estos cursos',
      'Crea un pipeline comercial que reciba los leads de la página de captura',
      'Crea una página de ventas y publícala en mi dominio',
    ],
    eyebrow: 'Míralo en acción',
    headline: 'Prueba la IA de Clickmax',
    headlineSoft: 'haciendo clic en el botón de abajo',
    modulo: 'CRM',
    autor: 'Tú',
    dica: 'Busca en toda la base de clientes',
    acao: 'Haz clic y prueba',
    painel: {
      titulo: 'Max',
      subtitulo: 'dinero escondido en tu base',
      fechar: 'Cerrar el panel',
      voltar: 'Volver al inicio',
      squad: 'Squad activa',
      trilha:
        'Tool execute · 7 sondas en secuencia · respuesta con datos de ejemplo',
      marca: 'Clickmax',
      concluido: 'Listo',
      buscando: 'Buscando…',
      saudacao: 'Buenos días. Aquí está el resumen de tu semana.',
      dinheiroRotulo: 'Dinero recuperable esta semana',
      dinheiroValor: 'R$ 587.420',
      dinheiroApoio: 'Dinero esperando una acción tuya esta semana.',
      tituloTop: 'Las 3 mejores acciones de la semana',
      subtituloTop: 'hazlas en este orden, cada ítem tiene 1 botón',
      tituloSinais: 'Señales que piden atención',
      aplicar: 'Aplicar',
      status: {
        urgente: 'Urgente',
        oportunidade: 'Oportunidad',
        atencao: 'Atención',
        pronto: 'Listo para aplicar',
      },
      ctaTexto:
        'Este resumen queda fijado arriba en tu CRM todos los lunes a las 8h. Cada ítem de arriba tiene 1 botón y la IA dispara el flujo completo. ¿Quieres ver esto corriendo en tu base?',
      ctaBotao: 'Quiero el Max en mi CRM',
      placeholder: 'Pregunta lo que quieras sobre este workspace…',
      enviar: 'Enviar',
      nota: 'Las respuestas usan datos de ejemplo.',
    },
  },

  doItAll: {
    eyebrow: 'Lo que puedes hacer',
    headline: 'Hazlo todo con Clickmax.',
    blocks: {
      'ia-aplicada': {
        title: 'IA aplicada',
        desc: 'Pregunta dónde se está perdiendo dinero. La IA analiza embudos, abandonos y el kanban comercial, y te arma la estrategia con un clic.',
      },
      marketing: {
        title: 'Marketing',
        desc: 'Embudos, mensajes, automatizaciones y analítica.',
      },
      comercial: {
        title: 'Comercial',
        desc: 'Segmenta y vende a los leads calientes de tu kanban.',
      },
      'vendas-online': {
        title: 'Ventas online',
        desc: 'Upsell, one click buy y recuperación de pagos y tarjetas.',
      },
      templates: {
        title: 'Plantillas',
        desc: 'Estrategias que más funcionan en el mercado, a un clic de distancia.',
      },
      automacoes: {
        title: 'Automatizaciones',
        desc: 'Flujos que atienden, recuperan y venden sin depender de gente.',
      },
    },
  },

  moduleShowcase: {
    eyebrow: '12 módulos nativos',
    headline: 'Cada módulo, en detalle.',
    modulePrefix: 'Módulo · ',
    discoverPrefix: 'Descubrir ',
    discoverSuffix: ' ›',
    items: {
      paginas: {
        title: 'Constructor de Páginas',
        desc: 'Mira la analítica y ajusta al momento. Sin dev, guiado por la estructura que vende.',
        bullets: [
          'Editor visual: <b>captura, ventas, checkout, upsell, downsell y gracias</b> sin código.',
          'Lanza y prueba rápido, con <b>menos dependencia de devs</b>.',
          'Integra páginas externas y <b>scripts de Clickmax</b>.',
          'Corre directo en la <b>Cloud</b>, dentro de la misma operación.',
        ],
        quote: 'Cuanto más rápido publicas, más rápido validas y vendes.',
        chips: [
          'EDITOR VISUAL',
          'ANALÍTICA INTEGRADA',
          'PUBLICACIÓN EN LA CLOUD',
        ],
      },
      funnels: {
        title: 'Embudos de Ventas y Analítica',
        desc: 'Deja de adivinar dónde pierdes la venta. Míralo en tiempo real.',
        bullets: [
          'Arma el recorrido completo, <b>de la captura a la venta</b>, en un solo lugar.',
          'Mira exactamente <b>en qué etapa</b> se está escapando el dinero.',
          'Descubre qué páginas convierten más y dónde está el abandono.',
          'Optimiza la campaña con datos reales: <b>más conversión sin más tráfico</b>.',
          'Sigue los ingresos por etapa y el impacto de cada cambio.',
        ],
        quote: 'La intuición no paga cuentas. Los datos sí.',
        chips: [
          'RECORRIDO COMPLETO',
          'ANALÍTICA POR ETAPA',
          'INGRESOS POR ETAPA',
        ],
      },
      quizz: {
        title: 'Quiz Builder',
        desc: 'El cliente cuenta qué quiere comprar, y tú le ofreces el producto correcto.',
        bullets: [
          'Preguntas con <b>lógica condicional</b>: cada respuesta cambia el camino y la oferta.',
          'Los cálculos detrás de las respuestas arman el <b>resultado personalizado</b> de cada lead.',
          'Termina en <b>checkout personalizado</b>: compra exactamente lo que el quiz mostró.',
          'Cada respuesta se vuelve dato: <b>califica y segmenta</b> sin preguntar nada más.',
        ],
        quote:
          'La oferta personalizada convierte más. El quiz descubre lo que quiere y se lo vende al instante.',
        chips: [
          'LÓGICA CONDICIONAL',
          'RESULTADO PERSONALIZADO',
          'CHECKOUT DIRECTO',
        ],
      },
      automacoes: {
        title: 'Flujos de Mensajes y Automatizaciones',
        desc: 'Atiende, recupera y vende en automático: WhatsApp, SMS, email y llamada.',
        bullets: [
          'Escala la atención <b>sin contratar más gente</b>.',
          'Recupera la venta perdida sola, mientras duermes.',
          'Relación continua que aumenta <b>retención y recompra</b>.',
          'Dispara por <b>WhatsApp, SMS, email y llamada</b>.',
          'La velocidad de respuesta se convierte en venta.',
        ],
        quote: 'Quien automatiza vende más y pierde menos.',
        chips: ['FLUJOS POR DISPARADOR', 'MULTICANAL', 'FUNCIONA 24H'],
      },
      mensagens: {
        title: 'Broadcast: SMS, WhatsApp API Oficial, Email e IVR',
        desc: 'Dispara una campaña a toda tu base en minutos.',
        bullets: [
          'Comunicación rápida con toda la base, en el momento que quieras.',
          'Ideal para <b>venta puntual, lanzamiento y difusión</b>.',
          'Reactiva contactos inactivos y trae gente de vuelta.',
          'Envía por <b>WhatsApp, SMS, email y llamada</b>.',
          'Métricas de envío para saber qué funcionó.',
        ],
        quote:
          'No toda venta espera a una automatización. Algunas las disparas hoy.',
        chips: ['WHATSAPP OFICIAL', 'SMS E IVR', 'MÉTRICAS DE ENVÍO'],
      },
      crm: {
        title: 'CRM Inteligente',
        desc: 'Con todo unificado, la IA barre los datos y encuentra a quien quiere comprar.',
        bullets: [
          'Toda la información del cliente <b>centralizada en un solo lugar</b>.',
          'Segmentación avanzada por comportamiento e historial.',
          'Oferta más personalizada = <b>más conversión</b>.',
          'Visión 360° de cada cliente, del primer contacto a la recompra.',
          'Más previsibilidad para la operación comercial.',
        ],
        quote: 'Quien conoce al cliente vende más y atiende mejor.',
        chips: ['BASE UNIFICADA', 'SEGMENTACIÓN AVANZADA', 'HISTORIAL 360°'],
      },
      checkout: {
        title: 'Productos y Ofertas',
        desc: 'Una sola oferta deja dinero sobre la mesa. Vende como quieras.',
        bullets: [
          'Digital, físico, <b>suscripción, recurrencia, trial</b>, mentoría, servicio: todo.',
          'Toda la operación comercial centralizada en un lugar.',
          'Sube el ticket medio con <b>upsell, downsell y order bump</b>.',
          'Afiliados, coproductores y socios sin dolor de cabeza.',
          'Varias ofertas en el mismo embudo = <b>20 a 30% más de facturación</b>.',
        ],
        quote: 'Más ofertas en el embudo, 20 a 30% más con la misma base.',
        chips: ['UPSELL Y ORDER BUMP', 'SUSCRIPCIÓN Y TRIAL', 'MULTIOFERTA'],
      },
      membros: {
        title: 'Área de Miembros',
        desc: 'La entrega se vuelve experiencia, y el cliente satisfecho compra de nuevo.',
        bullets: [
          'Cursos, módulos, clases, archivos, trailers y <b>certificados</b> en un solo lugar.',
          'Navegación <b>estilo Netflix</b> con banners y campañas internas.',
          '<b>Ofertas contextuales</b>: terminó el módulo → oferta; terminó el curso → upsell.',
          'Integrada a Productos, Checkouts, Embudos, CRM y Automatizaciones.',
        ],
        quote:
          'Vender es la mitad. La otra mitad es hacer que el cliente vuelva.',
        chips: ['NAVEGACIÓN STREAMING', 'CERTIFICADOS', 'OFERTA CONTEXTUAL'],
      },
      insights: {
        title: 'MCP y Operación por IA',
        desc: 'Di lo que necesitas, o deja que la IA te avise antes de pedirlo.',
        bullets: [
          'Controla <b>toda la plataforma con IA</b>, en lenguaje natural.',
          '“Crea un embudo para mi curso”, “arma un área de miembros”: la IA <b>lo hace</b>.',
          'Crea producto de suscripción, configura automatizaciones, arma quiz y pipeline a pedido.',
          'Curva de aprendizaje <b>cercana a cero</b>, democratiza el uso para todo el equipo.',
        ],
        quote:
          'En vez de dominar decenas de pantallas, habla en lenguaje natural. La IA opera por ti.',
        chips: ['LENGUAJE NATURAL', 'MCP NATIVO', 'CERO CURVA'],
      },
      integracoes: {
        title: 'Paquetes Compartidos y Replicación',
        desc: 'Replica un negocio entero en minutos, sin rehacer nada desde cero.',
        bullets: [
          'Duplica <b>embudos, páginas, productos, flujos y automatizaciones</b> de una vez.',
          'Escala operaciones de afiliados y socios manteniendo el <b>estándar</b>.',
          'Define qué queda <b>editable</b> y qué queda <b>bloqueado</b>.',
          'Corta el tiempo de implementación de semanas a minutos.',
        ],
        quote: 'Lo que llevó meses armar, lo entregas listo en pocos clics.',
        chips: [
          'REPLICACIÓN EN 1 CLIC',
          'ESTÁNDAR GARANTIZADO',
          'CONTROL DE EDICIÓN',
        ],
      },
      dominios: {
        title: 'Tu dominio, tu operación.',
        desc: 'Publica páginas y embudos en tu dominio, con toda la estructura de tracking y checkout corriendo por detrás.',
        bullets: [],
        quote: '',
        chips: ['DOMINIO PROPIO', 'TRACKING NATIVO', 'SSL AUTOMÁTICO'],
      },
      linkprotect: {
        title: 'Chatbot con IA',
        desc: 'Un agente entrenado en tu negocio respondiendo 24h, sin nómina.',
        bullets: [
          'Asistente <b>entrenado con la información de tu negocio</b>: responde como quien conoce el producto.',
          'Atiende <b>24h</b> y baja el costo operativo del soporte.',
          'La conversación en el sitio <b>captura datos</b> del visitante mientras atiende.',
          'Todo cae en el <b>CRM</b>: se vuelve inteligencia comercial, no una charla perdida.',
        ],
        quote:
          'La mayoría de las dudas se repite. La IA responde al instante y además captura a quien está caliente.',
        chips: ['CHATBOT CON IA', 'CAPTURA EN EL CRM', 'PROTECCIÓN DE LINK'],
      },
    },
  },

  ecosystem: {
    eyebrowPrefix: 'Ecosistema IA · ',
    eyebrowSuffix: ' páginas',
    headline:
      'Es como si tuviéramos una startup para cada una de las situaciones de abajo, pero todas en el mismo lugar.',
    subheadline:
      'Explora los casos de uso en los que puedes usar Clickmax para vender más.',
    cardCta: 'Conocer',
    leadBefore: 'Son ',
    leadAfter:
      ' páginas activas, cada una atacando un ángulo distinto del mismo problema: convertir tráfico en ingresos. Todas corren sobre el mismo Clickmax.',
  },

  partnership: {
    eyebrow: 'Socios',
    headline: 'Sostenido por una alianza de verdad.',
    cta: 'Conviértete en socio',
    pillars: [
      {
        title: 'Aceleración de casos de uso',
        body: 'Equipos que ya pusieron cientos de operaciones en el aire en semanas, no en trimestres.',
      },
      {
        title: 'Especialistas de élite',
        body: 'Gente certificada en embudos, copy, tráfico y automatización dentro de Clickmax.',
      },
      {
        title: 'Personalización profunda',
        body: 'Integraciones a medida, APIs y flujos diseñados para tu modelo de venta.',
      },
      {
        title: 'Activación enterprise',
        body: 'Migración asistida, gobernanza y soporte dedicado para operaciones grandes.',
      },
    ],
  },

  darkBand: {
    eyebrow: 'Operaciones diseñadas para convertir.',
    headline:
      'Cada módulo nace listo para vender, sin depender de otra herramienta.',
    columns: [
      {
        title: 'Autoservicio',
        body: 'Crea la cuenta, arma el primer embudo y publica solo, sin esperar el onboarding de nadie.',
      },
      {
        title: 'Nube Clickmax',
        body: 'Corre entera en nuestra infraestructura: sin servidor que configurar, sin certificado que renovar.',
      },
      {
        title: 'Con agencias socias',
        body: 'O implementa con quien ya lo hizo cientos de veces: replicación, white-label y soporte dedicado.',
      },
    ],
  },

  finalCta: {
    eyebrow: 'Sé dueño de tu futuro.',
    headline: 'Toda tu operación, funcionando hoy mismo.',
    ctaPrimary: 'Empezar ahora',
    ctaSecondary: 'Conviértete en socio',
  },

  footer: {
    tagline: 'La operación completa. Una plataforma.',
    orbEyebrow: 'Ecosistema CX',
    orbTitle: 'Todo canal, todo dato, en la misma órbita.',
    address:
      'Av. Yojiro Takaoka, 4384, Alphaville, Santana de Parnaíba/SP, Brasil',
    companySuffix: 'Clickmax, INFO TECH TECNOLOGIA LTDA.',
    columns: {
      modules: { title: 'Módulos' },
      features: { title: 'Funcionalidades' },
      builders: {
        title: 'Para quien construye',
        items: [
          'Capacidades técnicas',
          'Precios',
          'Videos del producto',
          'Changelog',
          'Soporte',
        ],
      },
      ecosystem: {
        title: 'Ecosistema IA',
        countSuffix:
          ' páginas activas, cada una vendiendo un ángulo distinto del mismo problema.',
      },
      legal: {
        title: 'Legal',
        items: [
          'Política de privacidad',
          'Términos de uso',
          'Cookies',
          'suporte@clickmax.io',
        ],
      },
    },
  },

  moduleLanding: {
    ctaTrial: 'Probar 14 días gratis',
    ctaAll: 'Ver todo',
    benefitsEyebrow: 'Lo que cambia en la práctica',
    anglesEyebrow: 'Ángulos de este módulo',
    anglesLead:
      'Páginas del ecosistema Clickmax construidas sobre esta funcionalidad, cada una probando un ángulo distinto.',
    angleStartup: 'STARTUP',
    anglePrefix: 'ÁNGULO ',
    seeSite: 'Ver sitio',
  },

  partners: {
    hero: {
      eyebrow: 'Socios',
      headline: 'Construye sobre Clickmax.',
      lead: 'Tres formas de entrar: recomendando a quien ya vende en digital, operando clientes como agencia, o conectando Clickmax al resto del stack vía API, MCP y webhooks.',
      ctaWhatsapp: 'Hablar por WhatsApp',
    },
    whatsappText:
      'Hola, vengo de clickmax.io/es/socios y quiero saber más sobre ser socio (afiliado, agencia o integrador).',
    tracksEyebrow: 'Elige tu camino',
    tracks: [
      {
        eyebrow: 'PARA QUIEN YA TIENE AUDIENCIA',
        title: 'Afiliado',
        desc: 'Recomienda Clickmax a quien ya vende en digital y gana comisión recurrente mientras el cliente siga activo. Sin crear producto, sin sostener soporte.',
        bullets: [
          'Comisión recurrente mes a mes, no solo en la venta inicial',
          'Material de venta listo: página, video y prueba social ya probados en campaña real',
          'Sirve para quien ya promueve curso, mentoría, producto digital o herramienta del nicho',
        ],
      },
      {
        eyebrow: 'PARA QUIEN OPERA CLIENTES',
        title: 'Agencia certificada',
        desc: 'Opera varios clientes en una sola cuenta, con replicación de embudo, página, producto y automatización. Sin rearmar cada operación desde cero en cada contrato nuevo.',
        bullets: [
          'Paquetes compartidos: duplica embudo, página, producto y flujo para el cliente nuevo en minutos',
          'Multicliente organizado en una única cuenta, sin mezclar datos entre operaciones',
          'Tú decides qué queda editable y qué queda bloqueado para el cliente final',
        ],
      },
      {
        eyebrow: 'PARA QUIEN CONSTRUYE ENCIMA',
        title: 'Dev / Integrador',
        desc: 'API, MCP y webhooks para conectar Clickmax al resto del stack, o dejar que la IA opere toda la plataforma en lenguaje natural.',
        bullets: [
          'MCP: comanda embudo, producto, automatización y pipeline vía IA, sin interfaz manual',
          'Webhook en cada evento importante del embudo, del checkout y del CRM',
          'API abierta para integrar con las herramientas que el cliente ya usa',
        ],
      },
    ],
    stepsEyebrow: 'Cómo entrar',
    steps: [
      {
        n: '01',
        title: 'Habla con nosotros',
        desc: 'Escríbenos por WhatsApp y cuéntanos rápido qué operas hoy: audiencia, agencia o stack técnico.',
      },
      {
        n: '02',
        title: 'Definimos el formato',
        desc: 'Comisión, replicación de embudo o acceso técnico (API/MCP): lo que tenga sentido para tu operación.',
      },
      {
        n: '03',
        title: 'Empiezas a operar',
        desc: 'Acceso liberado, material de apoyo en mano, y el primer cliente o recomendación ya puede entrar.',
      },
    ],
    finalHeadline: 'Elige el camino y escríbenos.',
    finalLead:
      'Sin formulario de 20 campos. Es una conversación por WhatsApp o un email, y sales sabiendo los próximos pasos.',
  },

  oficial: {
    hero: {
      eyebrow: 'Clickmax / Plataforma',
      headlineLines: ['La operación', 'completa. Una', 'plataforma.'],
      lead: 'Embudos, páginas, CRM, mensajes, checkout y automatizaciones en la misma base de datos, con IA operando por MCP.',
      ctaPrimary: 'Empieza gratis',
      ctaSecondary: 'Hablar con ventas',
      note: '14 días gratis en Professional. Sin tarjeta para empezar.',
    },
    capabilities: {
      eyebrow: 'Capacidades técnicas',
      headline: 'Construido para quien construye.',
      lead: 'Sin página de marketinero. Cada capacidad de abajo es un recurso que existe hoy, con el nombre técnico que tiene.',
      items: [
        {
          eyebrow: 'Dev',
          title: 'Desarrolladores',
          body: 'La plataforma entera es accesible fuera de la UI.',
          bullets: [
            'API REST versionada + webhooks por evento (venta, reembolso, tag, opt-in)',
            'MCP: la IA opera la cuenta (crea embudo, producto, automatización) en lenguaje natural',
            'SDK de tracking (pixel cx), server-side y client-side, sin sampling',
            'Importa páginas en HTML/CSS puro, sin lock-in de builder',
          ],
        },
        {
          eyebrow: 'Diseño',
          title: 'Diseñadores',
          body: 'Sistema de diseño real, no un constructor de bloques genérico.',
          bullets: [
            'Design tokens exportables (color, tipografía, espaciado) por proyecto',
            'Editor visual con capas, grilla y componentes reutilizables',
            'Plantillas premium listas para clonar y personalizar en minutos',
            'Styleguide por workspace: consistencia entre página, email y checkout',
          ],
        },
        {
          eyebrow: 'Agencia',
          title: 'Agencias',
          body: 'Una operación, N clientes. Sin replicar trabajo manual.',
          bullets: [
            'Workspaces multicliente con permiso aislado por cuenta',
            'Replicación de embudo entero (páginas + automatizaciones + producto) en 1 clic',
            'White-label: sin marca Clickmax en ninguna pantalla del cliente final',
            'Reportes consolidados por cliente: ingresos, embudo, canal, todo en un panel',
          ],
        },
      ],
    },
    automation: {
      eyebrow: 'Automatización',
      headline: 'No es agendar mensajes. Es ruteo por comportamiento.',
      blocks: [
        {
          eyebrow: 'Flows',
          title: 'Flujos de mensaje y acción por comportamiento',
          specifics: [
            {
              k: 'Disparadores',
              v: 'carrito abandonado, pago expirado, tag agregada, respuesta de quiz',
            },
            {
              k: 'Eventos',
              v: 'page view, form submit, purchase, refund, cancelación',
            },
            {
              k: 'Ruteo',
              v: 'condiciones AND/OR por comportamiento, split test entre caminos',
            },
          ],
        },
        {
          eyebrow: 'Max · IA',
          title: 'IA operando la cuenta por MCP',
          specifics: [
            {
              k: 'Comando',
              v: '"crea un embudo para mi curso": la IA arma captura, ventas y checkout',
            },
            {
              k: 'Alcance',
              v: 'crea producto, configura automatización, arma quiz y pipeline a pedido',
            },
            {
              k: 'Acceso',
              v: 'el mismo protocolo MCP que orquesta herramientas externas de IA',
            },
          ],
        },
      ],
    },
    proof: {
      eyebrow: 'Operadores reales',
      headline: 'Quién ya opera en Clickmax.',
      count: '+30.100 negocios activos',
      testimonials: [
        {
          name: 'Pedro Lotz',
          result: 'R$ 40k a 70k/día',
          body: 'No invertía en tráfico. Activó su propia base (800 mil seguidores) en vez de comprar audiencia nueva.',
          tags: ['Personal trainer', 'Fitness'],
        },
        {
          name: 'Leandro Rezende',
          result: 'R$ 550 mil/mes',
          body: 'Vendió high ticket de posgrado a una base calificada que los embudos de ticket medio no alcanzaban.',
          tags: ['Profesor universitario', 'Diseño'],
        },
        {
          name: 'Alan Nicolas',
          result: 'R$ 270 mil',
          body: 'Cruzó audiencias interesadas en inteligencia artificial y vendió R$ 270.000 con Clickmax.',
          tags: ['Infoproductor', 'IA'],
        },
        {
          name: 'Robson Souza',
          result: '+R$ 100 mil',
          body: 'Aprovechó un hype viral y vendió más de R$ 100.000 en entradas para un público que creó desde cero.',
          tags: ['Infoproductor', 'Belleza'],
        },
        {
          name: 'Gilberto Prado',
          result: 'R$ 450 mil/mes',
          body: 'Cambió el lanzamiento gratuito por un embudo de taller pago. Retorno de 10× sobre la inversión.',
          tags: ['Diseñador'],
        },
        {
          name: 'Hayla Rodrigues',
          result: 'Múltiples 5 cifras',
          body: 'Migró área de miembros, páginas y checkout one-click en 2 días y corrió una campaña que antes no cabía en el presupuesto.',
          tags: ['Infoproductora', 'Finanzas'],
        },
      ],
    },
    pricing: {
      eyebrow: 'Precios',
      headline: 'Un plan por etapa de operación.',
      badge: 'El más elegido',
      per: '/mes',
      ctaPrefix: 'Empezar con ',
      note: 'El plan anual sale hasta 30% más barato. Habla con ventas para cerrar el plan correcto para tu volumen.',
      plans: [
        {
          tagline: 'Primer embudo, primera escala.',
          items: [
            '1 proyecto · 2 embudos · 15 páginas',
            '5.000 contactos activos',
            '5.000 créditos de envío/mes',
            'Sin marca Clickmax',
          ],
        },
        {
          tagline: '14 días gratis, sin tarjeta.',
          items: [
            'Embudos, páginas y tests A/B ilimitados',
            'CRM y créditos de envío ilimitados',
            'MCP + API + webhooks liberados',
            '3 asientos de equipo',
          ],
        },
        {
          tagline: 'Varios embudos, varios productos.',
          items: [
            'Todo lo de Professional, sin límite',
            '40.000 créditos de envío/mes',
            'Multicliente + replicación de embudo',
            '10 asientos de equipo',
          ],
        },
      ],
    },
    finalCta: {
      headlineLines: [
        'Deja de sumar herramientas.',
        'Empieza a sumar ingresos.',
      ],
      ctaPrimary: 'Empieza gratis',
      ctaSecondary: 'Hablar con ventas',
    },
  },
}

export const HUB_COPY: Record<Lang, HubCopy> = { pt: PT, en: EN, es: ES }

/** Copy do idioma pedido (uso direto quando o componente já recebe `lang`). */
export function copyFor(lang: Lang): HubCopy {
  return HUB_COPY[lang]
}
