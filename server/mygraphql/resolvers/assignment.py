from ariadne import ObjectType, QueryType
from ariadne.exceptions import HttpError
from models.CourseTeacher import CourseTeacher
from models.Assignment import Assignment

from db import session
from models.Enrollment import Enrollment
from models.Question import Question, QuestionOption
from models.Submission import SubmittedAssignment

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
    if not assignment:
        raise HttpError("Assignment not found")
    return assignment


@assignmentQuery.field("getAssignmentsByCourseUser")
def resolve_assignments_by_course(*_, courseId, userId):
    is_teaching = (
        session.query(CourseTeacher)
        .where(CourseTeacher.teacher_id == userId)
        .where(CourseTeacher.course_id == courseId)
        .first()
    )

    all_assignments = (
        session.query(Assignment).where(Assignment.course_id == courseId)
        # .join(Enrollment, Enrollment.course_id == Assignment.course_id)
        # .where(Enrollment.student_id == userId)
        .all()
    )
    if is_teaching:
        return all_assignments
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
