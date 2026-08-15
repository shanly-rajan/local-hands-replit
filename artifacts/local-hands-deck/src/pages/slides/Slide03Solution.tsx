export default function Slide03Solution() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-accent">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px)',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-[0.5vh] bg-primary" />
      <div
        className="absolute bottom-[-3vh] right-[-2vw] font-display font-black text-white/5 leading-none select-none pointer-events-none"
        style={{ fontSize: '22vw' }}
      >
        02
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center px-[9vw]">
        <p className="font-body text-[1.3vw] text-primary tracking-[0.2em] uppercase mb-[3vh]">
          02 — The solution
        </p>
        <p
          className="font-display text-[4vw] font-bold text-white leading-[1.3] max-w-[78vw]"
          style={{ textWrap: 'pretty' } as React.CSSProperties}
        >
          Local Hands is a two-sided community marketplace that connects residents who need help with verified local service providers — rated and recommended by their actual neighbours.
        </p>
        <div className="mt-[5vh] w-[8vw] h-[0.4vh] bg-primary" />
      </div>
    </div>
  );
}
