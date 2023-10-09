from typing import Optional
from sqlalchemy import Column, ForeignKey, Integer, String
from models import Base


class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    submission_text = Column(String, nullable=True)
    score = Column(Integer, nullable=True)

    def __init__(
        self,
        student_id: int,
        assignment_id: int,
        question_id: int,
        submission_text: Optional[str] = None,
        score: Optional[int] = None,
    ):
        self.assignment_id = assignment_id
        self.student_id = student_id
        self.question_id = question_id
        self.submission_text = submission_text
        self.score = score

    def __repr__(self) -> str:
        return f"Submission(student_id='{self.student_id}', assignment_id='{self.assignment_id}')"


class SubmittedOption(Base):
    __tablename__ = "submitted_options"
    id = Column(Integer, primary_key=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    option_id = Column(Integer, ForeignKey("question_options.id"))

    def __init__(self, submission_id: int, option_id: int):
        self.submission_id = submission_id
        self.option_id = option_id

    def __repr__(self) -> str:
        return f"SubmittedOption(submission_id='{self.submission_id}', option_id='{self.option_id}')"
