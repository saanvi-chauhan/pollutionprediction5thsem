import { AQI_CATEGORIES, getAQICategory } from '../services/api'

const HealthAdvisory = ({ aqi, darkMode = false }) => {
    const category = getAQICategory(aqi)
    const categoryInfo = AQI_CATEGORIES[category]

    const healthTips = {
        'Good': {
            icon: '✅',
            tips: [
                'Perfect for outdoor activities',
                'Go for a jog or walk in the park',
                'Open windows for fresh air'
            ],
            bgClass: 'from-emerald-500/10 to-emerald-500/5',
            borderClass: 'border-emerald-500/30'
        },
        'Satisfactory': {
            icon: '👍',
            tips: [
                'Generally safe for outdoor activities',
                'Sensitive individuals should monitor symptoms',
                'Good time for ventilation'
            ],
            bgClass: 'from-lime-500/10 to-lime-500/5',
            borderClass: 'border-lime-500/30'
        },
        'Moderate': {
            icon: '⚠️',
            tips: [
                'Reduce prolonged outdoor exertion',
                'Sensitive groups should limit outdoor time',
                'Keep windows closed during peak hours'
            ],
            bgClass: 'from-yellow-500/10 to-yellow-500/5',
            borderClass: 'border-yellow-500/30'
        },
        'Poor': {
            icon: '🚨',
            tips: [
                'Avoid outdoor physical activities',
                'Wear N95 mask if going outside',
                'Use air purifiers indoors'
            ],
            bgClass: 'from-orange-500/10 to-orange-500/5',
            borderClass: 'border-orange-500/30'
        },
        'Very Poor': {
            icon: '⛔',
            tips: [
                'Stay indoors as much as possible',
                'Essential trips only with N95 mask',
                'Seal windows and doors'
            ],
            bgClass: 'from-red-500/10 to-red-500/5',
            borderClass: 'border-red-500/30'
        },
        'Severe': {
            icon: '☠️',
            tips: [
                'Health emergency - remain indoors',
                'No outdoor activity whatsoever',
                'Seek medical help if symptoms occur'
            ],
            bgClass: 'from-red-900/20 to-red-900/10',
            borderClass: 'border-red-900/30'
        }
    }

    const tipInfo = healthTips[category] || healthTips['Moderate']

    return (
        <div className={`
      rounded-xl overflow-hidden border
      ${darkMode ? 'bg-slate-800/50' : 'bg-white'}
      ${tipInfo.borderClass}
    `}>
            <div className={`
        px-6 py-4 bg-gradient-to-r ${tipInfo.bgClass}
        border-b ${tipInfo.borderClass}
      `}>
                <h3 className="font-semibold flex items-center gap-2">
                    <span className="text-2xl">{tipInfo.icon}</span>
                    Health Advisory
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {categoryInfo?.advice}
                </p>
            </div>

            <div className="p-4">
                <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Recommendations:
                </p>
                <ul className="space-y-2">
                    {tipInfo.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <span className="text-primary-500 mt-0.5">•</span>
                            <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                {tip}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default HealthAdvisory
