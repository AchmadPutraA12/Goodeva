from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "supersecretkey_goodeva_2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DATA_PATH: str = "../data/sales_data.csv"

    class Config:
        env_file = ".env"


settings = Settings()
