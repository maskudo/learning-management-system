from datetime import date
from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    Date,
    UniqueConstraint,
)
from models import Base


class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True)
    enrollment_date = Column(Date, default=date.today)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    cancelled = Column(Boolean, default=False)
    cancellation_reason = Column(String)
    __table_args__ = (
        UniqueConstraint("student_id", "course_id", name="uq_student_course_pair"),
    )

    def __init__(
        self, student_id: int, course_id: int, cancelled: bool, cancellation_reason: str
    ) -> None:
        self.student_id = student_id
        self.course_id = course_id
        self.cancelled = cancelled
        self.cancellation_reason = cancellation_reason

    def __repr__(self) -> str:
        return f"Enrollment(id='{self.id}'), date='{self.enrollment_date}'"
