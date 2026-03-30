import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# =====================================
# Load Dataset
# =====================================

data = pd.read_csv("data/fake_social_media/fake_social_media.csv")

print("Dataset loaded successfully")
print(data.head())

# =====================================
# Data Preprocessing
# =====================================

# Convert categorical column to numeric
data = pd.get_dummies(data, columns=["platform"])

# Separate features and label
X = data.drop("is_fake", axis=1)
y = data["is_fake"]

# Handle missing values
X = X.fillna(0)

# =====================================
# Train-Test Split
# =====================================

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))

# =====================================
# Train Model
# =====================================

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

print("Model training completed")

# =====================================
# Model Evaluation
# =====================================

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("Model Accuracy:", accuracy)

print("\nClassification Report:\n")
print(classification_report(y_test, predictions, zero_division=0))

# =====================================
# Save Model
# =====================================

joblib.dump(model, "backend/detectx_model.pkl")
joblib.dump(X.columns.tolist(), "backend/detectx_features.pkl")
print("Model saved successfully!")