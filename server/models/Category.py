from datetime import date
from sqlalchemy import Column, Integer, String, Date
from models import Base


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(150))
    created_at = Column(Date, default=date.today)

    def __init__(self, name: str, description: str) -> None:
        self.name = name
        self.description = description

    def __repr__(self) -> str:
        return f"Category(name='{self.name}'), description='{self.description}'"
