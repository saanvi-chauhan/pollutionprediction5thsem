from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

from utils.feature_engineering import prepare_features
from utils.shap_utils import RFShapExplainer
from utils.aqi_utils import calculate_aqi_pm25, aqi_category
from utils.chatbot_service import AirQualityChatbot
import os
import google.generativeai as genai
from dotenv import load_dotenv

# ========================
# PATHS & ENV
# ========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Look for .env in current dir then parent dir
dotenv_path = os.path.join(BASE_DIR, ".env")
if not os.path.exists(dotenv_path):
    dotenv_path = os.path.join(BASE_DIR, "..", ".env")
load_dotenv(dotenv_path)

MODELS_DIR = os.path.join(BASE_DIR, "models")
def get_model_path(filename):
    return os.path.join(MODELS_DIR, filename)

# ========================
# LOAD MODELS
# ========================

rf_model = joblib.load(get_model_path("pm25_rf_model.pkl"))
xgb_model = joblib.load(get_model_path("pm25_xgb_model.pkl"))
ensemble_cfg = joblib.load(get_model_path("ensemble_config.pkl"))
feature_columns = joblib.load(get_model_path("feature_columns.pkl"))

# Advanced Models
pollution_model = joblib.load(get_model_path("pollution_model.pkl"))
forecast_model = joblib.load(get_model_path("pm25_forecast_model.pkl"))
feature_columns_advanced = joblib.load(get_model_path("feature_order_advanced.pkl")) if os.path.exists(get_model_path("feature_order_advanced.pkl")) else feature_columns

w_rf = ensemble_cfg["weights"]["random_forest"]
w_xgb = ensemble_cfg["weights"]["xgboost"]

# AI Reasoning Configuration (Gemini)
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("CRITICAL: GEMINI_API_KEY not found in environment!")
else:
    pass

genai.configure(api_key=api_key)
# Explicitly use Gemini 2.5 Flash
gemini_model = genai.GenerativeModel('models/gemini-flash-latest')

# Background data for SHAP
background_df = pd.read_csv(
    os.path.join(BASE_DIR, "../data/ml_ready_dataset_clean.csv")
).drop(columns=["from_date", "station_id", "PM2.5"]).sample(100)

shap_explainer = RFShapExplainer(rf_model, background_df)

# Initialize Chatbot
chatbot = AirQualityChatbot()

# ========================
# FASTAPI APP
# ========================

app = FastAPI(title="PM2.5 Prediction API")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========================
# ROOT ENDPOINT
# ========================
@app.get("/")
def home():
    return {"message": "PM2.5 Ensemble Prediction API is running"}


# ========================
# LIVE DATA ENDPOINT
# ========================
@app.get("/latest")
def get_latest(station_id: str = None):
    try:
        # Path relative to backend/ directory
        csv_path = "../frontend/data/live_data.csv"
        df = pd.read_csv(csv_path, parse_dates=["datetime"])
        
        if df.empty:
            return {"error": "No data available"}
        
        # Filter by station if provided
        if station_id:
            # Map frontend station names to CSV station names if needed
            # CSV has: Peenya, Silkboard, RVCE_Mailsandra
            filtered = df[df["station_id"] == station_id]
            if not filtered.empty:
                latest = filtered.sort_values("datetime").iloc[-1]
            else:
                return {"error": f"No data for station {station_id}"}
        else:
            latest = df.sort_values("datetime").iloc[-1]

        return {
            "datetime": str(latest["datetime"]),
            "PM10": float(latest["PM10"]),
            "NO2": float(latest["NO2"]),
            "NOx": float(latest["NOx"]) if pd.notna(latest.get("NOx")) else 0.0,
            "CO": float(latest["CO"]),
            "Ozone": float(latest["Ozone"]) if pd.notna(latest.get("Ozone")) else 0.0,
            "RH": float(latest["RH"]) if pd.notna(latest.get("RH")) else 0.0,
            "station_id": latest.get("station_id", "Unknown"),
            "PM25_lag_1": float(latest["PM2.5"]) if pd.notna(latest.get("PM2.5")) else 0.0,
            # For lag_24 we might need more logic or just approximate with current/lag_1
            "PM25_lag_24": float(latest["PM2.5"]) if pd.notna(latest.get("PM2.5")) else 0.0
        }
    except Exception as e:
        return {"error": str(e)}






