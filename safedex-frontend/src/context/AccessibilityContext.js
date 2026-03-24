import { createContext, useContext, useState, useEffect } from 'react'

const AccessibilityContext = createContext()

export function AccessibilityProvider({ children }) {

  const [textSize, setTextSize] = useState(() =>
    localStorage.getItem('textSize') || 'Default')

  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem('darkMode') === 'true' ) 

  const [highContrast, setHighContrast] = useState(() =>
  localStorage.getItem('highContrast') === 'true' )

  const enableDarkMode = () => {
    setDarkMode(true)
    setHighContrast(false)
  }

  const disableDarkMode = () => {
    setDarkMode(false)
  }

  const enableHighContrast = () => {
    setHighContrast(true)
    setDarkMode(false)
  }

  const disableHighContrast = () => {
    setHighContrast(false)
  }


    useEffect(() => {
        localStorage.setItem('darkMode', darkMode)
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

    useEffect(() => {
        localStorage.setItem('highContrast', highContrast)
        if (highContrast) {
            document.documentElement.classList.add('high-contrast')
        } else {
            document.documentElement.classList.remove('high-contrast')
        }
    }, [highContrast])

    useEffect(() => {
        localStorage.setItem('textSize', textSize)
        const sizes = { Small: '14px', Default: '16px', Large: '20px' }
        document.documentElement.style.fontSize = sizes[textSize]
    }, [textSize])

  return (
    <AccessibilityContext.Provider value={{
      textSize, setTextSize,
      darkMode, setDarkMode,
      highContrast, setHighContrast,
      enableDarkMode, disableDarkMode,
      enableHighContrast, disableHighContrast,
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => useContext(AccessibilityContext)