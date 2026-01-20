# 🚀 Quick Start: Chatbot Implementation

## ⚡ TL;DR - What We're Building

An AI chatbot that answers questions like:
- *"What's the current AQI in Peenya?"*
- *"Is it safe to go outside?"*
- *"What is PM2.5?"*
- *"Compare air quality across all stations"*
- *"Should I exercise outdoors today?"*

---

## 🎯 Recommended Approach: Traditional ML (Fast & Effective)

**Why?** Lightweight, fast training, easy to deploy, doesn't need huge datasets

**Tech Stack**:
- **Intent Classification**: TF-IDF + Logistic Regression
- **Entity Extraction**: spaCy + Regex
- **Response Generation**: Templates + Real API data

---

## 📋 Step-by-Step Implementation (Simplified)

### STEP 1: Create Training Data (2-3 hours)

**Create**: `data/chatbot/intents.json`

```json
{
  "intents": [
    {
      "tag": "check_aqi",
      "patterns": [
        "What is the current AQI?",
        "Tell me the AQI in {location}",
        "How is the air quality?",
        "Is air quality good today?",
        "What's the pollution level?"
      ],
      "responses": [
        "The current AQI in {location} is {aqi}, which is {category}. {health_advice}"
      ],
      "context": ["location"],
      "action": "fetch_latest_aqi"
    },
    {
      "tag": "outdoor_safety",
      "patterns": [
        "Is it safe to go outside?",
        "Can I exercise outdoors?",
        "Should I go for a run?",
        "Is it okay to play outside?",
        "Can children play outside?"
      ],
      "responses": [
        "Based on the current AQI of {aqi} ({category}), {safety_advice}"
      ],
      "action": "check_safety"
    },
    {
      "tag": "what_is_aqi",
      "patterns": [
        "What is AQI?",
        "Explain AQI",
        "What does AQI mean?",
        "Tell me about air quality index"
      ],
      "responses": [
        "AQI (Air Quality Index) is a number from 0-500 that indicates how polluted the air is. 0-50 is Good, 51-100 is Satisfactory, 101-200 is Moderate, 201-300 is Poor, 301-400 is Very Poor, and 401-500 is Severe."
      ],
      "action": "explain_concept"
    },
    {
      "tag": "compare_stations",
      "patterns": [
        "Compare air quality",
        "Which area has better air?",
        "Show me all stations",
        "Compare Peenya and Silkboard",
        "Best air quality location"
      ],
      "responses": [
        "Here's the comparison: {comparison_data}"
      ],
      "action": "fetch_comparison"
    }
  ]
}
```

**Create**: 15-20 intents with 5-10 patterns each = **100-150 training examples**

Common Intents:
1. check_aqi
2. outdoor_safety
3. what_is_aqi
4. what_is_pm25
5. compare_stations
6. health_advisory
7. pollution_causes
8. reduce_exposure
9. greeting
10. goodbye
11. thanks
12. help

---

### STEP 2: Train Intent Classifier (30 mins)

**Create**: `notebooks/08_train_chatbot.ipynb`

```python
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import joblib

# 1. Load data
with open('../data/chatbot/intents.json', 'r') as f:
    data = json.load(f)

# 2. Prepare training data
X = []  # Questions
y = []  # Intent tags

for intent in data['intents']:
    for pattern in intent['patterns']:
        X.append(pattern.lower())
        y.append(intent['tag'])

# 3. Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Vectorize
vectorizer = TfidfVectorizer(max_features=500, ngram_range=(1, 2))
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# 5. Train model
model = LogisticRegression(max_iter=1000, random_state=42)
model.fit(X_train_vec, y_train)

# 6. Evaluate
accuracy = model.score(X_test_vec, y_test)
print(f"Accuracy: {accuracy * 100:.2f}%")

# 7. Save models
joblib.dump(model, '../backend/models/chatbot_intent_model.pkl')
joblib.dump(vectorizer, '../backend/models/chatbot_vectorizer.pkl')

print("✅ Models saved!")
```

**Expected Accuracy**: 85-90%

---

### STEP 3: Build Chatbot Service (1-2 hours)

**Create**: `backend/utils/chatbot_service.py`

