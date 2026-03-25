import { useState } from 'react'
import { ReactComponent as PersonIcon } from '../assets/icons/accessibilityButton.svg'
import { useAccessibility } from '../context/AccessibilityContext'

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { textSize, setTextSize, darkMode, highContrast, enableDarkMode, disableDarkMode, enableHighContrast, disableHighContrast } = useAccessibility()

  return (
    <div className='fixed bottom-6 right-6 z-[2000]'>
      {isOpen ? (
        <div className={`w-72 border rounded-2xl shadow-2xl ${
            highContrast ? 'bg-hc-bg border-hc-border' :
            darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>

          
          <div className={`flex items-center justify-between px-4 py-3 border-b ${
            highContrast ? 'border-hc-border' :
            darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
            <span className={`font-mono font-bold text-sm ${
                highContrast ? 'text-hc-text' :
                darkMode ? 'text-white' : 'text-slate-900'}`}>
              Customise Display Settings
            </span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Minimise accessibility settings"
              className={`font-bold text-lg px-2 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded ${
                highContrast ? 'text-hc-text hover:text-hc-text' :
                darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
              —
            </button>
          </div>

    
          <div className='p-4'>
            
            <div className='flex items-center justify-between'>
              <span className={`font-mono text-sm ${
                highContrast ? 'text-hc-text' :
                darkMode ? 'text-white' : 'text-slate-700'}`}>
                Dark Mode
              </span>
              <button
                onClick={() => darkMode ? disableDarkMode() : enableDarkMode()}
                role="switch"
                aria-checked={darkMode}
                className={`w-12 h-6 rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                  darkMode ? 'bg-slate-600' : 'bg-slate-200'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all duration-300 ${
                  darkMode ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/*High Contrast*/}
            
            <div className='flex items-center justify-between mt-4'>
                <span className={`font-mono text-sm ${
                    highContrast ? 'text-hc-text' :
                    darkMode ? 'text-white' : 'text-slate-700'}`}>
                    High Contrast
                </span>
                <button
                    onClick={() => highContrast ? disableHighContrast() : enableHighContrast()}
                    role="switch"
                    aria-checked={highContrast}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                    highContrast ? 'bg-hc-border' : 'bg-slate-200'
                    }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all duration-300 ${
                    highContrast ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
            </div>

            <p className={`font-mono text-sm mb-3 mt-4 text-center ${
                highContrast ? 'text-hc-text' :
                darkMode ? 'text-white' : 'text-slate-900'}`}>
                Text Size
                </p>
                <div className='flex gap-2'>
                    {['Small', 'Default', 'Large'].map((size) => (
                    <button
                        key={size}
                        onClick={() => setTextSize(size)}
                        aria-pressed={textSize === size}
                        className={`flex-1 py-2 rounded-lg font-mono text-xs transition focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                            textSize === size
                            ? highContrast ? 'bg-hc-text text-hc-bg' : 'bg-slate-900 text-white':
                            highContrast ? 'bg-hc-surface text-hc-text border border-hc-border hover:bg-hc-text hover:text-hc-bg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}>
                        {size}
                    </button>
                    ))}
                    </div>
                </div>
            </div>
      ) : (
        <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Accessibility Settings"
            aria-expanded={isOpen}
            className='group w-16 h-16 bg-slate-50 hc:bg-hc-text hover:bg-black hc:hover:bg-hc-bg border-2 border-black rounded-2xl shadow-lg flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-slate-100' >
            <PersonIcon className='w-14 h-14 transition-colors group-hover:[&_path]:fill-white group-hover:[&_circle]:fill-white hc:group-hover:[&_circle]:fill-yellow-400 hc:group-hover:[&_path]:fill-yellow-400' style={{ fill: 'black' }} />
        </button>
      )}
    </div>
  )
}