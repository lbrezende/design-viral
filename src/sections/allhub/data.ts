// Dados e constantes compartilhadas entre o hub /all, as páginas de módulo e
// /parceiros. Ver docs/ALL-HUB-SPEC.md.
//
// O JSON é importado como texto bruto (?raw) + JSON.parse em vez de import
// direto de módulo JSON: assim não dependemos de "resolveJsonModule" no
// tsconfig (config compartilhada com outras rotas/agentes).
import ecosystemRaw from '@/content/ai-ecosystem.json?raw'
import type { CxIconName } from './ClickmaxIcons'

/** Os 12 módulos nativos do Clickmax — id canônico usado por i18n.ts
 * (moduleLabels), HUB_ROUTES, ModuleShowcase e o rodapé. */
export type ModuleId =
  | 'funnels'
  | 'paginas'
  | 'quizz'
  | 'automacoes'
  | 'crm'
  | 'mensagens'
  | 'checkout'
  | 'membros'
  | 'insights'
  | 'dominios'
  | 'linkprotect'
  | 'integracoes'

export interface EcosystemItem {
  slug: string
  name: string
  feature: string
  url: string
  batch: 1 | 2
  angleId: string | null
  h1: string
  mode: 'light' | 'dark'
  canvas: string
  ink: string
  accent: string
}

export const ECOSYSTEM: EcosystemItem[] = JSON.parse(ecosystemRaw)

