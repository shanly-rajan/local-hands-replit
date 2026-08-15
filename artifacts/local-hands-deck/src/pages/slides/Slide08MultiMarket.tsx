export default function Slide08MultiMarket() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="h-full px-[6vw] py-[6vh] flex flex-col">
        <div className="mb-[4vh]">
          <p className="font-body text-[1.3vw] text-primary tracking-[0.2em] uppercase mb-[1.5vh]">07</p>
          <h2 className="font-display text-[4.5vw] font-black text-text leading-tight tracking-tight">
            Multi-market from day one
          </h2>
        </div>
        <div className="flex-1 flex gap-[2.5vw] items-stretch">
          <div className="flex-1 bg-white rounded-[1vw] p-[3vw] border border-black/5 flex flex-col justify-between">
            <div>
              <p
                className="font-display font-black text-text/8 leading-none mb-[2.5vh]"
                style={{ fontSize: '5vw' }}
              >
                ZA
              </p>
              <h3 className="font-display text-[2.4vw] font-bold text-text mb-[1.5vh]">South Africa</h3>
              <p className="font-body text-[1.9vw] text-primary font-semibold">ZAR — Rand</p>
            </div>
            <div className="pt-[2.5vh] border-t border-black/6 space-y-[0.8vh]">
              <p className="font-body text-[1.7vw] text-muted">3 cities</p>
              <p className="font-body text-[1.7vw] text-muted">9 suburbs</p>
            </div>
          </div>
          <div className="flex-1 bg-accent rounded-[1vw] p-[3vw] flex flex-col justify-between">
            <div>
              <p
                className="font-display font-black text-white/10 leading-none mb-[2.5vh]"
                style={{ fontSize: '5vw' }}
              >
                US
              </p>
              <h3 className="font-display text-[2.4vw] font-bold text-white mb-[1.5vh]">United States</h3>
              <p className="font-body text-[1.9vw] text-primary font-semibold">USD — Dollar</p>
            </div>
            <div className="pt-[2.5vh] border-t border-white/10 space-y-[0.8vh]">
              <p className="font-body text-[1.7vw] text-white/55">3 cities</p>
              <p className="font-body text-[1.7vw] text-white/55">9 suburbs</p>
            </div>
          </div>
          <div className="flex-1 bg-white rounded-[1vw] p-[3vw] border border-black/5 flex flex-col justify-between">
            <div>
              <p
                className="font-display font-black text-text/8 leading-none mb-[2.5vh]"
                style={{ fontSize: '5vw' }}
              >
                IN
              </p>
              <h3 className="font-display text-[2.4vw] font-bold text-text mb-[1.5vh]">India</h3>
              <p className="font-body text-[1.9vw] text-primary font-semibold">INR — Rupee</p>
            </div>
            <div className="pt-[2.5vh] border-t border-black/6 space-y-[0.8vh]">
              <p className="font-body text-[1.7vw] text-muted">3 cities</p>
              <p className="font-body text-[1.7vw] text-muted">9 suburbs</p>
            </div>
          </div>
        </div>
        <p className="font-body text-[1.5vw] text-muted mt-[2.5vh]">
          Country + city + suburb filtering applied across every view in the app
        </p>
      </div>
    </div>
  );
}
