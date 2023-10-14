from ariadne import ObjectType, QueryType
from models.Assignment import Assignment

from db import session
from models.Enrollment import Enrollment
from models.Question import Question, QuestionOption
from models.Submission import Submission, SubmittedAssignment, SubmittedOption

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
    session.flush()
    for question in assignmentInfo["questions"]:
        q = Question(assignmentObj.id, question["question"], question["type"])
        session.add(q)
        session.flush()
        if question["type"] == "multiple_choice":
            for option in question["options"]:
                o = QuestionOption(q.id, option["text"], option["is_correct"])
                session.add(o)

    session.commit()
    return assignmentObj


@assignmentQuery.field("getAssignment")
def resolve_assignment(*_, assignmentId):
    assignment = session.query(Assignment).where(Assignment.id == assignmentId).first()
    return assignment


@assignmentQuery.field("getAssignmentsByCourseUser")
def resolve_assignments_by_course(*_, courseId, userId):
    if not userId or not courseId:
        return None

    all_assignments = (
        session.query(Assignment)
        .where(Assignment.course_id == courseId)
        .join(Enrollment, Enrollment.course_id == Assignment.course_id)
        .where(Enrollment.student_id == userId)
        .all()
    )
    assignments_done_by_user = (
        session.query(Assignment)
        .join(SubmittedAssignment, SubmittedAssignment.assignment_id == Assignment.id)
        .where(SubmittedAssignment.student_id == userId)
        .all()
    )

    s = set(assignments_done_by_user)
    remaining_assignments = [x for x in all_assignments if x not in s]
    return remaining_assignments


@assignmentQuery.field("getAssignmentsByUser")
def resolve_get_assignments_by_user(*_, userId):
    if not userId:
        return None

    all_assignments = (
        session.query(Assignment)
        .join(Enrollment, Enrollment.course_id == Assignment.course_id)
        .where(Enrollment.student_id == userId)
        .all()
    )
    assignments_done_by_user = (
        session.query(Assignment)
        .join(SubmittedAssignment, SubmittedAssignment.assignment_id == Assignment.id)
        .where(SubmittedAssignment.student_id == userId)
        .all()
    )

    s = set(assignments_done_by_user)
    remaining_assignments = [x for x in all_assignments if x not in s]
    return remaining_assignments


@assignmentMutate.field("submitAssignment")
def resolve_submit_assignment(*_, submittedAssignment):
    try:
        submittedAssignmentObj = SubmittedAssignment(
            submittedAssignment["student_id"], submittedAssignment["assignment_id"]
        )
        session.add(submittedAssignmentObj)
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
