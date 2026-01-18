import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const predictPM25 = async (data) => {
    try {
        const response = await api.post('/predict', data)
        return { success: true, data: response.data }
    } catch (error) {
        console.error('Prediction API Error:', error)
        return {
            success: false,
            error: error.response?.data?.detail || error.message || 'Failed to connect to backend'
        }
    }
}

export const getLatestData = async (stationId) => {
    try {
        const response = await api.get(`/latest?station_id=${stationId}`)
        return { success: true, data: response.data }
    } catch (error) {
        console.error('Fetch Latest Data Error:', error)
        return {
            success: false,
            error: error.response?.data?.detail || error.message || 'Failed to fetch live data'
        }
    }
}

export const getComparisonData = async () => {
    try {
        const response = await api.get('/comparison')
        return { success: true, data: response.data }
    } catch (error) {
        console.error('Fetch Comparison Data Error:', error)
        return {
            success: false,
            error: error.response?.data?.detail || error.message || 'Failed to fetch comparison data'
        }
    }
}

// Mock data for demo/testing when backend is not available
export const getMockPrediction = () => ({
    pm25_prediction: 42.5,
    aqi: 128,
    aqi_category: "Moderate",
    explanation: [
        "PM10 increased PM2.5 by +1.23",
        "Humidity reduced PM2.5 by -0.85",
        "CO increased PM2.5 by +0.42",
        "NOx increased PM2.5 by +0.38",
        "Ozone reduced PM2.5 by -0.22"
    ]
})

// Station coordinates for Bengaluru
export const STATIONS = {
    'Peenya': { lat: 13.0205, lon: 77.5360, id: 'peenya' },
    'RVCE_Mailsandra': { lat: 12.9338, lon: 77.5263, id: 'rvce' },
    'Silkboard': { lat: 12.9279, lon: 77.6240, id: 'silkboard' },
}

// AQI category colors and info
export const AQI_CATEGORIES = {
    'Good': { color: '#10b981', range: '0-50', bgClass: 'bg-emerald-500', advice: 'Air quality is satisfactory. Enjoy outdoor activities!' },
    'Satisfactory': { color: '#84cc16', range: '51-100', bgClass: 'bg-lime-500', advice: 'Air quality is acceptable. Unusually sensitive people should limit outdoor exertion.' },
    'Moderate': { color: '#eab308', range: '101-200', bgClass: 'bg-yellow-500', advice: 'Members of sensitive groups may experience health effects. General public less likely affected.' },
    'Poor': { color: '#f97316', range: '201-300', bgClass: 'bg-orange-500', advice: 'Everyone may begin to experience health effects. Sensitive groups may experience more serious effects.' },
    'Very Poor': { color: '#ef4444', range: '301-400', bgClass: 'bg-red-500', advice: 'Health alert: everyone may experience serious health effects. Avoid outdoor activities.' },
    'Severe': { color: '#7c2d12', range: '401-500', bgClass: 'bg-red-900', advice: 'Health emergency. Everyone is likely to be affected. Stay indoors!' },
}

export const getAQICategory = (aqi) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Satisfactory'
    if (aqi <= 200) return 'Moderate'
    if (aqi <= 300) return 'Poor'
    if (aqi <= 400) return 'Very Poor'
    return 'Severe'
}

export const getAQIColor = (aqi) => {
    const category = getAQICategory(aqi)
    return AQI_CATEGORIES[category]?.color || '#6b7280'
}

export default api
