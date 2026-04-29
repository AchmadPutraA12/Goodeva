import os
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "sales_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "label_encoder.pkl")

FEATURES = ["jumlah_penjualan", "harga", "diskon"]
TARGET = "status"


def load_data() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH)
    df.dropna(subset=FEATURES + [TARGET], inplace=True)
    return df


def train():
    df = load_data()

    le = LabelEncoder()
    y = le.fit_transform(df[TARGET])
    X = df[FEATURES].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"Classes: {list(le.classes_)}")
    print(f"Accuracy : {accuracy:.4f} ({accuracy*100:.2f}%)")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=le.classes_))

    importances = model.feature_importances_
    print("Feature Importances:")
    for feat, imp in sorted(zip(FEATURES, importances), key=lambda x: -x[1]):
        print(f"  {feat}: {imp:.4f}")

    joblib.dump(model, MODEL_PATH)
    joblib.dump(le, ENCODER_PATH)
    print(f"\nModel saved  → {MODEL_PATH}")
    print(f"Encoder saved → {ENCODER_PATH}")
    return accuracy


if __name__ == "__main__":
    train()
