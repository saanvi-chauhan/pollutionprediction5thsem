import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { STATIONS, getAQIColor, getAQICategory, getComparisonData } from '../services/api'
import Card from '../components/ui/Card'
import AQIGauge from '../components/AQIGauge'

const Comparison = ({ darkMode }) => {
    const [stationData, setStationData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchComparison()
        // Auto refresh
        const interval = setInterval(fetchComparison, 300000)
        return () => clearInterval(interval)
    }, [])

    const fetchComparison = async () => {
        const result = await getComparisonData()
        if (result.success) {
            setStationData(result.data)
        } else {
            console.warn('Failed to fetch comparison:', result.error)
            setError('Failed to load live data')
            // Fallback to empty or keep previous
        }
        setLoading(false)
    }

    // Find worst station
    const worstStation = stationData.length > 0
        ? stationData.reduce((prev, curr) => curr.AQI > prev.AQI ? curr : prev)
        : null

    if (loading && stationData.length === 0) {
        return <div className="p-8 text-center text-gray-500">Loading comparison data...</div>
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">📊 Station Comparison</h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Compare air quality across all monitoring stations
                </p>
            </div>

            {/* Worst Air Quality Alert */}
            <Card darkMode={darkMode} className="mb-8 border-l-4 border-l-red-500">
                <div className="flex items-center gap-4">
                    <span className="text-4xl">⚠️</span>
                    <div>
                        <h3 className="font-semibold text-lg">Highest Pollution Alert</h3>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <span className="font-bold text-red-500">{worstStation.name.replace('_', ' ')}</span> currently has the worst air quality with AQI of{' '}
                            <span className="font-bold" style={{ color: getAQIColor(worstStation.AQI) }}>
                                {worstStation.AQI} ({getAQICategory(worstStation.AQI)})
                            </span>
                        </p>
                    </div>
                </div>
            </Card>

            {/* Station Cards with AQI Gauges */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {stationData.map((station) => (
                    <Card
                        key={station.name}
                        darkMode={darkMode}
                        className={`${station.name === worstStation.name ? 'ring-2 ring-red-500' : ''}`}
                    >
                        <div className="text-center">
                            <h3 className="font-semibold text-lg mb-4 flex items-center justify-center gap-2">
                                📍 {station.name.replace('_', ' ')}
                                {station.name === worstStation.name && (
                                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                        Worst
                                    </span>
                                )}
                            </h3>

                            <AQIGauge aqi={station.AQI} size="medium" />

                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                                    <p className="text-xs text-gray-500">PM2.5</p>
                                    <p className="font-bold">{station.PM25} µg/m³</p>
                                </div>
                                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                                    <p className="text-xs text-gray-500">PM10</p>
                                    <p className="font-bold">{station.PM10} µg/m³</p>
                                </div>
                                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                                    <p className="text-xs text-gray-500">NO2</p>
                                    <p className="font-bold">{station.NO2} ppb</p>
                                </div>
                                <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                                    <p className="text-xs text-gray-500">CO</p>
                                    <p className="font-bold">{station.CO} mg/m³</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Bar Chart Comparison */}
            <Card darkMode={darkMode}>
                <h3 className="font-semibold text-lg mb-6">📈 Pollutant Comparison Chart</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={stationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                                border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                                borderRadius: '8px',
                            }}
                        />
                        <Legend />
                        <Bar dataKey="PM10" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="PM25" name="PM2.5" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="NO2" fill="#f97316" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="AQI" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            {/* Legend */}
            <div className={`mt-8 p-4 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                <h4 className="font-medium mb-3">🎨 AQI Color Legend</h4>
                <div className="flex flex-wrap gap-4">
                    {[
                        { label: 'Good (0-50)', color: '#10b981' },
                        { label: 'Satisfactory (51-100)', color: '#84cc16' },
                        { label: 'Moderate (101-200)', color: '#eab308' },
                        { label: 'Poor (201-300)', color: '#f97316' },
                        { label: 'Very Poor (301-400)', color: '#ef4444' },
                        { label: 'Severe (401-500)', color: '#7c2d12' },
                    ].map(({ label, color }) => (
                        <div key={label} className="flex items-center gap-2">
                            <span
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                            <span className="text-sm">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Comparison
