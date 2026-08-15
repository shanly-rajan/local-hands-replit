export default function Slide02Problem() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="absolute left-0 top-0 bottom-0 w-[0.5vw] bg-primary" />
      <div className="h-full flex px-[7vw] py-[6vh] gap-[5vw]">
        <div className="flex flex-col justify-center flex-1">
          <p className="font-body text-[1.3vw] text-primary tracking-[0.2em] uppercase mb-[1.5vh]">01</p>
          <h2
            className="font-display text-[5vw] font-black text-text leading-tight tracking-tight mb-[5vh]"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            The problem
          </h2>
          <div className="space-y-[3vh]">
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.55vw] h-[0.55vw] rounded-full bg-primary shrink-0 mt-[1.2vw]" />
              <p
                className="font-body text-[2.15vw] text-text leading-snug"
                style={{ textWrap: 'pretty' } as React.CSSProperties}
              >
                Finding a trustworthy plumber, tutor, or cleaner is still word-of-mouth
              </p>
            </div>
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.55vw] h-[0.55vw] rounded-full bg-primary shrink-0 mt-[1.2vw]" />
              <p
                className="font-body text-[2.15vw] text-text leading-snug"
                style={{ textWrap: 'pretty' } as React.CSSProperties}
              >
                Word-of-mouth doesn't scale beyond your immediate circle
              </p>
            </div>
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.55vw] h-[0.55vw] rounded-full bg-primary shrink-0 mt-[1.2vw]" />
              <p
                className="font-body text-[2.15vw] text-text leading-snug"
                style={{ textWrap: 'pretty' } as React.CSSProperties}
              >
                Generic platforms like Upwork are too global and impersonal
              </p>
            </div>
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.55vw] h-[0.55vw] rounded-full bg-primary shrink-0 mt-[1.2vw]" />
              <p
                className="font-body text-[2.15vw] text-text leading-snug"
                style={{ textWrap: 'pretty' } as React.CSSProperties}
              >
                You have no idea who you're letting into your home
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-[28vw] shrink-0">
          <span className="font-display text-[24vw] font-black text-text/5 leading-none select-none">?</span>
        </div>
      </div>
    </div>
  );
}
