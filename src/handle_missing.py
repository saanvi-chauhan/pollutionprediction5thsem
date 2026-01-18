import pandas as pd

# =========================
# LOAD DATA
# =========================
df = pd.read_csv(
    "data/ml_ready_dataset_new.csv",
    parse_dates=["from_date"]
)

print("Initial shape:", df.shape)

# =========================
# 1. DROP VERY SPARSE COLUMNS
# =========================
missing_ratio = df.isna().mean()
drop_cols = missing_ratio[missing_ratio > 0.5].index.tolist()

df = df.drop(columns=drop_cols)
print("Dropped sparse columns:", drop_cols)

# =========================
# DROP COLUMNS MISSING FOR ANY STATION
# =========================
station_missing = (
    df.groupby("station_id", group_keys=False)
      .apply(lambda x: x.isna().all())
)

# Columns that are all-NaN in at least one station
drop_station_cols = station_missing.any()
drop_station_cols = drop_station_cols[drop_station_cols].index.tolist()

df = df.drop(columns=drop_station_cols)

print("Dropped station-incomplete columns:", drop_station_cols)


# =========================
# 2. SORT (CRITICAL FOR TIME METHODS)
# =========================
df = df.sort_values(["station_id", "from_date"]).reset_index(drop=True)

# =========================
# 3. LAG FEATURES — FILL BOTH SIDES
# =========================
lag_cols = ["PM25_lag_1", "PM25_lag_6", "PM25_lag_24"]
lag_cols = [c for c in lag_cols if c in df.columns]

for col in lag_cols:
    df[col] = (
        df.groupby("station_id")[col]
          .transform(lambda x: x.ffill().bfill())
    )

# =========================
# 4. WEATHER VARIABLES — INTERPOLATE + FILL EDGES
# =========================
weather_cols = ["Temp", "RH", "SR"]

for col in weather_cols:
    if col in df.columns:
        df[col] = (
            df.groupby("station_id")[col]
              .transform(lambda x: x.interpolate().ffill().bfill())
        )

# =========================
# 5. POLLUTANTS — STATION-WISE MEDIAN
# =========================
pollutant_cols = [
    "PM10", "NO", "NO2", "NOx",
    "NH3", "SO2", "CO", "Ozone",
    "MP-Xylene", "O-Xylene"
]

for col in pollutant_cols:
    if col in df.columns:
        df[col] = (
            df.groupby("station_id")[col]
              .transform(lambda x: x.fillna(x.median()))
        )

# =========================
# 6. EVENT FLAGS → FILL WITH 0
# =========================
event_cols = ["is_festival", "is_secondary_event", "is_local_event"]

for col in event_cols:
    if col in df.columns:
        df[col] = df[col].fillna(0).astype(int)

# =========================
# FINAL STEP: DROP UNAVOIDABLE NaN ROWS (LAG EDGES)
# =========================
before = len(df)
df = df.dropna()
after = len(df)

print(f"Dropped {before - after} rows due to unavoidable lag NaNs")


# =========================
# 7. FINAL SAFETY CHECK
# =========================
remaining_nulls = df.isna().sum().sum()
print("Remaining missing values:", remaining_nulls)



# =========================
# 8. SAVE CLEAN DATASET
# =========================
df.to_csv("data/ml_ready_dataset_clean.csv", index=False)

print("✅ Missing values handled successfully")
print("Final shape:", df.shape)
