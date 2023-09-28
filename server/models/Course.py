from datetime import date
from sqlalchemy import Column, ForeignKey, Integer, String, Date
from models import Base


class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    abstract = Column(String)
    bibliography = Column(String)
    description = Column(String)
    created_at = Column(Date, default=date.today)
    category = Column(Integer, ForeignKey("categories.id"), nullable=False)

    def __init__(
        self,
        name: str,
        description: str,
        abstract: str,
        bibliography: str,
        category: int,
    ):
        self.name = name
        self.description = description
        self.abstract = abstract
        self.bibliography = bibliography
        self.category = category

    def __repr__(self) -> str:
        return f"Course(name='{self.name}'), description='{self.description}'"
