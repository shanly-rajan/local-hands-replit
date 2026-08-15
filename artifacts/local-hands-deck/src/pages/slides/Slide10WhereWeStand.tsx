export default function Slide10WhereWeStand() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-accent">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 75% 25%, rgba(249,115,22,0.12) 0%, transparent 55%)',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-[0.5vh] bg-primary" />
      <div className="relative z-10 h-full px-[7vw] py-[6vh] flex flex-col">
        <div className="mb-[4vh]">
          <p className="font-body text-[1.3vw] text-primary tracking-[0.2em] uppercase mb-[1.5vh]">09</p>
          <h2 className="font-display text-[4.5vw] font-black text-white leading-tight tracking-tight">
            Where it stands today
          </h2>
        </div>
        <div className="flex gap-[5vw] mb-[5vh]">
          <div>
            <p className="font-display font-black text-primary leading-none" style={{ fontSize: '5.5vw' }}>30</p>
            <p className="font-body text-[1.6vw] text-white/55 mt-[0.5vh]">seeded providers</p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="font-display font-black text-primary leading-none" style={{ fontSize: '5.5vw' }}>29</p>
            <p className="font-body text-[1.6vw] text-white/55 mt-[0.5vh]">community jobs</p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="font-display font-black text-primary leading-none" style={{ fontSize: '5.5vw' }}>3</p>
            <p className="font-body text-[1.6vw] text-white/55 mt-[0.5vh]">countries live</p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="font-display font-black text-primary leading-none" style={{ fontSize: '5.5vw' }}>7</p>
            <p className="font-body text-[1.6vw] text-white/55 mt-[0.5vh]">local ads</p>
          </div>
        </div>
        <div className="space-y-[2.2vh]">
          <div className="flex items-center gap-[1.5vw]">
            <div className="w-[0.5vw] h-[0.5vw] rounded-full bg-primary shrink-0" />
            <p className="font-body text-[2vw] text-white/80">
              Full jobs board — post, receive interest, hire, and complete
            </p>
          </div>
          <div className="flex items-center gap-[1.5vw]">
            <div className="w-[0.5vw] h-[0.5vw] rounded-full bg-primary shrink-0" />
            <p className="font-body text-[2vw] text-white/80">
              Community Sponsors page with real photography
            </p>
          </div>
          <div className="flex items-center gap-[1.5vw]">
            <div className="w-[0.5vw] h-[0.5vw] rounded-full bg-primary shrink-0" />
            <p className="font-body text-[2vw] text-white/80">
              Demo mode — no login required to explore
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
