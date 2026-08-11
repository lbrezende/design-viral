import { useEffect } from 'react'

/** Pixel/SDK do Clickmax (global). Injeta o script no <head> uma única vez e
 *  dispara page_view. Renderizado SÓ nas páginas que pedem o tracking — nunca
 *  na raiz nem nas outras rotas. Cada rota chama com o seu próprio
 *  `projectSlug`/`pageSlug`. Equivalente ao snippet oficial do Clickmax.
 *  `projectSlug` e `pageSlug` são obrigatórios (identificam o produto/página no
 *  Clickmax). */
type CxWindow = Window & {
  cxs?: ((...args: unknown[]) => void) & { queue?: unknown[] }
  _cx?: { callMethod: (...args: unknown[]) => void }
}

type ClickmaxPixelProps = {
  projectSlug: string
  pageSlug: string
}

export function ClickmaxPixel({ projectSlug, pageSlug }: ClickmaxPixelProps) {
  useEffect(() => {
    const w = window as CxWindow
    if (!w.cxs) {
      const cxs = ((...args: unknown[]) => {
        if (w._cx) w._cx.callMethod(...args)
        else cxs.queue?.push(args)
      }) as ((...args: unknown[]) => void) & { queue: unknown[] }
      cxs.queue = []
      w.cxs = cxs

      const src = `https://api.clickmax.io/sdk/script.js?ps=${encodeURIComponent(
        projectSlug,
      )}&pg=${encodeURIComponent(pageSlug)}`
      if (!document.querySelector(`script[src="${src}"]`)) {
        const s = document.createElement('script')
        s.async = true
        s.src = src
        document.head.appendChild(s)
      }
      w.cxs('init', projectSlug, pageSlug)
    }
    w.cxs?.('track', 'page_view')
  }, [projectSlug, pageSlug])

  return null
}
