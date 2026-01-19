import pandas as pd

# -----------------------------
# STEP 3: Load dataset
# -----------------------------
df = pd.read_csv("data/ml_ready_with_peak_flag.csv")

print("Dataset loaded")
print("Total rows:", len(df))

# -----------------------------
# STEP 4: Monthly overall average
# -----------------------------
monthly_overall = (
    df.groupby("month")["PM2.5"]
    .mean()
    .reset_index()
    .rename(columns={"PM2.5": "overall_pm25"})
)

# -----------------------------
# STEP 5: Monthly peak-hour average
# -----------------------------
monthly_peak = (
    df[df["is_peak_hour"] == 1]
    .groupby("month")["PM2.5"]
    .mean()
    .reset_index()
    .rename(columns={"PM2.5": "peak_pm25"})
)

# -----------------------------
# STEP 6: Monthly non-peak average
# -----------------------------
monthly_non_peak = (
    df[df["is_peak_hour"] == 0]
    .groupby("month")["PM2.5"]
    .mean()
    .reset_index()
    .rename(columns={"PM2.5": "non_peak_pm25"})
)

# -----------------------------
# STEP 7: Merge all results
# -----------------------------
monthly_analysis = (
    monthly_overall
    .merge(monthly_peak, on="month", how="left")
    .merge(monthly_non_peak, on="month", how="left")
)

print("\nMonthly Analysis Preview:")
print(monthly_analysis.head())

# -----------------------------
# STEP 8: Save for dashboard
# -----------------------------
monthly_analysis.to_csv(
    "data/monthly_peak_vs_nonpeak_analysis.csv",
    index=False
)

print("\n✅ Step 3 completed: Monthly analysis saved")
