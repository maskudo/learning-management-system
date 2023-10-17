from datetime import date
from sqlalchemy import Column, Date, ForeignKey, Integer, String
from models import Base


class Resource(Base):
    __tablename__ = "resources"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    created_at = Column(Date, default=date.today)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)

    def __init__(
        self,
        title: str,
        description: str,
        course_id: int,
    ) -> None:
        self.title = title
        self.description = description
        self.course_id = course_id

    def __repr__(self) -> str:
        return f"Class(title='{self.title}', description='{self.description}')"
