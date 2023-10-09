from ariadne import ObjectType, QueryType
from models.Question import Question, QuestionOption

from db import session

questionQuery = QueryType()
questionMutate = ObjectType("Mutation")


@questionMutate.field("addQuestion")
def resolve_add_question(*_, questionInfo):
    questionObj = Question(
        questionInfo["assignment_id"],
        questionInfo["question_text"],
        questionInfo["question_type"],
    )
    session.add(questionObj)
    session.commit()
    return questionObj


# @questionMutate.field("deletequestion")
# def resolve_delete_question(*_, asssignmentId):
#     try:
#         question = (
#             session.query(question).where(question.id == asssignmentId).one()
#         )
#         session.delete(question)
#         session.commit()
#         return True
#     except Exception:
#         return False


@questionQuery.field("getQuestion")
def resolve_question(*_, questionId):
    question = session.query(Question).where(Question.id == questionId).first()
    return question


@questionMutate.field("addQuestionOption")
def resolve_add_question_option(*_, questionOptionInfo):
    questionOptionObj = QuestionOption(
        questionOptionInfo["question_id"],
        questionOptionInfo["option_text"],
        questionOptionInfo["is_correct"],
    )
    session.add(questionOptionObj)
    session.commit()
    return questionOptionObj


@questionQuery.field("getQuestionOption")
def resolve_question_option(*_, questionOptionId):
    question_option = (
        session.query(QuestionOption)
        .where(QuestionOption.id == questionOptionId)
        .first()
    )
    return question_option
