import os
import requests
import pandas as pd
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# =========================
# LOAD ENVIRONMENT VARIABLES
# =========================
load_dotenv(Path(__file__).parent.parent / ".env")

# =========================
# AQICN API TOKEN
# =========================
TOKEN = os.getenv("AQICN_TOKEN")

# =========================
# TARGET LOCATIONS
# =========================
LOCATIONS = {
    "RVCE_Mailsandra": (12.9338, 77.5263),
    "Peenya": (13.0205, 77.5360),
    "Silkboard": (12.9279, 77.6240),
}

# =========================
# OUTPUT CSV
# =========================
OUTPUT_PATH = Path("../frontend/data/live_data.csv")


def fetch_aqi(lat, lon):
    url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={TOKEN}"
    res = requests.get(url)

    if res.status_code != 200:
        return None

    data = res.json()
    if data.get("status") != "ok":
        return None

    info = data["data"]
    iaqi = info.get("iaqi", {})

    return {
        "PM2.5": iaqi.get("pm25", {}).get("v"),
        "PM10": iaqi.get("pm10", {}).get("v"),
        "NO2": iaqi.get("no2", {}).get("v"),
        "CO": iaqi.get("co", {}).get("v"),
        "Ozone": iaqi.get("o3", {}).get("v"),
        "RH": iaqi.get("h", {}).get("v", 60)  # fallback
    }


# =========================
# MAIN EXECUTION
# =========================
if __name__ == "__main__":
    rows = []

    for station, (lat, lon) in LOCATIONS.items():
        aqi_info = fetch_aqi(lat, lon)

        if not aqi_info:
            print(f"❌ Failed to fetch data for {station}")
            continue

        row = {
            "datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "station_id": station,
            **aqi_info
        }

        rows.append(row)

        print(f"✅ {station} updated → PM2.5 = {row['PM2.5']}")

    if not rows:
        print("⚠️ No data fetched")
        exit()

    df_new = pd.DataFrame(rows)

    if OUTPUT_PATH.exists():
        df_old = pd.read_csv(OUTPUT_PATH)
        df_final = pd.concat([df_old, df_new], ignore_index=True)
    else:
        df_final = df_new

    df_final.to_csv(OUTPUT_PATH, index=False)
    print("📁 live_data.csv updated successfully")
