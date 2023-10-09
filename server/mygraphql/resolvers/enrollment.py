from ariadne import ObjectType, QueryType
from ariadne.exceptions import HttpBadRequestError

from db import session
from models.Enrollment import Enrollment

enrollmentQuery = QueryType()
enrollmentMutate = ObjectType("Mutation")


@enrollmentQuery.field("enrollments")
def resolve_enrollments(*_):
    return session.query(Enrollment)


@enrollmentQuery.field("enrollment")
def resolve_enrollment(*_, enrollmentId):
    enrollment = session.query(Enrollment).where(Enrollment.id == enrollmentId).one()
    return enrollment


@enrollmentQuery.field("getEnrollmentsByCourse")
def resolve_get_enrollments_by_courset(*_, courseId):
    enrollments = session.query(Enrollment).where(Enrollment.course_id == courseId)
    return enrollments


@enrollmentMutate.field("addEnrollment")
def resolve_add_enrollment(*_, enrollment):
    enrollmentCheck = (
        session.query(Enrollment)
        .where(Enrollment.student_id == enrollment["student_id"])
        .where(Enrollment.course_id == enrollment["course_id"])
        .first()
    )
    if enrollmentCheck and not enrollmentCheck.cancelled:
        raise HttpBadRequestError("User already enrolled into the course.")
    enrollmentObj = Enrollment(
        enrollment["student_id"],
        enrollment["course_id"],
        enrollment.get("cancelled", False),
        enrollment.get("cancellation_reason", None),
    )
    session.add(enrollmentObj)
    session.commit()
    return enrollmentObj