```python
import joblib
import json
import re
from typing import Dict, List
import requests

class AirQualityChatbot:
    def __init__(self):
        # Load models
        self.model = joblib.load("models/chatbot_intent_model.pkl")
        self.vectorizer = joblib.load("models/chatbot_vectorizer.pkl")
        
        # Load intents
        with open('../data/chatbot/intents.json', 'r') as f:
            self.intents_data = json.load(f)
        
        self.station_names = ["Peenya", "RVCE_Mailsandra", "Silkboard"]
    
    def predict_intent(self, query: str) -> tuple:
        """Predict intent and confidence"""
        query_vec = self.vectorizer.transform([query.lower()])
        intent = self.model.predict(query_vec)[0]
        confidence = max(self.model.predict_proba(query_vec)[0])
        return intent, confidence
    
    def extract_location(self, query: str) -> str:
        """Extract station name from query"""
        query_lower = query.lower()
        for station in self.station_names:
            if station.lower() in query_lower:
                return station
        return "Peenya"  # Default
    
    def get_aqi_category(self, aqi: int) -> str:
        """Convert AQI to category"""
        if aqi <= 50: return "Good"
        elif aqi <= 100: return "Satisfactory"
        elif aqi <= 200: return "Moderate"
        elif aqi <= 300: return "Poor"
        elif aqi <= 400: return "Very Poor"
        else: return "Severe"
    
    def fetch_latest_data(self, station: str) -> Dict:
        """Call existing API to get latest data"""
        try:
            response = requests.get(f"http://127.0.0.1:8000/latest?station_id={station}", timeout=5)
            return response.json()
        except:
            return {"error": "Could not fetch data"}
    
    def generate_response(self, intent: str, query: str) -> Dict:
        """Generate response based on intent"""
        
        if intent == "check_aqi":
            station = self.extract_location(query)
            data = self.fetch_latest_data(station)
            
            if "error" not in data:
                # Calculate AQI from PM2.5 (simplified)
                pm25 = data.get("PM25_lag_1", 0)
                aqi = int(pm25 * 2.5)  # Rough approximation
                category = self.get_aqi_category(aqi)
                
                return {
                    "response": f"The current AQI in {station} is {aqi}, which is {category}.",
                    "intent": intent,
                    "data": {"station": station, "aqi": aqi, "category": category}
                }
        
        elif intent == "outdoor_safety":
            station = self.extract_location(query)
            data = self.fetch_latest_data(station)
            pm25 = data.get("PM25_lag_1", 0)
            aqi = int(pm25 * 2.5)
            
            if aqi <= 100:
                advice = "Yes, it's safe! Air quality is good for outdoor activities."
            elif aqi <= 200:
                advice = "Sensitive groups should limit prolonged outdoor exertion."
            else:
                advice = "Not recommended. Air quality is poor. Avoid outdoor activities."
            
            return {
                "response": f"Current AQI: {aqi}. {advice}",
                "intent": intent,
                "data": {"aqi": aqi, "safe": aqi <= 100}
            }
        
        elif intent == "what_is_aqi":
            return {
                "response": "AQI (Air Quality Index) is a standardized indicator of air quality. It ranges from 0 (excellent) to 500 (hazardous). Lower values mean cleaner air!",
                "intent": intent
            }
        
        elif intent == "compare_stations":
            # Call comparison endpoint
            try:
                response = requests.get("http://127.0.0.1:8000/comparison", timeout=5)
                stations = response.json()
                
                comparison = "Air Quality Comparison:\n"
                for s in stations:
                    comparison += f"• {s['name']}: AQI {s['AQI']} (PM2.5: {s['PM25']} µg/m³)\n"
                
                return {"response": comparison, "intent": intent, "data": stations}
            except:
                return {"response": "Sorry, couldn't fetch comparison data.", "intent": intent}
        
        # Default fallback
        return {
            "response": "I'm not sure how to answer that. Try asking about current AQI, air quality, or if it's safe to go outside!",
            "intent": "fallback"
        }
    
    def process_query(self, query: str) -> Dict:
        """Main processing function"""
        # 1. Predict intent
        intent, confidence = self.predict_intent(query)
        
        # 2. Generate response
        if confidence < 0.5:
            return {
                "response": "I'm not confident I understood that. Could you rephrase?",
                "intent": "unclear",
                "confidence": float(confidence)
            }
        
        response = self.generate_response(intent, query)
        response["confidence"] = float(confidence)
        
        return response
```

---

### STEP 4: Add API Endpoint (15 mins)

**Update**: `backend/app.py`

```python
from utils.chatbot_service import AirQualityChatbot

# Initialize chatbot
chatbot = AirQualityChatbot()

@app.post("/chatbot/query")
def chatbot_query(query: str):
    """
    Process chatbot query
    
    Example: POST /chatbot/query?query=What is the AQI in Peenya?
    """
    result = chatbot.process_query(query)
    return result

@app.get("/chatbot/suggestions")
def get_suggestions():
    """Return common question suggestions"""
    return {
        "suggestions": [
            "What is the current AQI?",
            "Is it safe to go outside?",
            "Compare air quality across stations",
            "What is PM2.5?",
            "Show me the pollution levels"
        ]
    }
```

---

### STEP 5: Update Frontend UI (2-3 hours)

**Update**: `frontend-react/src/pages/Chatbot.jsx`

