import '@/styles/all-hub.css'
import { AllHubFooter } from './AllHubFooter'
import { AllHubNav } from './AllHubNav'
import { DarkBand } from './all/DarkBand'
import { DoItAll } from './all/DoItAll'
import { EcosystemGrid } from './all/EcosystemGrid'
import { FinalCta } from './all/FinalCta'
import { Hero } from './all/Hero'
import { LogosAndCases } from './all/LogosAndCases'
import { MaxDemo } from './all/MaxDemo'
import { ModuleShowcase } from './all/ModuleShowcase'
import { Partnership } from './all/Partnership'
import { copyFor, type Lang, useDocumentTitle } from './i18n'

/* Hub /all (PT) e /en/all (EN) — mesma composição, copy de i18n.ts.
   O site não usa react-helmet nem `head:` de rota nessas páginas: troca o
   document.title no mount e restaura no unmount (mesmo padrão do /oficial). */

export function AllPage({ lang = 'pt' }: { lang?: Lang }) {
  const t = copyFor(lang)

  useDocumentTitle(t.meta.allTitle)

  return (
    <div className="cxa min-h-screen">
      <AllHubNav links={t.nav.links.all} lang={lang} />
      <Hero lang={lang} />
      {/* Logo depois da frase-manifesto: ela promete que a IA opera a
          plataforma, e esta seção deixa a pessoa ver isso acontecendo. */}
      <MaxDemo lang={lang} />
      {/* A frase-manifesto aparece UMA vez só, no overlay central do Hero.
          A seção <Manifesto /> repetia o mesmo texto logo abaixo — removida. */}
      <DoItAll lang={lang} />
      <ModuleShowcase lang={lang} />
      <EcosystemGrid lang={lang} />
      {/* Prova social vem DEPOIS do ecossistema: primeiro o leitor vê os 83
          ângulos, aí os cases de quem já opera assim. */}
      <LogosAndCases lang={lang} />
      <Partnership lang={lang} />
      <DarkBand lang={lang} />
      <FinalCta lang={lang} />
      <AllHubFooter lang={lang} />
    </div>
  )
}
