export default function Features() {
  const features = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      ),
      title: "Conversational Commerce",
      description: "Natural language ordering from browse to checkout. Your customers can shop, ask questions, and complete purchases through simple conversation.",
      features: [
        "Product recommendations",
        "Inventory management", 
        "Order tracking"
      ]
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      ),
      title: "Secure Payment Processing",
      description: "PCI-compliant encrypted payments with intelligent retry logic. Handle transactions seamlessly within the chat experience.",
      features: [
        "Multiple payment methods",
        "Fraud detection",
        "Automatic receipts"
      ]
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      ),
      title: "Human-in-the-Loop Moderation",
      description: "Admin approval workflow for user reviews and comments. Maintain quality control while enabling customer feedback.",
      features: [
        "Review moderation",
        "Content filtering",
        "Admin dashboard"
      ]
    }
  ]

  return (
    <section id="features" className="py-32 relative z-[2]">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything you need for{' '}
            <span className="bg-gradient-to-r from-[var(--accent)] to-[#00D4FF] bg-clip-text text-transparent">
              conversational commerce
            </span>
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            Powerful AI-driven features that transform how your customers shop, pay, and engage with your business.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-[var(--bg-secondary)] border border-[var(--bg-elevated)] rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[var(--accent)] hover:shadow-[0_20px_40px_rgba(0,240,255,0.1)] relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="w-15 h-15 bg-[var(--accent-subtle)] rounded-2xl flex items-center justify-center mb-6 text-[var(--accent)]">
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                {feature.description}
              </p>
              
              <ul className="space-y-2">
                {feature.features.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-[var(--text-secondary)] relative pl-6">
                    <div className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}