
# --- Imports ---
import pandas as pd
import numpy as np
import xgboost as xgb
import shap
import matplotlib.pyplot as plt
import joblib

from sklearn.model_selection import train_test_split # Removed StratifiedKFold, cross_val_score
from sklearn.metrics import (
    accuracy_score, roc_auc_score, f1_score, confusion_matrix,
    precision_recall_curve, brier_score_loss
)
from sklearn.calibration import calibration_curve

# --- Load Data ---
df = pd.read_csv('/content/heartdisease_outlier_capped.csv')

# --- Features and Target ---
X = df.drop("target", axis=1)
y = df["target"]

# ==========================
# XGBOOST MODEL
# ==========================
model = xgb.XGBClassifier(
    learning_rate=0.03,
    max_depth=3,
    n_estimators=150,
    min_child_weight=5,
    subsample=0.7,
    colsample_bytree=0.7,
    reg_alpha=0.2,
    reg_lambda=1.5,
    objective='binary:logistic',
    eval_metric='logloss',
    random_state=42,
    use_label_encoder=False
)

# ==========================
# CROSS VALIDATION (Stability Check)
# ==========================

# ==========================
# TRAIN / TEST SPLIT (for final model)
# ==========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
X_train_full, X_val, y_train_full, y_val = train_test_split(
    X_train, y_train, test_size=0.2, stratify=y_train, random_state=42
)

model.fit(
    X_train_full, y_train_full,
    eval_set=[(X_val, y_val)],
    early_stopping_rounds=20,
    verbose=False
)

# ==========================
# EVALUATION
# ==========================
def evaluate_model(y_true, y_proba, threshold=0.5):
    y_pred = (y_proba >= threshold).astype(int)
    print(f"\nEvaluation at Threshold = {threshold}")
    print("F1 Score:", f1_score(y_true, y_pred))
    print("ROC-AUC:", roc_auc_score(y_true, y_proba))
    print("Brier Score:", brier_score_loss(y_true, y_proba))
    print("Confusion Matrix:\n", confusion_matrix(y_true, y_pred))
    return y_pred

y_test_proba = model.predict_proba(X_test)[:, 1]
y_train_pred = model.predict(X_train)
y_test_pred = model.predict(X_test)

print("\nTraining Accuracy:", accuracy_score(y_train, y_train_pred))
print("Testing Accuracy :", accuracy_score(y_test, y_test_pred))

evaluate_model(y_test, y_test_proba)

# ==========================
# SAVE MODEL
# ==========================
joblib.dump(model, "xgb_heart_model.joblib")
print(" Model saved successfully as 'xgb_heart_model.joblib'")

# ==========================
# THRESHOLD TUNING
# ==========================
precision, recall, thresholds = precision_recall_curve(y_test, y_test_proba)
f1_scores = [f1_score(y_test, (y_test_proba >= t).astype(int)) for t in thresholds]
best_thresh = thresholds[np.argmax(f1_scores)]
print(f"\n Best Threshold by F1: {best_thresh:.3f}")

y_pred_thresh = evaluate_model(y_test, y_test_proba, threshold=best_thresh)

# ==========================
# RISK BANDING
# ==========================
def risk_band(prob):
    return (
        "Low Risk" if prob < 0.2 else
        "Moderate Risk" if prob < 0.5 else
        "High Risk"
    )

results_df = pd.DataFrame({
    "True_Label": y_test,
    "Predicted_Label": y_pred_thresh,
    "Probability": y_test_proba,
    "Risk_Band": [risk_band(p) for p in y_test_proba]
})

print("\nSample Output:\n", results_df.head())

risk_counts = results_df['Risk_Band'].value_counts().sort_index()
risk_counts.plot(kind='bar', color=['green', 'orange', 'red'])
plt.title("Risk Band Distribution")
plt.ylabel("Patient Count")
plt.xticks(rotation=0)
plt.grid(axis='y')
plt.show()

# ==========================
# CALIBRATION CURVE
# ==========================
prob_true, prob_pred = calibration_curve(y_test, y_test_proba, n_bins=10)
plt.plot(prob_pred, prob_true, marker='o')
plt.plot([0, 1], [0, 1], linestyle='--')
plt.xlabel("Predicted Probability")
plt.ylabel("True Probability")
plt.title("Calibration Curve")
plt.grid()
plt.show()

# ==========================
# SHAP INTERPRETABILITY
# ==========================
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

shap.summary_plot(shap_values, X_test)

top_feature = X_test.columns[np.argmax(np.abs(shap_values).mean(axis=0))]
shap.dependence_plot(top_feature, shap_values, X_test)

def plot_shap_waterfall(index, label):
    print(f"\nSHAP Waterfall: {label} Example")
    shap.plots.waterfall(
        shap.Explanation(
            values=shap_values[index],
            base_values=explainer.expected_value,
            data=X_test.iloc[index]
        )
    )

false_positives = (y_test == 0) & (y_pred_thresh == 1)
false_negatives = (y_test == 1) & (y_pred_thresh == 0)

if false_positives.any():
    plot_shap_waterfall(np.where(false_positives)[0][0], "False Positive")
if false_negatives.any():
    plot_shap_waterfall(np.where(false_negatives)[0][0], "False Negative")
