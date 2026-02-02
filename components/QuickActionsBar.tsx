'use client'

interface QuickActionsBarProps {
  cartItemCount: number
  onViewCart: () => void
  onCheckout: () => void
}

export default function QuickActionsBar({
  cartItemCount,
  onViewCart,
  onCheckout
}: QuickActionsBarProps) {
  const actions = [
    {
      label: cartItemCount > 0 ? `View Cart (${cartItemCount})` : 'View Cart',
      onClick: onViewCart,
      disabled: cartItemCount === 0
    }
  ]

  // Add checkout action if cart has items
  if (cartItemCount > 0) {
    actions.unshift({
      label: 'Checkout',
      onClick: onCheckout,
      disabled: false
    })
  }

  return (
    <div className="border-t border-[#2A2A2A] px-4 py-3 bg-[#0F0F0F]">
      <div className="flex gap-2 overflow-x-auto">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`
              flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium
              transition-all duration-300 ease-out
              ${action.disabled 
                ? 'bg-[#1A1A1A] text-[#6B6B6B] cursor-not-allowed' 
                : 'bg-[#1A1A1A] text-[#B0B0B0] border border-[#2A2A2A] hover:border-[#00E5FF] hover:text-white'
              }
            `}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}