from datetime import datetime
from ariadne import ObjectType, QueryType

from db import session
from models.Class import Class
from models.CourseTeacher import CourseTeacher
from models.Enrollment import Enrollment

classQuery = QueryType()
classMutate = ObjectType("Mutation")


@classMutate.field("addClass")
def resolve_add_class(*_, classInfo):
    print(classInfo)
    classObj = Class(
        classInfo["title"],
        classInfo["course_id"],
        classInfo["teacher_id"],
        classInfo["start_time"],
        classInfo["end_time"],
        classInfo.get("cencelled"),
        classInfo.get("cancellation_reason"),
    )
    session.add(classObj)
    session.commit()
    return classObj


@classQuery.field("getClassesByCourse")
def resolve_get_classes_by_course(*_, courseId):
    classes = session.query(Class).where(Class.course_id == courseId)
    return classes


@classQuery.field("getClassesByUser")
def resolve_get_classes_by_user(*_, userId):
    current_time = datetime.now()
    classes = (
        session.query(Class)
        .join(Enrollment, Enrollment.course_id == Class.course_id)
        .filter(Enrollment.student_id == userId, Class.end_time > current_time)
        .order_by(Class.start_time)
        .all()
    )
    return classes


@classQuery.field("getClassesByTeacher")
def resolve_get_classes_by_teacher(*_, teacherId):
    current_time = datetime.now()
    classes = (
        session.query(Class)
        .join(CourseTeacher, CourseTeacher.course_id == Class.course_id)
        .filter(CourseTeacher.teacher_id == teacherId, Class.end_time > current_time)
        .order_by(Class.start_time)
        .all()
    )
    return classes
