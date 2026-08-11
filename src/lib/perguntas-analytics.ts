/* Typeform-style analytics para os funis de perguntas do Acelerador.
   O prefix do evento é configurável (ex.: 'raiox') pra permitir tracking
   isolado por variante do funil.

   Métricas derivadas (calculadas no admin/dashboard depois):
     - Iniciados = count(<prefix>_perguntas_started)
     - Completion rate = count(completed) / count(started)
     - Tempo médio de completion = média(total_elapsed_ms de completed)
     - Drop-off por slide = slide_view[N] / slide_view[N-1]
     - Tempo médio por slide = diff(slide_view consecutivos) */

const EVENTS_ENDPOINT =
  (import.meta as { env?: Record<string, string> }).env
    ?.VITE_PERGUNTAS_EVENTS_ENDPOINT ||
  'https://clickmax-diagnostico.vercel.app/api/perguntas-events'

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[] }
type Cxs = ((...args: unknown[]) => void) & { queue?: unknown[] }

type FbqWindow = Window & { fbq?: Fbq }
type CxsWindow = Window & { cxs?: Cxs }

export type EventPayload = {
  session_id: string
  slide_index?: number
  slide_key?: string
  answer?: string | Record<string, unknown>
  elapsed_ms?: number
  total_elapsed_ms?: number
  meta?: Record<string, unknown>
}

export type Suffix =
  | 'perguntas_view'
  | 'perguntas_started'
  | 'slide_view'
  | 'slide_answered'
  | 'perguntas_completed'
  | 'perguntas_abandoned'

function generateSessionId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`
  }
  return `${prefix}_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
}

export function createAnalytics(prefix: string) {
  const SESSION_KEY = `${prefix}_perguntas_session`
  const STARTED_KEY = `${prefix}_perguntas_started_fired`

  function getSessionId(): string {
    if (typeof window === 'undefined') return generateSessionId(prefix)
    try {
      const existing = sessionStorage.getItem(SESSION_KEY)
      if (existing) return existing
      const fresh = generateSessionId(prefix)
      sessionStorage.setItem(SESSION_KEY, fresh)
      return fresh
    } catch {
      return generateSessionId(prefix)
    }
  }

  function fireMeta(name: string, payload: EventPayload) {
    if (typeof window === 'undefined') return
    const w = window as FbqWindow
    try {
      w.fbq?.('trackCustom', name, payload)
    } catch {}
  }

  function fireClickmax(name: string, payload: EventPayload) {
    if (typeof window === 'undefined') return
    const w = window as CxsWindow
    try {
      w.cxs?.('track', name, payload)
    } catch {}
  }

  function fireBackend(name: string, payload: EventPayload) {
    if (typeof window === 'undefined') return
    const body = JSON.stringify({
      name,
      ...payload,
      ts: new Date().toISOString(),
    })
    try {
      if ('sendBeacon' in navigator) {
        const blob = new Blob([body], { type: 'text/plain;charset=UTF-8' })
        navigator.sendBeacon(EVENTS_ENDPOINT, blob)
        return
      }
    } catch {}
    fetch(EVENTS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body,
      keepalive: true,
    }).catch(() => {})
  }

  function fireEvent(
    suffix: Suffix,
    payload: Omit<EventPayload, 'session_id'> = {},
  ) {
    const name = `${prefix}_${suffix}`
    const full: EventPayload = {
      session_id: getSessionId(),
      ...payload,
    }
    fireMeta(name, full)
    fireClickmax(name, full)
    fireBackend(name, full)
    if (
      typeof window !== 'undefined' &&
      (import.meta as { env?: Record<string, string> }).env?.DEV
    ) {
      console.debug(`[${prefix}-analytics]`, name, full)
    }
  }

  function markStartedOnce(payload: Omit<EventPayload, 'session_id'> = {}) {
    if (typeof window === 'undefined') return false
    try {
      if (sessionStorage.getItem(STARTED_KEY)) return false
      sessionStorage.setItem(STARTED_KEY, '1')
      fireEvent('perguntas_started', payload)
      return true
    } catch {
      fireEvent('perguntas_started', payload)
      return true
    }
  }

  function resetSession() {
    if (typeof window === 'undefined') return
    try {
      sessionStorage.removeItem(SESSION_KEY)
      sessionStorage.removeItem(STARTED_KEY)
    } catch {}
  }

  return { fireEvent, markStartedOnce, getSessionId, resetSession }
}
