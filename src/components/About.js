// About and FAQ Components

export default function About() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6">About ForeCastle</h2>
      
      <div className="prose max-w-none">
        <p className="mb-4">
          ForeCastle is a decentralized prediction market platform that allows users to create, 
          trade, and resolve markets on future events. Built on blockchain technology, we provide 
          transparent, secure, and non-custodial prediction markets.
        </p>
        
        <h3 className="text-xl font-semibold mb-3">Key Features</h3>
        <ul className="list-disc pl-6 mb-6">
          <li>Decentralized market creation and trading</li>
          <li>Smart contract-based resolution</li>
          <li>Non-custodial wallet integration</li>
          <li>Real-time price discovery</li>
          <li>Low fees with Layer-2 scaling</li>
          <li>Cross-platform accessibility</li>
        </ul>
        
        <h3 className="text-xl font-semibold mb-3">How It Works</h3>
        <p className="mb-4">
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
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index}>
            <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
