import pandas as pd

# -----------------------------
# STEP 2: Load dataset with peak flag
# -----------------------------
df = pd.read_csv("data/ml_ready_with_peak_flag.csv")

print("Dataset loaded")
print("Total rows:", len(df))

# -----------------------------
# STEP 3: Compute peak vs non-peak averages
# -----------------------------
peak_avg = df[df["is_peak_hour"] == 1]["PM2.5"].mean()
non_peak_avg = df[df["is_peak_hour"] == 0]["PM2.5"].mean()

print("\n--- Peak vs Non-Peak PM2.5 ---")
print(f"Peak Hour Avg PM2.5     : {peak_avg:.2f}")
print(f"Non-Peak Hour Avg PM2.5 : {non_peak_avg:.2f}")

# -----------------------------
# STEP 4: Percentage difference
# -----------------------------
percentage_increase = ((peak_avg - non_peak_avg) / non_peak_avg) * 100

print(
    f"\nPM2.5 increases by {percentage_increase:.2f}% during peak hours"
)

# -----------------------------
# STEP 5: Save summary for dashboard
# -----------------------------
summary_df = pd.DataFrame({
    "metric": ["peak_avg_pm25", "non_peak_avg_pm25", "percentage_increase"],
    "value": [peak_avg, non_peak_avg, percentage_increase]
})

summary_df.to_csv("data/peak_vs_nonpeak_summary.csv", index=False)

print("\n✅ Step 2 completed: Peak vs Non-Peak analysis saved")
