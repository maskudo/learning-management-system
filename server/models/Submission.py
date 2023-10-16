from typing import Optional
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from models import Base


# TODO: normalize tables
class SubmittedAssignment(Base):
    __tablename__ = "submitted_assignments"
    id = Column(Integer, primary_key=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    assignment = relationship("Assignment")
    student = relationship("User")
    submissions = relationship("Submission")

    def __init__(
        self,
        student_id: int,
        assignment_id: int,
    ):
        self.assignment_id = assignment_id
        self.student_id = student_id

    def __repr__(self) -> str:
        return f"SubmittedAssignment(student_id='{self.student_id}', assignment_id='{self.assignment_id}')"


class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True)
    submitted_assignment_id = Column(Integer, ForeignKey("submitted_assignments.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    submission_text = Column(String, nullable=True)
    score = Column(Integer, nullable=True)
    submitted_option = relationship("SubmittedOption", uselist=False)
    question = relationship("Question", uselist=False)

    def __init__(
        self,
        submitted_assignment_id: int,
        question_id: int,
        submission_text: Optional[str] = None,
        score: Optional[int] = None,
    ):
        self.submitted_assignment_id = submitted_assignment_id
        self.question_id = question_id
        self.submission_text = submission_text
        self.score = score

    def __repr__(self) -> str:
        return f"Submission(submitted_assignment_id='{self.submitted_assignment_id}', submission_text='{self.submission_text}'), {self.submitted_option}"


class SubmittedOption(Base):
    __tablename__ = "submitted_options"
    id = Column(Integer, primary_key=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    option_id = Column(Integer, ForeignKey("question_options.id"))
    option = relationship("QuestionOption")
    submission = relationship("Submission", back_populates="submitted_option")

    def __init__(self, submission_id: int, option_id: int):
        self.submission_id = submission_id
        self.option_id = option_id

    def __repr__(self) -> str:
        return f"SubmittedOption(id='{self.id}', submission_id='{self.submission_id}', option_id='{self.option_id})"
