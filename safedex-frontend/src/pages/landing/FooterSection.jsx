import { Link } from 'react-router-dom'

export default function FooterSection() {
  return (
    <footer className='w-full bg-black py-12 px-8 hc:border-t hc:border-hc-border'>
      
      <div className='max-w-6xl mx-auto'>

        
        <div className='flex flex-col sm:flex-row justify-between items-center mb-8'>
          {/* WILL CHANGE THIS TO THE LOGO JUST NEED TO IMPORT THE FONT FROM GOOGLE FONTS*/}
          <h2 className='font-silkscreen font-m text-white text-2xl mb-4 sm:mb-0'>
            SafeDex
          </h2>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <div className='flex gap-8'>
              <Link to='/' tabIndex={0}   className='font-mono text-slate-400 hover:text-white text-sm transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black hc:text-hc-text'>Home</Link>
              <Link to='/listings' tabIndex={0} className='font-mono text-slate-400 hover:text-white text-sm transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black hc:text-hc-text'>Listings</Link>
              <Link to='/favourite' tabIndex={0} className='font-mono text-slate-400 hover:text-white text-sm transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black hc:text-hc-text'>Favourites</Link>
              <Link to='/heatmap' tabIndex={0} className='font-mono text-slate-400 hover:text-white text-sm transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black hc:text-hc-text'>Map</Link>
            </div>
          </nav>

        </div>

        <div className='border-t border-slate-800 my-8 hc:border-hc-border'></div>
        <p className=' flex justify-center text-slate-400 text-sm font-mono hc:text-hc-text'> © SafeDex 2026</p>
        
      </div>
    </footer>
  )
}