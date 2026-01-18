import pandas as pd

INPUT_FILE = r"C:\5th sem\main el\data\combined_air_quality_2025.xlsx"
OUTPUT_FILE = r"C:\5th sem\main el\data\processed_data.csv"

# 1. Read raw file to detect header row
raw = pd.read_excel(INPUT_FILE, header=None)

# 2. Find the row where actual table starts
header_row = raw[raw.iloc[:, 0] == "From Date"].index[0]

# 3. Read again using the correct header
df = pd.read_excel(INPUT_FILE, header=header_row)

# 4. Drop completely empty columns
df = df.dropna(axis=1, how="all")

# 5. Clean column names
df.columns = df.columns.astype(str).str.strip()

# 6. Rename date columns
df = df.rename(columns={
    "From Date": "from_date",
    "To Date": "to_date"
})

# 7. FIX: Rename station column if wrongly named (e.g., "Peenya")
if "Peenya" in df.columns:
    df = df.rename(columns={"Peenya": "station_id"})

# (Safety) If station_id still doesn't exist, raise alert
if "station_id" not in df.columns:
    raise ValueError("❌ station_id column not found after preprocessing")

# 8. Parse datetime safely
df["from_date"] = pd.to_datetime(df["from_date"], errors="coerce", dayfirst=True)
df["to_date"] = pd.to_datetime(df["to_date"], errors="coerce", dayfirst=True)

# 9. Drop rows where datetime parsing failed
df = df.dropna(subset=["from_date"])

# 10. Add month info
df["month"] = df["from_date"].dt.month
df["month_name"] = df["from_date"].dt.month_name()

# 11. Sort month-wise and time-wise
df = df.sort_values(by=["month", "from_date"]).reset_index(drop=True)

# 12. (Optional but clean) Move station_id to front
cols = ["from_date", "to_date", "station_id"] + \
       [c for c in df.columns if c not in ["from_date", "to_date", "station_id"]]
df = df[cols]

# 13. Save final CSV
df.to_csv(OUTPUT_FILE, index=False)

print("✅ FINAL CSV READY")
print("📊 Total rows:", len(df))
print("📅 Date range:", df["from_date"].min(), "→", df["from_date"].max())
print("📍 Stations:\n", df["station_id"].value_counts())
