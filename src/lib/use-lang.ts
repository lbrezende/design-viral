import { useLocation } from '@tanstack/react-router'

/** Idiomas aceitos no seletor (`?lang=`). */
export type UrlLang = 'en' | 'pt' | 'es'

/** Idiomas com copy escrita nas variantes de estilo (/v1–/vN) e na home.
 *  O conteúdo bilíngue (`Loc = { pt, en }`) só cobre estes dois. */
export type Lang = 'en' | 'pt'

/** Lê `?lang=` da URL. Aceita `en` e `es`; qualquer outro valor cai em 'pt'. */
export function useUrlLang(): UrlLang {
  const loc = useLocation()
  const fromObj = (loc.search as { lang?: unknown } | undefined)?.lang
  if (fromObj === 'en') return 'en'
  if (fromObj === 'es') return 'es'
  const str = (loc as { searchStr?: string }).searchStr || ''
  if (/(?:^|[?&])lang=en(?:&|$)/.test(str)) return 'en'
  if (/(?:^|[?&])lang=es(?:&|$)/.test(str)) return 'es'
  return 'pt'
}

/** Idioma da copy renderizada. Defaults para 'pt' — só `…?lang=en` renderiza
 *  a copy em inglês. `?lang=es` é reconhecido pelo seletor, mas as variantes
 *  de estilo ainda não têm copy em espanhol, então caem em PT (o espanhol do
 *  hub mora nas rotas /es/*, ver sections/allhub/i18n.ts). */
export function useLang(): Lang {
  return useUrlLang() === 'en' ? 'en' : 'pt'
}
