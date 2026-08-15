export default function Slide04HowItWorks() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="h-full px-[6vw] py-[6vh] flex flex-col">
        <div className="mb-[5vh]">
          <p className="font-body text-[1.3vw] text-primary tracking-[0.2em] uppercase mb-[1.5vh]">03</p>
          <h2 className="font-display text-[4.5vw] font-black text-text leading-tight tracking-tight">
            How it works
          </h2>
        </div>
        <div className="flex-1 flex gap-[3vw] items-stretch">
          <div className="flex-1 flex flex-col">
            <div
              className="font-display font-black text-primary/15 leading-none mb-[2.5vh]"
              style={{ fontSize: '8vw' }}
            >
              1
            </div>
            <div className="h-[0.35vh] bg-primary mb-[3vh]" />
            <h3 className="font-display text-[2.4vw] font-bold text-text mb-[2vh]">Post a job</h3>
            <p
              className="font-body text-[2vw] text-muted leading-snug"
              style={{ textWrap: 'pretty' } as React.CSSProperties}
            >
              Describe what you need, set a budget, and pick your urgency level.
            </p>
          </div>
          <div className="flex-1 flex flex-col">
            <div
              className="font-display font-black text-primary/10 leading-none mb-[2.5vh]"
              style={{ fontSize: '8vw' }}
            >
              2
            </div>
            <div className="h-[0.35vh] bg-primary/35 mb-[3vh]" />
            <h3 className="font-display text-[2.4vw] font-bold text-text mb-[2vh]">Providers respond</h3>
            <p
              className="font-body text-[2vw] text-muted leading-snug"
              style={{ textWrap: 'pretty' } as React.CSSProperties}
            >
              Local providers express interest with their estimate and public profile.
            </p>
          </div>
          <div className="flex-1 flex flex-col">
            <div
              className="font-display font-black text-primary/5 leading-none mb-[2.5vh]"
              style={{ fontSize: '8vw' }}
            >
              3
            </div>
            <div className="h-[0.35vh] bg-primary/15 mb-[3vh]" />
            <h3 className="font-display text-[2.4vw] font-bold text-text mb-[2vh]">Hire &amp; review</h3>
            <p
              className="font-body text-[2vw] text-muted leading-snug"
              style={{ textWrap: 'pretty' } as React.CSSProperties}
            >
              Choose the right person, get the job done, leave a rating for the community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
