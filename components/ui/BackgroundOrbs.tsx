export default function BackgroundOrbs() {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      <div 
        className="absolute w-[400px] h-[400px] top-[10%] left-[20%] rounded-full animate-float"
        style={{
          background: 'radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)',
          animationDelay: '0s'
        }}
      />
      <div 
        className="absolute w-[300px] h-[300px] top-[60%] right-[15%] rounded-full animate-float"
        style={{
          background: 'radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)',
          animationDelay: '-3s'
        }}
      />
      <div 
        className="absolute w-[200px] h-[200px] bottom-[20%] left-[10%] rounded-full animate-float"
        style={{
          background: 'radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)',
          animationDelay: '-6s'
        }}
      />
    </div>
  )
}