from ariadne import ObjectType, QueryType

from db import session
from models.Course import Course

courseQuery = QueryType()
courseMutate = ObjectType("Mutation")


@courseQuery.field("courses")
def resolve_courses(*_):
    return session.query(Course)


@courseQuery.field("course")
def resolve_course(*_, courseId):
    course = session.query(Course).where(Course.id == courseId).one()
    return course


@courseMutate.field("addCourse")
def resolve_add_course(*_, course):
    try:
        courseObj = Course(
            course["name"],
            course.get("description", None),
            course.get("abstract", None),
            course.get("bibliography", None),
            course["category"],
        )
        session.add(courseObj)
        session.commit()
        return courseObj
    except Exception:
        return None


@courseMutate.field("deleteCourse")
def resolve_delete_course(*_, courseId):
    try:
        course = session.query(Course).where(Course.id == courseId).one()
        session.delete(course)
        session.commit()
        return True
    except Exception:
        return False
