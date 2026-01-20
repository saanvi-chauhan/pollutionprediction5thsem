# 🤖 Air Quality Chatbot - Implementation Plan

## 📋 Project Overview
Build an NLP-powered chatbot that answers user questions about:
- Air Quality Index (AQI) levels
- Pollution conditions at different stations
- Safety recommendations for outdoor activities
- PM2.5, PM10, and other pollutant explanations
- Historical trends and predictions

---

## 🎯 Phase 1: Data Collection & Preparation (2-3 days)

### 1.1 Create Training Dataset
**Objective**: Build a comprehensive Q&A dataset for chatbot training

**Data Sources**:
- Your existing air quality data (Peenya, RVCE, Silkboard)
- AQI standards and health guidelines
- Pollution knowledge base (causes, effects, safety measures)

**Dataset Structure**:
```json
{
  "intent": "check_aqi",
  "question": "What is the current AQI in Peenya?",
  "answer": "Based on the latest data, the AQI in Peenya is {aqi_value}, which is {category}.",
  "context": ["location", "current_time"],
  "api_call": "/latest?station_id=Peenya"
}
```

**Intent Categories** (15-20 intents):
1. **check_aqi** - Current AQI queries
2. **check_pollution_level** - Specific pollutant levels
3. **compare_stations** - Compare air quality across stations
4. **outdoor_safety** - Is it safe to go outside?
5. **health_advisory** - Health recommendations
6. **what_is_aqi** - Explain AQI concept
7. **what_is_pm25** - Explain PM2.5
8. **pollution_causes** - What causes pollution?
9. **reduce_pollution** - How to reduce exposure?
10. **historical_trend** - Past pollution patterns
11. **prediction** - Future air quality
12. **best_worst_station** - Which area has best/worst air?
13. **sensitive_groups** - Advice for vulnerable people
14. **pollution_sources** - Traffic, industrial sources
15. **seasonal_effects** - Pollution variation by season

**Action Items**:
- [ ] Create `data/chatbot/intents.json` with 100+ Q&A pairs
- [ ] Generate template responses for each intent
- [ ] Create entity extraction rules (locations, pollutants, time)
- [ ] Add fallback responses for unknown queries

---

## 🧠 Phase 2: Model Selection & Training (3-5 days)

### 2.1 Approach Options

#### Option A: Traditional ML (Simpler, Faster) ⭐ **RECOMMENDED**
**Tech Stack**: scikit-learn, NLTK, spaCy

**Model Architecture**:
1. **Intent Classification**: 
   - TF-IDF Vectorizer + Logistic Regression
   - Or: Count Vectorizer + Naive Bayes
   - Accuracy Target: 85%+

2. **Entity Recognition**:
   - spaCy NER for extracting location, pollutant names, time
   - Regex patterns for numbers, dates

3. **Response Generation**:
   - Template-based with dynamic API data injection
   - Simple and reliable

**Pros**: Fast training, lightweight, easy to deploy, interpretable
**Cons**: Limited understanding of complex queries

#### Option B: Transformer-Based (Advanced) 
**Tech Stack**: Hugging Face Transformers, BERT/DistilBERT

**Model**: 
- Fine-tuned DistilBERT for intent classification
- T5 or GPT-2 for response generation
- Accuracy Target: 90%+

**Pros**: Better context understanding, handles complex queries
**Cons**: Slower, requires more data, larger model size

#### Option C: Hybrid (Best of Both)
- Use lightweight ML for intent classification
- Use rule-based + API calls for response generation
- Integrate with existing prediction models

### 2.2 Implementation Steps (Option A - Recommended)

**Step 1: Text Preprocessing**
```python
# backend/utils/chatbot_preprocessing.py
- Lowercase conversion
- Remove punctuation
- Tokenization
- Stop word removal
- Lemmatization
```

**Step 2: Feature Engineering**
```python
# backend/utils/chatbot_features.py
- TF-IDF vectorization (max 500 features)
- N-gram features (1-2 grams)
- Custom features: has_location, has_pollutant, has_time
```

**Step 3: Train Intent Classifier**
```python
# notebooks/08_train_chatbot.ipynb
1. Load intents.json
2. Split train/test (80/20)
3. Train Logistic Regression
4. Cross-validation
5. Save model as chatbot_intent_model.pkl
```

**Step 4: Build Entity Extractor**
```python
# backend/utils/entity_extractor.py
- spaCy for location extraction
- Regex for pollutant names (PM2.5, PM10, NO2, etc.)
- dateparser for time expressions
```

