/*
  The inner-page hero (Nov 2026), matching the homepage: the label and
  headline hold the left, the lede and actions sit on the right, bottom-aligned
  to them. No glow, no centred stack. Used by /agents, /connect and /blogs.
*/
export default function PageHero({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: React.ReactNode;
  title: React.ReactNode;
  lede: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="w-full">
      <div className="mx-auto grid max-w-(--breakpoint-xl) gap-6 px-4 pt-16 pb-16 md:px-8 md:pt-24 md:pb-20 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="flex flex-col items-start gap-5 lg:col-span-7">
          <span className="kicker">{kicker}</span>
          <h1 className="text-[2.5rem] leading-[1.05] text-balance md:text-6xl lg:text-[4rem]">{title}</h1>
        </div>
        <div className="flex flex-col items-start gap-5 lg:col-span-5 lg:pb-2">
          <p className="text-base text-muted-foreground sm:text-lg">{lede}</p>
          {children ? <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

/* A left-aligned section head, as on the homepage: orange label, then the heading. */
export function SectionHead({
  kicker,
  title,
  sub,
  className = "",
}: {
  kicker?: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex max-w-2xl flex-col gap-3 ${className}`}>
      {kicker ? <span className="kicker">{kicker}</span> : null}
      <h2 className="text-3xl font-heading font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {sub ? <p className="text-lg text-muted-foreground">{sub}</p> : null}
    </div>
  );
}
