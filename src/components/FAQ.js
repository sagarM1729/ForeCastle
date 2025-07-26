// FAQ Component
export default function FAQ() {
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
    <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl p-8">
      <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index}>
            <h3 className="text-xl font-semibold text-orange-400 mb-2">{faq.question}</h3>
            <p className="text-gray-300 text-lg">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
