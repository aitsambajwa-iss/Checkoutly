import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  currency: string
  sizes: string[]
  colors: string[]
  availability: any
  created_at: string
  name_normalized: string
  image_url?: string
}

// Function to generate image URL from Supabase Storage
function generateImageUrl(productName: string): string {
  // Convert product name to filename format
  const filename = productName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
  
  // Try multiple formats - the browser will use the first one that exists
  // We'll return the .jpg URL as primary, but add fallback logic in the component
  return `${supabaseUrl}/storage/v1/object/public/product-images/${filename}.jpg`
}

// Function to get all possible image URLs for a product (for fallback)
export function getProductImageUrls(productName: string): string[] {
  const filename = productName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  
  const baseUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${filename}`
  
  // Return array of possible image URLs in order of preference
  return [
    `${baseUrl}.jpg`,
    `${baseUrl}.jpeg`, 
    `${baseUrl}.png`,
    `${baseUrl}.webp`
  ]
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    // Add image URLs to products
    const productsWithImages = (data || []).map(product => ({
      ...product,
      image_url: generateImageUrl(product.name)
    }))

    return productsWithImages
  } catch (error) {
    console.error('Error in getAllProducts:', error)
    return []
  }
}

export async function getProductByName(name: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${name}%`)
      .single()

    if (error) {
      console.error('Error fetching product by name:', error)
      return null
    }

    // Add image URL
    return {
      ...data,
      image_url: generateImageUrl(data.name)
    }
  } catch (error) {
    console.error('Error in getProductByName:', error)
    return null
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching products:', error)
      return []
    }

    // Add image URLs to products
    const productsWithImages = (data || []).map(product => ({
      ...product,
      image_url: generateImageUrl(product.name)
    }))

    return productsWithImages
  } catch (error) {
    console.error('Error in searchProducts:', error)
    return []
  }
}