export default function Slide12Closing() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-primary">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 85%, rgba(255,255,255,0.12) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(0,0,0,0.12) 0%, transparent 45%)',
        }}
      />
      <div
        className="absolute bottom-[-3vh] right-[-1vw] font-display font-black text-white/8 leading-none select-none pointer-events-none"
        style={{ fontSize: '22vw' }}
      >
        LH
      </div>
      <div className="relative z-10 h-full flex flex-col justify-between px-[7vw] py-[7vh]">
        <div className="flex items-center gap-[1vw]">
          <div className="w-[2.2vw] h-[2.2vw] rounded-full bg-white/25 flex items-center justify-center">
            <div className="w-[0.8vw] h-[0.8vw] rounded-full bg-white" />
          </div>
          <span className="font-body text-[1.3vw] text-white/65 tracking-[0.25em] uppercase">Local Hands</span>
        </div>
        <div>
          <p className="font-body text-[1.5vw] text-white/55 tracking-[0.2em] uppercase mb-[3vh]">
            11 — Try it now
          </p>
          <h2
            className="font-display text-[7.5vw] font-black text-white leading-none tracking-tight mb-[3.5vh]"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            A working prototype.
          </h2>
          <p className="font-body text-[2.2vw] text-white/80 mb-[3vh]">
            Live and clickable right now.
          </p>
          <a
            href="https://6afaccb3-4b3d-45f8-8ecc-2b0e1a797a17-00-2fa4u1u298xv2.kirk.replit.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[1.7vw] text-white/75 underline underline-offset-4"
          >
            local-hands.replit.dev
          </a>
        </div>
      </div>
    </div>
  );
}
