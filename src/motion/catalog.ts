/* Catálogo dos 42 motions do Design Viral — mesmo inventário do poster
   "Every Motion Claude Can Make" (texto, data, transitions, texture, 3D,
   code, interface). Cada entrada carrega o prompt de vibe coding que gera
   o efeito e um trecho de código de exemplo pronto para colar. */

export type MotionCategory =
  | 'texto'
  | 'data'
  | 'transitions'
  | 'texture'
  | '3d'
  | 'code'
  | 'interface'

export const CATEGORY_LABELS: Record<MotionCategory, string> = {
  texto: 'Texto',
  data: 'Data',
  transitions: 'Transitions',
  texture: 'Texture',
  '3d': '3D',
  code: 'Code',
  interface: 'Interface',
}

export const CATEGORY_COLORS: Record<MotionCategory, string> = {
  texto: '#6ee7ff',
  data: '#34d399',
  transitions: '#c084fc',
  texture: '#fbbf24',
  '3d': '#a3e635',
  code: '#f97316',
  interface: '#818cf8',
}

export type MotionDef = {
  id: string
  name: string
  category: MotionCategory
  desc: string
  prompt: string
  code: string
}

export const MOTIONS: MotionDef[] = [
  /* ── TEXTO ─────────────────────────────────────────────── */
  {
    id: 'kinetic-type',
    name: 'Kinetic type',
    category: 'texto',
    desc: 'Palavras que entram em cena com peso, escala e ritmo próprios.',
    prompt:
      'Crie uma headline com tipografia cinética: cada palavra entra em sequência com spring físico (stiffness 300, damping 20), alternando escala de 0.8→1 e leve rotação de -4° a 0°. Use framer-motion com staggerChildren de 0.08s e uma fonte display bold.',
    code: `<motion.span
  initial={{ scale: 0.8, rotate: -4, opacity: 0 }}
  animate={{ scale: 1, rotate: 0, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
/>`,
  },
  {
    id: 'typewriter',
    name: 'Typewriter',
    category: 'texto',
    desc: 'Texto digitado caractere a caractere, com cursor piscando.',
    prompt:
      'Implemente um efeito máquina de escrever: o texto aparece caractere a caractere a cada 40ms, com um cursor de bloco piscando (step-end 1s infinite). Ao terminar uma frase, pause 1.5s, apague e digite a próxima. Vanilla JS + CSS, sem libs.',
    code: `const el = document.querySelector('.type')
let i = 0
const tick = () => {
  el.textContent = text.slice(0, ++i)
  if (i < text.length) setTimeout(tick, 40)
}
tick()`,
  },
  {
    id: 'matrix-decode',
    name: 'Matrix decode',
    category: 'texto',
    desc: 'Caracteres aleatórios que se resolvem no texto final.',
    prompt:
      'Faça um efeito de decodificação Matrix: o texto começa como caracteres aleatórios (A-Z, 0-9) e cada posição "trava" no caractere correto da esquerda para a direita, trocando os aleatórios a cada 30ms. Fonte monoespaçada, cor verde-neon sobre fundo escuro.',
    code: `const scramble = () =>
  target.split('').map((c, i) =>
    i < locked ? c : CHARS[Math.random() * CHARS.length | 0]
  ).join('')
setInterval(() => { locked++; el.textContent = scramble() }, 60)`,
  },
  {
    id: 'karaoke-captions',
    name: 'Karaoke captions',
    category: 'texto',
    desc: 'Legendas com preenchimento progressivo palavra a palavra.',
    prompt:
      'Crie legendas estilo karaokê: as palavras da frase ficam em cinza e são "preenchidas" com branco/destaque uma a uma, sincronizadas em intervalos fixos (ou com timestamps de áudio). Use background-clip: text com um gradiente animado da esquerda para a direita.',
    code: `.karaoke span.done { color: #fff }
.karaoke span.now {
  background: linear-gradient(90deg, #fff var(--p), #666 var(--p));
  -webkit-background-clip: text;
  color: transparent;
}`,
  },
  {
    id: 'neon-glow',
    name: 'Neon glow',
    category: 'texto',
    desc: 'Brilho de letreiro neon pulsando em volta do texto.',
    prompt:
      'Aplique um efeito neon glow em um texto: múltiplos text-shadows sobrepostos (2px, 8px, 24px, 48px) na cor do neon, com animação de pulso sutil (opacity 0.85→1) e um flicker ocasional de 80ms. Fundo quase preto para o brilho respirar.',
    code: `.neon {
  color: #e9d5ff;
  text-shadow: 0 0 2px #c084fc, 0 0 8px #c084fc,
    0 0 24px #a855f7, 0 0 48px #7c3aed;
  animation: pulse 2.4s ease-in-out infinite;
}`,
  },
  {
    id: 'gradient-fill',
    name: 'Gradient fill',
    category: 'texto',
    desc: 'Gradiente animado que percorre o texto continuamente.',
    prompt:
      'Crie um texto com gradiente animado: gradiente de 3 cores aplicado via background-clip: text, com background-size 200% e animação infinita de background-position (0%→200%) em 6s linear. Ideal para headlines hero.',
    code: `.grad {
  background: linear-gradient(90deg,#6ee7ff,#c084fc,#6ee7ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  color: transparent;
  animation: slide 6s linear infinite;
}`,
  },

  /* ── DATA ──────────────────────────────────────────────── */
  {
    id: 'count-up',
    name: 'Count-up',
    category: 'data',
    desc: 'Números que sobem até o valor final quando entram na tela.',
    prompt:
      'Implemente um contador animado: quando o número entra no viewport (IntersectionObserver), anime de 0 até o valor final em 1.2s com easing easeOutExpo, formatando com separador de milhar pt-BR. Use requestAnimationFrame, sem libs.',
    code: `const animate = t0 => now => {
  const p = Math.min((now - t0) / 1200, 1)
  const eased = 1 - Math.pow(2, -10 * p)
  el.textContent = Math.round(end * eased).toLocaleString('pt-BR')
  if (p < 1) requestAnimationFrame(animate(t0))
}`,
  },
  {
    id: 'bar-race',
    name: 'Bar race',
    category: 'data',
    desc: 'Barras que disputam posição conforme os valores mudam.',
    prompt:
      'Crie um bar chart race: barras horizontais ordenadas por valor que trocam de posição suavemente (layout animation do framer-motion) a cada atualização de dados (1.5s). Cada barra anima largura com spring e o ranking reordena com AnimatePresence.',
    code: `{ranked.map(d => (
  <motion.div layout key={d.id}
    animate={{ width: d.value + '%' }}
    transition={{ type: 'spring', damping: 26 }}
  />
))}`,
  },
  {
    id: 'stock-ticker',
    name: 'Stock ticker',
    category: 'data',
    desc: 'Linha de cotação serrilhada avançando em tempo real.',
    prompt:
      'Desenhe um gráfico de linha estilo ticker de bolsa em SVG: a polyline ganha um ponto novo a cada 300ms (random walk), deslizando para a esquerda, com stroke verde quando sobe e vermelho quando cai, e um ponto pulsante na extremidade.',
    code: `points.push(last + (Math.random() - 0.5) * 8)
if (points.length > N) points.shift()
path.setAttribute('points',
  points.map((y, x) => \`\${x * step},\${y}\`).join(' '))`,
  },
  {
    id: 'line-draw',
    name: 'Line draw',
    category: 'data',
    desc: 'Traçado de linha que se desenha do início ao fim.',
    prompt:
      'Anime o desenho de uma linha SVG: use stroke-dasharray igual ao comprimento total do path (getTotalLength) e anime stroke-dashoffset desse valor até 0 em 2s ease-in-out quando o gráfico entrar na tela.',
    code: `const len = path.getTotalLength()
path.style.strokeDasharray = len
path.style.strokeDashoffset = len
path.animate({ strokeDashoffset: 0 },
  { duration: 2000, easing: 'ease-in-out', fill: 'forwards' })`,
  },
  {
    id: 'progress-bars',
    name: 'Progress bars',
    category: 'data',
    desc: 'Barras de progresso que preenchem em cascata.',
    prompt:
      'Crie um grupo de progress bars animadas: cada barra preenche da esquerda até seu percentual com cubic-bezier(0.16,1,0.3,1) em 1s, em cascata (delay incremental de 120ms), com o rótulo numérico contando junto do preenchimento.',
    code: `.bar i {
  transform-origin: left;
  transform: scaleX(0);
  animation: fill 1s cubic-bezier(.16,1,.3,1) forwards;
  animation-delay: calc(var(--i) * 120ms);
}`,
  },
  {
    id: 'countdown',
    name: 'Countdown',
    category: 'data',
    desc: 'Cronômetro regressivo com dígitos que viram.',
    prompt:
      'Implemente um countdown com dígitos flip: cada dígito troca com uma rotação 3D de -90°→0° no eixo X (perspective 400px) quando o valor muda, estilo painel de aeroporto. Mostre dias:horas:minutos:segundos até a data-alvo.',
    code: `<motion.span key={digit}
  initial={{ rotateX: -90, opacity: 0 }}
  animate={{ rotateX: 0, opacity: 1 }}
  transition={{ duration: 0.35, ease: 'backOut' }}
>{digit}</motion.span>`,
  },

  /* ── TRANSITIONS ───────────────────────────────────────── */
  {
    id: 'crossfade',
    name: 'Crossfade',
    category: 'transitions',
    desc: 'Uma cena dissolve suavemente na próxima.',
    prompt:
      'Faça um crossfade entre seções/imagens: o elemento que sai anima opacity 1→0 enquanto o que entra vai de 0→1, ambos em 600ms ease-in-out, sobrepostos em posição absoluta com AnimatePresence mode="sync".',
    code: `<AnimatePresence mode="sync">
  <motion.div key={slide}
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
  />
</AnimatePresence>`,
  },
  {
    id: 'glitch',
    name: 'Glitch',
    category: 'transitions',
    desc: 'Cortes digitais com deslocamento RGB e fatias.',
    prompt:
      'Crie um efeito glitch: duplique o conteúdo em duas camadas com clip-path de fatias horizontais aleatórias, desloque-as ±6px no eixo X com channel shift (uma camada vermelha, outra ciano em mix-blend-mode: screen) em rajadas de 200ms a cada 2-3s.',
    code: `.glitch::before, .glitch::after {
  content: attr(data-text);
  position: absolute; inset: 0;
}
.glitch::before { color: #f0f; clip-path: inset(20% 0 60% 0);
  animation: shift 2.4s steps(2) infinite }`,
  },
  {
    id: 'light-leak',
    name: 'Light leak',
    category: 'transitions',
    desc: 'Vazamento de luz quente varrendo a cena.',
    prompt:
      'Simule um light leak de filme: um gradiente radial quente (âmbar→magenta→transparente) em mix-blend-mode: screen atravessa a tela na diagonal em 1.2s com blur(40px), clareando a cena por onde passa. Dispare na troca de seção.',
    code: `.leak {
  background: radial-gradient(circle,
    rgba(251,191,36,.8), rgba(217,70,239,.4), transparent 70%);
  filter: blur(40px);
  mix-blend-mode: screen;
  animation: sweep 1.2s ease-in-out;
}`,
  },
  {
    id: 'zoom-punch',
    name: 'Zoom punch',
    category: 'transitions',
    desc: 'Zoom rápido com impacto e recuo elástico.',
    prompt:
      'Implemente um zoom punch: o elemento entra com scale 1.35→1 em 350ms usando cubic-bezier(0.22,1.4,0.36,1) (overshoot), combinado com um blur radial rápido que desaparece. Use para revelar destaques com impacto.',
    code: `<motion.div
  initial={{ scale: 1.35, filter: 'blur(8px)' }}
  animate={{ scale: 1, filter: 'blur(0px)' }}
  transition={{ duration: 0.35, ease: [0.22, 1.4, 0.36, 1] }}
/>`,
  },
  {
    id: 'whip-pan',
    name: 'Whip pan',
    category: 'transitions',
    desc: 'Chicotada lateral com motion blur entre cenas.',
    prompt:
      'Crie uma transição whip pan: a cena atual desliza -100% no X em 250ms com blur horizontal crescente (até 24px) e a próxima entra de +100% com o blur diminuindo, easing easeIn na saída e easeOut na entrada.',
    code: `exit: { x: '-100%', filter: 'blur(24px)',
  transition: { duration: 0.25, ease: 'easeIn' } },
enter: { x: 0, filter: 'blur(0px)',
  transition: { duration: 0.25, ease: 'easeOut' } }`,
  },
  {
    id: 'radial-split',
    name: 'Radial split',
    category: 'transitions',
    desc: 'A cena se abre em leque a partir do centro.',
    prompt:
      'Faça uma transição radial split: a nova cena é revelada por um clip-path circle que cresce do centro (circle(0%) → circle(150%)) em 700ms cubic-bezier(0.83,0,0.17,1); a cena antiga escurece 20% enquanto é coberta.',
    code: `<motion.div
  initial={{ clipPath: 'circle(0% at 50% 50%)' }}
  animate={{ clipPath: 'circle(150% at 50% 50%)' }}
  transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
/>`,
  },
  {
    id: 'grid-wipe',
    name: 'Grid wipe',
    category: 'transitions',
    desc: 'Mosaico de blocos que revela a próxima cena.',
    prompt:
      'Implemente um grid wipe: cubra a tela com uma grade 8×5 de quadrados que aparecem em ordem semi-aleatória (stagger 25ms) cobrindo a cena, e desaparecem na mesma ordem revelando a próxima. Cada quadrado anima scale 0→1 com ease backOut.',
    code: `{cells.map((c, i) => (
  <motion.div key={i}
    animate={{ scale: [0, 1, 1, 0] }}
    transition={{ duration: 1.4, delay: order[i] * 0.025,
      times: [0, 0.3, 0.7, 1] }}
  />
))}`,
  },
  {
    id: 'warp-dissolve',
    name: 'Warp dissolve',
    category: 'transitions',
    desc: 'A imagem se distorce e evapora em partículas.',
    prompt:
      'Crie um warp dissolve: o elemento que sai sofre distorção progressiva (scale 1→1.06, skew 0→3°, blur 0→16px) enquanto um displacement de turbulência SVG (feTurbulence + feDisplacementMap com scale animado 0→60) o dissolve em 800ms.',
    code: `<filter id="warp">
  <feTurbulence baseFrequency="0.02" numOctaves="2">
    <animate attributeName="baseFrequency"
      values="0.02;0.09" dur="0.8s" />
  </feTurbulence>
  <feDisplacementMap in="SourceGraphic" scale="60" />
</filter>`,
  },
  {
    id: 'flash-cut',
    name: 'Flash cut',
    category: 'transitions',
    desc: 'Corte seco com um frame branco de impacto.',
    prompt:
      'Implemente um flash cut: na troca de cena, um overlay branco vai de opacity 0→1 em 60ms e de 1→0 em 240ms (easing easeOut), cortando direto para a próxima cena no pico do flash. Opcional: dessature a cena 100%→0 durante o flash.',
    code: `flash.animate(
  [{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 0 }],
  { duration: 300, easing: 'ease-out' }
)
swapScene() // troque no pico (60ms)`,
  },
  {
    id: 'beat-cut',
    name: 'Beat cut',
    category: 'transitions',
    desc: 'Cortes secos sincronizados na batida.',
    prompt:
      'Crie um beat cut: alterne conteúdos em cortes secos (sem easing, troca instantânea) a cada batida — use um intervalo fixo de 500ms (120bpm) ou detecte onsets de áudio via Web Audio API. Acompanhe cada corte com um scale punch de 1.04→1 em 120ms.',
    code: `setInterval(() => {
  idx = (idx + 1) % scenes.length
  stage.replaceChildren(scenes[idx])
  stage.animate([{ scale: 1.04 }, { scale: 1 }],
    { duration: 120 })
}, 500)`,
  },

  /* ── TEXTURE ───────────────────────────────────────────── */
  {
    id: 'film-grain',
    name: 'Film grain',
    category: 'texture',
    desc: 'Granulação de película viva sobre a imagem.',
    prompt:
      'Adicione film grain animado: um overlay fixo com ruído (feTurbulence em SVG data-URI ou textura PNG) em opacity 0.06 e mix-blend-mode: overlay, reposicionado a cada frame com steps(10) para o grão "ferver" como película.',
    code: `.grain::after {
  content: ''; position: fixed; inset: -100%;
  background: url(#noise);
  opacity: .06; mix-blend-mode: overlay;
  animation: jitter .8s steps(10) infinite;
}`,
  },
  {
    id: 'lens-flare',
    name: 'Lens flare',
    category: 'texture',
    desc: 'Reflexo de lente atravessando o quadro.',
    prompt:
      'Crie um lens flare: um núcleo radial brilhante + 3 círculos fantasma menores alinhados na diagonal oposta, todos em mix-blend-mode: screen, atravessando a tela lentamente (12s) com flare horizontal fino (gradiente linear de 1px expandido).',
    code: `.flare {
  background: radial-gradient(circle at center,
    #fff 0%, rgba(255,200,120,.6) 8%, transparent 40%);
  mix-blend-mode: screen;
  animation: cross 12s linear infinite;
}`,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    category: 'texture',
    desc: 'Névoas coloridas fluindo como aurora boreal.',
    prompt:
      'Faça um fundo aurora: 3 blobs de gradiente radial (verde, ciano, roxo) com blur(80px), cada um animando translate/scale em loops longos dessincronizados (18s, 24s, 30s) sobre fundo escuro, com saturate(1.4) no conjunto.',
    code: `.aurora i {
  filter: blur(80px);
  border-radius: 50%;
  animation: drift var(--t) ease-in-out infinite alternate;
}
.aurora { filter: saturate(1.4) }`,
  },
  {
    id: 'particles',
    name: 'Particles',
    category: 'texture',
    desc: 'Partículas flutuando em profundidade.',
    prompt:
      'Crie um sistema de partículas leve em canvas: 80 pontos com velocidade browniana, tamanho 1-3px e opacidade proporcional à profundidade; conecte pares próximos (<100px) com linhas de opacidade decrescente. requestAnimationFrame, sem libs.',
    code: `ps.forEach(p => {
  p.x += p.vx; p.y += p.vy
  ctx.globalAlpha = p.z
  ctx.fillRect(p.x, p.y, p.z * 3, p.z * 3)
})`,
  },
  {
    id: 'shader-dissolve',
    name: 'Shader dissolve',
    category: 'texture',
    desc: 'Pixels que dissolvem por limiar de ruído.',
    prompt:
      'Implemente um shader dissolve (WebGL ou fallback CSS): um mapa de ruído define o limiar de dissolução — anime um uniform threshold de 0→1 e descarte fragmentos onde noise < threshold, com uma borda emissiva de 2% na fronteira da dissolução.',
    code: `float n = noise(vUv * 8.0);
if (n < uThreshold) discard;
if (n < uThreshold + 0.02)
  gl_FragColor = vec4(uEdgeColor, 1.0);`,
  },

  /* ── 3D ────────────────────────────────────────────────── */
  {
    id: '3d-extrude',
    name: '3D extrude',
    category: '3d',
    desc: 'Elementos que saltam do plano com profundidade real.',
    prompt:
      'Crie um efeito 3D extrude: um card/texto com transform-style: preserve-3d e perspective 800px que rotaciona levemente seguindo o mouse (rotateX/rotateY ±10°), com camadas empilhadas em translateZ (0, 20px, 40px) criando paralaxe interna.',
    code: `card.onmousemove = e => {
  const { x, y } = norm(e)      // -1..1
  card.style.transform =
    \`perspective(800px) rotateY(\${x * 10}deg)
     rotateX(\${-y * 10}deg)\`
}`,
  },
  {
    id: 'clone-wall',
    name: 'Clone wall',
    category: '3d',
    desc: 'Parede de réplicas em grade com ondulação.',
    prompt:
      'Monte um clone wall: uma grade de N réplicas do mesmo elemento em perspectiva, animando escala/brilho em onda radial a partir do centro (delay proporcional à distância), como um telão de LEDs em profundidade.',
    code: `clones.forEach((c, i) => {
  const d = dist(i, center)
  c.style.animationDelay = d * 60 + 'ms'
})
/* @keyframes wave { 50% { transform: scale(.85); filter: brightness(1.6) } } */`,
  },
  {
    id: 'lens-warp',
    name: 'Lens warp',
    category: '3d',
    desc: 'Distorção de lente esférica no conteúdo.',
    prompt:
      'Aplique um lens warp: distorção esférica que acompanha o cursor usando SVG feDisplacementMap com um mapa radial (ou shader), intensidade máxima no centro da "lente" (raio ~140px), com leve aumento de escala (1.08) dentro da área.',
    code: `<filter id="lens">
  <feImage href="#radialMap" result="map" />
  <feDisplacementMap in="SourceGraphic" in2="map"
    scale="45" xChannelSelector="R" yChannelSelector="G" />
</filter>`,
  },

  /* ── CODE ──────────────────────────────────────────────── */
  {
    id: 'code-typing',
    name: 'Code typing',
    category: 'code',
    desc: 'Código sendo digitado com syntax highlight ao vivo.',
    prompt:
      'Simule código sendo digitado num editor: fonte mono, tema escuro, caracteres surgindo a 25ms com highlight de sintaxe aplicado em tempo real (tokens coloridos), cursor de linha vertical piscando e auto-scroll conforme as linhas crescem.',
    code: `const typeLine = async line => {
  for (const ch of line) {
    buf += ch
    pre.innerHTML = highlight(buf) + '<i class="caret"></i>'
    await sleep(25)
  }
}`,
  },
  {
    id: 'code-diff',
    name: 'Code diff',
    category: 'code',
    desc: 'Linhas adicionadas e removidas se revelando.',
    prompt:
      'Anime um code diff: linhas removidas (fundo vermelho translúcido, prefixo -) colapsam a altura até 0 enquanto as adicionadas (fundo verde, prefixo +) expandem de 0 com stagger de 80ms, como um commit sendo aplicado ao vivo.',
    code: `<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: 'auto', opacity: 1 }}
  transition={{ delay: i * 0.08 }}
  className={line.added ? 'bg-green-500/15' : 'bg-red-500/15'}
/>`,
  },
  {
    id: 'code-morph',
    name: 'Code morph',
    category: 'code',
    desc: 'Um trecho de código se transforma em outro.',
    prompt:
      'Crie um code morph: tokens compartilhados entre o código A e o código B deslizam para a nova posição (layoutId do framer-motion), tokens exclusivos de A fazem fade-out e os novos de B fade-in — como um refactor acontecendo sozinho.',
    code: `{tokens.map(t => (
  <motion.span layoutId={t.stableId} key={t.stableId}
    transition={{ type: 'spring', damping: 30 }}
  >{t.text}</motion.span>
))}`,
  },
  {
    id: 'code-scroll',
    name: 'Code scroll',
    category: 'code',
    desc: 'Rolagem contínua de código como créditos de filme.',
    prompt:
      'Faça um code scroll infinito: um bloco de código longo rolando verticalmente em loop (translateY 0→-50% com o conteúdo duplicado), 40s linear infinite, com máscara de gradiente no topo e na base e leve inclinação 3D opcional.',
    code: `.scroll {
  animation: roll 40s linear infinite;
  mask-image: linear-gradient(transparent,
    #000 15%, #000 85%, transparent);
}
@keyframes roll { to { translate: 0 -50% } }`,
  },

  /* ── INTERFACE ─────────────────────────────────────────── */
  {
    id: 'cursor-demo',
    name: 'Cursor demo',
    category: 'interface',
    desc: 'Cursor fantasma demonstrando a interface sozinho.',
    prompt:
      'Crie um cursor demo: um ponteiro fantasma que percorre a UI em caminhos suaves (animação de x/y com easing easeInOut entre waypoints), pausa sobre botões, faz um clique com ripple (círculo expandindo) e dispara o estado real do componente.',
    code: `for (const step of tour) {
  await cursor.moveTo(step.target, 600)
  cursor.ripple()
  step.target.click()
  await sleep(800)
}`,
  },
  {
    id: 'phone-mockup',
    name: 'Phone mockup',
    category: 'interface',
    desc: 'Celular 3D flutuando com a UI rodando dentro.',
    prompt:
      'Monte um phone mockup animado: moldura de iPhone em CSS (bordas arredondadas 48px, notch) flutuando com rotateY suave de -12°→12° em loop de 8s, screenshots trocando dentro da tela com slide vertical a cada 3s.',
    code: `.phone {
  border-radius: 48px; border: 10px solid #111;
  animation: float 8s ease-in-out infinite alternate;
}
@keyframes float {
  from { transform: perspective(900px) rotateY(-12deg) }
  to { transform: perspective(900px) rotateY(12deg) } }`,
  },
  {
    id: 'app-showcase',
    name: 'App showcase',
    category: 'interface',
    desc: 'Telas do app deslizando em carrossel de vitrine.',
    prompt:
      'Crie um app showcase: 3+ telas em carrossel com a tela central em destaque (scale 1, opacity 1) e as laterais recuadas (scale 0.85, opacity 0.5, translateZ negativo); troque a cada 2.5s com spring e sombras que reforcem a profundidade.',
    code: `<motion.img
  animate={{
    scale: i === active ? 1 : 0.85,
    opacity: i === active ? 1 : 0.5,
    x: (i - active) * 220,
  }}
  transition={{ type: 'spring', damping: 24 }}
/>`,
  },
  {
    id: 'logo-assemble',
    name: 'Logo assemble',
    category: 'interface',
    desc: 'Fragmentos que voam e se montam no logo.',
    prompt:
      'Anime um logo assemble: divida o logo em 4-6 fragmentos (SVG paths ou blocos) que começam espalhados fora da tela com rotações aleatórias e voam para a posição final com spring (stiffness 120, damping 14), terminando com um glow rápido.',
    code: `{parts.map((p, i) => (
  <motion.path key={i} d={p.d}
    initial={{ x: p.fromX, y: p.fromY, rotate: p.spin }}
    animate={{ x: 0, y: 0, rotate: 0 }}
    transition={{ type: 'spring', stiffness: 120, damping: 14,
      delay: i * 0.06 }}
  />
))}`,
  },
  {
    id: 'lower-thirds',
    name: 'Lower thirds',
    category: 'interface',
    desc: 'Tarjas de identificação entrando como em broadcast.',
    prompt:
      'Crie um lower third de broadcast: uma barra de destaque entra da esquerda (scaleX 0→1, transform-origin left, 400ms) seguida pelo nome deslizando de baixo com clip e um sub-título com delay de 150ms; saída reversa após 4s.',
    code: `.bar { animation: grow .4s cubic-bezier(.16,1,.3,1) both }
.name { animation: rise .4s .15s both }
@keyframes grow { from { transform: scaleX(0) } }
@keyframes rise { from { translate: 0 110%; opacity: 0 } }`,
  },
  {
    id: 'camcorder-hud',
    name: 'Camcorder HUD',
    category: 'interface',
    desc: 'Overlay de filmadora com REC piscando.',
    prompt:
      'Monte um HUD de camcorder retrô: cantos de enquadramento em L, "REC" com ponto vermelho piscando 1s step-end, timecode correndo (HH:MM:SS:FF a 30fps), indicador de bateria e data no rodapé — tudo em fonte mono sobre a cena.',
    code: `setInterval(() => {
  f = (f + 1) % 30
  tc.textContent =
    \`\${hh}:\${mm}:\${ss}:\${String(f).padStart(2, '0')}\`
}, 1000 / 30)`,
  },
  {
    id: 'map-route',
    name: 'Map route',
    category: 'interface',
    desc: 'Rota que se traça no mapa até o destino.',
    prompt:
      'Anime uma rota em mapa: um path SVG tracejado que se desenha do ponto A ao B (stroke-dashoffset), com um marcador circulando pelo caminho (offset-path / animateMotion), pin do destino caindo com bounce ao final.',
    code: `<circle r="5">
  <animateMotion dur="3s" fill="freeze">
    <mpath href="#route" />
  </animateMotion>
</circle>`,
  },
  {
    id: 'hand-drawn',
    name: 'Hand-drawn',
    category: 'interface',
    desc: 'Rabiscos e setas desenhados à mão em cena.',
    prompt:
      'Crie anotações hand-drawn: círculos, setas e sublinhados com traço irregular (SVG com filter de turbulência leve) que se desenham com stroke-dashoffset em 600ms, aparecendo sobre elementos-chave como se alguém rabiscasse a tela ao vivo.',
    code: `.doodle path {
  stroke-dasharray: var(--len);
  stroke-dashoffset: var(--len);
  filter: url(#wobble);
  animation: draw .6s ease-out forwards;
}`,
  },
]

export const MOTION_BY_ID: Record<string, MotionDef> = Object.fromEntries(
  MOTIONS.map(m => [m.id, m]),
)

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as MotionCategory[]
