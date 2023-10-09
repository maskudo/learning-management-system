from ariadne import ObjectType, QueryType
from ariadne.exceptions import HttpBadRequestError

from db import session
from models.CourseTeacher import CourseTeacher

courseTeacherQuery = QueryType()
courseTeacherMutate = ObjectType("Mutation")


@courseTeacherMutate.field("addCourseTeacher")
def resolve_add_course_teacher(*_, courseId, teacherId):
    courseTeacherCheck = (
        session.query(CourseTeacher)
        .where(CourseTeacher.teacher_id == teacherId)
        .where(CourseTeacher.course_id == courseId)
        .first()
    )
    if courseTeacherCheck:
        raise HttpBadRequestError("Teacher already assigned to the course.")

    courseTeacherObj = CourseTeacher(courseId, teacherId)
    session.add(courseTeacherObj)
    session.commit()
    return courseTeacherObj


@courseTeacherQuery.field("getTeachersByCourse")
def resolve_get_teachers_by_courset(*_, courseId):
    courseTeachers = session.query(CourseTeacher).where(
        CourseTeacher.course_id == courseId
    )
    return courseTeachers
