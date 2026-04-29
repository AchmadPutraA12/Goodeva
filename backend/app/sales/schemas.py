from pydantic import BaseModel


class SalesItem(BaseModel):
    product_id: str
    product_name: str
    jumlah_penjualan: int
    harga: float
    diskon: float
    status: str


class SalesResponse(BaseModel):
    total: int
    page: int
    page_size: int
    data: list[SalesItem]
