from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from models import Base


class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"))
    deadline = Column(DateTime, nullable=False)

    def __init__(self, name: str, course_id: int, deadline: datetime) -> None:
        self.name = name
        self.course_id = course_id
        self.deadline = deadline

    def __repr__(self) -> str:
        return f"Assignement(name='{self.name}'), deadline='{self.deadline}'"
