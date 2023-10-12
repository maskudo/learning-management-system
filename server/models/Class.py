from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Time
from sqlalchemy.orm import relationship
from models import Base


class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    cancelled = Column(Boolean, default=False)
    cancellation_reason = Column(String)
    course = relationship("Course", cascade="delete, merge, save-update")
    teacher = relationship("User", cascade="delete, merge, save-update")

    def __init__(
        self,
        title: str,
        course_id: int,
        teacher_id: int,
        start_time: Time,
        end_time: Time,
        cancelled: bool,
        cancellation_reason: str,
    ) -> None:
        self.title = title
        self.teacher_id = teacher_id
        self.course_id = course_id
        self.start_time = start_time
        self.end_time = end_time
        self.cancelled = cancelled
        self.cancellation_reason = cancellation_reason

    def __repr__(self) -> str:
        return f"Class(title='{self.title}', start_time='{self.start_time}', end_time='{self.end_time}')"
