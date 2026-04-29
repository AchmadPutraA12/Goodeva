import os
import numpy as np
import joblib
from fastapi import APIRouter, Depends, HTTPException
from app.auth.utils import get_current_user
from app.auth.schemas import TokenData
from app.predict.schemas import PredictRequest, PredictResponse

router = APIRouter(prefix="/api", tags=["Predict"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "..", "..", "ml", "model.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "..", "..", "..", "ml", "label_encoder.pkl")

_model = None
_encoder = None


def _get_model():
    global _model, _encoder
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise HTTPException(
                status_code=503,
                detail="Model belum dilatih. Jalankan: python ml/train.py",
            )
        _model = joblib.load(MODEL_PATH)
        _encoder = joblib.load(ENCODER_PATH)
    return _model, _encoder


@router.post("/predict", response_model=PredictResponse, summary="Prediksi status produk")
def predict(
    body: PredictRequest,
    _: TokenData = Depends(get_current_user),
):
    model, encoder = _get_model()

    features = np.array([[body.jumlah_penjualan, body.harga, body.diskon]])
    pred_idx = model.predict(features)[0]
    proba = model.predict_proba(features)[0]

    classes = list(encoder.classes_)  # ['Laris', 'Tidak']
    laris_idx = classes.index("Laris")
    tidak_idx = classes.index("Tidak")

    return PredictResponse(
        status=encoder.inverse_transform([pred_idx])[0],
        probability_laris=round(float(proba[laris_idx]), 4),
        probability_tidak=round(float(proba[tidak_idx]), 4),
    )
