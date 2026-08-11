/* Ícones pixel-art (bitmaps 8×8) usados nas seções do hub /all — mesma
   linguagem visual do pixel-cx do AllHubFooter, em escala pequena, pra
   maleta/robô/globo do Manifesto, rail de módulos, blocos "Do it all" e
   colunas de Parceria. Renderizador único (PixelGlyph) + dicionário de
   bitmaps (ICONS). '1' acende, '0' fica transparente. */

export type PixelBitmap = readonly string[]

export const ICONS = {
  cx: ['00111100', '01000010', '11111111', '10000001', '10111101', '10111101', '10000001', '11111111'],
  robot: ['00111100', '01011010', '11111111', '10100101', '11111111', '00100100', '00100100', '01111110'],
  globe: ['00111100', '01000010', '10100101', '11011011', '11011011', '10100101', '01000010', '00111100'],
  page: ['01111100', '01000110', '01000010', '01111110', '01000010', '01000010', '01000010', '01111110'],
  funnel: ['11111111', '11111111', '01111110', '00111100', '00011000', '00011000', '00011000', '00011000'],
  grid: ['11110000', '11110000', '11110011', '11110011', '00111100', '00111100', '00001111', '00001111'],
  spark: ['00011000', '00011000', '00111100', '01111110', '11111111', '00111100', '01100110', '11000011'],
  stack: ['00000000', '11111110', '00000000', '01111100', '00000000', '00111000', '00000000', '00011000'],
  gear: ['00100100', '01011010', '10111101', '11111111', '11111111', '10111101', '01011010', '00100100'],
  chat: ['11111100', '10000010', '10000010', '10000010', '11111100', '00110000', '00011000', '00000000'],
  cart: ['11000000', '11000000', '11111100', '10000010', '10000010', '10000010', '11111110', '01100110'],
  play: ['01000000', '01100000', '01110000', '01111000', '01111000', '01110000', '01100000', '01000000'],
  link: ['00111000', '01000100', '01000100', '00111011', '11011100', '01000100', '01000100', '00111000'],
  quiz: ['00011000', '00011000', '00011000', '01111110', '01000010', '10000001', '00000000', '00011000'],
  shield: ['00111100', '01111110', '11111111', '11111111', '11111111', '01111110', '00111100', '00011000'],
  rocket: ['00011000', '00111100', '00111100', '01111110', '01111110', '11111111', '00100100', '01000010'],
  star: ['00011000', '00011000', '01111110', '11111111', '11111111', '01100110', '11000011', '10000001'],
  wrench: ['11000000', '11100000', '01110000', '00111000', '00011100', '00001110', '00000111', '00000011'],
  building: ['01111110', '01000010', '01011010', '01000010', '01011010', '01000010', '01111110', '11111111'],
} as const

export type IconName = keyof typeof ICONS

export function PixelGlyph({
  icon,
  color = 'currentColor',
  size = 24,
  className = '',
}: {
  icon: IconName
  color?: string
  size?: number
  className?: string
}) {
  const bitmap: PixelBitmap = ICONS[icon]
  const rows = bitmap.length
  const cols = bitmap[0]?.length ?? rows
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      {bitmap.flatMap((row, ri) =>
        row.split('').map((v, ci) => (
          <span
            key={`${ri}-${ci}`}
            style={{ background: v === '1' ? color : 'transparent' }}
          />
        )),
      )}
    </div>
  )
}