export const SUPPORT_EMAIL = 'suporte@clickmax.io'
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}`

/** Sitemap dos 12 módulos — usado pelas próprias páginas (ex.: bloco final
 * "outros módulos") e por /parceiros. AllHubNav/AllHubFooter já têm seus
 * próprios links internos (âncoras de página / sitemap do rodapé). */
export interface ModuleLink {
  slug: ModuleId
  /** PT-only label, mantido por compatibilidade — telas localizadas devem
   *  preferir `moduleLabels[slug]` (i18n.ts), não este campo. */
  label: string
  path: string
  /** Ícone oficial do app (ClickmaxIcons) — mesmo mapeamento do rail de
   *  módulos em all/ModuleShowcase.tsx. */
  icon: CxIconName
}

export const MODULE_LINKS: ModuleLink[] = [
  { slug: 'funnels', label: 'Funis', path: '/funnels', icon: 'funnels' },
  { slug: 'paginas', label: 'Páginas', path: '/paginas', icon: 'pages' },
  { slug: 'quizz', label: 'Quiz', path: '/quizz', icon: 'products' },
  {
    slug: 'automacoes',
    label: 'Automações',
    path: '/automacoes',
    icon: 'flows',
  },
  { slug: 'crm', label: 'CRM', path: '/crm', icon: 'leads' },
  {
    slug: 'mensagens',
    label: 'Mensagens',
    path: '/mensagens',
    icon: 'messages',
  },
  { slug: 'checkout', label: 'Checkout', path: '/checkout', icon: 'sales' },
  {
    slug: 'membros',
    label: 'Membros',
    path: '/membros',
    icon: 'membersarea',
  },
  { slug: 'insights', label: 'Insights', path: '/insights', icon: 'geral' },
  { slug: 'dominios', label: 'Domínios', path: '/dominios', icon: 'domains' },
  {
    slug: 'linkprotect',
    label: 'LinkProtect',
    path: '/linkprotect',
    icon: 'cloakers',
  },
  {
    slug: 'integracoes',
    label: 'Integrações',
    path: '/integracoes',
    icon: 'integrations',
  },
]

/** TODAS as features do Clickmax (não só os 12 módulos) — usado pelo hero
 * do hub /all (campo de blocos) e pelo mapa de features do rodapé.
 * Rótulo PT/EN aqui mesmo porque a maioria não existe em moduleLabels
 * (i18n.ts cobre só os módulos). `to` = módulo (id) que cobre a feature. */
export interface FeatureLink {
  pt: string
  en: string
  es: string
  icon: CxIconName
  to: ModuleId
}

export const FEATURES: FeatureLink[] = [
  { pt: 'Páginas', en: 'Pages', es: 'Páginas', icon: 'pages', to: 'paginas' },
  { pt: 'Funis', en: 'Funnels', es: 'Embudos', icon: 'funnels', to: 'funnels' },
  { pt: 'CRM', en: 'CRM', es: 'CRM', icon: 'leads', to: 'crm' },
  {
    pt: 'Checkout',
    en: 'Checkout',
    es: 'Checkout',
    icon: 'sales',
    to: 'checkout',
  },
  {
    pt: 'Mensagens',
    en: 'Messaging',
    es: 'Mensajes',
    icon: 'messages',
    to: 'mensagens',
  },
  {
    pt: 'Automações',
    en: 'Automations',
    es: 'Automatizaciones',
    icon: 'flows',
    to: 'automacoes',
  },
  {
    pt: 'Membros',
    en: 'Members',
    es: 'Miembros',
    icon: 'membersarea',
    to: 'membros',
  },
  {
    pt: 'Domínios',
    en: 'Domains',
    es: 'Dominios',
    icon: 'domains',
    to: 'dominios',
  },
  {
    pt: 'WhatsApp',
    en: 'WhatsApp',
    es: 'WhatsApp',
    icon: 'messages',
    to: 'mensagens',
  },
  { pt: 'SMS', en: 'SMS', es: 'SMS', icon: 'messages', to: 'mensagens' },
  { pt: 'Kanban', en: 'Kanban', es: 'Kanban', icon: 'projects', to: 'crm' },
  { pt: 'URA', en: 'Voice IVR', es: 'IVR', icon: 'messages', to: 'mensagens' },
  { pt: 'E-mail', en: 'Email', es: 'Email', icon: 'messages', to: 'mensagens' },
  {
    pt: 'Teste A/B',
    en: 'A/B testing',
    es: 'Test A/B',
    icon: 'geral',
    to: 'funnels',
  },
  {
    pt: 'Redirect',
    en: 'Redirect',
    es: 'Redirect',
    icon: 'cloakers',
    to: 'linkprotect',
  },
  {
    pt: 'Cursos',
    en: 'Courses',
    es: 'Cursos',
    icon: 'membersarea',
    to: 'membros',
  },
  {
    pt: 'Comunidade',
    en: 'Community',
    es: 'Comunidad',
    icon: 'communities',
    to: 'membros',
  },
  {
    pt: 'Mentorias',
    en: 'Live coaching',
    es: 'Mentorías',
    icon: 'communities',
    to: 'membros',
  },
  {
    pt: 'Webinários',
    en: 'Webinars',
    es: 'Webinars',
    icon: 'projects',
    to: 'funnels',
  },
  { pt: 'Quiz', en: 'Quiz', es: 'Quiz', icon: 'products', to: 'quizz' },
  {
    pt: 'Insights de IA',
    en: 'AI insights',
    es: 'Insights de IA',
    icon: 'geral',
    to: 'insights',
  },
  {
    pt: 'Segmentação',
    en: 'Segments',
    es: 'Segmentación',
    icon: 'leads',
    to: 'crm',
  },
  {
    pt: 'Comercial',
    en: 'Sales team',
    es: 'Comercial',
    icon: 'projects',
    to: 'crm',
  },
  { pt: 'Leads', en: 'Leads', es: 'Leads', icon: 'leads', to: 'crm' },
  {
    pt: 'Instagram',
    en: 'Instagram',
    es: 'Instagram',
    icon: 'messages',
    to: 'mensagens',
  },
  {
    pt: 'Direct',
    en: 'Direct',
    es: 'Direct',
    icon: 'messages',
    to: 'mensagens',
  },
  {
    pt: 'Chat ao vivo',
    en: 'Live chat',
    es: 'Chat en vivo',
    icon: 'messages',
    to: 'mensagens',
  },
  {
    pt: 'Sentimento',
    en: 'Sentiment',
    es: 'Sentimiento',
    icon: 'geral',
    to: 'insights',
  },
  {
    pt: 'Follow-up',
    en: 'Follow-up',
    es: 'Follow-up',
    icon: 'flows',
    to: 'automacoes',
  },
  {
    pt: 'Integrações',
    en: 'Integrations',
    es: 'Integraciones',
    icon: 'integrations',
    to: 'integracoes',
  },
  {
    pt: 'Carteira',
    en: 'Wallet',
    es: 'Billetera',
    icon: 'wallet',
    to: 'checkout',
  },
  {
    pt: 'Produtos',
    en: 'Products',
    es: 'Productos',
    icon: 'products',
    to: 'checkout',
  },
]

function normalize(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/**
 * Filtra o ecossistema de 83 páginas por palavras-chave do módulo (contra
 * name+feature, sem acento). Ordena por nº de acertos, prioriza batch 1
 * (feature "limpa") e garante um mínimo de itens (fallback) pra faixa nunca
 * ficar vazia.
 */
export function relatedAngles(keywords: string[], limit = 8): EcosystemItem[] {
  const norm = keywords.map(normalize)
  const scored = ECOSYSTEM.map(item => {
    const hay = normalize(`${item.name} ${item.feature}`)
    const hits = norm.reduce((n, k) => (hay.includes(k) ? n + 1 : n), 0)
    return { item, hits }
  }).filter(x => x.hits > 0)

  scored.sort((a, b) => b.hits - a.hits || a.item.batch - b.item.batch)

  const picked = scored.map(x => x.item).slice(0, limit)

  if (picked.length < Math.min(limit, 4)) {
    const used = new Set(picked.map(p => p.slug))
    for (const item of ECOSYSTEM) {
      if (picked.length >= 4) break
      if (!used.has(item.slug)) {
        picked.push(item)
        used.add(item.slug)
      }
    }
  }

  return picked
}
