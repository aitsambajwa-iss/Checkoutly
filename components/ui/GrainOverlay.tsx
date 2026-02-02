export default function GrainOverlay() {
  return (
    <div 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1] opacity-[0.03]"
      style={{
        backgroundImage: `
          radial-gradient(circle at 25% 25%, #ffffff 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, #ffffff 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        backgroundPosition: '0 0, 25px 25px'
      }}
    />
  )
}