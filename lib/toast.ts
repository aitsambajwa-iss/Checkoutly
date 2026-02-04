// Success Toast Utility
export const showSuccessToast = (message: string) => {
  const toast = document.createElement('div')
  toast.className = 'fixed bottom-8 right-8 bg-[#FFFFFF] text-[#000000] px-6 py-4 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-[#E5E5E5] animate-slide-in-right font-bold z-[9999] flex items-center gap-3'
  toast.innerHTML = `
    <span class="text-xl">✓</span>
    <span class="text-sm tracking-tight">${message}</span>
  `
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 300ms ease-in forwards'
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

export const showErrorToast = (message: string) => {
  const toast = document.createElement('div')
  toast.className = 'fixed bottom-8 right-8 bg-[var(--bg-elevated)] text-[#FFFFFF] px-6 py-4 rounded-xl shadow-2xl border border-[#3A3A3A] animate-slide-in-right font-medium z-[9999] flex items-center gap-3'
  toast.innerHTML = `
    <span class="text-[#A0A0A0]">✗</span>
    <span class="text-sm tracking-tight">${message}</span>
  `
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 300ms ease-in forwards'
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

export const showInfoToast = (message: string) => {
  const toast = document.createElement('div')
  toast.className = 'fixed bottom-8 right-8 bg-[var(--bg-elevated)] text-[#FFFFFF] px-6 py-4 rounded-xl shadow-2xl border border-[#3A3A3A] animate-slide-in-right font-medium z-[9999] flex items-center gap-3'
  toast.innerHTML = `
    <span class="text-[#A0A0A0]">ℹ</span>
    <span class="text-sm tracking-tight">${message}</span>
  `
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 300ms ease-in forwards'
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}