```jsx
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Card from '../components/ui/Card'

const Chatbot = ({ darkMode }) => {
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: 'Hi! I can help you with air quality information. Ask me anything!',
            time: new Date().toLocaleTimeString()
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const messagesEndRef = useRef(null)
    
    // Fetch suggestions
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/chatbot/suggestions')
            .then(res => setSuggestions(res.data.suggestions))
            .catch(err => console.error(err))
    }, [])
    
    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])
    
    const sendMessage = async (text) => {
        if (!text.trim()) return
        
        // Add user message
        const userMsg = {
            type: 'user',
            text: text,
            time: new Date().toLocaleTimeString()
        }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)
        
        try {
            // Call chatbot API
            const response = await axios.post(
                'http://127.0.0.1:8000/chatbot/query',
                null,
                { params: { query: text } }
            )
            
            // Add bot response
            const botMsg = {
                type: 'bot',
                text: response.data.response,
                time: new Date().toLocaleTimeString(),
                data: response.data.data
            }
            setMessages(prev => [...prev, botMsg])
        } catch (error) {
            setMessages(prev => [...prev, {
                type: 'bot',
                text: 'Sorry, something went wrong. Please try again.',
                time: new Date().toLocaleTimeString()
            }])
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">🤖 Air Quality Assistant</h1>
            
            {/* Chat Container */}
            <Card darkMode={darkMode} className="mb-4 h-[500px] flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                    msg.type === 'user'
                                        ? 'bg-primary-500 text-white'
                                        : darkMode
                                        ? 'bg-slate-700 text-gray-200'
                                        : 'bg-gray-100 text-gray-900'
                                }`}
                            >
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                <p className="text-xs opacity-60 mt-1">{msg.time}</p>
                            </div>
                        </div>
                    ))}
                    
                    {loading && (
                        <div className="flex justify-start">
                            <div className={`rounded-lg px-4 py-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                <span className="animate-pulse">Thinking...</span>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>
                
                {/* Input */}
                <div className="border-t dark:border-slate-700 p-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                            placeholder="Ask me about air quality..."
                            className={`flex-1 px-4 py-2 rounded-lg border ${
                                darkMode
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            disabled={loading}
                        />
                        <button
                            onClick={() => sendMessage(input)}
                            disabled={loading || !input.trim()}
                            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </Card>
            
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
                {suggestions.map((sug, idx) => (
                    <button
                        key={idx}
                        onClick={() => sendMessage(sug)}
                        className={`px-4 py-2 rounded-full text-sm ${
                            darkMode
                                ? 'bg-slate-700 hover:bg-slate-600'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        {sug}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Chatbot
```

---

### STEP 6: Install Dependencies

```bash
# Backend
cd backend
pip install scikit-learn nltk spacy

# Download spaCy model
python -m spacy download en_core_web_sm

# Frontend (no new dependencies needed!)
```

---

## ✅ Testing Checklist

1. ✅ Train model (accuracy > 85%)
2. ✅ Test API endpoint: `POST http://127.0.0.1:8000/chatbot/query?query=What is the AQI?`
3. ✅ Frontend displays chat interface
4. ✅ Messages send and receive correctly
5. ✅ Suggestions work when clicked
6. ✅ Loading state shows while processing
7. ✅ Handles errors gracefully

---

## 🎯 Example Conversations

**User**: "What's the current AQI?"  
**Bot**: "The current AQI in Peenya is 145, which is Moderate."

**User**: "Is it safe to go outside?"  
**Bot**: "Current AQI: 145. Sensitive groups should limit prolonged outdoor exertion."

**User**: "Compare all stations"  
**Bot**: "Air Quality Comparison:  
• Peenya: AQI 145 (PM2.5: 58 µg/m³)  
• RVCE_Mailsandra: AQI 132 (PM2.5: 52 µg/m³)  
• Silkboard: AQI 167 (PM2.5: 67 µg/m³)"

**User**: "What is PM2.5?"  
**Bot**: "PM2.5 refers to fine particulate matter less than 2.5 micrometers in diameter. It can penetrate deep into lungs and cause respiratory issues."

---

## ⏱️ Time Estimate

- **Step 1**: Create intents.json → **2-3 hours**
- **Step 2**: Train model → **30 minutes**
- **Step 3**: Build service → **1-2 hours**
- **Step 4**: Add API endpoint → **15 minutes**
- **Step 5**: Update frontend → **2-3 hours**
- **Step 6**: Testing → **1 hour**

**TOTAL**: **7-10 hours** for a working chatbot!

---

## 🚀 Ready to Start?

```bash
# 1. Create data folder
mkdir -p data/chatbot

# 2. Create intents.json (use the template above)

# 3. Create training notebook
jupyter notebook notebooks/08_train_chatbot.ipynb

# 4. Run training

# 5. Implement backend service

# 6. Update frontend

# 7. Test and refine!
```

---

**Need help?** Check the full plan in `CHATBOT_IMPLEMENTATION_PLAN.md` 📖

