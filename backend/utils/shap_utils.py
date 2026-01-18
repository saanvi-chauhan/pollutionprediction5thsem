import shap
import pandas as pd

class RFShapExplainer:
    def __init__(self, model, background_data):
        self.explainer = shap.TreeExplainer(model, background_data)

    def explain(self, X):
        shap_values = self.explainer.shap_values(X)

        shap_df = pd.DataFrame({
            "feature": X.columns,
            "shap_value": shap_values[0]
        }).sort_values(by="shap_value", ascending=False)

        reasons = []
        for _, row in shap_df.head(5).iterrows():
            if row["shap_value"] > 0:
                reasons.append(f"{row['feature']} increased PM2.5")
            else:
                reasons.append(f"{row['feature']} reduced PM2.5")

        return reasons
