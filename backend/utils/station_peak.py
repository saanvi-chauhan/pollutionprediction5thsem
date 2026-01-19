import pandas as pd

# -----------------------------
# STEP 4: Load dataset
# -----------------------------
df = pd.read_csv("data/ml_ready_with_peak_flag.csv")

print("Dataset loaded")
print("Total rows:", len(df))

# -----------------------------
# STEP 5: Station-wise peak vs non-peak averages
# -----------------------------
station_analysis = (
    df.groupby(["station_id", "is_peak_hour"])["PM2.5"]
    .mean()
    .reset_index()
)

# Rename for clarity
station_analysis["hour_type"] = station_analysis["is_peak_hour"].map(
    {1: "Peak", 0: "Non-Peak"}
)

station_analysis = station_analysis.drop(columns=["is_peak_hour"])

print("\nStation-wise Peak vs Non-Peak PM2.5:")
print(station_analysis.head())

# -----------------------------
# STEP 6: Pivot for dashboard-friendly format
# -----------------------------
station_pivot = station_analysis.pivot(
    index="station_id",
    columns="hour_type",
    values="PM2.5"
).reset_index()

# -----------------------------
# STEP 7: Calculate percentage increase
# -----------------------------
station_pivot["percentage_increase"] = (
    (station_pivot["Peak"] - station_pivot["Non-Peak"])
    / station_pivot["Non-Peak"]
) * 100

print("\nStation-wise Summary:")
print(station_pivot)

# -----------------------------
# STEP 8: Save for dashboard
# -----------------------------
station_pivot.to_csv(
    "data/stationwise_peak_vs_nonpeak_pm25.csv",
    index=False
)

print("\n✅ Step 4 completed: Station-wise analysis saved")
