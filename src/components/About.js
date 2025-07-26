// About and FAQ Components

export default function About() {
  return (
    <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 p-8 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-white">About ForeCastle</h2>
      
      <div className="prose max-w-none">
        <p className="mb-4 text-gray-300 leading-relaxed">
          ForeCastle is a decentralized prediction market platform that allows users to create, 
          trade, and resolve markets on future events. Built on blockchain technology, we provide 
          transparent, secure, and non-custodial prediction markets.
        </p>
        
        <h3 className="text-xl font-semibold mb-3 text-white">Key Features</h3>
        <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-1">
          <li>Decentralized market creation and trading</li>
          <li>Smart contract-based resolution</li>
          <li>Non-custodial wallet integration</li>
          <li>Real-time price discovery</li>
          <li>Low fees with Layer-2 scaling</li>
          <li>Cross-platform accessibility</li>
        </ul>
        
        <h3 className="text-xl font-semibold mb-3 text-white">How It Works</h3>
        <p className="mb-4 text-gray-300 leading-relaxed">
          Users can create prediction markets on any future event, from political elections 
          to sports outcomes to cryptocurrency prices. Other users can then trade on these 
          markets, with prices reflecting the crowd's prediction of the event outcome.
        </p>
      </div>
    </div>
  )
}

export function FAQ() {
  const faqs = [
    {
      question: "How do prediction markets work?",
      answer: "Prediction markets allow traders to buy and sell shares representing the probability of future events. Prices naturally reflect the crowd's collective wisdom about event outcomes."
    },
    {
      question: "Is ForeCastle decentralized?",
      answer: "Yes, ForeCastle uses smart contracts on Ethereum and Polygon for transparent, trustless market resolution. Users maintain custody of their funds at all times."
    },
    {
      question: "What fees does ForeCastle charge?",
      answer: "ForeCastle charges minimal platform fees, typically 1-2% of trading volume. We use Layer-2 solutions to minimize gas costs for users."
    },
    {
      question: "How are markets resolved?",
      answer: "Markets are resolved using a combination of automated oracles and community verification to ensure accurate and timely resolution of events."
    }
  ]

  return (
    <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 p-8 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="pb-6 border-b border-gray-700/50 last:border-b-0">
            <h3 className="text-lg font-semibold mb-2 text-white">{faq.question}</h3>
            <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
