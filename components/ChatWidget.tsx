'use client'

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react'
import { sendToCloudflareWorker } from '@/lib/n8n'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { formatTime, createTimestamp, generateId } from '@/lib/time'
import OrderFormCompact from './OrderFormCompact'
import PaymentForm from './PaymentForm'
import ReviewForm from './ReviewForm'
import InlineProductCard from './InlineProductCard'
import StickyProductBar from './StickyProductBar'
import InteractiveLoading, { LoadingState } from './InteractiveLoading'
import ProductSkeleton from './ProductSkeleton'
import TypewriterText from './TypewriterText'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message, Product } from '@/lib/types'

interface ChatWidgetProps {
  selectedProduct?: Product | null
  onProductSelect?: (product: Product) => void
  onExternalAddToCart?: (productName: string, options: { size: string; color: string; quantity: number }) => void
}

interface OrderData {
  product_name: string
  size: string
  color: string
  quantity: number
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  // For multi-item orders
  items?: Array<{
    product_name: string
    size: string
    color: string
    quantity: number
  }>
}

interface PaymentData {
  name: string
  email: string
  amount: number
  currency: string
  description: string
  card: {
    number: string
    exp_month: number
    exp_year: number
    cvc: string
  }
  order_number: string
}

interface ReviewData {
  order_id: string
  review: string
  rating: number
  customer_name?: string
  customer_email?: string
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  // Add actual product data
  sizes?: string[]
  colors?: string[]
  product_id?: string
  image_url?: string
}

interface MultiOrderData {
  items: CartItem[]
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  order_total: number
}

