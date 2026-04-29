import os
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.auth.utils import get_current_user
from app.auth.schemas import TokenData

router = APIRouter(prefix="/api", tags=["Stats"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "..", "..", "data", "sales_data.csv")


class DiskonBucket(BaseModel):
    label: str
    laris: int
    tidak: int


class TopProduct(BaseModel):
    product_id: str
    product_name: str
    jumlah_penjualan: int
    status: str


class StatsResponse(BaseModel):
    total_produk: int
    total_laris: int
    total_tidak: int
    pct_laris: float
    total_penjualan: int
    avg_harga: float
    avg_diskon: float
    top_products: list[TopProduct]
    diskon_distribution: list[DiskonBucket]


def _load_csv() -> pd.DataFrame:
    if not os.path.exists(DATA_PATH):
        raise HTTPException(status_code=500, detail="File data tidak ditemukan")
    return pd.read_csv(DATA_PATH)


@router.get("/stats", response_model=StatsResponse, summary="Ringkasan statistik penjualan")
def get_stats(_: TokenData = Depends(get_current_user)):
    df = _load_csv()

    total = len(df)
    laris = int((df["status"] == "Laris").sum())
    tidak = total - laris

    top = (
        df.nlargest(5, "jumlah_penjualan")[["product_id", "product_name", "jumlah_penjualan", "status"]]
        .to_dict(orient="records")
    )

    # distribusi diskon dalam bucket
    bins = [0, 5, 10, 15, 20, 25, 30, 101]
    labels = ["0%", "5%", "10%", "15%", "20%", "25%", "30%"]
    df["diskon_bucket"] = pd.cut(df["diskon"], bins=bins, labels=labels, right=False)
    dist = []
    for label in labels:
        sub = df[df["diskon_bucket"] == label]
        dist.append(DiskonBucket(
            label=label,
            laris=int((sub["status"] == "Laris").sum()),
            tidak=int((sub["status"] == "Tidak").sum()),
        ))

    return StatsResponse(
        total_produk=total,
        total_laris=laris,
        total_tidak=tidak,
        pct_laris=round(laris / total * 100, 1),
        total_penjualan=int(df["jumlah_penjualan"].sum()),
        avg_harga=round(float(df["harga"].mean()), 0),
        avg_diskon=round(float(df["diskon"].mean()), 1),
        top_products=[TopProduct(**p) for p in top],
        diskon_distribution=dist,
    )
