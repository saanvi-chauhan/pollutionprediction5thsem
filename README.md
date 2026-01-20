# 🌍 AI-Powered Air Quality Prediction & Analysis

An advanced full-stack application for monitoring, predicting, and analyzing air quality (PM2.5) in Bengaluru. This system leverages **Machine Learning (XGBoost, Random Forest)**, **SHAP Explainability**, and **Generative AI (Gemini 1.5 Flash)** to provide real-time insights and actionable health advice.

![Project Banner](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Backend-FastAPI-blue?logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)
![AI](https://img.shields.io/badge/AI-Gemini%20Flash-orange?logo=google)

## ✨ Key Features

### 1. 📊 Interactive Dashboard
- **Real-time Monitoring**: Live AQI, PM2.5, PM10, NO2, and other pollutant levels for **Peenya**, **Silkboard**, and **RVCE**.
- **Visualizations**: Dynamic charts showing historical trends and pollutant breakdown.
- **Smart Alerts**: Color-coded cards indicating air quality status (Good, Moderate, Severe).

### 2. 🔮 Advanced Prediction System
- **Hybrid Ensemble Model**: Combines **Random Forest** and **XGBoost** for high-accuracy PM2.5 forecasting.
- **Explainable AI (XAI)**: Uses **SHAP (SHapley Additive exPlanations)** to show *why* a prediction was made (e.g., "High humidity increased prediction by 12%").
- **Future Forecasting**: Predicts PM2.5 levels for the next 6 hours.

### 3. 🤖 AI Chatbot Assistant
- **Natural Language Query**: Ask questions like "Is it safe to go for a run?" or "What is PM2.5?".
- **Hybrid Intelligence**:
  - **Local Intent Classifier**: Instantly answers common queries using Logistic Regression & TF-IDF.
  - **Generative Fallback (Gemini)**: Handles complex/unseen questions using Google's **Gemini 1.5 Flash** LLM.
- **Context-Aware**: Understands which station you are interested in.

### 4. 📉 Station Comparison
- Compare pollution metrics across different locations side-by-side to find the cleanest area.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **ML Libraries**: Scikit-learn, XGBoost, SHAP, Joblib
- **Generative AI**: Google Generative AI SDK (`google-generativeai`)
- **Data Processing**: Pandas, NumPy

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

---

## � Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js & npm
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/saanvi-chauhan/pollutionprediction5thsem.git
cd pollutionprediction5thsem
git checkout final
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configuration**:
Create a `.env` file in the `backend` or root directory:
```env
GEMINI_API_KEY=your_google_api_key_here
```

**Run Server**:
```bash
python app.py
# Server runs on http://127.0.0.1:8000
```

### 3. Frontend Setup
```bash
cd frontend-react

# Install dependencies
npm install

# Run Development Server
npm run dev
# App runs on http://localhost:5173
```

---

## 🧠 Model Details

- **Random Forest**: Captures non-linear complex interactions between pollutants.
- **XGBoost**: Gradient boosting framework for high performance and regularization.
- **Ensemble**: Weighted average of RF and XGBoost predictions for superior stability.
- **Chatbot (Intent)**: TF-IDF vectorizer + Logistic Regression trained on custom `intents.json`.

---

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## � License
Distributed under the MIT License. See `LICENSE` for more information.

---
**Maintained by:** [Saanvi Chauhan](https://github.com/saanvi-chauhan)