**Step 5: Response Generator**
```python
# backend/utils/response_generator.py
- Map intent to response template
- Extract entities from query
- Call appropriate API endpoint
- Inject real-time data into response
```

---

## 🏗️ Phase 3: Backend Integration (2-3 days)

### 3.1 New API Endpoints

**File**: `backend/app.py`

```python
@app.post("/chatbot/query")
def chatbot_query(query: str):
    """
    Process user query and return intelligent response
    
    Input: "What's the air quality in Silkboard?"
    Output: {
        "response": "The current AQI in Silkboard is 145 (Moderate). Sensitive groups should limit prolonged outdoor exertion.",
        "intent": "check_aqi",
        "confidence": 0.92,
        "data": {
            "station": "Silkboard",
            "aqi": 145,
            "category": "Moderate"
        }
    }
    """
    pass

@app.get("/chatbot/suggestions")
def get_suggestions():
    """Return common question suggestions"""
    return [
        "What is the current AQI?",
        "Is it safe to go outside?",
        "Compare air quality across stations",
        "What is PM2.5?",
        "Show me predictions for tomorrow"
    ]
```

### 3.2 Chatbot Service Class

**File**: `backend/utils/chatbot_service.py`

```python
class AirQualityChatbot:
    def __init__(self):
        self.intent_model = joblib.load("models/chatbot_intent_model.pkl")
        self.vectorizer = joblib.load("models/chatbot_vectorizer.pkl")
        self.intents_db = load_intents()
        self.entity_extractor = EntityExtractor()
    
    def process_query(self, query: str):
        # 1. Preprocess
        # 2. Predict intent
        # 3. Extract entities
        # 4. Fetch data from API/database
        # 5. Generate response
        # 6. Return structured response
        pass
```

---

## 💻 Phase 4: Frontend Integration (2-3 days)

### 4.1 Update Chatbot Page

**File**: `frontend-react/src/pages/Chatbot.jsx`

**Features**:
1. **Chat Interface**:
   - Message history with user/bot avatars
   - Typing indicator while processing
   - Auto-scroll to latest message
   - Message timestamps

2. **Quick Actions**:
   - Suggested questions as buttons
   - Station selector
   - "Clear chat" option

3. **Rich Responses**:
   - Text responses with formatting
   - Embedded AQI gauge for relevant queries
   - Quick links to Dashboard/Comparison pages
   - Data cards for pollutant information

4. **Error Handling**:
   - Graceful fallback for unknown queries
   - "Did you mean...?" suggestions
   - Backend timeout handling

**UI Components to Create**:
```jsx
components/chatbot/
├── ChatMessage.jsx       // Individual message bubble
├── ChatInput.jsx         // Input field with send button
├── SuggestionChips.jsx   // Quick question buttons
├── TypingIndicator.jsx   // Animated "bot is typing..."
└── ChatbotAvatar.jsx     // Bot/User avatars
```

### 4.2 API Service

**File**: `frontend-react/src/services/chatbot.js`

```javascript
export const sendChatMessage = async (message) => {
    const response = await api.post('/chatbot/query', { query: message })
    return response.data
}

export const getChatSuggestions = async () => {
    const response = await api.get('/chatbot/suggestions')
    return response.data
}
```

---

## 🧪 Phase 5: Testing & Evaluation (2 days)

### 5.1 Model Evaluation Metrics
- **Intent Classification Accuracy**: Target 85%+
- **Response Relevance**: Manual evaluation on 100 test queries
- **API Call Success Rate**: 95%+
- **Average Response Time**: < 2 seconds

### 5.2 Test Scenarios
1. Simple AQI queries (current, by station)
2. Comparison queries (multi-station)
3. Health advisory questions
4. Educational questions (What is PM2.5?)
5. Complex multi-part questions
6. Ambiguous queries
7. Out-of-scope questions
8. Typos and grammatical errors

### 5.3 User Acceptance Testing
- Test with 5-10 users
- Collect feedback on response quality
- Identify missing intents
- Improve response templates

---

## 📦 Phase 6: Deployment & Optimization (1-2 days)

### 6.1 Model Optimization
- Reduce model size (compress if needed)
- Cache common queries
- Implement response caching for repeated questions
- Add rate limiting

### 6.2 Monitoring
- Log all queries and responses
- Track intent distribution
- Monitor response times
- Identify failing queries for improvement

---

## 📊 Technical Requirements

### Backend Dependencies
Add to `backend/requirements.txt`:
```
scikit-learn  # Already installed
spacy>=3.5.0
nltk>=3.8.0
python-dateutil>=2.8.0
fuzzywuzzy>=0.18.0  # For fuzzy string matching
```

