import ScrollReveal from './ScrollReveal'

export default function Features() {
  const primaryFeature = {
    title: "Conversational Commerce",
    subheadline: "From discovery to checkout, in one conversation.",
    tags: ["Natural language ordering", "Product discovery", "Order tracking"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  }

  const secondaryFeatures = [
    {
      title: "Secure Payments",
      subheadline: "PCI-compliant, encrypted, and resilient.",
      tags: ["Multiple payment methods", "Smart retries", "Instant receipts"],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Human Moderation",
      subheadline: "Control without friction.",
      tags: ["Review approvals", "Content filtering", "Admin audit trail"],
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ]

  return (
    <section id="features" className="py-32 relative z-[2]">
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Section Header - Calm Confidence */}
        <div className="max-w-3xl mb-24">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight text-white mb-6">
              Built for conversational<br />commerce at scale.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-lg text-[var(--text-muted)] leading-relaxed">
              AI-powered workflows that let customers browse, pay, and engage—without leaving the conversation.
            </p>
          </ScrollReveal>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Primary Feature - 2x Width */}
          <ScrollReveal className="lg:col-span-2 lg:row-span-2" threshold={0.1}>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl h-full flex flex-col group overflow-hidden">
              <div className="p-10 md:p-20 flex-1">
                <div className="text-[var(--text-muted)] mb-8 opacity-40">
                  {primaryFeature.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-medium text-white mb-4">
                  {primaryFeature.title}
                </h3>
                <p className="text-lg text-[var(--text-muted)] max-w-md leading-relaxed mb-4">
                  {primaryFeature.subheadline}
                </p>
                <p className="text-sm text-[var(--text-tertiary)] font-display opacity-60 leading-relaxed max-w-md mb-12">
                  A unified session-driven workflow connecting chat, orders, and payments.
                </p>

                <div className="flex flex-wrap items-center gap-y-2 text-[13px] font-mono text-[var(--text-tertiary)] tracking-tight">
                  {primaryFeature.tags.map((tag, i) => (
                    <span key={i} className="flex items-center">
                      {tag}
                      {i < primaryFeature.tags.length - 1 && (
                        <span className="mx-4 opacity-30">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Option A: Capability Band (Stripe/Linear style) */}
              <div className="border-t border-[var(--border-subtle)] bg-white/[0.01] px-10 md:px-20 py-8">
                <div className="grid grid-cols-2 lg:flex items-center justify-between gap-y-4 text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--text-tertiary)] opacity-50">
                  <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                    <span className="w-1 h-1 rounded-full bg-[var(--accent)] hidden lg:block" />
                    Browse
                  </div>
                  <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                    <span className="w-1 h-1 rounded-full bg-[var(--accent)] hidden lg:block" />
                    Ask
                  </div>
                  <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                    <span className="w-1 h-1 rounded-full bg-[var(--accent)] hidden lg:block" />
                    Pay
                  </div>
                  <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                    <span className="w-1 h-1 rounded-full bg-[var(--accent)] hidden lg:block" />
                    Track
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Secondary Features */}
          {secondaryFeatures.map((feature, index) => (
            <ScrollReveal key={index} delay={index * 200} threshold={0.1}>
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-10 h-full flex flex-col justify-between group">
                <div>
                  <div className="text-[var(--text-muted)] mb-6 opacity-40">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-display font-medium text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-8">
                    {feature.subheadline}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-y-1 text-[11px] font-mono text-[var(--text-tertiary)] tracking-tight">
                  {feature.tags.map((tag, i) => (
                    <span key={i} className="flex items-center">
                      {tag}
                      {i < feature.tags.length - 1 && (
                        <span className="mx-3 opacity-30 italic font-sans text-xs">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
