import NavBar from '../components/NavBar';
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
    </main>
  )
}
