import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import routes from '../lib/routes'

export default function NavBar() {
  const [show, setShow] = useState(true)
  const [lastScroll, setLastScroll] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      if (currentScroll < 10) {
        setShow(true)
      } else if (currentScroll > lastScroll) {
        setShow(false)
      } else {
        setShow(true)
      }
      setLastScroll(currentScroll)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScroll])

  const isInPath = (path) => {
    if (path === '/') {
      return location.pathname === path
    } else {
      return location.pathname.startsWith(path)
    }
  }

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 w-full z-[2000] bg-black border-b border-white/10 hc:border-hc-border transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* "Logo" */}
          <Link to="/" className="text-2xl font-m text-white font-silkscreen">
            SafeDex
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-8">
            {routes
            .filter(({ name }) => name)
            .map(({ name, path }) => (
              <Link
                key={path}
                to={path}
                //tabIndex={0}
                className={`font-mono text-sm transition duration-300 focus:outline-none focus:ring-2 focus:ring-white px-2 py-1 ${
                  isInPath(path)
                    ? 'text-white font-semibold hc:text-hc-text'
                    : 'text-white/70 hover:text-white hc:text-hc-text hc:hover:text-hc-text'
                }`}
              >
                {name}
              </Link>
            ))}
          </div>

        </div>

      </div>
    </nav>
  )
}
