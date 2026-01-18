from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

from utils.feature_engineering import prepare_features
from utils.shap_utils import RFShapExplainer
from utils.aqi_utils import calculate_aqi_pm25, aqi_category

# ========================
# LOAD MODELS
# ========================

rf_model = joblib.load("models/pm25_rf_model.pkl")
xgb_model = joblib.load("models/pm25_xgb_model.pkl")
ensemble_cfg = joblib.load("models/ensemble_config.pkl")
feature_columns = joblib.load("models/feature_columns.pkl")

w_rf = ensemble_cfg["weights"]["random_forest"]
w_xgb = ensemble_cfg["weights"]["xgboost"]

# Background data for SHAP
background_df = pd.read_csv(
    "../data/ml_ready_dataset_clean.csv"
).drop(columns=["from_date", "station_id", "PM2.5"]).sample(100)

shap_explainer = RFShapExplainer(rf_model, background_df)

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
