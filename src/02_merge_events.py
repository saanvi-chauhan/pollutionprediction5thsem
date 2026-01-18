import pandas as pd

# =========================
# LOAD DATA
# =========================

# Load cleaned air quality data
df = pd.read_csv(
    "data/processed_data.csv",
    parse_dates=["from_date"]
)

# Load events calendar
events = pd.read_excel("data/events/events_calendar.xlsx")

print("✅ Data loaded successfully")

# =========================
# PREPARE EVENTS DATA
# =========================

events["Date"] = pd.to_datetime(events["Date"], dayfirst=True, errors="coerce")

# Keep only 2025 events
events = events[events["Date"].dt.year == 2025]

# Create event flags
events["is_festival"] = (events["Event Type"] == "Festival").astype(int)
events["is_secondary_event"] = (events["Event Type"] == "Secondary").astype(int)
events["is_local_event"] = (events["Event Type"] == "Local Cultural").astype(int)

# Keep required columns
events = events[[
    "Date", "is_festival", "is_secondary_event", "is_local_event"
]]

# =========================
# MERGE EVENTS WITH AIR QUALITY DATA
# =========================

# Create date columns for merge
df["date"] = df["from_date"].dt.date
events["date"] = events["Date"].dt.date

# Merge (left join keeps all pollution data)
df = df.merge(
    events.drop(columns=["Date"]),
    on="date",
    how="left"
)

# Fill missing event flags with 0
event_cols = ["is_festival", "is_secondary_event", "is_local_event"]
df[event_cols] = df[event_cols].fillna(0).astype(int)

# Drop helper column
df = df.drop(columns=["date"])

# =========================
# SAVE FINAL DATASET
# =========================

df.to_csv("data/final_dataset.csv", index=False)

print("✅ Events merged successfully")
print("📊 Event counts:")
print(df[event_cols].sum())
