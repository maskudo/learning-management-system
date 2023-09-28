from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, Time
from models import Base


class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True)
    class_no = Column(Integer)
    title = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    cancelled = Column(Boolean, default=False)
    cancellation_reason = Column(String)

    def __init__(
        self,
        title: str,
        class_no: int,
        course_id: int,
        teacher_id: int,
        date: Date,
        start_time: Time,
        end_time: Time,
        cancelled: bool,
        cancellation_reason: str,
    ) -> None:
        self.title = title
        self.class_no = class_no
        self.teacher_id = teacher_id
        self.course_id = course_id
        self.date = date
        self.start_time = start_time
        self.end_time = end_time
        self.cancelled = cancelled
        self.cancellation_reason = cancellation_reason

    def __repr__(self) -> str:
        return f"Class(no='{self.class_no}'), date='{self.date}'"
