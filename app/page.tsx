import Header from '@/components/header'
import Hero from '@/components/hero'
import Hero2 from '@/components/sections/Hero'
import FeaturesShowcase from '@/components/features-showcase'
import Companies from '@/components/companies'
import FeaturesGrid from '@/components/features-grid'
import { Industry } from '@/components/industry'
import Footer from '@/components/footer'
import { Testimonials } from '@/components/sections/testimonials'
import { CTAFinal } from '@/components/cta-final'
import { FAQ } from '@/components/faq'
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
     
      <Companies />
       <FeaturesShowcase />
      <FeaturesGrid />
      <Industry />
      <Testimonials />
      <FAQ />
      <CTAFinal />
      <Footer />
    </main>
  )
}
