import { Link, useLocation } from 'react-router-dom'

const Navbar = ({ darkMode, toggleDarkMode }) => {
    const location = useLocation()

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/comparison', label: 'Compare' },
        { path: '/chatbot', label: 'Chatbot' },
        { path: '/about', label: 'About' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-xl text-primary-700">AQ</span>
                        <span className="font-semibold text-slate-900">Air Quality Lab</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    isActive(link.path)
                                        ? 'bg-primary-100 text-primary-800'
                                        : 'text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="md:hidden flex items-center space-x-2">
                        <MobileMenu darkMode={darkMode} navLinks={navLinks} isActive={isActive} />
                    </div>
                </div>
            </div>
        </nav>
    )
}

const MobileMenu = ({ darkMode, navLinks, isActive }) => {
    return (
        <div className="relative group">
            <button className="p-2 rounded-md hover:bg-slate-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <div className="absolute right-0 mt-2 w-44 rounded-md shadow border border-slate-200 bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`block px-4 py-2 text-sm ${
                            isActive(link.path)
                                ? 'bg-primary-50 text-primary-800'
                                : 'hover:bg-slate-100 text-slate-700'
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Navbar