# ========================
# COMPARISON ENDPOINT
# ========================
@app.get("/comparison")
def compare_stations():
    try:
        csv_path = "../frontend/data/live_data.csv"
        df = pd.read_csv(csv_path, parse_dates=["datetime"])
        
        if df.empty:
            return {"error": "No data available"}

        stations = df["station_id"].dropna().unique()
        results = []
        
        for station in stations:
            latest = df[df["station_id"] == station].sort_values("datetime").iloc[-1]
            
            # Prepare input for prediction
            input_data = {
                "datetime": str(latest["datetime"]),
                "PM10": float(latest["PM10"]),
                "NO2": float(latest["NO2"]),
                "NO": 0.0, # Default if missing
                "NOx": float(latest["NOx"]) if pd.notna(latest.get("NOx")) else 0.0,
                "CO": float(latest["CO"]),
                "Ozone": float(latest["Ozone"]) if pd.notna(latest.get("Ozone")) else 0.0,
                "RH": float(latest["RH"]) if pd.notna(latest.get("RH")) else 0.0,
                "PM25_lag_1": float(latest["PM2.5"]) if pd.notna(latest.get("PM2.5")) else 0.0,
                "PM25_lag_24": float(latest["PM2.5"]) if pd.notna(latest.get("PM2.5")) else 0.0,
            }
            
            # Predict
            X = prepare_features(input_data, feature_columns)
            pm25_rf = rf_model.predict(X)[0]
            pm25_xgb = xgb_model.predict(X)[0]
            pm25_final = w_rf * pm25_rf + w_xgb * pm25_xgb
            
            aqi = calculate_aqi_pm25(pm25_final)
            
            results.append({
                "name": station,
                "PM10": float(latest["PM10"]),
                "PM25": round(float(pm25_final), 2),
                "NO2": float(latest["NO2"]),
                "CO": float(latest["CO"]),
                "AQI": int(aqi)
            })
            
        return results
        
    except Exception as e:
        return {"error": str(e)}


@app.post("/predict")
def predict(data: dict):

    X = prepare_features(data, feature_columns)

    pm25_rf = rf_model.predict(X)[0]
    pm25_xgb = xgb_model.predict(X)[0]

    pm25_final = w_rf * pm25_rf + w_xgb * pm25_xgb

    aqi = calculate_aqi_pm25(pm25_final)
    category = aqi_category(aqi)

    explanation = shap_explainer.explain(X)

    return {
        "pm25_prediction": round(float(pm25_final), 2),
        "aqi": int(aqi),
        "aqi_category": category,
        "explanation": explanation
    }


# ========================
# ADVANCED PREDICTION & ANALYSIS
# ========================

