export default function Slide11WhatComesNext() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="h-full px-[6vw] py-[6vh] flex flex-col">
        <div className="mb-[3.5vh]">
          <p className="font-body text-[1.3vw] text-primary tracking-[0.2em] uppercase mb-[1.5vh]">10</p>
          <h2 className="font-display text-[4.5vw] font-black text-text leading-tight tracking-tight">
            What comes next
          </h2>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex items-center gap-[2.5vw] py-[1.8vh] border-b border-black/6">
            <span className="font-display text-[2.5vw] font-black text-primary/20 w-[4vw] shrink-0 tabular-nums">01</span>
            <div>
              <p className="font-body text-[2.2vw] font-semibold text-text leading-tight">User authentication</p>
              <p className="font-body text-[1.7vw] text-muted mt-[0.3vh]">Residents and providers own their data</p>
            </div>
          </div>
          <div className="flex items-center gap-[2.5vw] py-[1.8vh] border-b border-black/6">
            <span className="font-display text-[2.5vw] font-black text-primary/20 w-[4vw] shrink-0 tabular-nums">02</span>
            <div>
              <p className="font-body text-[2.2vw] font-semibold text-text leading-tight">Provider self-registration</p>
              <p className="font-body text-[1.7vw] text-muted mt-[0.3vh]">Any tradesperson can sign up</p>
            </div>
          </div>
          <div className="flex items-center gap-[2.5vw] py-[1.8vh] border-b border-black/6">
            <span className="font-display text-[2.5vw] font-black text-primary/20 w-[4vw] shrink-0 tabular-nums">03</span>
            <div>
              <p className="font-body text-[2.2vw] font-semibold text-text leading-tight">Native mobile app</p>
              <p className="font-body text-[1.7vw] text-muted mt-[0.3vh]">Installable, with push notifications</p>
            </div>
          </div>
          <div className="flex items-center gap-[2.5vw] py-[1.8vh] border-b border-black/6">
            <span className="font-display text-[2.5vw] font-black text-primary/20 w-[4vw] shrink-0 tabular-nums">04</span>
            <div>
              <p className="font-body text-[2.2vw] font-semibold text-text leading-tight">User-submitted reviews</p>
              <p className="font-body text-[1.7vw] text-muted mt-[0.3vh]">Authenticated ratings from real users</p>
            </div>
          </div>
          <div className="flex items-center gap-[2.5vw] py-[1.8vh]">
            <span className="font-display text-[2.5vw] font-black text-primary/20 w-[4vw] shrink-0 tabular-nums">05</span>
            <div>
              <p className="font-body text-[2.2vw] font-semibold text-text leading-tight">Payment &amp; booking integration</p>
              <p className="font-body text-[1.7vw] text-muted mt-[0.3vh]">Secure transactions within the platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
