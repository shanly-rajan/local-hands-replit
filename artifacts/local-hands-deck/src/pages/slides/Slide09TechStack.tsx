const base = import.meta.env.BASE_URL;

export default function Slide09TechStack() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg">
      <div className="h-full flex">
        <div className="w-[44vw] flex flex-col justify-center px-[6vw] py-[7vh] shrink-0">
          <p className="font-body text-[1.3vw] text-primary tracking-[0.2em] uppercase mb-[1.5vh]">08</p>
          <h2 className="font-display text-[3.8vw] font-black text-text leading-tight tracking-tight mb-[4.5vh]">
            Built on a modern stack
          </h2>
          <div className="space-y-[2.8vh]">
            <div className="flex items-start gap-[1.3vw]">
              <div className="w-[0.5vw] h-[0.5vw] rounded-full bg-primary shrink-0 mt-[1.1vw]" />
              <p className="font-body text-[1.9vw] text-text leading-snug">
                React + Vite frontend, Express API, PostgreSQL + Drizzle ORM
              </p>
            </div>
            <div className="flex items-start gap-[1.3vw]">
              <div className="w-[0.5vw] h-[0.5vw] rounded-full bg-primary shrink-0 mt-[1.1vw]" />
              <p className="font-body text-[1.9vw] text-text leading-snug">
                OpenAPI spec — Orval codegen — Zod schemas + React Query hooks
              </p>
            </div>
            <div className="flex items-start gap-[1.3vw]">
              <div className="w-[0.5vw] h-[0.5vw] rounded-full bg-primary shrink-0 mt-[1.1vw]" />
              <p className="font-body text-[1.9vw] text-text leading-snug">
                pnpm monorepo — shared DB schema, shared API client
              </p>
            </div>
            <div className="flex items-start gap-[1.3vw]">
              <div className="w-[0.5vw] h-[0.5vw] rounded-full bg-primary shrink-0 mt-[1.1vw]" />
              <p className="font-body text-[1.9vw] text-text leading-snug">
                Fully responsive — desktop nav + mobile bottom bar
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-[3vw] py-[5vh]" style={{ background: 'rgba(255,255,255,0.6)' }}>
          <img
            src={`${base}architecture.png`}
            alt="Architecture diagram"
            crossOrigin="anonymous"
            className="max-w-full max-h-full object-contain"
            style={{ borderRadius: '0.5vw' }}
          />
        </div>
      </div>
    </div>
  );
}
