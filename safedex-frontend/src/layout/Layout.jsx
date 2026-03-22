import NavBar from '../components/NavBar';

export default function Layout({ children }) {
    return (
        <main>
            <nav className="fixed inset-0 z-50 min-w-full h-[60px] bg-slate-50">
                <NavBar />
            </nav>
            <div className="h-[60px]" /> {/* Filler div */}
            <div className="px-2">
                {children}
            </div>
        </main>
    )
}
