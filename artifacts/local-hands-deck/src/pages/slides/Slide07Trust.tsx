export default function Slide07Trust() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="h-full px-[6vw] py-[6vh] flex flex-col">
        <div className="mb-[4vh]">
          <p className="font-body text-[1.3vw] text-primary tracking-[0.2em] uppercase mb-[1.5vh]">06</p>
          <h2 className="font-display text-[4.5vw] font-black text-text leading-tight tracking-tight">
            Community trust built in
          </h2>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-[2.5vw]">
          <div className="bg-white rounded-[1vw] p-[3vw] border border-black/5 flex flex-col">
            <div className="w-[3vw] h-[3vw] rounded-full flex items-center justify-center mb-[2.5vh]" style={{ background: 'rgba(249,115,22,0.1)' }}>
              <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-primary" />
            </div>
            <h3 className="font-display text-[2.2vw] font-bold text-text mb-[1vh]">Verification badge</h3>
            <p className="font-body text-[1.8vw] text-muted leading-snug">
              Manually reviewed providers stand out from the crowd
            </p>
          </div>
          <div className="bg-white rounded-[1vw] p-[3vw] border border-black/5 flex flex-col">
            <div className="w-[3vw] h-[3vw] rounded-full flex items-center justify-center mb-[2.5vh]" style={{ background: 'rgba(249,115,22,0.1)' }}>
              <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-primary" />
            </div>
            <h3 className="font-display text-[2.2vw] font-bold text-text mb-[1vh]">Star ratings</h3>
            <p className="font-body text-[1.8vw] text-muted leading-snug">
              Rating and review count displayed on every provider profile
            </p>
          </div>
          <div className="bg-white rounded-[1vw] p-[3vw] border border-black/5 flex flex-col">
            <div className="w-[3vw] h-[3vw] rounded-full flex items-center justify-center mb-[2.5vh]" style={{ background: 'rgba(28,43,58,0.08)' }}>
              <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            </div>
            <h3 className="font-display text-[2.2vw] font-bold text-text mb-[1vh]">Value score</h3>
            <p className="font-body text-[1.8vw] text-muted leading-snug">
              A 0–100 composite of price, rating, and reliability
            </p>
          </div>
          <div className="bg-white rounded-[1vw] p-[3vw] border border-black/5 flex flex-col">
            <div className="w-[3vw] h-[3vw] rounded-full flex items-center justify-center mb-[2.5vh]" style={{ background: 'rgba(28,43,58,0.08)' }}>
              <div className="w-[1.1vw] h-[1.1vw] rounded-full bg-accent" />
            </div>
            <h3 className="font-display text-[2.2vw] font-bold text-text mb-[1vh]">Location-scoped</h3>
            <p className="font-body text-[1.8vw] text-muted leading-snug">
              Only see providers and jobs relevant to your area
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
