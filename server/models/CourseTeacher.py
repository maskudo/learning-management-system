from datetime import date
from sqlalchemy import Column, ForeignKey, Integer, Date, UniqueConstraint
from sqlalchemy.orm import relationship
from models import Base


class CourseTeacher(Base):
    __tablename__ = "course_teacher"
    id = Column(Integer, primary_key=True)
    created_at = Column(Date, default=date.today)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course = relationship("Course", cascade="delete, merge, save-update")
    teacher = relationship(
        "User", cascade="delete, merge, save-update", back_populates="teaching"
    )
    __table_args__ = (
        UniqueConstraint("teacher_id", "course_id", name="uq_course_teacher_pair"),
    )

    def __init__(self, course_id: int, teacher_id: int):
        self.course_id = course_id
        self.teacher_id = teacher_id

    def __repr__(self) -> str:
        return f"Lecturer(course_id='{self.course_id}'), teacher_id='{self.teacher_id}'"
