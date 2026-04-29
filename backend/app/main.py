from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.router import router as auth_router
from app.sales.router import router as sales_router
from app.predict.router import router as predict_router

app = FastAPI(
    title="Mini AI Sales Prediction API",
    description="REST API untuk manajemen data penjualan dan prediksi status produk",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(sales_router)
app.include_router(predict_router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Mini AI Sales Prediction API is running"}
