const base = import.meta.env.BASE_URL;

export default function Slide01Cover() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <img
        src={`${base}hero.jpg`}
        alt="Local community scene"
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/45 to-black/80" />
      <div className="relative z-10 h-full flex flex-col justify-between px-[6vw] py-[6vh]">
        <div className="flex items-center gap-[0.8vw]">
          <div className="w-[2.2vw] h-[2.2vw] rounded-full bg-primary flex items-center justify-center">
            <div className="w-[0.8vw] h-[0.8vw] rounded-full bg-white" />
          </div>
          <span className="font-body text-[1.3vw] text-white/60 tracking-[0.25em] uppercase">Community Services</span>
        </div>
        <div>
          <p
            className="font-body text-[1.5vw] text-primary tracking-[0.2em] uppercase mb-[2vh]"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Demo Presentation — 2026
          </p>
          <h1
            className="font-display text-[9vw] font-black text-white leading-none tracking-tight mb-[3vh]"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Local Hands
          </h1>
          <p
            className="font-body text-[2.3vw] text-white/80 max-w-[54vw] leading-snug"
            style={{ textWrap: 'pretty' } as React.CSSProperties}
          >
            Trusted local services, recommended by your community.
          </p>
        </div>
      </div>
    </div>
  );
}
