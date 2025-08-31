#  Imports
import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split, RandomizedSearchCV, cross_validate
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.metrics import (
    accuracy_score, f1_score, roc_auc_score, classification_report,
    confusion_matrix, precision_recall_curve
)
import matplotlib.pyplot as plt
import joblib

# --------------------------
# 1) Load & Preprocess
# --------------------------
df = pd.read_csv("preprocessed_diabetes.csv")

zero_cols = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
df[zero_cols] = df[zero_cols].replace(0, np.nan)

X = df.drop('Outcome', axis=1)
y = df['Outcome']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, stratify=y, random_state=42
)

imputer = SimpleImputer(strategy='median')
X_train_imp = X_train.copy()
X_test_imp = X_test.copy()
X_train_imp[zero_cols] = imputer.fit_transform(X_train[zero_cols])
X_test_imp[zero_cols] = imputer.transform(X_test[zero_cols])

# --------------------------
# 2) Hyperparameter Search
# --------------------------
rf = RandomForestClassifier(random_state=42)

param_dist = {
    'n_estimators': [150, 200, 250],
    'max_depth': [6, 8, 10],
    'min_samples_split': [10, 15, 20],
    'min_samples_leaf': [5, 6, 7, 8],
    'max_features': ['sqrt']
}

search = RandomizedSearchCV(
    rf, param_dist, n_iter=15, scoring='f1',
    cv=5, n_jobs=-1, random_state=42, verbose=0
)
search.fit(X_train_imp, y_train)
best_rf = search.best_estimator_
print(" Best hyperparams:", search.best_params_)

# --------------------------
# 3) Cross-validation (Stability)
# --------------------------
cv_results = cross_validate(
    best_rf, X, y, cv=5,
    scoring=['accuracy', 'f1', 'roc_auc']
)
print("\n Cross-Validation Results (5-Fold):")
for metric in cv_results:
    if "test" in metric:
        print(f"{metric.split('_')[1].capitalize()} -> "
              f"Mean: {cv_results[metric].mean():.4f}, "
              f"Std: {cv_results[metric].std():.4f}")

# --------------------------
# 4) Calibrate Model
# --------------------------
calib = CalibratedClassifierCV(best_rf, method='isotonic', cv=5)
calib.fit(X_train_imp, y_train)

# --------------------------
# 5) Best Threshold from Train
# --------------------------
y_train_probs = calib.predict_proba(X_train_imp)[:, 1]
precision, recall, thresholds = precision_recall_curve(y_train, y_train_probs)
f1_scores = 2 * (precision * recall) / (precision + recall + 1e-8)
best_idx = np.argmax(f1_scores)
best_threshold = thresholds[best_idx]
print(f"\n Best Threshold (Train F1): {best_threshold:.3f}")

# --------------------------
# 6) Evaluate on Train & Test
# --------------------------
y_train_pred = (y_train_probs >= best_threshold).astype(int)
y_test_proba = calib.predict_proba(X_test_imp)[:, 1]
y_test_pred = (y_test_proba >= best_threshold).astype(int)

train_acc = accuracy_score(y_train, y_train_pred)
test_acc = accuracy_score(y_test, y_test_pred)

print(f"\nTraining Accuracy: {train_acc:.4f}")
print(f"Testing Accuracy : {test_acc:.4f}")
print(f"Generalization Gap: {abs(train_acc - test_acc):.4f}")

# --------------------------
# 7) Test Metrics
# --------------------------
print(f"\nF1 Score  (Test): {f1_score(y_test, y_test_pred):.4f}")
print(f"ROC-AUC   (Test): {roc_auc_score(y_test, y_test_proba):.4f}")
print("\nClassification Report (Test):\n", classification_report(y_test, y_test_pred))
print("Confusion Matrix (Test):\n", confusion_matrix(y_test, y_test_pred))

# --------------------------
# 8) Calibration Curve
# --------------------------
prob_true, prob_pred = calibration_curve(y_test, y_test_proba, n_bins=10)
plt.plot(prob_pred, prob_true, marker='o')
plt.plot([0, 1], [0, 1], linestyle='--')
plt.xlabel("Predicted Probability")
plt.ylabel("True Probability")
plt.title("Calibration Curve")
plt.grid()
plt.show()

# --------------------------
# 9) Save Model with joblib
# --------------------------
joblib.dump(calib, "rf_diabetes_model.joblib")
print("\n Model saved as rf_diabetes_model.joblib")

# Optional: Save the best threshold for later use
joblib.dump(best_threshold, "best_threshold.joblib")
print(" Best threshold saved as best_threshold.joblib")