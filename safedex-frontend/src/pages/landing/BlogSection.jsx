import blog1 from './assets/images/blog1.jpg'
import blog2 from './assets/images/blog2.jpg'
import blog3 from './assets/images/blog3.jpg'

const blogs = [
  {
    id: 1,
    image: blog1,
    alt: "Block of red brick flats, Well Street, London, UK",
    title: 'SDG 11: Why the Future Relies on Safe Housing',
    preview: 'With rapid urbanisation and the rising cost of living, housing affordability has reached crisis levels. Read about our mission at SafeDex as we move forward...',
  },
  {
    id: 2,
    image: blog2,
    alt: "Room with lots of plants and a cat",
    title: "The Eco-Conscious Renter's Manual",
    preview: 'From energy efficiency to green spaces, sustainable living often starts at home...',
  },
  {
    id: 3,
    image: blog3,
    alt: "Brick wall and a cracked and aged white sign with faded lettering",
    title: 'How Underfunding Fuels Unsafe Neighbourhoods',
    preview: 'When councils reduce funding to local services and infrastructure, the effects on community safety and development are dangerous. A deep dive into the numbers behind budget cuts, spendings and their lasting effects on local communities...',
  },
]

export default function BlogSection() {
  return (
    <section className='w-full py-32 px-8'>
      {/* Heading */}
      <div className='text-center mb-16'>
        <h2 className='font-mono font-semibold text-black text-6xl md:text-7xl text-center mx-auto dark:text-white hc:text-hc-text'>
          The SafeDex Journal
        </h2>
        <p className='font-mono text-2xl text-slate-800 text-center mt-2 max-w-xl mx-auto dark:text-slate-300 hc:text-hc-text'>
          Written by the SafeDex team, for the SafeDex community.
        </p>
      </div>

      {/* Blog Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className='rounded-2xl border border-slate-100 dark:border-slate-700 hc:border-hc-border shadow-sm overflow-hidden hover:shadow-md transition hover:-translate-y-1 transform dark:bg-slate-900 hc:bg-hc-layer'
          >
            <img
              src={blog.image}
              alt={blog.alt}
              className='w-full h-48 object-cover hc:opacity-50'
            />
            <div className='p-6'>
              <h3 className='text-lg font-semibold text-slate-900 mb-3 dark:text-slate-100 hc:text-hc-text'>
                {blog.title}
              </h3>
              <p className='text-slate-500 text-sm leading-relaxed mb-6 dark:text-slate-200 hc:text-hc-text'>
                {blog.preview}
              </p>
              <button className='inline-flex items-center gap-2 text-sm font-medium text-black hover:underline dark:text-white hc:text-hc-bg hc:bg-hc-text hc:px-3 hc:py-1 hc:rounded'>
                Read more →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom link */}
      <div className='flex justify-center mt-12'>
        <button tabIndex={0} className='inline-flex items-center gap-2 font-mono font-medium text-black text-lg hover:underline dark:text-white hc:text-hc-text'>
          Click here to read more from The SafeDex Journal →
        </button>
      </div>
    </section>
  )
}