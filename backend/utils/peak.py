import pandas as pd

# -----------------------------
# STEP 1: Load dataset
# -----------------------------
df = pd.read_csv("./data/ml_ready_dataset_new.csv")

print("Dataset loaded successfully")
print("Total rows:", len(df))

# -----------------------------
# STEP 2: Convert & sort time
# -----------------------------
df["from_date"] = pd.to_datetime(df["from_date"], dayfirst=True)
df = df.sort_values("from_date").reset_index(drop=True)

print("Data sorted by time")

# -----------------------------
# STEP 3: Define peak hours
# Peak hours: 8–11 AM, 5–9 PM
# -----------------------------
def is_peak_hour(hour):
    return 1 if (8 <= hour <= 11) or (17 <= hour <= 21) else 0

df["is_peak_hour"] = df["hour"].apply(is_peak_hour)

# -----------------------------
# STEP 4: Sanity check
# -----------------------------
print(df[["hour", "is_peak_hour"]].head(15))

# -----------------------------
# STEP 5: Save updated dataset
# -----------------------------
df.to_csv("data/ml_ready_with_peak_flag.csv", index=False)

print("✅ Step 1 completed: Peak hour flag added")
