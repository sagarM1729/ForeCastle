import FAQ from '@/components/FAQ'
import About from '@/components/About'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About ForeCastle
        </h1>
        <p className="text-xl text-gray-600">
          Learn about our decentralized prediction market platform
        </p>
      </div>
      
      <div className="space-y-12">
        <About />
        <FAQ />
      </div>
    </div>
  )
}
