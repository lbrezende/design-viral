import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  MOTION_BY_ID,
  MOTIONS,
  type MotionDef,
} from './catalog'
import { DemoFold } from './demo-folds'
import { cxTrack, useLeadGate } from './lead-gate'
import { MotionPreview } from './previews'

/* Cada bloco da página /motion vem embrulhado aqui. O conteúdo original NÃO
   é alterado: o botão flutuante à direita só CONTA qual motion aquele bloco
   já usa. Ao escolher outro motion no painel, uma dobra de exemplo dedicada
   (DemoFold) é inserida logo abaixo do bloco — o efeito acontece só ali,
   com conteúdo desenhado para aquele tipo de movimento. */

function MotionPicker({
  current,
  sectionName,
  onPick,
  onClose,
}: {
  current: MotionDef
  sectionName: string
  onPick: (id: string) => void
  onClose: () => void
}) {
  const { gate } = useLeadGate()
  const [copied, setCopied] = useState(false)

  const copyPrompt = () => {
    gate(() => {
      try {
        navigator.clipboard?.writeText(
          `${current.prompt}\n\n// Exemplo:\n${current.code}`,
        )
      } catch {}
      cxTrack('prompt_copy', { motion: current.id, section: sectionName })
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }, `copy:${current.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="cxa fixed top-1/2 right-4 z-[70] w-[340px] max-w-[calc(100vw-2rem)] -translate-y-1/2 overflow-hidden rounded-[var(--cxa-radius)] !bg-[var(--cxa-paper)] text-[var(--cxa-ink)] shadow-[var(--cxa-shadow-lift)]"
      style={{ maxHeight: 'min(78vh, 640px)' }}
    >
      <div className="flex items-start justify-between gap-3 border-[var(--cxa-hairline)] border-b p-4">
        <div>
          <p className="cxa-eyebrow !text-[11px]">{sectionName}</p>
          <p className="mt-0.5 font-semibold text-[15px] tracking-[-0.01em]">
            Aqui está sendo usado: {current.name}
          </p>
          <p className="mt-0.5 text-[12px] text-[var(--cxa-ink-soft)]">
            {current.desc}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-[var(--cxa-icon)] transition-colors hover:bg-[var(--cxa-subtle)] hover:text-[var(--cxa-ink)]"
        >
          ✕
        </button>
      </div>

      <div className="border-[var(--cxa-hairline)] border-b p-4">
        <p className="mb-2 text-[11px] text-[var(--cxa-ink-soft)]">
          Prompt para vibe codar este efeito:
        </p>
        <p className="mb-3 max-h-[88px] overflow-y-auto rounded-[var(--cxa-radius-sm)] border border-[var(--cxa-hairline)] bg-[var(--cxa-subtle)] p-3 text-[12px] text-[var(--cxa-ink)] leading-relaxed">
          {current.prompt}
        </p>
        <button
          type="button"
          onClick={copyPrompt}
          className="cxa-pill-gradient w-full justify-center !py-2.5 text-[13px]"
        >
          {copied ? 'Copiado ✓' : 'Copiar prompt + código'}
        </button>
      </div>

      <div className="overflow-y-auto p-4" style={{ maxHeight: '300px' }}>
        <p className="mb-2 text-[11px] text-[var(--cxa-ink-soft)]">
          Escolha outro motion para <strong>adicionar uma dobra de exemplo</strong>{' '}
          logo abaixo deste bloco:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {MOTIONS.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => onPick(m.id)}
              className={`rounded-[10px] border px-2.5 py-2 text-left transition-colors ${
                m.id === current.id
                  ? 'border-[var(--cxa-ink)] bg-[var(--cxa-subtle)]'
                  : 'border-[var(--cxa-hairline)] hover:border-[var(--cxa-ink)] hover:bg-[var(--cxa-subtle)]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <i
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ background: CATEGORY_COLORS[m.category] }}
                />
                <span className="truncate font-medium text-[11.5px] text-[var(--cxa-ink)]">
                  {m.name}
                </span>
              </span>
              <span className="mt-0.5 block text-[10px] text-[var(--cxa-ink-soft)]">
                {CATEGORY_LABELS[m.category]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function MotionSection({
  name,
  defaultMotion,
  children,
}: {
  name: string
  defaultMotion: string
  children: React.ReactNode
}) {
  const { gate } = useLeadGate()
  const [open, setOpen] = useState(false)
  const [demoId, setDemoId] = useState<string | null>(null)

  const def = MOTION_BY_ID[defaultMotion]
  const demo = demoId ? MOTION_BY_ID[demoId] : null

  const pick = (id: string) => {
    gate(() => {
      setDemoId(id)
      setOpen(false)
      cxTrack('demo_fold_add', { section: name, motion: id })
    }, `demo:${id}`)
  }

  return (
    <>
      <section className="relative">
        {children}

        {/* Botão flutuante à direita: informa o motion nativo deste bloco */}
        <div className="pointer-events-none absolute inset-y-0 right-3 z-40 hidden items-center md:flex">
          <div className="pointer-events-auto sticky top-1/2">
            <button
              type="button"
              onClick={() => {
                setOpen(v => !v)
                if (!open)
                  cxTrack('motion_chip_open', { section: name, motion: def.id })
              }}
              title={`Aqui está sendo usado o motion "${def.name}". Escolha outro para adicionar uma dobra de exemplo.`}
              className="group flex items-center gap-2 rounded-full border border-[var(--cxa-hairline)] bg-[var(--cxa-paper)] py-2 pr-3.5 pl-2.5 text-[var(--cxa-ink)] shadow-[var(--cxa-shadow-lift)] transition-all hover:border-[var(--cxa-ink)]"
            >
              <i
                className="size-2 rounded-full"
                style={{ background: CATEGORY_COLORS[def.category] }}
              />
              <span className="max-w-0 overflow-hidden whitespace-nowrap text-[11px] text-[var(--cxa-ink-soft)] opacity-0 transition-all duration-300 group-hover:max-w-[190px] group-hover:opacity-100">
                Aqui está sendo usado
              </span>
              <span className="whitespace-nowrap font-semibold text-[12px]">
                {def.name}
              </span>
              <span className="rounded-full bg-[var(--cxa-subtle)] px-2 py-0.5 text-[10.5px] text-[var(--cxa-ink-soft)] transition-colors group-hover:bg-[var(--cxa-dark)] group-hover:text-white">
                + exemplo
              </span>
            </button>
          </div>
        </div>

        {/* Mobile: chip compacto no rodapé do bloco */}
        <div className="absolute right-3 bottom-3 z-40 md:hidden">
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-1.5 rounded-full border border-[var(--cxa-hairline)] bg-[var(--cxa-paper)] px-3 py-1.5 font-semibold text-[11px] text-[var(--cxa-ink)] shadow-[var(--cxa-shadow)]"
          >
            <i
              className="size-1.5 rounded-full"
              style={{ background: CATEGORY_COLORS[def.category] }}
            />
            {def.name}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <MotionPicker
              current={def}
              sectionName={name}
              onPick={pick}
              onClose={() => setOpen(false)}
            />
          )}
        </AnimatePresence>
      </section>

      {/* A dobra de exemplo entra AQUI, logo abaixo do bloco clicado */}
      <AnimatePresence>
        {demo && (
          <DemoFold
            key={demo.id}
            def={demo}
            onRemove={() => setDemoId(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export { MotionPreview }
