import { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import PollutantCard from '../components/PollutantCard'
import AQIGauge from '../components/AQIGauge'
import ShapExplanation from '../components/ShapExplanation'
import HealthAdvisory from '../components/HealthAdvisory'
import StationPeakChart from '../components/StationPeakChart'
import MonthlyPeakTrend from '../components/MonthlyPeakTrend'
import AIAnalysisReport from '../components/AIAnalysisReport'
import { predictAdvanced, getAIAnalysis, getMockPrediction, getLatestData, STATIONS } from '../services/api'



const Dashboard = ({ darkMode }) => {
    const [selectedStation, setSelectedStation] = useState('Peenya')
    const [loading, setLoading] = useState(false)
    const [prediction, setPrediction] = useState(null)
    const [advancedPrediction, setAdvancedPrediction] = useState(null)
    const [aiAnalysis, setAiAnalysis] = useState(null)
    const [analysisLoading, setAnalysisLoading] = useState(false)
    const [error, setError] = useState(null)


    // Initial state with safe defaults
    const [sensorData, setSensorData] = useState({
        PM10: 0, NO2: 0, NO: 0, NOx: 0, CO: 0, Ozone: 0, RH: 0,
        PM25_lag_1: 0, PM25_lag_24: 0,
        datetime: '--'
    })

    // Fetch live data on mount and station change
    useEffect(() => {
        fetchData(selectedStation)

        // Auto-refresh every 5 minutes
        const interval = setInterval(() => fetchData(selectedStation), 300000)
        return () => clearInterval(interval)
    }, [selectedStation])

    const fetchData = async (station) => {
        const result = await getLatestData(station)
        if (result.success) {
            setSensorData(result.data)
            // Auto-clear error if successful
            if (error && error.includes('Failed to fetch')) setError(null)
        } else {
            console.warn('Using fallback data due to:', result.error)
            // Keep previous data or show error toast? For now just log
        }
    }

    const handlePredict = async () => {
        setLoading(true)
        setError(null)
        setAiAnalysis(null)

        try {
            const payload = {
                datetime: sensorData.datetime !== '--' ? sensorData.datetime : new Date().toISOString(),
                PM10: sensorData.PM10,
                NO2: sensorData.NO2,
                NO: sensorData.NO || 0,
                NOx: sensorData.NOx,
                CO: sensorData.CO,
                Ozone: sensorData.Ozone,
                RH: sensorData.RH,
                PM25_lag_1: sensorData.PM25_lag_1,
                PM25_lag_24: sensorData.PM25_lag_24,
                month: new Date(sensorData.datetime !== '--' ? sensorData.datetime : new Date()).getMonth() + 1,
                hour: new Date(sensorData.datetime !== '--' ? sensorData.datetime : new Date()).getHours(),
            }

            const result = await predictAdvanced(payload)

            if (result.success) {
                setPrediction(result.data.current)
                setAdvancedPrediction(result.data.forecast)

                // Fetch AI Analysis automatically after prediction
                fetchAIAnalysis(result.data, payload)
            } else {
                console.warn('Using mock prediction due to:', result.error)
                const mock = getMockPrediction()
                setPrediction(mock)
                setError('Backend not available. Using demo prediction.')
            }
        } catch (err) {
            console.error('Prediction error:', err)
            setPrediction(getMockPrediction())
            setError('Backend not available. Using demo prediction.')
        } finally {
            setLoading(false)
        }
    }

    const fetchAIAnalysis = async (predictionData, features) => {
        setAnalysisLoading(true)
        try {
            const analysisPayload = {
                pm25_current: predictionData.current.pm25,
                pm25_future: predictionData.forecast.pm25_6h,
                is_high_pollution: predictionData.forecast.is_high_pollution,
                humidity: features.RH,
                month: features.month,
                hour: features.hour,
                lag_24: features.PM25_lag_24
            }
            const result = await getAIAnalysis(analysisPayload)
            if (result.success) {
                setAiAnalysis(result.data.reasoning)
            }
        } catch (err) {
            console.error('AI Analysis fetch error:', err)
        } finally {
            setAnalysisLoading(false)
        }
    }

    const handleStationChange = (station) => {
        setSelectedStation(station)
        setPrediction(null)
        // Data fetch is handled by useEffect
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">📡 Live Dashboard</h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Real-time air quality monitoring and PM2.5 prediction
                </p>
            </div>

            {/* Station Selector */}
            <Card darkMode={darkMode} className="mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            📍 Select Monitoring Station
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(STATIONS).map((station) => (
                                <button
                                    key={station}
                                    onClick={() => handleStationChange(station)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedStation === station
                                        ? 'bg-primary-500 text-white shadow-lg'
                                        : darkMode
                                            ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    {station.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div>🕐 Last Updated</div>
                        <div className="font-mono">{sensorData.datetime}</div>
                    </div>
                </div>
            </Card>

            {/* Pollutant Cards Grid */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">📊 Current Sensor Readings</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <PollutantCard name="PM10" value={sensorData.PM10} unit="µg/m³" darkMode={darkMode} />
                    <PollutantCard name="NO2" value={sensorData.NO2} unit="ppb" darkMode={darkMode} />
                    <PollutantCard name="NOx" value={sensorData.NOx} unit="ppb" darkMode={darkMode} />
                    <PollutantCard name="CO" value={sensorData.CO} unit="mg/m³" darkMode={darkMode} />
                    <PollutantCard name="Ozone" value={sensorData.Ozone} unit="ppb" darkMode={darkMode} />
                    <PollutantCard name="RH" value={sensorData.RH} unit="%" icon="💧" darkMode={darkMode} />
                </div>
            </div>

            {/* Prediction Section */}
            <Card darkMode={darkMode} className="mb-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Predict Button and Result */}
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-4">🔮 PM2.5 Prediction</h2>

                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-sm">
                                ⚠️ {error}
                            </div>
                        )}

                        <Button
                            onClick={handlePredict}
                            loading={loading}
                            size="lg"
                            className="w-full sm:w-auto mb-6"
                        >
                            {loading ? 'Running Model...' : '🎯 Predict PM2.5 & AQI'}
                        </Button>

                        {prediction && (
                            <div className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} border-l-4 border-l-primary-500`}>
                                        <p className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Prediction</p>
                                        <p className="text-3xl font-bold text-primary-500">
                                            {prediction.pm25 ? prediction.pm25.toFixed(2) : prediction.pm25_prediction.toFixed(2)}
                                            <span className="text-base font-normal ml-1">µg/m³</span>
                                        </p>
                                        <p className="text-sm font-medium mt-1">{prediction.category || prediction.aqi_category}</p>
                                    </div>

                                    {advancedPrediction && (
                                        <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} border-l-4 border-l-indigo-500`}>
                                            <p className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>6-Hour Forecast</p>
                                            <p className="text-3xl font-bold text-indigo-500">
                                                {advancedPrediction.pm25_6h.toFixed(2)}
                                                <span className="text-base font-normal ml-1">µg/m³</span>
                                            </p>
                                            <p className={`text-sm font-medium mt-1 ${advancedPrediction.is_high_pollution ? 'text-red-500' : 'text-emerald-500'}`}>
                                                {advancedPrediction.status}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {advancedPrediction && advancedPrediction.is_high_pollution === 1 && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2">
                                        <span>⚠️</span> <strong>High Pollution Event Detected</strong> in the next 6 hours.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: AQI Gauge */}
                    <div className="flex items-center justify-center lg:border-l lg:pl-8 dark:border-slate-700 border-gray-200">
                        {prediction ? (
                            <AQIGauge aqi={prediction.aqi} size="large" />
                        ) : (
                            <div className="text-center p-8">
                                <span className="text-6xl grayscale opacity-40">🎯</span>
                                <p className={`mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Click predict to see AQI
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* SHAP Explanation & Health Advisory */}
            {(prediction || advancedPrediction) && (
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {prediction?.explanation && <ShapExplanation explanations={prediction.explanation} darkMode={darkMode} />}
                    <HealthAdvisory aqi={prediction?.aqi || 0} darkMode={darkMode} />
                </div>
            )}

            {/* AI Analysis Report */}
            {(aiAnalysis || analysisLoading) && (
                <div className="mb-8">
                    <AIAnalysisReport report={aiAnalysis} loading={analysisLoading} darkMode={darkMode} />
                </div>
            )}

            {/* Peak Analysis Section */}
            <div className="mt-12 mb-8">
                <h2 className="text-xl font-semibold mb-6">📉 Traffic & Temporal Analysis</h2>
                <div className="grid lg:grid-cols-2 gap-6 mb-4">
                    <StationPeakChart darkMode={darkMode} />
                    <MonthlyPeakTrend darkMode={darkMode} />
                </div>
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-800/50 border-slate-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'} text-sm`}>
                    <p>
                        <strong>Insight:</strong> Peak-hour pollution levels are consistently higher than non-peak hours, indicating the influence of traffic and human activity.
                    </p>
                </div>
            </div>




        </div>
    )
}

export default Dashboard
