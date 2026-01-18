import { getAQIColor, AQI_CATEGORIES, getAQICategory } from '../services/api'

const AQIGauge = ({ aqi, size = 'large' }) => {
    const category = getAQICategory(aqi)
    const color = getAQIColor(aqi)
    const categoryInfo = AQI_CATEGORIES[category]

    // Calculate gauge percentage (max AQI is 500)
    const percentage = Math.min((aqi / 500) * 100, 100)
    const circumference = 2 * Math.PI * 45
    const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75 // 270 degree arc

    const sizes = {
        small: { container: 'w-32 h-32', text: 'text-2xl', label: 'text-xs' },
        medium: { container: 'w-40 h-40', text: 'text-3xl', label: 'text-sm' },
        large: { container: 'w-52 h-52', text: 'text-4xl', label: 'text-base' },
    }

    const sizeClasses = sizes[size] || sizes.large

    return (
        <div className="flex flex-col items-center">
            <div className={`relative ${sizeClasses.container}`}>
                <svg className="w-full h-full transform -rotate-[135deg]" viewBox="0 0 100 100">
                    {/* Background arc */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="text-gray-200 dark:text-slate-700"
                        strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                    />
                    {/* Foreground arc */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (percentage / 100) * circumference * 0.75}
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className={`font-bold ${sizeClasses.text} aqi-pulse`}
                        style={{ color }}
                    >
                        {aqi}
                    </span>
                    <span className={`${sizeClasses.label} font-medium text-gray-500 dark:text-gray-400`}>
                        AQI
                    </span>
                </div>
            </div>

            {/* Category badge */}
            <div
                className="mt-4 px-4 py-2 rounded-full font-semibold text-white shadow-lg"
                style={{ backgroundColor: color }}
            >
                {category}
            </div>

            {/* Range info */}
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Range: {categoryInfo?.range}
            </p>
        </div>
    )
}

export default AQIGauge
