from ariadne import ObjectType, QueryType
from models.Submission import Submission, SubmittedOption

from db import session

submissionQuery = QueryType()
submissionMutate = ObjectType("Mutation")


@submissionMutate.field("addSubmission")
def resolve_add_submission(*_, submissionInfo):
    print(submissionInfo)
    submissionObj = Submission(
        submissionInfo["student_id"],
        submissionInfo["assignment_id"],
        submissionInfo["question_id"],
        submissionInfo["submission_text"],
        submissionInfo["score"],
    )
    session.add(submissionObj)
    session.commit()
    return submissionObj


# @submissionMutate.field("deletesubmission")
# def resolve_delete_submission(*_, asssignmentId):
#     try:
#         submission = (
#             session.query(submission).where(submission.id == asssignmentId).one()
#         )
#         session.delete(submission)
#         session.commit()
#         return True
#     except Exception:
#         return False


@submissionQuery.field("getSubmission")
def resolve_submission(*_, submissionId):
    submission = session.query(Submission).where(Submission.id == submissionId).first()
    return submission


@submissionMutate.field("addSubmittedOption")
def resolve_add_submission_option(*_, submissionOptionInfo):
    submissionOptionObj = SubmittedOption(
        submissionOptionInfo["submission_id"],
        submissionOptionInfo["option_id"],
    )
    session.add(submissionOptionObj)
    session.commit()
    return submissionOptionObj


@submissionQuery.field("getSubmittedOption")
def resolve_submission_option(*_, submissionOptionId):
    submission_option = (
        session.query(SubmittedOption)
        .where(SubmittedOption.id == submissionOptionId)
        .first()
    )
    return submission_option
