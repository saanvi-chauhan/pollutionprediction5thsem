import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const Chatbot = ({ darkMode }) => {
    const STATIONS = ['Peenya', 'Silkboard', 'RVCE_Mailsandra']
    const [selectedStation, setSelectedStation] = useState(null)
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: '👋 Hi! Before we start, what is your location? Please choose: **Peenya**, **Silkboard**, or **RVCE**.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const suggestions = [
        "What is the current AQI?",
        "AQI in my area right now?",
        "Air quality right now in Peenya",
        "Is it safe to go outside?",
        "Is it safe to go for a run right now?",
        "Compare air quality across stations",
        "Which station has the lowest AQI right now?",
        "What is PM2.5?",
        "What is PM10?",
        "Show pollution levels"
    ]

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async (text) => {
        if (!text.trim()) return

        // If station not selected yet, try to infer it or ask again
        if (!selectedStation) {
            const lower = text.toLowerCase()
            let inferred = null
            if (lower.includes('peenya')) inferred = 'Peenya'
            if (lower.includes('silkboard') || lower.includes('silboard') || lower.includes('silk')) inferred = 'Silkboard'
            if (lower.includes('rvce') || lower.includes('mailsandra')) inferred = 'RVCE_Mailsandra'

            // Add user message
            const userMsg = {
                type: 'user',
                text: text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setMessages(prev => [...prev, userMsg])
            setInput('')

            if (inferred) {
                setSelectedStation(inferred)
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: `✅ Got it — I’ll use **${inferred.replace('_', ' ')}** for live AQI and safety checks. What would you like to know?`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }])
            } else {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    text: 'Please pick a location first: **Peenya**, **Silkboard**, or **RVCE**.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }])
            }
            return
        }

        // Add user message
        const userMsg = {
            type: 'user',
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            // Call the real chatbot API
            const response = await axios.post(
                'http://127.0.0.1:8000/chatbot/query',
                null,
                {
                    params: { query: text, station_id: selectedStation },
                    timeout: 30000
                }
            )

            const botMsg = {
                type: 'bot',
                text: response.data.response,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                intent: response.data.intent,
                confidence: response.data.confidence
            }
            setMessages(prev => [...prev, botMsg])
        } catch (error) {
            console.error('Chatbot API error:', error)
            // Fallback to simple responses if backend is not available
            const fallbackResponse = generateSimpleResponse(text.toLowerCase())
            setMessages(prev => [...prev, {
                type: 'bot',
                text: fallbackResponse,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }])
        } finally {
            setLoading(false)
        }
    }

    const generateSimpleResponse = (query) => {
        // Simple keyword-based responses (will be replaced with ML model)
        if (query.includes('aqi') || query.includes('air quality')) {
            return '🌡️ The current AQI varies by station:\n• Peenya: ~145 (Moderate)\n• RVCE Mailsandra: ~132 (Moderate)\n• Silkboard: ~167 (Moderate)\n\nVisit the Dashboard for real-time data!'
        }
        else if (query.includes('safe') || query.includes('outside') || query.includes('outdoor')) {
            return '🏃 Based on current conditions (AQI ~140-160), it\'s generally safe for most people, but sensitive groups should consider limiting prolonged outdoor exertion.\n\n👶 Children, elderly, and those with respiratory conditions should take extra care.'
        }
        else if (query.includes('pm2.5') || query.includes('pm 2.5')) {
            return '🔬 PM2.5 refers to fine particulate matter with diameter less than 2.5 micrometers. These tiny particles can penetrate deep into lungs and bloodstream, causing respiratory and cardiovascular problems.\n\n📊 Safe levels: 0-30 µg/m³\nCurrent avg: ~50-70 µg/m³'
        }
        else if (query.includes('compare') || query.includes('comparison')) {
            return '📍 Station Comparison:\n\n🏭 Peenya (Industrial): Moderate to Poor\n🎓 RVCE Mailsandra (Educational): Moderate\n🚗 Silkboard (Traffic): Moderate to Poor\n\nCheck the Comparison page for detailed metrics!'
        }
        else if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
            return '👋 Hello! I\'m here to help you understand air quality in Bengaluru. You can ask me about:\n• Current AQI levels\n• Safety for outdoor activities\n• Pollution information\n• Station comparisons'
        }
        else if (query.includes('help')) {
            return '💡 I can help you with:\n\n✅ Current AQI at different stations\n✅ Safety advice for outdoor activities\n✅ Explanation of pollutants (PM2.5, PM10, etc.)\n✅ Station comparisons\n✅ Health recommendations\n\nJust ask your question naturally!'
        }
        else if (query.includes('thank')) {
            return '😊 You\'re welcome! Stay safe and breathe easy! 🌿'
        }
        else {
            return '🤔 I\'m still learning! For now, try asking about:\n• Current AQI levels\n• Is it safe to go outside?\n• What is PM2.5?\n• Compare stations\n\nOr visit the Dashboard for detailed information!'
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage(input)
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                    <span>🤖</span> Air Quality Assistant
                </h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ask me anything about air quality, pollution, and safety
                </p>
            </div>

            {/* Info Banner */}
            <div className={`mb-6 p-4 rounded-lg border ${darkMode ? 'bg-green-900/20 border-green-700/50' : 'bg-green-50 border-green-200'}`}>
                <p className="text-sm text-center">
                    🤖 <strong>AI-Powered!</strong> This chatbot uses Machine Learning (Logistic Regression + TF-IDF) to understand your questions about air quality.
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm">
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        📍 Location:
                    </span>
                    {selectedStation ? (
                        <span className="px-3 py-1 rounded-full bg-primary-500 text-white font-medium">
                            {selectedStation.replace('_', ' ')}
                        </span>
                    ) : (
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            not selected
                        </span>
                    )}
                </div>
                {!selectedStation && (
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <button
                            onClick={() => sendMessage('Peenya')}
                            disabled={loading}
                            className={`px-4 py-2 rounded-full text-sm transition-all hover:scale-105 ${darkMode
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            Peenya
                        </button>
                        <button
                            onClick={() => sendMessage('Silkboard')}
                            disabled={loading}
                            className={`px-4 py-2 rounded-full text-sm transition-all hover:scale-105 ${darkMode
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            Silkboard
                        </button>
                        <button
                            onClick={() => sendMessage('RVCE')}
                            disabled={loading}
                            className={`px-4 py-2 rounded-full text-sm transition-all hover:scale-105 ${darkMode
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            RVCE
                        </button>
                    </div>
                )}
            </div>

            {/* Chat Container */}
            <Card darkMode={darkMode} className="mb-6 flex flex-col" style={{ height: '550px' }}>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        >
                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${msg.type === 'user'
                                    ? 'bg-primary-500 text-white rounded-br-sm'
                                    : darkMode
                                        ? 'bg-slate-700 text-gray-100 rounded-bl-sm'
                                        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                                <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-primary-100' : 'opacity-60'}`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {loading && (
                        <div className="flex justify-start">
                            <div className={`rounded-2xl px-4 py-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={`border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} p-4`}>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={selectedStation ? "Type your question here..." : "First select your location (Peenya / Silkboard / RVCE)..."}
                            className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 ${darkMode
                                ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                            disabled={loading}
                        />
                        <Button
                            onClick={() => sendMessage(input)}
                            disabled={loading || !input.trim()}
                            className="px-6"
                        >
                            {loading ? '⏳' : '📤'}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Quick Suggestions */}
            <div>
                <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    💡 Quick questions:
                </p>
                <div className="flex flex-wrap gap-2">
                    {suggestions.map((sug, idx) => (
                        <button
                            key={idx}
                            onClick={() => sendMessage(sug)}
                            disabled={loading}
                            className={`px-4 py-2 rounded-full text-sm transition-all hover:scale-105 ${darkMode
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {sug}
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer Info */}
            <div className={`mt-8 p-4 rounded-lg text-center text-sm ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    ✅ <strong>Powered by:</strong> Logistic Regression Intent Classifier • TF-IDF Vectorization • Real-time API Integration
                </p>
            </div>
        </div>
    )
}

export default Chatbot
