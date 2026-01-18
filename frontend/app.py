import streamlit as st
import pandas as pd
import requests
import math
import plotly.express as px
import plotly.graph_objects as go

# =============================
# CONFIG
# =============================
BACKEND_URL = "http://127.0.0.1:8000/predict"
DATA_PATH = "data/live_data.csv"

# =============================
# SAFE VALUE HANDLER (CRITICAL)
# =============================
def safe_value(x):
    if x is None:
        return 0.0
    try:
        x = float(x)
        if math.isnan(x) or math.isinf(x):
            return 0.0
        return x
    except:
        return 0.0

# =============================
# PAGE CONFIG
# =============================
st.set_page_config(
    page_title="Air Quality Prediction Dashboard",
    page_icon="🌍",
    layout="wide"
)

# =============================
# HEADER
# =============================
st.markdown("""
<div style="background: linear-gradient(90deg,#667eea,#764ba2);
            padding:20px;border-radius:15px;text-align:center">
    <h1 style="color:white;">🌍 Air Quality Prediction System</h1>
    <p style="color:white;">
        Real-Time CPCB Data → ML Ensemble → PM2.5 Prediction & AQI
    </p>
</div>
""", unsafe_allow_html=True)

# =============================
# LOAD DATA
# =============================
@st.cache_data(ttl=60)
def load_data():
    df = pd.read_csv(DATA_PATH, parse_dates=["datetime"])
    return df.sort_values("datetime")

df = load_data()
latest = df.iloc[-1]

# =============================
# SIDEBAR
# =============================
with st.sidebar:
    st.markdown("### ⚙️ Dashboard Controls")
    auto_refresh = st.checkbox("🔄 Auto-refresh (simulate live)", True)

    st.markdown("---")
    st.markdown("### 📊 AQI Categories")
    st.markdown("""
    - 🟢 **Good** (0–50)  
    - 🟡 **Satisfactory** (51–100)  
    - 🟠 **Moderate** (101–200)  
    - 🔴 **Poor** (201–300)  
    - 🟣 **Very Poor** (301–400)  
    - ⚫ **Severe** (401–500)
    """)

    st.markdown("---")
    st.markdown("### 📍 Stations")
    st.caption("• Peenya\n• RVCE Mailsandra\n• Silkboard")

# =============================
# LATEST SENSOR DATA
# =============================
st.markdown("## 📡 Latest CPCB Reading")

c1, c2, c3, c4 = st.columns(4)
c1.metric("PM10", f"{safe_value(latest.get('PM10')):.1f} µg/m³")
c2.metric("NO2", f"{safe_value(latest.get('NO2')):.1f} ppb")
c3.metric("CO", f"{safe_value(latest.get('CO')):.2f} mg/m³")
c4.metric("Ozone", f"{safe_value(latest.get('Ozone')):.1f} ppb")

c5, c6, c7, c8 = st.columns(4)
c5.metric("NOx", f"{safe_value(latest.get('NOx')):.1f} ppb")
c6.metric("Humidity", f"{safe_value(latest.get('RH')):.0f}%")
c7.metric("Time", latest["datetime"].strftime("%H:%M"))
c8.metric("Date", latest["datetime"].strftime("%d %b %Y"))

if pd.isna(latest.get("NOx")):
    st.warning("⚠ NOx sensor missing — fallback value used")

# =============================
# PREDICTION PAYLOAD (SAFE)
# =============================
payload = {
    "datetime": str(latest["datetime"]),
    "PM10": safe_value(latest.get("PM10")),
    "NO2": safe_value(latest.get("NO2")),
    "NO": safe_value(latest.get("NO")),
    "NOx": safe_value(latest.get("NOx")),
    "CO": safe_value(latest.get("CO")),
    "Ozone": safe_value(latest.get("Ozone")),
    "RH": safe_value(latest.get("RH")),
    "PM25_lag_1": safe_value(latest.get("PM25_lag_1")),
    "PM25_lag_24": safe_value(latest.get("PM25_lag_24")),
}

# =============================
# PREDICTION BUTTON
# =============================
st.markdown("---")
st.markdown("## 🔮 AI-Powered Prediction")

if st.button("🔮 Predict PM2.5 & AQI"):
    with st.spinner("Running ensemble model..."):
        try:
            response = requests.post(BACKEND_URL, json=payload, timeout=10)
        except requests.exceptions.ConnectionError:
            st.error("❌ Backend not running. Start FastAPI first.")
            st.stop()

    if response.status_code != 200:
        st.error(f"❌ Backend error {response.status_code}")
        st.stop()

    result = response.json()

    # =============================
    # RESULTS
    # =============================
    aqi = result["aqi"]
    pm25 = result["pm25_prediction"]
    category = result["aqi_category"]

    st.markdown("---")
    r1, r2, r3 = st.columns(3)

    r1.metric("Predicted PM2.5", f"{pm25:.2f} µg/m³")
    r2.metric("AQI", aqi)
    r3.metric("Category", category)

    # =============================
    # SHAP EXPLANATION
    # =============================
    st.markdown("## 🧠 Model Explanation (SHAP)")

    exp_cols = st.columns(2)
    for i, explanation in enumerate(result["explanation"]):
     with exp_cols[i % 2]:
        st.markdown(
            f"""
            <div class="explanation-item">
                📌 {explanation}
            </div>
            """,
            unsafe_allow_html=True
        )


# =============================
# HISTORICAL TREND
# =============================
st.markdown("---")
st.markdown("## 📈 Historical Trend")

fig = px.line(
    df,
    x="datetime",
    y=["PM10", "NO2", "CO"],
    labels={"value": "Concentration", "variable": "Pollutant"},
)
st.plotly_chart(fig, use_container_width=True)

# =============================
# FOOTER
# =============================
st.markdown("---")
st.caption("🔬 Random Forest + XGBoost Ensemble | 🧠 SHAP Explainability | 🏛️ CPCB Data")
