import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

const HistoricalChart = ({ data = [], darkMode = false, timeFilter = '24h' }) => {
    // Sample data if none provided
    const sampleData = data.length > 0 ? data : generateSampleData(timeFilter)

    const colors = {
        PM10: '#ef4444',
        NO2: '#f97316',
        CO: '#8b5cf6',
        PM25: '#6366f1',
        Ozone: '#10b981'
    }

    return (
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">📈 Historical Trends</h3>
                <div className="flex gap-2">
                    {['6h', '24h', '7d'].map((filter) => (
                        <button
                            key={filter}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors ${timeFilter === filter
                                    ? 'bg-primary-500 text-white'
                                    : darkMode
                                        ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                }`}
                        >
                            {filter === '6h' ? 'Last 6 hours' : filter === '24h' ? 'Last 24 hours' : 'Last 7 days'}
                        </button>
                    ))}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sampleData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={darkMode ? '#374151' : '#e5e7eb'}
                    />
                    <XAxis
                        dataKey="time"
                        stroke={darkMode ? '#9ca3af' : '#6b7280'}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        stroke={darkMode ? '#9ca3af' : '#6b7280'}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                            border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: darkMode ? '#f3f4f6' : '#111827'
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="PM10"
                        stroke={colors.PM10}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="NO2"
                        stroke={colors.NO2}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="CO"
                        stroke={colors.CO}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

// Generate sample data for demo
function generateSampleData(timeFilter) {
    const points = timeFilter === '6h' ? 12 : timeFilter === '24h' ? 24 : 7
    const data = []

    for (let i = 0; i < points; i++) {
        const label = timeFilter === '7d'
            ? `Day ${i + 1}`
            : `${String(i).padStart(2, '0')}:00`

        data.push({
            time: label,
            PM10: Math.floor(60 + Math.random() * 80),
            NO2: Math.floor(20 + Math.random() * 40),
            CO: (0.5 + Math.random() * 1.5).toFixed(2),
        })
    }

    return data
}

export default HistoricalChart
