import Card from '../components/ui/Card'

const About = ({ darkMode }) => {
    const technologies = [
        {
            category: 'Machine Learning',
            items: [
                { name: 'Random Forest', desc: 'Ensemble of decision trees for robust predictions', icon: '🌲' },
                { name: 'XGBoost', desc: 'Gradient boosting for high accuracy', icon: '⚡' },
                { name: 'Ensemble Learning', desc: 'Weighted combination for best results', icon: '🎯' },
                { name: 'SHAP', desc: 'Explainable AI for feature importance', icon: '🧠' },
            ]
        },
        {
            category: 'Backend',
            items: [
                { name: 'FastAPI', desc: 'High-performance Python API framework', icon: '🚀' },
                { name: 'Python', desc: 'Core language for ML & backend', icon: '🐍' },
                { name: 'Pandas & NumPy', desc: 'Data processing & analysis', icon: '📊' },
            ]
        },
        {
            category: 'Frontend',
            items: [
                { name: 'React.js', desc: 'Modern component-based UI framework', icon: '⚛️' },
                { name: 'Tailwind CSS', desc: 'Utility-first CSS framework', icon: '🎨' },
                { name: 'Recharts', desc: 'Data visualization library', icon: '📈' },
            ]
        },
        {
            category: 'Data Source',
            items: [
                { name: 'CPCB', desc: 'Central Pollution Control Board data', icon: '🏛️' },
                { name: 'AQICN API', desc: 'Real-time air quality data', icon: '🌐' },
            ]
        }
    ]

    const flowSteps = [
        { step: 1, title: 'Data Collection', desc: 'Real-time data from CPCB monitoring stations', icon: '📡' },
        { step: 2, title: 'Feature Engineering', desc: 'Temporal features, lag variables, rolling stats', icon: '⚙️' },
        { step: 3, title: 'ML Prediction', desc: 'Random Forest + XGBoost ensemble', icon: '🤖' },
        { step: 4, title: 'Explainability', desc: 'SHAP values for transparent insights', icon: '🔍' },
        { step: 5, title: 'Results', desc: 'PM2.5 prediction, AQI, health advisories', icon: '✅' },
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">About This System</h1>
                <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    An AI-powered air quality prediction system using machine learning
                    to provide accurate, explainable PM2.5 forecasts for Bengaluru
                </p>
            </div>

            {/* System Architecture Flow */}
            <Card darkMode={darkMode} className="mb-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>🏗️</span> System Architecture
                </h2>

                <div className="relative">
                    {/* Flow diagram */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {flowSteps.map((step, index) => (
                            <div key={step.step} className="flex items-center">
                                <div className={`
                  flex flex-col items-center text-center p-4 rounded-xl min-w-[140px]
                  ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}
                `}>
                                    <span className="text-3xl mb-2">{step.icon}</span>
                                    <span className="text-xs text-primary-500 font-semibold">Step {step.step}</span>
                                    <span className="font-medium text-sm mt-1">{step.title}</span>
                                    <span className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {step.desc}
                                    </span>
                                </div>

                                {/* Arrow */}
                                {index < flowSteps.length - 1 && (
                                    <div className="hidden md:block text-2xl text-primary-500 mx-2">→</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Technology Stack */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-center">🛠️ Technology Stack</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {technologies.map((category) => (
                        <Card key={category.category} darkMode={darkMode}>
                            <h3 className="font-semibold text-lg mb-4 text-primary-500">
                                {category.category}
                            </h3>
                            <div className="space-y-3">
                                {category.items.map((item) => (
                                    <div key={item.name} className="flex items-start gap-3">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* ML Model Details */}
            <Card darkMode={darkMode} className="mb-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>🎯</span> Ensemble Model Details
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Random Forest */}
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-slate-700/30' : 'bg-green-50'}`}>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <span className="text-2xl">🌲</span> Random Forest
                        </h3>
                        <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <li>• 100+ decision trees</li>
                            <li>• Handles non-linear relationships</li>
                            <li>• Robust to outliers</li>
                            <li>• Feature importance ranking</li>
                        </ul>
                    </div>

                    {/* XGBoost */}
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-slate-700/30' : 'bg-purple-50'}`}>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <span className="text-2xl">⚡</span> XGBoost
                        </h3>
                        <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <li>• Gradient boosting algorithm</li>
                            <li>• Sequential error correction</li>
                            <li>• Regularization for generalization</li>
                            <li>• State-of-the-art accuracy</li>
                        </ul>
                    </div>
                </div>

                <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-primary-900/20' : 'bg-primary-50'}`}>
                    <p className="text-center">
                        <span className="font-semibold">Ensemble Formula:</span>{' '}
                        <code className="bg-white/50 dark:bg-slate-700 px-2 py-1 rounded">
                            PM2.5 = w₁ × RF_prediction + w₂ × XGB_prediction
                        </code>
                    </p>
                </div>
            </Card>

            {/* Monitoring Stations */}
            <Card darkMode={darkMode} className="mb-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>📍</span> Monitoring Stations in Bengaluru
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { name: 'Peenya', area: 'Industrial Zone', lat: '13.0205°N', lon: '77.5360°E' },
                        { name: 'RVCE Mailsandra', area: 'Educational', lat: '12.9338°N', lon: '77.5263°E' },
                        { name: 'Silkboard', area: 'Heavy Traffic', lat: '12.9279°N', lon: '77.6240°E' },
                    ].map((station) => (
                        <div
                            key={station.name}
                            className={`p-4 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}
                        >
                            <h4 className="font-semibold">{station.name}</h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {station.area}
                            </p>
                            <p className="text-xs font-mono mt-2 text-primary-500">
                                {station.lat}, {station.lon}
                            </p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Project Info */}
            <div className={`text-center p-8 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                <h3 className="font-semibold text-lg mb-2">🎓 Academic Project</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Developed as part of 5th Semester Experiential Learning
                </p>
                <p className="text-sm mt-4">
                    <span className="font-medium">SDG Goal 9:</span> Industry, Innovation and Infrastructure
                </p>
            </div>
        </div>
    )
}

export default About
