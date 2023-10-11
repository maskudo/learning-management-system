from ariadne import ObjectType, QueryType
from models.Assignment import Assignment

from db import session
from models.Submission import Submission, SubmittedOption

assignmentQuery = QueryType()
assignmentMutate = ObjectType("Mutation")


@assignmentMutate.field("addAssignment")
def resolve_add_assignment(*_, assignmentInfo):
    assignmentObj = Assignment(
        assignmentInfo["name"],
        assignmentInfo["course_id"],
        assignmentInfo["deadline"],
    )
    session.add(assignmentObj)
    session.commit()
    return assignmentObj


@assignmentQuery.field("getAssignment")
def resolve_assignment(*_, assignmentId):
    assignment = session.query(Assignment).where(Assignment.id == assignmentId).first()
    return assignment


@assignmentQuery.field("getAssignmentsByCourse")
def resolve_assignments_by_course(*_, courseId):
    assignment = session.query(Assignment).where(Assignment.course_id == courseId)
    return assignment


@assignmentMutate.field("submitAssignment")
def resolve_submit_assignment(*_, submittedAssignment):
    try:
        for solution in submittedAssignment["solutions"]:
            submissionObj = Submission(
                submittedAssignment["student_id"],
                submittedAssignment["assignment_id"],
                solution["question"],
                solution["answer"]["submission_text"],
            )
            session.add(submissionObj)
            session.flush()
            submitted_option = solution["answer"]["submitted_option"]
            if submitted_option:
                submitted_option = SubmittedOption(submissionObj.id, submitted_option)
                session.add(submitted_option)
        session.commit()
        return True
    except Exception:
        return False
