import os
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, Query
from app.auth.utils import get_current_user
from app.auth.schemas import TokenData
from app.sales.schemas import SalesResponse, SalesItem

router = APIRouter(prefix="/api", tags=["Sales"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "..", "..", "data", "sales_data.csv")


def _load_csv() -> pd.DataFrame:
    if not os.path.exists(DATA_PATH):
        raise HTTPException(status_code=500, detail=f"File data tidak ditemukan: {DATA_PATH}")
    return pd.read_csv(DATA_PATH)


@router.get("/sales", response_model=SalesResponse, summary="Ambil data penjualan")
def get_sales(
    page: int = Query(default=1, ge=1, description="Nomor halaman"),
    page_size: int = Query(default=20, ge=1, le=100, description="Jumlah data per halaman"),
    status: str | None = Query(default=None, description="Filter status: Laris / Tidak"),
    _: TokenData = Depends(get_current_user),
):
    df = _load_csv()

    if status:
        df = df[df["status"].str.lower() == status.lower()]

    total = len(df)
    start = (page - 1) * page_size
    end = start + page_size
    page_df = df.iloc[start:end]

    items = [SalesItem(**row) for row in page_df.to_dict(orient="records")]
    return SalesResponse(total=total, page=page, page_size=page_size, data=items)
