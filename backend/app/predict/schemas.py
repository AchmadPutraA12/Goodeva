from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    jumlah_penjualan: int = Field(..., ge=0, description="Jumlah unit terjual")
    harga: float = Field(..., gt=0, description="Harga satuan per item (Rp)")
    diskon: float = Field(..., ge=0, le=100, description="Diskon dalam persen (0-100)")


class PredictResponse(BaseModel):
    status: str
    probability_laris: float
    probability_tidak: float
