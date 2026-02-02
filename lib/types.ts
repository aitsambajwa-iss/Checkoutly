export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  icon?: string
  description?: string | null
  sizes?: string[]
  colors?: string[]
  availability?: string
  image_url?: string
  featured?: boolean
}

export interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image_url?: string
  max_stock?: number
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  itemCount: number
}

export interface CheckoutData {
  contact: {
    name: string
    email: string
    phone: string
  }
  shipping: {
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export interface N8nResponse {
  type?: string
  content?: string
  text?: string
  output?: string
  response?: string
  transferToW2?: boolean
  workflowTransfer?: boolean
  newWebhookUrl?: string
}