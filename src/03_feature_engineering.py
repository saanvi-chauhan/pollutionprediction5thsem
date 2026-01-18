import pandas as pd

# =========================
# LOAD DATA
# =========================
df = pd.read_csv(
    "data/final_dataset.csv",
    parse_dates=["from_date"]
)

# =========================
# AGGREGATE TO HOURLY
# (already hourly, but kept for safety)
# =========================
df = (
    df.groupby(["station_id", "from_date"], as_index=False)
      .mean(numeric_only=True)
)

# =========================
# CREATE FULL HOURLY TIMELINE
# =========================
full_dfs = []

for station, g in df.groupby("station_id"):
    g = g.sort_values("from_date")

    full_index = pd.date_range(
        start=g["from_date"].min(),
        end=g["from_date"].max(),
        freq="h"
    )

    g = (
        g.set_index("from_date")
         .reindex(full_index)
         .reset_index()
         .rename(columns={"index": "from_date"})
    )

    g["station_id"] = station
    full_dfs.append(g)

df = pd.concat(full_dfs, ignore_index=True)

# =========================
# FIX TEMPERATURE COLUMN (if duplicated)
# =========================
if "Temp.1" in df.columns and "Temp" in df.columns:
    df["Temp"] = df["Temp"].fillna(df["Temp.1"])
    df = df.drop(columns=["Temp.1"])

# =========================
# TIME FEATURES
# =========================
df["hour"] = df["from_date"].dt.hour
df["day_of_week"] = df["from_date"].dt.weekday
df["month"] = df["from_date"].dt.month
df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)

df["is_winter"] = df["month"].isin([11, 12, 1, 2]).astype(int)
df["is_early_month"] = (df["from_date"].dt.day <= 10).astype(int)

# =========================
# SORT
# =========================
df = df.sort_values(["station_id", "from_date"])

# =========================
# LAG FEATURES (SAFE NOW)
# =========================
df["PM25_lag_1"] = df.groupby("station_id")["PM2.5"].shift(1)
df["PM25_lag_6"] = df.groupby("station_id")["PM2.5"].shift(6)
df["PM25_lag_24"] = df.groupby("station_id")["PM2.5"].shift(24)

# =========================
# DROP ONLY IF TARGET IS MISSING
# =========================
df = df.dropna(subset=["PM2.5"])

df = df.reset_index(drop=True)

# =========================
# SAVE
# =========================
df.to_csv("data/ml_ready_dataset_new.csv", index=False)

print("✅ DONE")
print("Final shape:", df.shape)
print("Days covered:", df["from_date"].dt.date.nunique())
