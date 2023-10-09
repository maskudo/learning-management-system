from sqlalchemy import Boolean, Column, Enum, ForeignKey, Integer, String
from models import Base


class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"))
    question_text = Column(String, nullable=False)
    question_type = Column(
        Enum("multiple_choice", "essay", name="question_type_enum", create_type=False),
        nullable=False,
    )

    def __init__(self, assignment_id: int, question_text: str, question_type: str):
        self.assignment_id = assignment_id
        self.question_text = question_text
        self.question_type = question_type

    def __repr__(self) -> str:
        return f"Question(text='{self.question_text}')"


class QuestionOption(Base):
    __tablename__ = "question_options"
    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    option_text = Column(String, nullable=False)
    is_correct = Column(Boolean, nullable=False)

    def __init__(self, question_id: int, option_text: str, is_correct: bool):
        self.question_id = question_id
        self.option_text = option_text
        self.is_correct = is_correct

    def __repr__(self) -> str:
        return (
            f"QuestionOption(text='{self.option_text}', is_correct='{self.is_correct}')"
        )
