// Success Toast Utility
export const showSuccessToast = (message: string) => {
  const toast = document.createElement('div')
  toast.className = 'fixed top-4 right-4 bg-[#10B981] text-white px-6 py-3 rounded-lg shadow-2xl animate-slideInRight font-medium z-50'
  toast.textContent = `✓ ${message}`
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 300ms ease-in forwards'
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

export const showErrorToast = (message: string) => {
  const toast = document.createElement('div')
  toast.className = 'fixed top-4 right-4 bg-[#EF4444] text-white px-6 py-3 rounded-lg shadow-2xl animate-slideInRight font-medium z-50'
  toast.textContent = `✗ ${message}`
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 300ms ease-in forwards'
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

export const showInfoToast = (message: string) => {
  const toast = document.createElement('div')
  toast.className = 'fixed top-4 right-4 bg-[#3B82F6] text-white px-6 py-3 rounded-lg shadow-2xl animate-slideInRight font-medium z-50'
  toast.textContent = `ℹ ${message}`
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 300ms ease-in forwards'
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}