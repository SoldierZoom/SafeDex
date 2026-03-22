import heroBlock from './assets/images/heroBlock.jpg'
import FeatureSection from './FeatureSection'
import Testimonials from './Testimonials'
import BlogSection from './BlogSection'
import FooterSection from './FooterSection'

import {Link} from 'react-router-dom'

export default function Landing() {
  return (
      <div> 
        {/* Section 1: Hero Section with CTA */}
        <section className='relative w-full h-screen overflow-hidden'>
        <img className='absolute top-0 left-0 w-full h-screen object-cover'
          src={heroBlock}
          alt="Apartment block at night with colourful lighting" />

          {/*Overlay to make it text more readible*/}
          <div className='absolute inset-0 bg-black/50'></div>
          {/* Grid overlay */}
          <div 
            className='absolute inset-0 pointer-events-none'
            style={{
              backgroundImage: 'linear-gradient(rgba(175, 151, 151, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '70px 70px'
            }}
          ></div>

          <div className='absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-white'></div>

          {/*Title Section*/}
          <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
            <p className='md:text-3xl sm:text-2xl text-3xl font-mono p-1 uppercase text-white'> A new way to Property Search  </p>
            <h1 className='md:text-8xl sm:text-7xl text-5xl font-bold font-mono md:pb-24 text-white'>Get Home-Safe with SafeDex</h1> 

            {/* Call to Action: Button that links to view properties page copied from: https://buttons.ibelick.com*/} 
            <Link 
              to='/listings'
              className="font-mono text-2xl border border-white/60 text-white px-10 py-3 hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              tabIndex={0}> {/*links to listings page*/}
              Search Property Listings →
            </Link>

          </div>  
          
        </section>  

        {/* Section 2: Features Section*/}
        <section className='w-full py-10 bg-white mt-1'>
          <FeatureSection />
        </section>

        {/* Section 3: Testimonials ie Trust Signals*/}
        <section className='w-full py-10 mt-1'>
          <Testimonials />
        </section>

        {/* Blog Section: Though it is fixed and not interactive*/}
        <section className='w-full py-10 mt-1'>
          <BlogSection />
        </section>

        {/*Footer - Links to pages*/}
        <section className='w-full mt-1'>
          <FooterSection />
        </section>
      </div>
  )
}
