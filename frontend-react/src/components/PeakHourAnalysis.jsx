import { useState, useEffect } from 'react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts'

const PeakHourAnalysis = ({ darkMode = false }) => {
    const [viewFilter, setViewFilter] = useState('overall')
    const [animating, setAnimating] = useState(false)

    // Peak Hours: 8-11 AM and 5-9 PM
    // Sample data - In production, this would come from API
    const peakVsNonPeakData = [
        { name: 'Peak Hours', value: 78.5, fill: 'url(#peakGradient)' },
        { name: 'Non-Peak Hours', value: 52.3, fill: 'url(#nonPeakGradient)' }
    ]

    const monthlyData = [
        { month: 'Jan', peak: 95.2, nonPeak: 68.4 },
        { month: 'Feb', peak: 88.7, nonPeak: 62.1 },
        { month: 'Mar', peak: 82.3, nonPeak: 58.9 },
        { month: 'Apr', peak: 68.5, nonPeak: 48.2 },
        { month: 'May', peak: 62.1, nonPeak: 44.6 },
        { month: 'Jun', peak: 58.4, nonPeak: 41.2 },
        { month: 'Jul', peak: 54.2, nonPeak: 38.8 },
        { month: 'Aug', peak: 52.8, nonPeak: 37.5 },
        { month: 'Sep', peak: 61.3, nonPeak: 43.9 },
        { month: 'Oct', peak: 72.6, nonPeak: 52.1 },
        { month: 'Nov', peak: 89.4, nonPeak: 64.8 },
        { month: 'Dec', peak: 98.7, nonPeak: 72.3 }
    ]

    // Calculate percentage difference
    const percentDiff = ((peakVsNonPeakData[0].value - peakVsNonPeakData[1].value) / peakVsNonPeakData[1].value * 100).toFixed(0)

    // Handle filter change with animation
    const handleFilterChange = (filter) => {
        setAnimating(true)
        setViewFilter(filter)
        setTimeout(() => setAnimating(false), 500)
    }

    // Filter buttons
    const filterOptions = [
        { id: 'overall', label: '🔄 Overall', icon: '📊' },
        { id: 'peak', label: '🔥 Peak Hours', icon: '⏰' },
        { id: 'nonPeak', label: '🌙 Non-Peak', icon: '🌿' }
    ]

    // Custom tooltip for monthly chart
    const MonthlyTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-4 rounded-xl shadow-xl border backdrop-blur-lg ${darkMode
                        ? 'bg-slate-800/95 border-slate-600'
                        : 'bg-white/95 border-gray-200'
                    }`}>
                    <p className="font-semibold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                {entry.name}:
                            </span>
                            <span className="font-semibold">{entry.value} µg/m³</span>
                        </div>
                    ))}
                </div>
            )
        }
        return null
    }

    // Custom tooltip for bar chart
    const BarTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className={`p-4 rounded-xl shadow-xl border backdrop-blur-lg ${darkMode
                        ? 'bg-slate-800/95 border-slate-600'
                        : 'bg-white/95 border-gray-200'
                    }`}>
                    <p className="font-semibold mb-1">{data.name}</p>
                    <p className="text-2xl font-bold">{data.value} <span className="text-sm font-normal">µg/m³</span></p>
                </div>
            )
        }
        return null
    }

    // Get filtered monthly data based on view
    const getFilteredData = () => {
        if (viewFilter === 'peak') {
            return monthlyData.map(d => ({ ...d, nonPeak: null }))
        } else if (viewFilter === 'nonPeak') {
            return monthlyData.map(d => ({ ...d, peak: null }))
        }
        return monthlyData
    }

    return (
        <div className={`rounded-2xl p-6 lg:p-8 transition-all duration-500 ${darkMode
                ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50'
                : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-xl'
            }`}>
            {/* Section Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">⏱️</span>
                    <h2 className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
                        Peak Hour & Monthly Pollution Analysis
                    </h2>
                </div>
                <p className={`text-sm lg:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Understanding pollution patterns during high-traffic periods (8-11 AM & 5-9 PM)
                </p>
            </div>

            {/* Filter Toggle */}
            <div className="flex flex-wrap gap-2 mb-8">
                {filterOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleFilterChange(option.id)}
                        className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${viewFilter === option.id
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                                : darkMode
                                    ? 'bg-slate-700/50 hover:bg-slate-600 text-gray-300 border border-slate-600'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">

                {/* Peak vs Non-Peak Comparison Cards */}
                <div className={`rounded-xl p-6 transition-all duration-500 ${animating ? 'opacity-50 scale-98' : 'opacity-100 scale-100'} ${darkMode ? 'bg-slate-700/30' : 'bg-gradient-to-br from-gray-50 to-white'
                    }`}>
                    <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                        <span className="text-xl">📊</span> Average PM2.5 Comparison
                    </h3>

                    {/* Side by Side Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Peak Hours Card */}
                        <div
                            className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-500 transform hover:scale-105 ${viewFilter === 'nonPeak' ? 'opacity-40' : 'opacity-100'
                                }`}
                            style={{
                                background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #dc2626 100%)'
                            }}
                        >
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10 text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">🔥</span>
                                    <span className="text-sm font-medium opacity-90">Peak Hours</span>
                                </div>
                                <div className="text-4xl font-bold mb-1">
                                    {peakVsNonPeakData[0].value}
                                </div>
                                <div className="text-sm opacity-80">µg/m³ PM2.5</div>
                                <div className="mt-3 text-xs opacity-70">8-11 AM & 5-9 PM</div>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
                        </div>

                        {/* Non-Peak Hours Card */}
                        <div
                            className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-500 transform hover:scale-105 ${viewFilter === 'peak' ? 'opacity-40' : 'opacity-100'
                                }`}
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)'
                            }}
                        >
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10 text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">🌿</span>
                                    <span className="text-sm font-medium opacity-90">Non-Peak</span>
                                </div>
                                <div className="text-4xl font-bold mb-1">
                                    {peakVsNonPeakData[1].value}
                                </div>
                                <div className="text-sm opacity-80">µg/m³ PM2.5</div>
                                <div className="mt-3 text-xs opacity-70">Other hours</div>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
                        </div>
                    </div>

                    {/* Bar Chart Visualization */}
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={peakVsNonPeakData} layout="vertical" barCategoryGap="30%">
                                <defs>
                                    <linearGradient id="peakGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#f97316" />
                                        <stop offset="100%" stopColor="#ef4444" />
                                    </linearGradient>
                                    <linearGradient id="nonPeakGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#059669" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal={false}
                                    stroke={darkMode ? '#374151' : '#e5e7eb'}
                                />
                                <XAxis
                                    type="number"
                                    stroke={darkMode ? '#9ca3af' : '#6b7280'}
                                    tick={{ fontSize: 12 }}
                                    domain={[0, 100]}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    stroke={darkMode ? '#9ca3af' : '#6b7280'}
                                    tick={{ fontSize: 12 }}
                                    width={100}
                                />
                                <Tooltip content={<BarTooltip />} />
                                <Bar
                                    dataKey="value"
                                    radius={[0, 8, 8, 0]}
                                    animationDuration={1000}
                                >
                                    {peakVsNonPeakData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Insight Text */}
                    <div className={`mt-4 p-4 rounded-xl ${darkMode ? 'bg-slate-600/30' : 'bg-orange-50'} border-l-4 border-orange-500`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span className="font-semibold text-orange-500">📌 Insight:</span> PM2.5 levels are consistently higher during peak traffic hours due to increased vehicular and human activity.
                        </p>
                    </div>
                </div>

                {/* Monthly Trend Chart */}
                <div className={`rounded-xl p-6 transition-all duration-500 ${animating ? 'opacity-50 scale-98' : 'opacity-100 scale-100'} ${darkMode ? 'bg-slate-700/30' : 'bg-gradient-to-br from-gray-50 to-white'
                    }`}>
                    <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                        <span className="text-xl">📈</span> Monthly Average PM2.5 Trends
                    </h3>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={getFilteredData()} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                                <defs>
                                    <linearGradient id="peakLineGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#f97316" />
                                        <stop offset="100%" stopColor="#ef4444" />
                                    </linearGradient>
                                    <linearGradient id="nonPeakLineGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#22c55e" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={darkMode ? '#374151' : '#e5e7eb'}
                                />
                                <XAxis
                                    dataKey="month"
                                    stroke={darkMode ? '#9ca3af' : '#6b7280'}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    stroke={darkMode ? '#9ca3af' : '#6b7280'}
                                    tick={{ fontSize: 12 }}
                                    domain={[0, 120]}
                                    label={{
                                        value: 'PM2.5 (µg/m³)',
                                        angle: -90,
                                        position: 'insideLeft',
                                        style: {
                                            fill: darkMode ? '#9ca3af' : '#6b7280',
                                            fontSize: 12
                                        }
                                    }}
                                />
                                <Tooltip content={<MonthlyTooltip />} />
                                <Legend
                                    wrapperStyle={{ paddingTop: '20px' }}
                                    formatter={(value) => (
                                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                            {value}
                                        </span>
                                    )}
                                />
                                {(viewFilter === 'overall' || viewFilter === 'peak') && (
                                    <Line
                                        type="monotone"
                                        dataKey="peak"
                                        name="Peak Hours"
                                        stroke="url(#peakLineGradient)"
                                        strokeWidth={3}
                                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
                                        animationDuration={1500}
                                    />
                                )}
                                {(viewFilter === 'overall' || viewFilter === 'nonPeak') && (
                                    <Line
                                        type="monotone"
                                        dataKey="nonPeak"
                                        name="Non-Peak Hours"
                                        stroke="url(#nonPeakLineGradient)"
                                        strokeWidth={3}
                                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}
                                        animationDuration={1500}
                                    />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Seasonal Insight */}
                    <div className={`mt-4 flex items-center gap-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span className="text-lg">❄️</span>
                        <span>Winter months (Nov-Feb) show significantly higher pollution levels</span>
                    </div>
                </div>
            </div>

            {/* Key Insights Box */}
            <div className={`relative overflow-hidden rounded-2xl p-6 ${darkMode
                    ? 'bg-gradient-to-r from-purple-900/40 via-slate-800/60 to-orange-900/40 border border-purple-500/20'
                    : 'bg-gradient-to-r from-purple-50 via-white to-orange-50 border border-purple-200'
                }`}>
                {/* Decorative background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -left-20 -top-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl animate-pulse">💡</span>
                        <h3 className="text-xl font-bold">Key Research Findings</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Finding 1 */}
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-white/80'} backdrop-blur-sm`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 font-bold">+{percentDiff}%</span>
                                <span className="font-semibold">Peak Impact</span>
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Peak-hour pollution shows a <span className="text-red-500 font-semibold">{percentDiff}% increase</span> compared to non-peak hours
                            </p>
                        </div>

                        {/* Finding 2 */}
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-white/80'} backdrop-blur-sm`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-500">❄️</span>
                                <span className="font-semibold">Winter Spike</span>
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Winter months show <span className="text-blue-500 font-semibold">40-60% higher</span> PM2.5 levels due to temperature inversion
                            </p>
                        </div>

                        {/* Finding 3 */}
                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-white/80'} backdrop-blur-sm`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500/20 text-green-500">🌿</span>
                                <span className="font-semibold">Best Period</span>
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Monsoon months (Jul-Aug) have the <span className="text-green-500 font-semibold">lowest pollution</span> due to rain washout effect
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Peak Hours Definition Footer */}
            <div className={`mt-6 flex flex-wrap items-center justify-center gap-4 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></span>
                    <span>Peak Hours: 8:00-11:00 AM & 5:00-9:00 PM</span>
                </div>
                <span className="hidden sm:inline">|</span>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></span>
                    <span>Non-Peak Hours: All other times</span>
                </div>
            </div>
        </div>
    )
}

export default PeakHourAnalysis