### Frontend Dependencies
Add to `frontend-react/package.json`:
```json
{
  "react-markdown": "^9.0.0",  // For formatting bot responses
  "react-syntax-highlighter": "^15.5.0"  // For code blocks if needed
}
```

### Model Files
```
backend/models/
├── chatbot_intent_model.pkl       # Intent classifier
├── chatbot_vectorizer.pkl         # TF-IDF vectorizer
├── chatbot_label_encoder.pkl      # Label encoder for intents
└── chatbot_entity_patterns.json   # Entity extraction patterns
```

### Training Data
```
data/chatbot/
├── intents.json                   # Training data (100+ examples)
├── responses.json                 # Response templates
├── entities.json                  # Custom entities (stations, pollutants)
└── fallback_responses.json        # Default responses
```

---

## 🎨 UI/UX Design Guidelines

### Color Coding
- **User messages**: Primary color (indigo/blue)
- **Bot messages**: Gray/neutral
- **AQI-related responses**: Use AQI category colors
- **Errors**: Red/orange tones

### Animations
- Smooth message appearance (fade in + slide up)
- Typing indicator with animated dots
- Scroll animation when new messages arrive

### Accessibility
- Screen reader support for messages
- Keyboard navigation (Enter to send, Tab to navigate)
- High contrast mode compatibility
- Focus indicators

---

## 🚀 Timeline Summary

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1**: Data Prep | 2-3 days | intents.json, responses.json, entity rules |
| **Phase 2**: Model Training | 3-5 days | Trained intent classifier, entity extractor |
| **Phase 3**: Backend API | 2-3 days | `/chatbot/query` endpoint, service class |
| **Phase 4**: Frontend UI | 2-3 days | Chat interface, message components |
| **Phase 5**: Testing | 2 days | Test reports, bug fixes |
| **Phase 6**: Deployment | 1-2 days | Production-ready chatbot |
| **TOTAL** | **12-18 days** | Fully functional AI chatbot |

---

## 📈 Success Metrics

### Technical Metrics
- ✅ Intent classification accuracy: **85%+**
- ✅ API response time: **< 2 seconds**
- ✅ Successful query handling: **90%+**
- ✅ Fallback rate: **< 15%**

### User Metrics
- ✅ User satisfaction: **4/5 stars**
- ✅ Task completion rate: **80%+**
- ✅ Average conversation length: **3-5 messages**
- ✅ Repeat usage rate: **50%+**

---

## 🔮 Future Enhancements (Post-MVP)

### Phase 2 Features
1. **Voice Input/Output**: Speech-to-text and text-to-speech
2. **Multi-language Support**: Hindi, Kannada, Tamil
3. **Personalization**: Remember user preferences
4. **Proactive Alerts**: "AQI is rising in your area!"
5. **Context Awareness**: Multi-turn conversations
6. **Image Understanding**: Upload photo, identify pollution
7. **Integration with Maps**: Show pollution heatmap
8. **Historical Analysis**: "Show me AQI trends for last month"

### Advanced ML
- Fine-tune GPT-3.5/GPT-4 for better responses
- Implement reinforcement learning from user feedback
- Add sentiment analysis to detect user frustration
- Build knowledge graph of air quality information

---

## 📚 Resources & References

### Datasets
- EPA AQI Guidelines
- WHO Air Quality Standards
- Your historical data (Jan-Nov 2025)

### Libraries & Tools
- **spaCy**: https://spacy.io/
- **scikit-learn**: https://scikit-learn.org/
- **NLTK**: https://www.nltk.org/
- **Hugging Face**: https://huggingface.co/ (if going advanced)

### Tutorials
- Intent Classification with sklearn
- Building Chatbots with spaCy
- React Chat UI Components

---

## 🎯 Next Steps

### Immediate Actions (Week 1)
1. ✅ Review and approve this plan
2. ⏳ Create `data/chatbot/intents.json` with 50 initial Q&A pairs
3. ⏳ Set up `notebooks/08_train_chatbot.ipynb`
4. ⏳ Install spaCy and download language model: `python -m spacy download en_core_web_sm`

### Week 2
5. Train initial intent classifier
6. Build entity extractor
7. Create `/chatbot/query` endpoint

### Week 3
8. Implement frontend chat UI
9. Integration testing
10. User testing and refinement

---

**Let me know if you'd like me to:**
1. Start implementing Phase 1 (create intents.json)
2. Set up the training notebook
3. Build the backend API first
4. Create the frontend UI first
5. Any other specific starting point you prefer!

