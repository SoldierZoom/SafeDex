import NavBar from '../components/NavBar';
// UNCOMMENT THIS AT THE END import FooterSection from '../pages/landing/FooterSection';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <main>
      <NavBar />
      <div className={isLanding ? '' : 'pt-16'}>
        {children}
      </div>
      {/* UNCOMMENT THIS AT THE END THIS IS THE END <FooterSection />*/} 
    </main>
  )
}
