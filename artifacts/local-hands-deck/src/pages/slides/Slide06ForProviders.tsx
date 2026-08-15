export default function Slide06ForProviders() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="h-full flex">
        <div className="w-[28vw] shrink-0 bg-accent flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-[3vw]">
              <p
                className="font-display font-black text-white/10 leading-none"
                style={{ fontSize: '14vw' }}
              >
                P
              </p>
              <p className="font-body text-[1.5vw] text-primary font-semibold tracking-[0.15em] uppercase mt-[2vh]">
                Providers
              </p>
            </div>
          </div>
          <div className="h-[0.5vh] bg-primary" />
        </div>
        <div className="flex-1 flex flex-col justify-center px-[7vw] py-[6vh]">
          <p className="font-body text-[1.3vw] text-primary tracking-[0.2em] uppercase mb-[1.5vh]">05</p>
          <h2 className="font-display text-[4.5vw] font-black text-text leading-tight tracking-tight mb-[5vh]">
            For service providers
          </h2>
          <div className="space-y-[3vh]">
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.6vw] h-[0.6vw] rounded-full bg-primary shrink-0 mt-[1.2vw]" />
              <p className="font-body text-[2.1vw] text-text leading-snug">
                A public profile with star ratings, reviews, and a value score
              </p>
            </div>
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.6vw] h-[0.6vw] rounded-full bg-primary shrink-0 mt-[1.2vw]" />
              <p className="font-body text-[2.1vw] text-text leading-snug">
                Contact details visible to residents once you're verified
              </p>
            </div>
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.6vw] h-[0.6vw] rounded-full bg-primary shrink-0 mt-[1.2vw]" />
              <p className="font-body text-[2.1vw] text-text leading-snug">
                Express interest in open community jobs with your estimate
              </p>
            </div>
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.6vw] h-[0.6vw] rounded-full bg-primary shrink-0 mt-[1.2vw]" />
              <p className="font-body text-[2.1vw] text-text leading-snug">
                Build a reputation in your local area over time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
