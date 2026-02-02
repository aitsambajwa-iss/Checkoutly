'use client'

import { useState, useRef } from 'react'
import ProgressiveProductGrid from './ProgressiveProductGrid'
import ChatWidget from './ChatWidget'
import FloatingCartCounter from './FloatingCartCounter'
import CartDrawer from './CartDrawer'
import CheckoutModal from './CheckoutModal'
import ProductDetailsModal from './ProductDetailsModal'
import { generateId } from '@/lib/time'
import type { Product } from '@/lib/types'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image_url?: string
}

export default function Demo() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCartDrawer, setShowCartDrawer] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [modalProduct, setModalProduct] = useState<Product | null>(null)
  
  // Reference to ChatWidget to trigger order form
  const chatWidgetRef = useRef<any>(null)

  const handleProductClick = (product: Product) => {
    setModalProduct(product)
    setShowProductModal(true)
  }

  const handleProductDrag = (product: Product) => {
    // Visual feedback for drag operation
    console.log('Product being dragged:', product.name)
  }

  const handleAddToCart = (product: Product, options: { size: string; color: string; quantity: number }) => {
    // Close the product modal
    setShowProductModal(false)
    
    // Add to ChatWidget's cart using the exposed function
    if ((window as any).chatWidgetAddToCart) {
      (window as any).chatWidgetAddToCart(product.name, options)
    }
  }

  // Cart management functions (for the separate cart system if needed)
  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const removeCartItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const handleCheckout = () => {
    setShowCartDrawer(false)
    setShowCheckoutModal(true)
  }

  const handlePlaceOrder = (orderData: any) => {
    setShowCheckoutModal(false)
    setCartItems([]) // Clear cart after order
    console.log('Order placed:', orderData)
    // Here you would typically send the order to your API
  }

  // Calculate cart totals
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Professional mode - side-by-side layout
  return (
    <>
      {/* Floating Cart Counter */}
      <FloatingCartCounter
        itemCount={itemCount}
        cartTotal={cartTotal}
        onCartClick={() => setShowCartDrawer(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={showCartDrawer}
        onClose={() => setShowCartDrawer(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeCartItem}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeCartItem}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Product Details Modal with Reviews */}
      <ProductDetailsModal
        isOpen={showProductModal}
        product={modalProduct!}
        onClose={() => setShowProductModal(false)}
        onAddToCart={(options) => {
          if (modalProduct) {
            handleAddToCart(modalProduct, options)
          }
        }}
      />

      <section id="demo" className="py-32 relative z-[2]">
        <div className="max-w-7xl mx-auto px-6">
          {/* B2B-Focused Header */}
          <div className="text-center mb-16">
            {/* Live Demo Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-full mb-6">
              <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></div>
              <span className="text-sm font-mono text-[#00E5FF]">LIVE DEMO</span>
            </div>
            
            {/* Main Headline - B2B Focused */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Experience the Future of
              <span className="block text-[#00E5FF] mt-2">Conversational Commerce</span>
            </h2>
            
            {/* Subheadline - Clear B2B Message */}
            <p className="text-lg text-[#B0B0B0] max-w-3xl mx-auto mb-6">
              This is the exact chatbot technology your customers will interact with.
              Try it yourself—drag products, ask questions, complete a full order.
            </p>
            
            {/* Value Props - 3 key points */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-[#B0B0B0]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Embed on your site in 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Handles 1000+ products</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>PCI-compliant payments</span>
              </div>
            </div>
          </div>
          
          {/* Main Demo Layout - Technology First */}
          <div className="grid lg:grid-cols-[40%_60%] gap-8">
            {/* LEFT: Compact Product Catalog (40% - Supporting Role) */}
            <div className="order-2 lg:order-1">
              <div className="sticky top-24">
                {/* Product Catalog Header */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Sample Product Catalog
                  </h3>
                  <p className="text-sm text-[#B0B0B0]">
                    These are sample products. Your catalog will display here.
                  </p>
                </div>
                
                {/* Compact Product Grid */}
                <div className="mb-4">
                  <ProgressiveProductGrid 
                    onProductClick={handleProductClick}
                    onProductDrag={handleProductDrag}
                  />
                </div>
                
                {/* Interaction Hint */}
                <div className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white mb-1">Try It</div>
                      <div className="text-xs text-[#B0B0B0]">
                        Drag any product into the chat or ask questions like &quot;Show me running shoes&quot;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* RIGHT: Chatbot (60% - The Star) */}
            <div className="order-1 lg:order-2">
              <div className="sticky top-24">
                {/* Chatbot Header - Clean and Simple */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <img 
                        src="/logo.svg" 
                        alt="Checkoutly Logo" 
                        width={28} 
                        height={28}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Checkoutly AI Assistant</h3>
                    </div>
                  </div>
                </div>
                
                {/* The Actual Chatbot Interface */}
                <ChatWidget 
                  selectedProduct={selectedProduct}
                  onProductSelect={setSelectedProduct}
                  onExternalAddToCart={() => {}}
                />
              </div>
            </div>
          </div>
          
          {/* Mobile Optimization */}
          <div className="lg:hidden mt-8">
            <div className="space-y-6">
              {/* Chat First (Most Important) */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Try the Chatbot</h3>
                <p className="text-sm text-[#B0B0B0] mb-4">
                  This is what your customers will interact with
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Proof Section - B2B Metrics */}
        <div className="max-w-7xl mx-auto px-6 py-12 mt-16">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Metric 1 */}
            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl">
              <div className="text-4xl font-bold text-[#00E5FF] mb-2">73%</div>
              <div className="text-sm font-semibold text-white mb-1">Higher Conversion</div>
              <div className="text-xs text-[#6B6B6B]">
                Customers who use chat complete purchases 73% more often
              </div>
            </div>
            
            {/* Metric 2 */}
            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl">
              <div className="text-4xl font-bold text-[#00E5FF] mb-2">-58%</div>
              <div className="text-sm font-semibold text-white mb-1">Cart Abandonment</div>
              <div className="text-xs text-[#6B6B6B]">
                Conversational checkout reduces abandonment by over half
              </div>
            </div>
            
            {/* Metric 3 */}
            <div className="p-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl">
              <div className="text-4xl font-bold text-[#00E5FF] mb-2">24/7</div>
              <div className="text-sm font-semibold text-white mb-1">Always Available</div>
              <div className="text-xs text-[#6B6B6B]">
                AI handles sales and support around the clock, no staffing needed
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}