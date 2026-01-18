import pandas as pd

def prepare_features(input_data: dict, feature_columns: list):
    """
    Converts partial API input into FULL model-ready feature vector
    """

    # 1️⃣ Convert incoming JSON to DataFrame
    df = pd.DataFrame([input_data])

    # 2️⃣ Handle datetime
    df["datetime"] = pd.to_datetime(df["datetime"])

    df["hour"] = df["datetime"].dt.hour
    df["day_of_week"] = df["datetime"].dt.weekday
    df["month"] = df["datetime"].dt.month
    df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)

    df = df.drop(columns=["datetime"])

    # 3️⃣ Add missing LAG features (LIVE DATA CANNOT HAVE THESE)
    for lag_col in ["PM25_lag_1", "PM25_lag_6", "PM25_lag_24"]:
        if lag_col not in df.columns:
            df[lag_col] = 0.0

    # 4️⃣ Add ALL missing training features
    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0.0

    # 5️⃣ Ensure correct column order
    df = df[feature_columns]

    return df
