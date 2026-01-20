# 🌍 CleanAir AI: Advanced Air Quality Prediction System

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.100+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)

**CleanAir AI** is a state-of-the-art air quality monitoring and prediction platform. It leverages machine learning to provide real-time PM2.5 forecasts, historical analysis, and personalized health advisories for major stations in Bangalore, including Peenya, Silkboard, and RVCE Mailsandra.

---

## 🚀 Key Features

- **Real-time Monitoring**: Live data fetching from **AQICN API** for multiple stations.
- **ML Predictions**: High-accuracy PM2.5 forecasting using an **Ensemble Model** (Random Forest + XGBoost).
- **Explainable AI**: Integrated **SHAP (SHapley Additive exPlanations)** to understand the factors driving pollution levels.
- **Health Advisories**: Dynamic health recommendations based on current and predicted AQI categories.
- **Interactive Dashboard**: Modern, responsive UI built with **Tailwind CSS** and **Recharts**.
- **Historical Analysis**: Visual comparison of pollutant trends across different locations.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **State/Navigation**: React Router DOM, Axios

### Backend
- **Framework**: FastAPI (Python)
- **Machine Learning**: Scikit-learn, XGBoost, Joblib
- **Interpretability**: SHAP
- **Data Handling**: Pandas, NumPy

### Data Automation
- **Scripting**: Python requests for live API fetching.
- **Storage**: CSV-based lightweight data management for real-time updates.

---

## 📂 Project Structure

```text
├── backend/            # FastAPI server & ML models
│   ├── models/         # Pre-trained .pkl models
│   ├── utils/          # Feature engineering & SHAP logic
│   └── app.py          # Main API entry point
├── frontend-react/     # Modern React dashboard
├── data_updater/       # Scripts to fetch live pollution data
├── notebooks/          # Exploratory Data Analysis & Model Training
├── data/               # Datasets for training & testing
└── .env                # API tokens & environment variables
```

---

## ⚡ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (3.9+)

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*Backend will run on `http://localhost:8000`*

### 3. Frontend Setup
```bash
cd frontend-react
npm install
npm run dev
```
*Frontend will run on `http://localhost:5173`*

### 4. Live Data Fetching
To update the dashboard with live data:
```bash
cd data_updater
python fetch.py
```
*(Requires a valid `AQICN_TOKEN` in your `.env` file)*

---

## 🧠 Machine Learning Model
The system uses an ensemble approach combining **Random Forest** and **XGBoost** to predict PM2.5 levels. 
- **Features**: PM10, NO2, NOx, CO, Ozone, Relative Humidity, and lagged PM2.5 values.
- **Explainability**: We use SHAP values to visualize the impact of each pollutant on the final prediction, ensuring transparency in our AI predictions.

---

## 👥 Contributors
- **Saanvi Chauhan** - *Lead Developer*

---

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
