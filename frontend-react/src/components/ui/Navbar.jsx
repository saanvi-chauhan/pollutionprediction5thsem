import { Link, useLocation } from 'react-router-dom'

const Navbar = ({ darkMode, toggleDarkMode }) => {
    const location = useLocation()

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/comparison', label: 'Compare' },
        { path: '/about', label: 'About' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <nav className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors duration-300 ${darkMode
                ? 'bg-slate-900/80 border-slate-700'
                : 'bg-white/80 border-gray-200'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl">🌍</span>
                        <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-500">
                            AirQ Predict
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive(link.path)
                                        ? 'bg-primary-500 text-white'
                                        : darkMode
                                            ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className={`p-2 rounded-lg transition-colors duration-200 ${darkMode
                                ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        aria-label="Toggle theme"
                    >
                        {darkMode ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>

                    {/* Mobile menu button */}
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
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${darkMode ? 'bg-slate-800' : 'bg-white'
                }`}>
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`block px-4 py-2 ${isActive(link.path)
                                ? 'bg-primary-500 text-white'
                                : darkMode
                                    ? 'hover:bg-slate-700'
                                    : 'hover:bg-gray-100'
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
