export default function Slide05ForResidents() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="h-full flex">
        <div className="flex-1 flex flex-col justify-center px-[7vw] py-[6vh]">
          <p className="font-body text-[1.3vw] text-primary tracking-[0.2em] uppercase mb-[1.5vh]">04</p>
          <h2 className="font-display text-[4.5vw] font-black text-text leading-tight tracking-tight mb-[5vh]">
            For residents
          </h2>
          <div className="space-y-[3vh]">
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.6vw] h-[0.6vw] rounded-full bg-primary shrink-0 mt-[1.2vw]" />
              <p className="font-body text-[2.1vw] text-text leading-snug">
                Browse verified providers filtered by category, rating, or area
              </p>
            </div>
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.6vw] h-[0.6vw] rounded-full bg-primary shrink-0 mt-[1.2vw]" />
              <p className="font-body text-[2.1vw] text-text leading-snug">
                Post a job and let interested providers come to you
              </p>
            </div>
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.6vw] h-[0.6vw] rounded-full bg-primary shrink-0 mt-[1.2vw]" />
              <p className="font-body text-[2.1vw] text-text leading-snug">
                Save favourite providers for quick access later
              </p>
            </div>
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.6vw] h-[0.6vw] rounded-full bg-primary shrink-0 mt-[1.2vw]" />
              <p className="font-body text-[2.1vw] text-text leading-snug">
                See value scores so you know you're getting a fair deal
              </p>
            </div>
          </div>
        </div>
        <div className="w-[28vw] shrink-0 flex flex-col" style={{ background: 'rgba(249,115,22,0.06)' }}>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-[3vw]">
              <p
                className="font-display font-black text-primary/20 leading-none"
                style={{ fontSize: '14vw' }}
              >
                R
              </p>
              <p className="font-body text-[1.5vw] text-primary font-semibold tracking-[0.15em] uppercase mt-[2vh]">
                Residents
              </p>
            </div>
          </div>
          <div className="h-[0.5vh] bg-primary/20" />
        </div>
      </div>
    </div>
  );
}
