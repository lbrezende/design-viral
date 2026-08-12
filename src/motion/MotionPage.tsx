import '@/styles/all-hub.css'
import { useEffect } from 'react'
import { ClickmaxPixel } from '@/components/clickmax-pixel'
import { AllHubFooter } from '@/sections/allhub/AllHubFooter'
import { DarkBand } from '@/sections/allhub/all/DarkBand'
import { DoItAll } from '@/sections/allhub/all/DoItAll'
import { FinalCta } from '@/sections/allhub/all/FinalCta'
import { Hero } from '@/sections/allhub/all/Hero'
import { LogosAndCases } from '@/sections/allhub/all/LogosAndCases'
import { MaxDemo } from '@/sections/allhub/all/MaxDemo'
import { ModuleShowcase } from '@/sections/allhub/all/ModuleShowcase'
import { Partnership } from '@/sections/allhub/all/Partnership'
import { CX_PAGE_SLUG, CX_PROJECT_SLUG } from './cx-config'
import { LeadGateProvider } from './lead-gate'
import { LibraryBar, MotionNav, WorkshopBand } from './MotionNav'
import { MotionSection } from './motion-section'

/* /motion — o clickmax.io/all duplicado virando playground de motion:
   mesma composição de blocos do AllPage original, mas cada bloco embrulhado
   num <MotionSection> que aplica um motion do catálogo e deixa trocar ao
   vivo pelo botão flutuante à direita. No topo, o headline com os 42 motions
   em gráficos vivos (estilo poster "Every Motion"). */

export function MotionPage() {
  useEffect(() => {
    const prev = document.title
    document.title =
      'Design Viral | Vários motions que a IA pode fazer pelo seu site'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <LeadGateProvider>
      <ClickmaxPixel projectSlug={CX_PROJECT_SLUG} pageSlug={CX_PAGE_SLUG} />
      <div className="cxa min-h-screen">
        <MotionNav />

        {/* A raiz é o próprio /all duplicado, bloco a bloco — o botão
            flutuante de cada bloco informa o motion em uso e deixa inserir
            dobras de exemplo. O grid completo com filtros mora na
            biblioteca ("Exemplos de todas as animações"). */}
        <div id="page" className="cxa">
          <MotionSection name="Hero" defaultMotion="logo-assemble">
            <Hero lang="pt" />
          </MotionSection>
          <MotionSection name="Demo do Max" defaultMotion="cursor-demo">
            <div id="demo">
              <MaxDemo lang="pt" />
            </div>
          </MotionSection>
          <MotionSection name="Do It All" defaultMotion="whip-pan">
            <DoItAll lang="pt" />
          </MotionSection>

          <WorkshopBand placement="mid" />

          <MotionSection name="Vitrine de módulos" defaultMotion="app-showcase">
            <ModuleShowcase lang="pt" />
          </MotionSection>
          <MotionSection name="Logos e cases" defaultMotion="crossfade">
            <LogosAndCases lang="pt" />
          </MotionSection>
          <MotionSection name="Parceria" defaultMotion="lower-thirds">
            <Partnership lang="pt" />
          </MotionSection>
          <MotionSection name="Faixa escura" defaultMotion="aurora">
            <DarkBand lang="pt" />
          </MotionSection>
          <MotionSection name="CTA final" defaultMotion="zoom-punch">
            <FinalCta lang="pt" />
          </MotionSection>
        </div>

        <WorkshopBand placement="footer" />
        <div className="cxa pb-12">
          <AllHubFooter lang="pt" />
        </div>
        <LibraryBar />
      </div>
    </LeadGateProvider>
  )
}
