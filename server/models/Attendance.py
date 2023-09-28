from sqlalchemy import Column, ForeignKey, Integer, Time
from models import Base


class Attendance(Base):
    __tablename__ = "attendances"
    id = Column(Integer, primary_key=True)
    arrive_time = Column(Time, nullable=False)
    leave_time = Column(Time, nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    def __init__(
        self,
        student_id: int,
        class_id: int,
        arrive_time: Time,
        leave_time: Time,
    ) -> None:
        self.student_id = student_id
        self.class_id = class_id
        self.arrive_time = arrive_time
        self.leave_time = leave_time

    def __repr__(self) -> str:
        return f"Class(no='{self.class_no}'), date='{self.date}'"
