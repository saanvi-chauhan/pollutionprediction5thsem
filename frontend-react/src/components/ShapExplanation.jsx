const ShapExplanation = ({ explanations = [], darkMode = false }) => {
    const parseExplanation = (text) => {
        // Parse explanation text like "PM10 increased PM2.5 by +1.23"
        const isPositive = text.includes('increased') || text.includes('+')
        const isNegative = text.includes('reduced') || text.includes('decreased') || text.includes('-')

        // Extract feature name and value
        const match = text.match(/([A-Za-z0-9_]+)\s+(increased|reduced|decreased)\s+PM2\.5\s+by\s+([+-]?\d+\.?\d*)/)

        return {
            text,
            isPositive: isPositive && !isNegative,
            isNegative,
            feature: match ? match[1] : null,
            value: match ? parseFloat(match[3]) : null,
        }
    }

    if (!explanations || explanations.length === 0) {
        return (
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                <p className="text-gray-500 text-center">No explanations available</p>
            </div>
        )
    }

    return (
        <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`}>
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'}`}>
                <h3 className="font-semibold flex items-center gap-2">
                    <span>🧠</span>
                    Why is this PM2.5 predicted?
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    SHAP-based feature importance analysis
                </p>
            </div>

            <div className="p-4 space-y-3">
                {explanations.map((exp, index) => {
                    const parsed = parseExplanation(exp)
                    return (
                        <div
                            key={index}
                            className={`
                flex items-center gap-3 p-3 rounded-lg transition-colors
                ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}
              `}
                        >
                            {/* Arrow indicator */}
                            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${parsed.isPositive
                                    ? 'bg-red-100 dark:bg-red-900/30'
                                    : 'bg-green-100 dark:bg-green-900/30'
                                }
              `}>
                                {parsed.isPositive ? (
                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </div>

                            {/* Explanation text */}
                            <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                {exp}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* Simple user explanation */}
            <div className={`px-6 py-4 border-t ${darkMode ? 'border-slate-700 bg-slate-800/30' : 'border-gray-200 bg-gray-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="inline-flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span> Increases PM2.5
                    </span>
                    <span className="mx-3">|</span>
                    <span className="inline-flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span> Decreases PM2.5
                    </span>
                </p>
            </div>
        </div>
    )
}

export default ShapExplanation
