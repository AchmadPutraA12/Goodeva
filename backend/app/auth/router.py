from fastapi import APIRouter, HTTPException, status
from app.auth.schemas import LoginRequest, TokenResponse
from app.auth.utils import authenticate_user, create_access_token

router = APIRouter(prefix="/api", tags=["Auth"])


@router.post("/login", response_model=TokenResponse, summary="Login dengan dummy user")
def login(body: LoginRequest):
    user = authenticate_user(body.email, body.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
        )
    token = create_access_token({"sub": user["email"], "name": user["name"]})
    return TokenResponse(access_token=token)
