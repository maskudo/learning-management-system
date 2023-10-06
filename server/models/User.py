from datetime import date, datetime
from sqlalchemy import Column, Enum, Integer, String, Date
from sqlalchemy.orm import relationship
from utils.hash import hash_password
from models import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(100), nullable=False, unique=True)
    name = Column(String(100), nullable=False)
    password = Column(String, nullable=False)
    birth_date = Column(Date, nullable=False)
    phone_no = Column(String(10), nullable=False)
    created_at = Column(Date, default=datetime.now)
    role = Column(
        Enum("admin", "teacher", "student", name="role_enum", create_type=False),
        nullable=False,
    )
    enrollments = relationship("Enrollment", cascade="delete, merge, save-update")

    def __init__(
        self,
        name: str,
        email: str,
        password: str,
        birth_date: date,
        phone_no: str,
        role: str,
    ) -> None:
        self.name = name
        self.email = email
        self.birth_date = birth_date
        self.phone_no = phone_no
        self.password = hash_password(password)
        self.role = role

    def __repr__(self) -> str:
        return f"User(name='{self.name}'), role='{self.role}', email='{self.email}')"
