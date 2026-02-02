// Utility functions for consistent time handling to avoid hydration issues

export const formatTime = (timestamp: Date | string | number): string => {
  try {
    const date = new Date(timestamp)
    if (isNaN(date.getTime())) return ''
    
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  } catch {
    return ''
  }
}

export const createTimestamp = (): Date => {
  return new Date()
}

export const getCurrentYear = (): number => {
  return new Date().getFullYear()
}

// For consistent ID generation
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}