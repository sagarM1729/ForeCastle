import './globals.css'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'ForeCastle - Decentralized Prediction Markets',
  description: 'Trade on the future. Create and participate in prediction markets for politics, sports, finance, and more.',
  keywords: ['prediction markets', 'blockchain', 'trading', 'web3', 'decentralized'],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