export default function ChatWidget({ selectedProduct, onProductSelect, onExternalAddToCart }: ChatWidgetProps) {
  // Internal cart state for chatbot
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderProduct, setOrderProduct] = useState<Product | null>(null)
  const [stickyProduct, setStickyProduct] = useState<Product | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  // Initialize messages after hydration to avoid mismatch
  useEffect(() => {
    setMessages([{
      id: '1',
      content: "Hi! I'm your AI shopping assistant. Drag products into this chat or ask me about our products!",
      isUser: false,
      timestamp: createTimestamp()
    }])
  }, [])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<any>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>('general')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Calculate cart totals (memoized for performance)
  const itemCount = useMemo(() =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  )
  const cartTotal = useMemo(() =>
    cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [cartItems]
  )

  // Add item to internal cart with specific options (for external calls)
  const addToCartWithOptions = useCallback(async (productName: string, options: { size: string; color: string; quantity: number }) => {
    try {
      // Get actual product data from Supabase
      const { getAllProducts } = await import('@/lib/products')
      const products = await getAllProducts()

      const product = products.find(p => p.name === productName)

      if (!product) {
        addMessage(`❌ Product "${productName}" not found.`, false)
        return
      }

      const newItem: CartItem = {
        id: generateId(),
        name: productName,
        price: Number(product.price),
        quantity: options.quantity,
        size: options.size,
        color: options.color,
        sizes: product.sizes,
        colors: product.colors,
        product_id: product.id,
        image_url: product.image_url
      }

      setCartItems(prev => [...prev, newItem])
      showSuccessToast(`Added ${productName} to cart!`)
      addMessage(`Added ${productName} (${options.size}, ${options.color}) to your cart. Say "checkout" when ready to order.`, false)

    } catch (error) {
      console.error('Error adding to cart:', error)
      addMessage(`Sorry, there was an error adding ${productName} to your cart.`, false)
    }
  }, [setCartItems])

  // Expose the addToCartWithOptions function to parent component
  useEffect(() => {
    if (onExternalAddToCart) {
      // This is a bit of a hack, but we need to expose the function to the parent
      (window as any).chatWidgetAddToCart = addToCartWithOptions
    }
  }, [onExternalAddToCart, addToCartWithOptions])

  // Add item to internal cart
  const addToCart = async (productName: string, quantity: number = 1, size: string = '', color: string = '') => {
    try {
      // Get actual product data from Supabase
      const { getAllProducts } = await import('@/lib/products')
      const products = await getAllProducts()

      const product = products.find(p => p.name === productName)

      if (!product) {
        addMessage(`❌ Product "${productName}" not found.`, false)
        return
      }

      const newItem: CartItem = {
        id: generateId(),
        name: productName,
        price: Number(product.price),
        quantity,
        size: size || '',
        color: color || '',
        sizes: product.sizes,
        colors: product.colors,
        product_id: product.id,
        image_url: product.image_url
      }

      setCartItems(prev => [...prev, newItem])
      showSuccessToast(`Added ${productName} to cart!`)

    } catch (error) {
      console.error('Error adding to cart:', error)
      // Fallback
      const price = getProductPrice(productName)
      const newItem: CartItem = {
        id: generateId(),
        name: productName,
        price,
        quantity,
        size: size || '',
        color: color || '',
        sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12', 'US 13'],
        colors: ['Black', 'White', 'Gray', 'Navy', 'Brown']
      }
      setCartItems(prev => [...prev, newItem])
      showSuccessToast(`Added ${productName} to cart with default options`)
    }
  }

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  // Show cart contents
  const showCart = () => {
    if (cartItems.length === 0) {
      addMessage('Your cart is empty! Ask me about our products to get started.', false)
      return
    }

    const cartSummary = cartItems.map(item =>
      `• ${item.name}${item.size || item.color ? ` (${[item.size, item.color].filter(Boolean).join(', ')})` : ''} - $${item.price} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')

    addMessage(`Your Cart:\n${cartSummary}\n\nTotal: $${cartTotal.toFixed(2)}\n\nSay "checkout" to place your order!`, false)
  }

  // Handle product details view
  const handleProductDetails = (product: Product) => {
    setStickyProduct(product)
    addMessage(`Here are the details for ${product.name}:`, false)

    // Add inline product card to messages
    const productMessage: Message = {
      id: generateId(),
      content: `PRODUCT_CARD:${JSON.stringify(product)}`,
      isUser: false,
      timestamp: createTimestamp()
    }
    setMessages(prev => [...prev, productMessage])
  }

  // Handle quick actions
  const handleBrowseAll = () => {
    addMessage('Here are all our available products. You can drag any product into this chat to learn more about it!', false)
    // Don't auto-scroll to products section to avoid page jumping
  }

  const handleTrackOrder = () => {
    addMessage('To track your order, please provide your order number (format: ORD-XXXXXXXXXX-XXXXXX)', false)
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    try {
      const productData = e.dataTransfer.getData('application/json')
      if (productData) {
        const product = JSON.parse(productData)

        // Show success ripple animation
        const chatContainer = e.currentTarget as HTMLElement
        const ripple = document.createElement('div')
        ripple.className = 'absolute top-1/2 left-1/2 w-24 h-24 -mt-12 -ml-12 border-4 border-[#FFFFFF] rounded-full animate-ping pointer-events-none'
        chatContainer.appendChild(ripple)

        setTimeout(() => ripple.remove(), 600)

        // Send message with slight delay for effect
        setTimeout(() => {
          handleUserMessage(`Tell me about ${product.name}`)
        }, 150)
      }
    } catch (error) {
      console.error('Failed to handle dropped product:', error)
    }
  }

  // Helper function to get product price
  const getProductPrice = (productName: string): number => {
    const productPrices: { [key: string]: number } = {
      'AeroRun Pro': 129.99,
      'TrailMaster X': 149.99,
      'UrbanWalk Classic': 89.99,
      'SportFlex Elite': 159.99,
      'Slip-On Canvas Shoes': 49.99,
      'High-Top Basketball Shoes': 149.99,
      'Trail Running Shoes': 109.50
    }
    return productPrices[productName] || 99.99 // Default price if not found
  }

  const scrollToBottom = () => {
    // Only scroll within the chat widget, don't affect the main page
    const messagesContainer = messagesEndRef.current?.parentElement
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }

  useEffect(() => {
    // Only auto-scroll when new messages are added, and only within the chat widget
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, isTyping])

  const addMessage = (content: string, isUser = false) => {
    const newMessage: Message = {
      id: generateId(),
      content,
      isUser,
      timestamp: createTimestamp()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const showTypingIndicator = () => {
    setIsTyping(true)
  }

  const hideTypingIndicator = () => {
    setIsTyping(false)
  }

  const handleUserMessage = useCallback(async (message: string) => {
    if (isTyping) return

    console.log('User message:', message)
    console.log('Current completedOrder:', completedOrder)

    addMessage(message, true)

    // Check for payment intent BEFORE sending to AI
    const paymentTriggers = ['pay now', 'pay for', 'payment', 'pay it', 'yes pay', 'proceed to pay', 'make payment', 'yes', 'sure', 'okay', 'ok']
    const reviewTriggers = ['leave a review', 'write a review', 'review', 'rate', 'feedback', 'comment', 'leave feedback', 'write feedback', 'give feedback']
    const cartTriggers = ['show cart', 'view cart', 'what\'s in my cart', 'check cart', 'see cart']
    const checkoutTriggers = ['checkout', 'place order', 'order now', 'buy now', 'proceed to checkout']

    const isPaymentIntent = paymentTriggers.some(trigger => message.toLowerCase().trim() === trigger.toLowerCase()) ||
      (message.toLowerCase().trim() === 'yes' && completedOrder)
    const isReviewIntent = reviewTriggers.some(trigger => message.toLowerCase().includes(trigger.toLowerCase()))
    const isCartIntent = cartTriggers.some(trigger => message.toLowerCase().includes(trigger.toLowerCase()))
    const isCheckoutIntent = checkoutTriggers.some(trigger => message.toLowerCase().includes(trigger.toLowerCase()))

    if (isPaymentIntent && completedOrder) {
      console.log('Payment intent detected, showing payment form for order:', completedOrder)
      setShowPaymentForm(true)
      return
    }

    if (isReviewIntent) {
      console.log('Review intent detected, showing review form')
      setShowReviewForm(true)
      return
    }

    if (isCartIntent) {
      showCart()
      return
    }

    if (isCheckoutIntent) {
      if (cartItems.length === 0) {
        addMessage('Your cart is empty! Add some products first before checking out.', false)
        return
      }

      // Use original order form for both single and multiple items
      // For multiple items, we'll create a combined product representation
      if (cartItems.length === 1) {
        const item = cartItems[0]
        const product: Product = {
          id: item.product_id || item.id,
          name: item.name,
          price: item.price,
          sizes: item.sizes || ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12', 'US 13'],
          colors: item.colors || ['Black', 'White', 'Gray', 'Navy', 'Brown'],
          description: `${item.name} - Premium quality footwear`
        }
        setOrderProduct(product)
        setShowOrderForm(true)
        return
      } else {
        // Multiple items - create a combined order form
        const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const itemNames = cartItems.map(item => `${item.name} (${item.quantity}x)`).join(', ')

        const product: Product = {
          id: 'multi-item',
          name: `Multiple Items (${cartItems.length} products)`,
          price: totalPrice,
          sizes: ['US 6', 'US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12', 'US 13'], // Will get actual sizes per product
          colors: ['Black', 'White', 'Gray', 'Navy', 'Brown'], // Will get actual colors per product
          description: `Order contains: ${itemNames}\n\nNote: Size and color will be selected for each product individually.`
        }
        setOrderProduct(product)
        setShowOrderForm(true)
        return
      }
    }

    // Set loading state based on message content
    if (message.toLowerCase().includes('search') || message.toLowerCase().includes('show') || message.toLowerCase().includes('find')) {
      setLoadingState('search')
    } else if (message.toLowerCase().includes('cart')) {
      setLoadingState('cart')
    } else if (message.toLowerCase().includes('checkout') || message.toLowerCase().includes('buy')) {
      setLoadingState('order')
    } else if (message.toLowerCase().includes('detail') || message.toLowerCase().includes('tell me about')) {
      setLoadingState('view')
    } else {
      setLoadingState('general')
    }

    showTypingIndicator()
    try {
      const response = await sendToCloudflareWorker(message)

      // Check if the response contains a client-side action (from AI function calling)
      try {
        const actionData = JSON.parse(response)
        if (actionData.action === 'add_to_cart') {
          addToCart(actionData.product_name, actionData.quantity || 1, actionData.size, actionData.color)
          addMessage(actionData.message || `Added ${actionData.product_name} to your cart. Say "cart" to view or "checkout" to order.`)
          return
        } else if (actionData.action === 'view_cart') {
          showCart()
          return
        }
      } catch (parseError) {
        // Not a JSON action, continue with normal response handling
      }

      addMessage(response)

    } catch (error) {
      console.error('Chat error:', error)
      addMessage('Sorry, I encountered an error. Please try again.')
    } finally {
      hideTypingIndicator()
    }
  }, [isTyping, cartItems, completedOrder, addToCart, showCart])

  // Helper function to calculate order total
  const calculateOrderTotal = (orderData: OrderData) => {
    if (orderData.items && orderData.items.length > 0) {
      // Multi-item order
      return orderData.items.reduce((total, item) => {
        const itemPrice = cartItems.find(cartItem => cartItem.name === item.product_name)?.price || 0
        return total + (itemPrice * item.quantity)
      }, 0)
    } else {
      // Single item order
      const productPrice = getProductPrice(orderData.product_name)
      return productPrice * (orderData.quantity || 1)
    }
  }

  // Helper function to get product name for payment description
  const getProductName = (orderData: OrderData) => {
    if (orderData.items && orderData.items.length > 0) {
      return orderData.items.length === 1
        ? orderData.items[0].product_name
        : `${orderData.items.length} items`
    }
    return orderData.product_name
  }

  const handleOrderSubmit = async (orderData: OrderData) => {
    setShowOrderForm(false)
    setOrderProduct(null)

    addMessage('Processing your order...', false)

    showTypingIndicator()
    try {
      let payload

      if (cartItems.length === 1) {
        // Single item order - use existing format
        payload = {
          ...orderData,
          chatId: `order_${Date.now()}`
        }
      } else {
        // Multi-item order - use individual item details from form
        const items = orderData.items?.map(item => ({
          product_name: item.product_name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          unit_price: cartItems.find(cartItem => cartItem.name === item.product_name)?.price || 0,
          total_price: (cartItems.find(cartItem => cartItem.name === item.product_name)?.price || 0) * item.quantity
        })) || []

        payload = {
          order_type: 'multi_item',
          items: items,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          shipping_address: orderData.shipping_address,
          item_count: items.length,
          chatId: `multi_order_${Date.now()}`,
          timestamp: new Date().toISOString()
        }
      }

      const response = await fetch('/api/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (result.success) {
        // Clear the entire cart after successful order
        setCartItems([])

        // Extract order number from the response text using multiple methods
        let extractedOrderNumber = `ORDER-${Date.now()}` // fallback

        // Try to extract from result.order.response (main response text)
        if (result.order?.response) {
          // Try multiple regex patterns to be more robust
          const patterns = [
            /Order Number: (ORD-[A-Z0-9-]+)/,
            /ORD-[A-Z0-9-]+/,
            /Order:\s*(ORD-[A-Z0-9-]+)/i
          ]

          for (const pattern of patterns) {
            const match = result.order.response.match(pattern)
            if (match) {
              extractedOrderNumber = match[1] || match[0]
              break
            }
          }
        }

        // Also try to extract from the main response field if available
        if (extractedOrderNumber.startsWith('ORDER-') && result.response) {
          const patterns = [
            /Order Number: (ORD-[A-Z0-9-]+)/,
            /ORD-[A-Z0-9-]+/
          ]

          for (const pattern of patterns) {
            const match = result.response.match(pattern)
            if (match) {
              extractedOrderNumber = match[1] || match[0]
              break
            }
          }
        }

        // Format the order data properly for PaymentForm
        const formattedOrder = {
          ...result.order,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          order_total: calculateOrderTotal(orderData),
          product_name: getProductName(orderData),
          order_number: extractedOrderNumber
        }

        setCompletedOrder(formattedOrder)
        addMessage(result.response || 'Order placed successfully! Opening payment form...', false)

        // Automatically show payment form after successful order
        setTimeout(() => {
          setShowPaymentForm(true)
        }, 1000) // Small delay to let the user see the success message
      } else {
        addMessage(result.response || result.error || 'There was an issue placing your order. Please try again.', false)
      }

    } catch (error) {
      console.error('Order error:', error)
      addMessage('Sorry, there was an error placing your order. Please try again or contact support.')
    } finally {
      hideTypingIndicator()
    }
  }

  const handleOrderCancel = () => {
    setShowOrderForm(false)
    setOrderProduct(null)
    addMessage('Order cancelled. Your items are still in your cart. Say "checkout" when you\'re ready to order.', false)
  }

  const handlePaymentSubmit = async (paymentData: PaymentData) => {
    setShowPaymentForm(false)
    setCompletedOrder(null)

    addMessage('Processing payment...', false)

    showTypingIndicator()
    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      })

      const result = await response.json()

      // Show the response message regardless of success/failure
      addMessage(result.response || 'Payment processed!')

    } catch (error) {
      console.error('Payment error:', error)
      addMessage('Sorry, there was an error processing your payment. Please try again or contact support.')
    } finally {
      hideTypingIndicator()
    }
  }

  const handlePaymentCancel = () => {
    setShowPaymentForm(false)
    setCompletedOrder(null)
    addMessage('Payment cancelled. Your order is still pending. You can pay later if needed.', false)
  }

  const handleReviewSubmit = async (reviewData: ReviewData) => {
    setShowReviewForm(false)

    addMessage('Submitting your review...', false)

    showTypingIndicator()
    try {
      const response = await fetch('/api/submit-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      })

      const result = await response.json()

      // Show the response message regardless of success/failure
      addMessage(result.response || 'Review submitted successfully!')

    } catch (error) {
      console.error('Review error:', error)
      addMessage('Sorry, there was an error submitting your review. Please try again or contact support.')
    } finally {
      hideTypingIndicator()
    }
  }

  const handleReviewCancel = () => {
    setShowReviewForm(false)
    addMessage('Review cancelled. Feel free to leave a review anytime!', false)
  }

  const handleProductClick = useCallback(async (product: Product) => {
    const message = `I'm interested in the ${product.name}`
    await handleUserMessage(message)

    if (onProductSelect) {
      onProductSelect(product)
    }
  }, [handleUserMessage, onProductSelect])

  // Handle product selection from parent
  useEffect(() => {
    if (selectedProduct) {
      handleProductClick(selectedProduct)
    }
  }, [selectedProduct, handleProductClick])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage = input.trim()
    setInput('')
    await handleUserMessage(userMessage)
  }

  // Check if any form is currently active
  const hasActiveForm = showOrderForm || showPaymentForm || showReviewForm

  return (
    <div className={`
      chat-widget relative flex flex-col
      bg-gradient-to-b from-[#0A0A0A] to-[#000000] 
      border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl
      transition-all duration-500 ease-out
      ${isDragOver ? 'border-[#00E5FF] shadow-[0_0_32px_rgba(0,229,255,0.3)] scale-[1.02]' : ''}
      ${hasActiveForm ? 'h-[750px]' : 'h-[600px]'}
    `}>
      {/* Sticky Product Bar */}
      <StickyProductBar
        product={stickyProduct}
        onAddToCart={addToCart}
        onClose={() => setStickyProduct(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] bg-[#0F0F0F]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img
              src="/logo.svg"
              alt="Checkoutly Logo"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div>
            <div className="font-display font-medium text-white text-sm">AI Assistant</div>
            <div className="text-xs text-[#10B981]">Online & Ready</div>
          </div>
        </div>

        {/* Real-time Stats (B2B Appeal) */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></div>
            <span className="text-[#6B6B6B]">Response: ~1.2s</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
            <span className="text-[#6B6B6B]">99.9% Uptime</span>
          </div>
        </div>

        {itemCount > 0 && (
          <button
            onClick={showCart}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] hover:border-[#00E5FF] transition-all duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="font-mono text-sm text-white">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} · ${cartTotal.toFixed(2)}
            </span>
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-6 space-y-4 relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            addToCart={addToCart}
            handleProductDetails={handleProductDetails}
          />
        ))}

        {/* Drop indicator overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/8 via-[#00B8D4]/4 to-[#00E5FF]/8 backdrop-blur-md flex items-center justify-center z-10 pointer-events-none">
            {/* Elegant border */}
            <div className="absolute inset-4 border-2 border-dashed border-[#00E5FF]/60 rounded-2xl"></div>
            <div className="absolute inset-6 border border-[#00E5FF]/20 rounded-xl"></div>

            {/* Content */}
            <div className="text-center relative z-10">
              {/* Icon with subtle glow */}
              <div className="relative mb-4 flex justify-center">
                <svg className="w-16 h-16 text-white/40 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              </div>

              {/* Stable text with subtle glow */}
              <div className="relative">
                <div className="text-2xl font-bold text-[#FFFFFF] mb-2 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                  Drop to inquire
                </div>
                <div className="text-sm text-[#B0B0B0]">
                  I&apos;ll tell you everything about this product!
                </div>
              </div>
            </div>

            {/* Subtle ripple effect */}
            <div className="absolute inset-0 rounded-2xl">
              <div className="absolute inset-0 bg-[#FFFFFF]/5 rounded-2xl animate-ping opacity-30"></div>
            </div>
          </div>
        )}

        {/* Payment Form */}
        {showPaymentForm && completedOrder && (
          <div className="mb-4 animate-slide-up">
            <PaymentForm
              orderData={completedOrder}
              onSubmit={handlePaymentSubmit}
              onCancel={handlePaymentCancel}
            />
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-4 animate-slide-up">
            <ReviewForm
              onSubmit={handleReviewSubmit}
              onCancel={handleReviewCancel}
            />
          </div>
        )}

        {/* Order Form */}
        {showOrderForm && orderProduct && (
          <div className="mb-4 animate-slide-up">
            <OrderFormCompact
              product={orderProduct}
              cartItems={cartItems.length > 1 ? cartItems : undefined}
              onSubmit={handleOrderSubmit}
              onCancel={handleOrderCancel}
            />
          </div>
        )}

        {isTyping && (
          <div className="mb-6">
            <InteractiveLoading state={loadingState} />
            {loadingState === 'search' && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                <ProductSkeleton />
                <ProductSkeleton />
              </div>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      {/* Input Area */}
      <div className="p-4 border-t border-[#2A2A2A] bg-[#0F0F0F]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about products, place orders, track shipments..."
            className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-white placeholder-[#6B6B6B] focus:outline-none focus:border-[#FFFFFF] transition-all duration-300"
            disabled={showPaymentForm || showReviewForm || showOrderForm}
          />
          <button
            onClick={handleSend}
            disabled={isTyping || showPaymentForm || showReviewForm || showOrderForm}
            className="px-6 py-3 bg-[#FFFFFF] text-black font-bold rounded-lg hover:bg-[#E5E5E5] transition-all duration-300 disabled:opacity-50"
          >
            Send
          </button>
        </div>

        {/* Clean Quick Actions */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          <button
            onClick={showCart}
            className="flex-shrink-0 text-xs px-3 py-1.5 bg-[#1A1A1A] text-[#B0B0B0] rounded border border-[#2A2A2A] hover:border-[#FFFFFF] hover:text-white transition-all duration-300"
          >
            Cart
          </button>

          {cartItems.length > 0 && (
            <button
              onClick={() => handleUserMessage('checkout')}
              className="flex-shrink-0 text-xs px-4 py-1.5 bg-[var(--accent)] text-black font-bold rounded shadow-[0_4px_12px_var(--accent-glow)] hover:bg-[var(--accent-hover)] transition-all duration-300 animate-pulse-subtle"
            >
              Checkout
            </button>
          )}

          <button
            onClick={() => setShowReviewForm(true)}
            className="flex-shrink-0 text-xs px-3 py-1.5 bg-[#1A1A1A] text-[#B0B0B0] rounded border border-[#2A2A2A] hover:border-[#FFFFFF] hover:text-white transition-all duration-300"
          >
            Leave Review
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper to render rich content (bold text and embedded product cards)
const RichMessageContent = ({ content, addToCart, handleProductDetails }: {
  content: string,
  addToCart: (productName: string, quantity?: number) => Promise<void>,
  handleProductDetails: (product: Product) => void
}) => {
  // Regex to match [PRODUCT:JSON_DATA] or **bold text**, supporting newlines and optional whitespace
  const combinedRegex = /\[PRODUCT:\s*(\{[\s\S]*?\})\]|\*\*([\s\S]*?)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = combinedRegex.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }

    if (match[1]) {
      // It's a product card
      try {
        const productData = JSON.parse(match[1]);
        parts.push({ type: 'product', value: productData });
      } catch (e) {
        console.warn('Failed to parse product JSON:', e);
        parts.push({ type: 'text', value: match[0] });
      }
    } else if (match[2]) {
      // It's bold text
      parts.push({ type: 'bold', value: match[2] });
    }

    lastIndex = combinedRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) });
  }

  if (parts.length === 0) return (
    <div className="whitespace-pre-wrap leading-relaxed">
      <TypewriterText text={content} />
    </div>
  );

  // Grouping logic for inline elements (text, bold) vs block elements (product)
  const groupedParts: any[] = [];
  let currentGroup: any[] = [];

  parts.forEach((part) => {
    if (part.type === 'product') {
      if (currentGroup.length > 0) {
        groupedParts.push({ type: 'inline-group', value: currentGroup });
        currentGroup = [];
      }
      groupedParts.push(part);
    } else {
      currentGroup.push(part);
    }
  });

  if (currentGroup.length > 0) {
    groupedParts.push({ type: 'inline-group', value: currentGroup });
  }

  return (
    <div className="space-y-4">
      {groupedParts.map((group, i) => {
        if (group.type === 'product') {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.1, type: 'spring', damping: 20 }}
              className="my-4 transform transition-all duration-300 hover:scale-[1.01]"
            >
              <InlineProductCard
                product={group.value}
                onAddToCart={addToCart}
                onViewDetails={handleProductDetails}
              />
            </motion.div>
          );
        }

        // It's an inline group (paragraph)
        return (
          <div key={i} className="chat-message whitespace-pre-wrap leading-relaxed text-white">
            {group.value.map((part: any, j: number) => {
              if (part.type === 'bold') {
                return (
                  <motion.span
                    key={j}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * j }}
                    className="inline"
                  >
                    <strong className="font-medium text-white underline underline-offset-4 decoration-[var(--accent)]/30">
                      {part.value}
                    </strong>
                  </motion.span>
                );
              }
              return (
                <TypewriterText key={j} text={part.value} />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// Memoized message component for better performance
const MessageItem = memo(function MessageItem({ message, addToCart, handleProductDetails }: {
  message: Message
  addToCart: (productName: string, quantity?: number) => Promise<void>
  handleProductDetails: (product: Product) => void
}) {
  return (
    <div
      key={message.id}
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-[slideIn_300ms_ease-out]`}
    >
      <div className={`max-w-[85%] ${message.isUser ? 'order-2' : 'order-1'}`}>
        {!message.isUser && (
          <div className="text-xs text-[#6B6B6B] mb-1 flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Checkoutly Logo"
              width={16}
              height={16}
              className="object-contain"
            />
            Checkoutly AI
          </div>
        )}

        {/* Check if this is a product card message */}
        {message.content.startsWith('PRODUCT_CARD:') ? (
          <InlineProductCard
            product={JSON.parse(message.content.replace('PRODUCT_CARD:', ''))}
            onAddToCart={addToCart}
            onViewDetails={handleProductDetails}
          />
        ) : (
          <div
            className={`chat-message px-5 py-3 rounded-2xl transition-all duration-300 ${message.isUser
              ? 'bg-[#FFFFFF] text-black shadow-[0_8px_24px_rgba(255,255,255,0.08)]'
              : 'bg-[#1E1E1E] text-white border border-[#2A2A2A] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
              }`}
          >
            {message.isUser ? (
              <span className="text-black font-medium">{message.content}</span>
            ) : (
              <RichMessageContent
                content={message.content}
                addToCart={addToCart}
                handleProductDetails={handleProductDetails}
              />
            )}
          </div>
        )}

        <div className="text-xs text-[#6B6B6B] mt-1">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
})