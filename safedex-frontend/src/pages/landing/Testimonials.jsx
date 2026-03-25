
//taken from https://prebuiltui.com/components/testimonial
const testimonials = [
  { id: 1, role: 'Student', quote: 'Moving to a new city for uni was scary. SafeDex helped me find a student home in a safe area I actually felt comfortable in.', author: 'Jake' },
  { id: 2, role: 'Young Professional', quote: 'As a busy working professional I am really impressed with the "Favourite a Property" feature!', author: 'Luisa' },
  { id: 3, role: 'Parent', quote: 'Finding a safe neighbourhood for my family was my priority. SafeDex gave me the data I needed to make the right choice.', author: 'Eva' },
  { id: 4, role: 'City Planner', quote: 'As a city planner, SafeDex is a brilliant idea! It provides safety information that highlights development insights in different areas.', author: 'Alex' },
  { id: 5, role: 'Deaf Person', quote: 'As someone who does not rely on auditory cues, I enjoy the visual and text-based breakdown of Safety Scores.', author: 'Emily' },
  { id: 6, role: 'Relocating Couple', quote: 'We both have different accessibility requirements. SafeDex allowed us both to customise and personalise our experience and find the perfect home!', author: 'James and Jeremy' },
]

export default function Testimonials() {
  return (
    <section className="px-4">
      <h2 className="font-mono font-semibold text-black text-6xl md:text-7xl text-center mx-auto dark:text-white hc:text-hc-text ">
        Our User Stories
      </h2>
      <p className="font-mono text-2xl text-slate-900 text-center mt-2 max-w-xl mx-auto dark:text-slate-300 hc:text-hc-text">
        Hear from those who found their homes with SafeDex.
      </p>
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0 pt-16">
        {testimonials.map((t) => (
          <article
            key={t.id}
            aria-label={`Testimonial by ${t.author}`}
            className="bg-white dark:bg-slate-800 hc:bg-hc-layer rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hc:border-hc-border overflow-hidden hover:shadow-md transition hover:-translate-y-1 transform"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-200 dark:bg-slate-700 hc:bg-hc-bg border-b border-slate-200 dark:border-slate-600 hc:border-hc-border">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>

            <div className="font-sans p-6">
              <p className="font-medium text-sm text-slate-500 dark:text-slate-300 hc:text-hc-text mb-4">{t.role}</p>
              <blockquote className="text-sm text-slate-700 dark:text-slate-200 hc:text-hc-text mb-4 leading-relaxed">"{t.quote}"</blockquote>
              <cite className="text-xs text-slate-600 dark:text-slate-200 hc:text-hc-text">— {t.author}</cite>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}