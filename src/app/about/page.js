import FAQ from '@/components/FAQ'
import About from '@/components/About'
import PageLayout from '@/components/PageLayout'

export default function AboutPage() {
  return (
    <PageLayout>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              About ForeCastle
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Learn about our decentralized prediction market platform
          </p>
        </div>
        
        <div className="space-y-12">
          <About />
          <FAQ />
        </div>
      </div>
    </PageLayout>
  )
}
