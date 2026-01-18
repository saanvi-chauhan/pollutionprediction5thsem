import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

const Landing = () => {
    const features = [
        {
            icon: '🤖',
            title: 'ML Ensemble Model',
            description: 'Random Forest + XGBoost ensemble for accurate PM2.5 predictions'
        },
        {
            icon: '📊',
            title: 'Real-time CPCB Data',
            description: 'Live air quality data from authorized monitoring stations'
        },
        {
            icon: '🧠',
            title: 'Explainable AI',
            description: 'SHAP-based feature importance for transparent predictions'
        },
        {
            icon: '📍',
            title: 'Multiple Stations',
            description: 'Coverage across Peenya, RVCE Mailsandra & Silkboard'
        }
    ]

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 gradient-bg opacity-90" />

                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        <span className="inline-block animate-bounce text-6xl mb-6">🌍</span>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            AI-Powered<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">
                                Air Quality Prediction
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10">
                            Real-time CPCB data → ML Ensemble → Explainable PM2.5 Prediction
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/dashboard">
                                <Button size="lg" className="w-full sm:w-auto">
                                    🚀 Open Dashboard
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-600">
                                    Learn More →
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Wave separator */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                            className="fill-gray-50 dark:fill-slate-900"
                        />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Why Use Our System?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            State-of-the-art machine learning for accurate, explainable air quality predictions
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-6 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                            >
                                <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </span>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white dark:bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '3', label: 'Monitoring Stations' },
                            { value: '2', label: 'ML Models' },
                            { value: '10+', label: 'Pollutant Metrics' },
                            { value: '24/7', label: 'Real-time Updates' }
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-50 dark:bg-slate-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Check Air Quality?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Get instant PM2.5 predictions with explainable AI insights
                    </p>
                    <Link to="/dashboard">
                        <Button size="lg">
                            🎯 Start Prediction
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🌍</span>
                            <span className="font-semibold">AirQ Predict</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            🔬 Random Forest + XGBoost | 🧠 SHAP Explainability | 🏛️ CPCB Data
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing
