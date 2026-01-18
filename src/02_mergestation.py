import pandas as pd
import os
import glob

# Base data directory
BASE_DIR = r"C:\5th sem\main el\data"

stations = {
    "Peenya": "Peenya",
    "RVCE_Mailsandra": "RVCE_Mailsandra",
    "Silkboard": "Silkboard"
}

all_data = []

for station_id, folder_name in stations.items():
    folder_path = os.path.join(BASE_DIR, folder_name)
    
    # Read all Excel files for that station
    files = glob.glob(os.path.join(folder_path, "*.xlsx"))
    
    for file in files:
        df = pd.read_excel(file)
        
        # Add station_id column
        df["station_id"] = station_id
        
        all_data.append(df)

# Combine ALL stations + ALL months (row-wise)
combined_df = pd.concat(all_data, ignore_index=True, sort=True)

# Save final dataset
output_path = os.path.join(BASE_DIR, "combined_air_quality_2025.xlsx")
combined_df.to_excel(output_path, index=False)

print("✅ Combined dataset created successfully!")
print("📁 Saved at:", output_path)
print("📊 Shape:", combined_df.shape)
