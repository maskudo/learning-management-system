from ariadne import ObjectType, QueryType
from ariadne.exceptions import HttpError
from sqlalchemy import and_
from models.Assignment import Assignment
from models.Submission import Grade, Submission, SubmittedAssignment, SubmittedOption

from db import session

submissionQuery = QueryType()
submissionMutate = ObjectType("Mutation")


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


@submissionMutate.field("submitAssignment")
def resolve_submit_assignment(*_, submittedAssignment):
    already_submitted = (
        session.query(SubmittedAssignment)
        .where(
            and_(
                SubmittedAssignment.student_id == submittedAssignment["student_id"],
                SubmittedAssignment.assignment_id
                == submittedAssignment["assignment_id"],
            )
        )
        .first()
    )
    if already_submitted:
        return HttpError("Cannot have multiple submissions on same assignment.")
    submittedAssignmentObj = SubmittedAssignment(
        submittedAssignment["student_id"], submittedAssignment["assignment_id"]
    )
    session.add(submittedAssignmentObj)
    session.flush()
    for solution in submittedAssignment["solutions"]:
        submissionObj = Submission(
            submittedAssignmentObj.id,
            solution["question"],
            solution["answer"]["submission_text"],
        )
        session.add(submissionObj)
        submitted_option = solution["answer"]["submitted_option"]
        if submitted_option:
            session.flush()
            submitted_option = SubmittedOption(submissionObj.id, submitted_option)
            session.add(submitted_option)
    session.commit()
    return True


@submissionQuery.field("getSubmittedAssignmentsByCourse")
def resolve_submitted_assignments_by_course(*_, courseId):
    submitted_assignments = (
        session.query(SubmittedAssignment)
        .join(Assignment, Assignment.id == SubmittedAssignment.assignment_id)
        .where(Assignment.course_id == courseId)
        .all()
    )
    return submitted_assignments


@submissionQuery.field("getSubmittedAssignment")
def resolve_submitted_assignments(*_, submittedAssignmentId):
    submission = session.query(SubmittedAssignment).get(submittedAssignmentId)
    return submission


@submissionMutate.field("submitGrade")
def resolve_submit_grade(*_, submittedGrade):
    already_submitted = (
        session.query(Grade)
        .where(Grade.submitted_assignment_id == submittedGrade["submittedAssignmentId"])
        .first()
    )
    if already_submitted:
        return HttpError("Grade Already Submitted")
    grade = Grade(submittedGrade["submittedAssignmentId"], submittedGrade["grade"])
    session.add(grade)
    session.commit()
    return True