@app.post("/predict_advanced")
def predict_advanced(data: dict):
    """
    Combined endpoint for current ensemble prediction and future 6h forecast.
    """
    # 1. Current Ensemble Prediction
    X_current = prepare_features(data, feature_columns)
    pm25_rf = rf_model.predict(X_current)[0]
    pm25_xgb = xgb_model.predict(X_current)[0]
    pm25_current = w_rf * pm25_rf + w_xgb * pm25_xgb
    
    aqi_current = calculate_aqi_pm25(pm25_current)
    category_current = aqi_category(aqi_current)
    explanation = shap_explainer.explain(X_current)

    # 2. Future 6h Forecast (Advanced Tuned Models)
    # We might need to adjust features for the advanced model
    # For now, we assume features are compatible or mapped
    input_dict = data.copy()
    if "PM2.5" not in input_dict and "PM25_lag_1" in input_dict:
        input_dict["PM2.5"] = input_dict["PM25_lag_1"]
    
    # Simple mapping for common fields
    mapping = {
        "is_winter": lambda d: 1 if d.get("month", 1) in [11, 12, 1, 2] else 0,
        "is_weekend": lambda d: 0, # Default or calculate from date
        "PM25_lag_6": lambda d: d.get("PM10", 0) * 0.6, # Heuristic fallback
    }
    
    for key, func in mapping.items():
        if key not in input_dict:
            input_dict[key] = func(input_dict)

    # Ensure all features for advanced model exist
    advanced_features = [
        "PM2.5", "PM10", "NOx", "NH3", "SO2", "CO", "Ozone", "Benzene", "Toluene",
        "RH", "month", "hour", "is_winter", "is_weekend",
        "PM25_lag_1", "PM25_lag_6", "PM25_lag_24"
    ]
    
    X_adv_data = {}
    for col in advanced_features:
        X_adv_data[col] = float(input_dict.get(col, 0))
    
    X_adv_df = pd.DataFrame([X_adv_data])
    
    is_high_pollution = int(pollution_model.predict(X_adv_df)[0])
    pm25_future = float(forecast_model.predict(X_adv_df)[0])

    return {
        "current": {
            "pm25": round(float(pm25_current), 2),
            "aqi": int(aqi_current),
            "category": category_current,
            "explanation": explanation
        },
        "forecast": {
            "pm25_6h": round(pm25_future, 2),
            "is_high_pollution": is_high_pollution,
            "status": "Hazardous" if is_high_pollution == 1 else "Safe"
        }
    }

@app.post("/analyze")
def analyze(data: dict):
    """
    Generate AI reasoning for predictions.
    """
    # Extract context
    pm25_current = data.get("pm25_current", 0)
    pm25_future = data.get("pm25_future", 0)
    is_high_pollution = data.get("is_high_pollution", 0)
    humidity = data.get("humidity", 0)
    month = data.get("month", 1)
    hour = data.get("hour", 0)
    lag_24 = data.get("lag_24", 0)

    condition_desc = (
        f"Current PM2.5 is {pm25_current:.1f} ug/m3. "
        f"24 hours ago it was {lag_24:.1f}. "
        f"Current humidity is {humidity:.1f}%. "
        f"It is month {int(month)} at hour {int(hour)}."
    )
    
    event_status = "HIGH POLLUTION EVENT" if is_high_pollution == 1 else "Normal Air Quality"
    reg_status = f"{pm25_future:.1f} ug/m3"
    
    prompt = f"""
    You are an AI Expert & Environmental Scientist. Provide a 2-part analysis:

    PART 1: PREDICTION REASONING (The "Physics")
    - Analyze the Current Scenario: {condition_desc}
    - Explain WHY the model predicts "{event_status}" and "{reg_status}" (in 6 hours).
    - Focus on environmental factors: lag effects (24h history), time of day, season, and proper weather physics.

    PART 2: MODEL SUPERIORITY (The "Data Science")
    - Compare RMSE Scores: XGBoost (15.94) vs Random Forest (16.22) vs Decision Tree (18.02).
    - Explain WHY XGBoost outperformed the others here. Mention Gradient Boosting's ability to reduce bias/variance and handle non-linear patterns better than simple averaging (RF) or single trees (DT).

    Keep it professional, insightful, and structured. Use Markdown.
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        return {"reasoning": response.text}
    except Exception as e:
        error_msg = str(e)
        return {"error": error_msg, "reasoning": f"Gemini Analysis failed. Error: {error_msg}. Please check your API key and connection."}

@app.post("/chatbot/query")
def chatbot_query(query: str = "", station_id: str = None):
    """
    Handle chatbot queries using trained intent classifier.
    """
    if not query:
        return {"error": "Query is required"}
    
    return chatbot.process_query(query, station_id=station_id)

if __name__ == "__main__":
    import uvicorn
    # Using port 8000 to match your terminal command
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
