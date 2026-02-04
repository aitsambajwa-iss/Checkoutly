'use client'

interface PriceProps {
    amount: number | string
    className?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}

export default function Price({ amount, className = '', size = 'md' }: PriceProps) {
    const numericAmount = typeof amount === 'number' ? amount : parseFloat(String(amount || 0))
    const [whole, decimal] = numericAmount.toFixed(2).split('.')

    const sizeClasses = {
        sm: { symbol: 'text-[10px]', whole: 'text-sm', decimal: 'text-[10px]' },
        md: { symbol: 'text-xs', whole: 'text-base', decimal: 'text-xs' },
        lg: { symbol: 'text-sm', whole: 'text-lg', decimal: 'text-sm' },
        xl: { symbol: 'text-sm', whole: 'text-xl', decimal: 'text-base' },
        '2xl': { symbol: 'text-sm', whole: 'text-2xl', decimal: 'text-lg' },
        '3xl': { symbol: 'text-sm', whole: 'text-3xl', decimal: 'text-xl' },
    }

    const currentSize = sizeClasses[size]

    return (
        <div className={`flex items-start gap-0.5 font-mono tabular-nums ${className}`}>
            <span className={`text-[#A0A0A0] mt-1 leading-none ${currentSize.symbol}`}>$</span>
            <span className={`text-white font-bold leading-none ${currentSize.whole}`}>
                {whole}
            </span>
            <span className={`text-[#6B6B6B] mt-1 leading-none ${currentSize.decimal}`}>
                .{decimal}
            </span>
        </div>
    )
}
