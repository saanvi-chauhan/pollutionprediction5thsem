const PollutantCard = ({ name, value, unit, icon, darkMode = false, unavailable = false }) => {
    const pollutantIcons = {
        PM10: '🌫️',
        'PM2.5': '💨',
        NO2: '🔴',
        NOx: '⚠️',
        CO: '🧪',
        Ozone: '☀️',
        RH: '💧',
        Temperature: '🌡️',
    }

    const iconToShow = icon || pollutantIcons[name] || '📊'

    return (
        <div className={`
      relative overflow-hidden rounded-xl p-4 transition-all duration-300
      ${darkMode
                ? 'bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 hover:border-primary-500/50'
                : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-primary-400 shadow-sm hover:shadow-md'
            }
      ${unavailable ? 'opacity-60' : 'hover:-translate-y-1'}
    `}>
            {/* Background decoration */}
            <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-primary-500/10 blur-xl" />

            <div className="relative flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {name}
                    </p>
                    {unavailable ? (
                        <p className="text-lg font-semibold text-gray-400 mt-1">
                            Data unavailable
                        </p>
                    ) : (
                        <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {typeof value === 'number' ? value.toFixed(1) : value}
                            <span className={`text-sm font-normal ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {unit}
                            </span>
                        </p>
                    )}
                </div>
                <span className="text-3xl">{iconToShow}</span>
            </div>
        </div>
    )
}

export default PollutantCard
