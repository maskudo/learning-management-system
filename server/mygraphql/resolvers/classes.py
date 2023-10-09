from ariadne import ObjectType, QueryType

from db import session
from models.Class import Class

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
