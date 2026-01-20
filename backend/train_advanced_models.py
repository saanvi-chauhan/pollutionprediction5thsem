import os
import pandas as pd
import numpy as np
import pickle
from xgboost import XGBClassifier, XGBRegressor
from sklearn.model_selection import train_test_split

def train_and_save():
    # Load data
    data_path = os.path.join("..", "data", "ml_ready_dataset_clean.csv")
    if not os.path.exists(data_path):
        # Try local path if running from root
        data_path = os.path.join("data", "ml_ready_dataset_clean.csv")
    
    if not os.path.exists(data_path):
        print(f"Error: Dataset not found at {data_path}")
        return

    df = pd.read_csv(data_path)
    df["from_date"] = pd.to_datetime(df["from_date"], errors="coerce", format="mixed", dayfirst=True)
    df = df.dropna(subset=["from_date"]).sort_values("from_date")

    # Target 1: Classification (High Pollution Event)
    threshold = df["PM2.5"].quantile(0.90)
    df["is_high_pollution"] = (df["PM2.5"] >= threshold).astype(int)

    # Target 2: Forecasting (6-Hour Horizon)
    HORIZON = 6
    df["PM2.5_future"] = df["PM2.5"].shift(-HORIZON)
    clean_df = df.dropna(subset=["PM2.5_future"])

    # Feature Selection
    features = [
        "PM2.5", "PM10", "NOx", "NH3", "SO2", "CO", "Ozone", "Benzene", "Toluene",
        "RH", "month", "hour", "is_winter", "is_weekend",
        "PM25_lag_1", "PM25_lag_6", "PM25_lag_24"
    ]

    X = clean_df[features]
    y_cls = clean_df["is_high_pollution"]
    y_reg = clean_df["PM2.5_future"]

    split_idx = int(len(clean_df) * 0.8)
    X_train = X.iloc[:split_idx]
    y_cls_train = y_cls.iloc[:split_idx]
    y_reg_train = y_reg.iloc[:split_idx]

    # Optimized Params (from notebook)
    cls_params = {'n_estimators': 163, 'max_depth': 3, 'learning_rate': 0.11794621670562552, 'subsample': 0.6059285643775195, 'scale_pos_weight': 8.503378435981661}
    reg_params = {'n_estimators': 135, 'max_depth': 4, 'learning_rate': 0.03779338673345643, 'subsample': 0.7675052611524197}

    print("Training models...")
    cls_model = XGBClassifier(**cls_params, random_state=42)
    cls_model.fit(X_train, y_cls_train)

    reg_model = XGBRegressor(**reg_params, random_state=42)
    reg_model.fit(X_train, y_reg_train)

    # Save models
    models_dir = os.path.join("backend", "models")
    os.makedirs(models_dir, exist_ok=True)
    
    with open(os.path.join(models_dir, "pollution_model.pkl"), "wb") as f:
        pickle.dump(cls_model, f)
    
    with open(os.path.join(models_dir, "pm25_forecast_model.pkl"), "wb") as f:
        pickle.dump(reg_model, f)
    
    with open(os.path.join(models_dir, "feature_order_advanced.pkl"), "wb") as f:
        pickle.dump(features, f)

    print(f"Models saved to {models_dir}")

if __name__ == "__main__":
    train_and_save()
