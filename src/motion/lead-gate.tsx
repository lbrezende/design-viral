import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { CX_TOKEN } from './cx-config'

/* Lead gate do Design Viral: qualquer ação "premium" (testar/trocar um motion,
   copiar prompt, abrir a biblioteca completa) passa por aqui. Se a pessoa já
   deixou os dados (localStorage), a ação roda direto; senão abre o popup
   "Veja gratuitamente toda a biblioteca de animações" e, ao enviar, cria o
   lead no CRM do Clickmax via Browser SDK (cxs('lead', …) — o loader vem do
   <ClickmaxPixel /> da página) e executa a ação represada. */

const CAPTURED_KEY = 'dv_lead_captured'

export const WORKSHOP_URL = 'https://lp.designengineer.com.br/'

/** Link do workshop com UTMs deixando claro que veio do Design Viral. */
export function workshopUrl(content: string): string {
  const p = new URLSearchParams({
    utm_source: 'designviral',
    utm_medium: 'site',
    utm_campaign: 'ux-motion',
    utm_content: content,
  })
  return `${WORKSHOP_URL}?${p.toString()}`
}

type CxWindow = Window & { cxs?: (...a: unknown[]) => void }

export function cxTrack(event: string, data?: Record<string, unknown>): void {
  try {
    const c = (window as CxWindow).cxs
    if (typeof c === 'function') c('track', event, data)
  } catch {
    /* sem SDK vira no-op */
  }
}

/* Canal garantido da captura externa: o webhook de entrada do workspace
   UX Unicórnio (token cx-token-…) recebe o lead mesmo antes de o projeto
   "Campanhas virais" existir no painel — o Browser SDK abaixo complementa
   atrelando o lead à sessão/cliques da página. */
function webhookLead(name: string, email: string, phone: string): void {
  try {
    fetch(`https://webhooks.clickmax.io/${CX_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        event: 'lead',
        name: name.trim() || undefined,
        email: email.trim(),
        phone: phone.replace(/\D/g, '') || undefined,
        source: 'designviral.vercel.app/motion',
        project: 'Campanhas virais',
        funnel: 'UX Motion',
      }),
    }).catch(() => {})
  } catch {
    /* best-effort */
  }
}

function cxsLead(name: string, email: string, phone: string): void {
  try {
    const c = (window as CxWindow).cxs
    if (typeof c !== 'function') return
    c(
      'lead',
      {
        name: name.trim() || undefined,
        email: email.trim(),
        telephone: phone.replace(/\D/g, '') || undefined,
      },
      (err: unknown) => {
        if (err) console.error('[designviral] cxs lead falhou:', err)
      },
    )
  } catch {
    /* best-effort */
  }
}

type LeadGateCtx = {
  captured: boolean
  /** Roda `action` se já capturou; senão abre o popup e roda após capturar. */
  gate: (action: () => void, reason: string) => void
}

const Ctx = createContext<LeadGateCtx>({ captured: false, gate: a => a() })

export function useLeadGate(): LeadGateCtx {
  return useContext(Ctx)
}

export function LeadGateProvider({ children }: { children: React.ReactNode }) {
  const [captured, setCaptured] = useState(false)
  const [open, setOpen] = useState(false)
  const pending = useRef<(() => void) | null>(null)

  useEffect(() => {
    try {
      setCaptured(localStorage.getItem(CAPTURED_KEY) === '1')
    } catch {}
  }, [])

  const gate = useCallback(
    (action: () => void, reason: string) => {
      if (captured) {
        action()
        return
      }
      cxTrack('lead_gate_open', { reason })
      pending.current = action
      setOpen(true)
    },
    [captured],
  )

  const onCaptured = useCallback(() => {
    setCaptured(true)
    setOpen(false)
    const run = pending.current
    pending.current = null
    /* dá um respiro pro popup fechar antes da ação (ex: copiar + toast) */
    if (run) setTimeout(run, 150)
  }, [])

  return (
    <Ctx.Provider value={{ captured, gate }}>
      {children}
      {open && (
        <LeadPopup onClose={() => setOpen(false)} onCaptured={onCaptured} />
      )}
    </Ctx.Provider>
  )
}

function LeadPopup({
  onClose,
  onCaptured,
}: {
  onClose: () => void
  onCaptured: () => void
}) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (busy || !email.trim()) return
    setBusy(true)
    cxsLead(nome, email, phone)
    webhookLead(nome, email, phone)
    cxTrack('lead_captured', { origin: 'motion_gate' })
    try {
      localStorage.setItem(CAPTURED_KEY, '1')
      localStorage.setItem(
        'dv_lead',
        JSON.stringify({ name: nome, email, phone, ts: Date.now() }),
      )
    } catch {}
    /* instante pro SDK enfileirar o envio antes de fechar */
    setTimeout(onCaptured, 400)
  }

  return (
    <div
      className="cxa fixed inset-0 z-[90] flex items-center justify-center p-4 !bg-transparent"
      style={{ background: 'rgba(20, 23, 26, 0.4)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Biblioteca de animações"
    >
      <div className="relative w-full max-w-[420px] rounded-[var(--cxa-radius)] bg-[var(--cxa-paper)] p-7 text-[var(--cxa-ink)] shadow-[var(--cxa-shadow-lift)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full text-[var(--cxa-icon)] transition-colors hover:bg-[var(--cxa-subtle)] hover:text-[var(--cxa-ink)]"
        >
          ✕
        </button>

        <p className="cxa-eyebrow mb-2">Biblioteca de animações</p>
        <h3 className="mb-2 font-semibold text-[22px] leading-tight tracking-[-0.02em]">
          Veja gratuitamente toda a biblioteca de animações.
        </h3>
        <p className="mb-5 text-[14px] text-[var(--cxa-ink-soft)] leading-relaxed">
          Basta deixar seu nome, email e telefone — e todos os 52 motions, com
          prompts prontos para copiar, ficam liberados.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
            className="dv-input"
          />
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Seu melhor email"
            autoComplete="email"
            className="dv-input"
          />
          <PhoneInput
            defaultCountry="br"
            value={phone}
            onChange={setPhone}
            inputProps={{
              id: 'dv-telephone',
              name: 'telephone',
              'aria-label': 'WhatsApp',
              autoComplete: 'tel',
              placeholder: 'WhatsApp',
            }}
            className="dv-phone"
          />
          <button
            type="submit"
            disabled={busy}
            className="cxa-pill-gradient mt-1 w-full justify-center disabled:opacity-60"
          >
            {busy ? 'Liberando…' : 'Liberar a biblioteca gratuita'}
          </button>
        </form>

        <p className="mt-4 text-[11.5px] text-[var(--cxa-ink-soft)] leading-relaxed">
          Sem spam: só a biblioteca e o convite do workshop de 22 e 23 de
          agosto do Design Engineer.
        </p>
      </div>
    </div>
  )
}
