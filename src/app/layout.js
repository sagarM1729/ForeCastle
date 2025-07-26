import './globals.css'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ParticleBackground from '@/components/ParticleBackground'

export const metadata = {
  title: 'ForeCastle - Decentralized Prediction Markets',
  description: 'Trade on the future. Create and participate in prediction markets for politics, sports, finance, and more.',
  keywords: ['prediction markets', 'blockchain', 'trading', 'web3', 'decentralized'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Providers>
          <div className="flex flex-col min-h-screen relative">
            {/* Subtle particle background */}
            <ParticleBackground />
            
            <Navbar />
            <main className="flex-grow pt-20 relative z-10">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
