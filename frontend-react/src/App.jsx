import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/ui/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Comparison from './pages/Comparison'
import About from './pages/About'

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('darkMode') === 'true' ||
                window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        return false
    })

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('darkMode', darkMode)
    }, [darkMode])

    const toggleDarkMode = () => setDarkMode(!darkMode)

    return (
        <Router>
            <div className={`min-h-screen transition-colors duration-300 ${darkMode
                    ? 'bg-slate-900 text-white'
                    : 'bg-gray-50 text-slate-900'
                }`}>
                <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                <main>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
                        <Route path="/comparison" element={<Comparison darkMode={darkMode} />} />
                        <Route path="/about" element={<About darkMode={darkMode} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App
