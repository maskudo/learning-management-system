from datetime import datetime, timedelta
from jose import jwt
from typing import Optional


ACCESS_TOKEN_EXPIRE_MINUTES = 30
SECRET_KEY = "learningmanagementsystem"
ALGORITHM = "HS256"


class JWTManager:
    @staticmethod
    def generate_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=float(ACCESS_TOKEN_EXPIRE_MINUTES)
            )
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def verify_jwt(token: str) -> bool:
        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
            current_timestamp = datetime.utcnow().timestamp()
            if not decoded_token:
                raise ValueError("Invalid Token")
            elif decoded_token["exp"] <= current_timestamp:
                raise ValueError("Token Expired")
            return True
        except Exception:
            return False
