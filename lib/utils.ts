import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server-session'
  
  let sessionId = localStorage.getItem('chatSessionId')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('chatSessionId', sessionId)
  }
  return sessionId
}