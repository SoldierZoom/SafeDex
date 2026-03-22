import blog1 from './assets/images/blog1.jpg'
import blog2 from './assets/images/blog2.jpg'
import blog3 from './assets/images/blog3.jpg'

const blogs = [
  {
    id: 1,
    image: blog1,
    alt: "Aerial View of an Urban City",
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
    <section className='w-full py-32 px-8 bg-white'>

      {/* Heading */}
      <div className='text-center mb-16'>
        <h2 className='font-mono font-semibold text-black text-6xl md:text-7xl text-center mx-auto'>
          The SafeDex Journal
        </h2>
        <p className='font-mono text-2xl text-slate-600 text-center mt-2 max-w-xl mx-auto'>
          Written by the SafeDex team, for the SafeDex community.
        </p>
      </div>

      {/* FAKE Blog Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
            {blogs.map((blog) => (
            <div
                key={blog.id}
                className='bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition hover:-translate-y-1 transform'
            >
                <img
                    src={blog.image}
                    alt={blog.alt}
                    className='w-full h-48 object-cover'
                />

                <div className='p-6'>
                <h3 className='text-lg font-semibold text-slate-900 mb-3'>
                    {blog.title}
                </h3>
                <p className='text-slate-500 text-sm leading-relaxed mb-6'>
                    {blog.preview}
                </p>
                <button className='inline-flex items-center gap-2 text-sm font-medium text-black hover:underline'>
                    Read more →
                </button>
                </div>

            </div>
            ))}
        </div>
        
        {/*FAKE LINK */}
        <div className='flex justify-center mt-12'>
                <button tabIndex={0} className='inline-flex items-center gap-2 font-mono font-medium text-black text-lg hover:underline'>
                    Click here to read more from The SafeDex Journal →
                </button>
        </div>
        
    </section>
  )
}