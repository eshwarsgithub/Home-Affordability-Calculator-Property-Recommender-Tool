const testimonials = [
  {
    quote:
      "We closed five trophy assets across three jurisdictions with zero slippage thanks to Tycoon Estates’ transaction desk.",
    author: "Devika S.",
    title: "Principal, Apex Meridian Family Office",
  },
  {
    quote: "The dashboard surfaces risk drifts in under a minute – our CIO calls it an unfair advantage.",
    author: "Luca V.",
    title: "Chief Investment Officer, Vadeem Capital",
  },
  {
    quote: "Micro-interactions feel subtle yet purposeful, mirroring the discretion we promise our limited partners.",
    author: "Rania K.",
    title: "Managing Partner, Riyadh Impact Fund",
  },
];

export const Testimonials = () => (
  <section className="page-shell mt-24">
    <div className="glass-panel p-10">
      <p className="text-xs uppercase tracking-[0.4em] text-white/60">Testimonials</p>
      <div className="mt-6 grid gap-8 md:grid-cols-3">
        {testimonials.map((item) => (
          <blockquote key={item.author} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
            <p>“{item.quote}”</p>
            <footer className="mt-4 text-white">
              {item.author}
              <br />
              <span className="text-white/60">{item.title}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  </section>
);
