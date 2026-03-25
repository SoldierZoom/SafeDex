import NavBar from '../components/NavBar';
import AccessibilityMenu from '../components/AccessibilityMenu'
import { useAccessibility } from '../context/AccessibilityContext'
import FooterSection from '../pages/landing/FooterSection';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const { darkMode } = useAccessibility()
  const {highContrast} = useAccessibility()

  return (
    <main className={`
        min-h-screen transition-colors duration-300
        ${highContrast ? 'bg-hc-bg text-hc-text' :
        darkMode ? 'dark bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <NavBar />
      <div className={isLanding ? '' : 'pt-16'}>
        {children}
      </div>
      <AccessibilityMenu />
      <FooterSection /> 
    </main>
  )
}
