from ariadne.asgi.handlers import GraphQLHTTPHandler
from ariadne.exceptions import HttpBadRequestError
from graphql.type import GraphQLResolveInfo
from starlette.middleware import Middleware
from middleware.JWTManager import JWTManager
from starlette.middleware.cors import CORSMiddleware
from models.Class import Class
from models.Category import Category
from models.Course import Course
from models.CourseTeacher import CourseTeacher
from models.Enrollment import Enrollment
from models.User import User
from ariadne import (
    ObjectType,
    QueryType,
    ScalarType,
    make_executable_schema,
    SubscriptionType,
)
from ariadne.asgi import GraphQL
from schema import type_defs
from fastapi import FastAPI

from utils.hash import hash_password
from db import session


subscription = SubscriptionType()
query = QueryType()

mutate = ObjectType("Mutation")
user = ObjectType("User")
datetime_scalar = ScalarType("Datetime")


@datetime_scalar.serializer
def serialize_datetime(value):
    return value.isoformat()


@query.field("users")
def resolve_users(*_):
    users = session.query(User)
    return users


@mutate.field("login")
def resolve_login_user(*_, email, password):
    existing_user = session.query(User).where(User.email == email).first()
    if not existing_user:
        return None

    hashed_password = hash_password(password)
    if hashed_password != existing_user.password:
        return None
    token = JWTManager.generate_token({"sub": email})
    login_info = {"email": email, "token": token}
    return login_info


@query.field("getUserByEmail")
def resolve_get_user_by_email(*_, email):
    user = session.query(User).where(User.email == email).one()
    return user


@query.field("user")
def resolve_user(*_, userId):
    user = session.query(User).where(User.id == userId).one()
    return user


@mutate.field("deleteUser")
def resolve_delete_User(*_, userId):
    try:
        user = session.query(User).where(User.id == userId).one()
        session.delete(user)
        session.commit()
        return True
    except Exception:
        return False


@mutate.field("register")
def resolve_register(*_, user):
    email_check = session.query(User).where(User.email == user["email"]).first()
    phone_check = session.query(User).where(User.phone_no == user["phone_no"]).first()
    if email_check:
        raise HttpBadRequestError("Email already in use!")
    elif phone_check:
        raise HttpBadRequestError("Phone number already in use!")
    userObj = User(
        user["name"],
        user["email"],
        user["password"],
        user["birth_date"],
        user["phone_no"],
        user["role"],
    )
    session.add(userObj)
    session.commit()
    return userObj


@mutate.field("addCategory")
def resolve_add_category(*_, name, description):
    try:
        categoryObj = Category(name, description)
        session.add(categoryObj)
        session.commit()
        return categoryObj
    except Exception:
        return None


@mutate.field("deleteCategory")
def resolve_delete_category(*_, categoryId):
    try:
        category = session.query(Category).where(Category.id == categoryId).one()
        session.delete(category)
        session.commit()
        return True
    except Exception:
        return False


@query.field("categories")
def resolve_categories(*_):
    return session.query(Category)


@query.field("category")
def resolve_category(*_, categoryId):
    category = session.query(Category).where(Category.id == categoryId).one()
    return category


@query.field("courses")
def resolve_courses(*_):
    return session.query(Course)


@query.field("course")
def resolve_course(*_, courseId):
    course = session.query(Course).where(Course.id == courseId).one()
    return course


@mutate.field("addCourse")
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


@mutate.field("deleteCourse")
def resolve_delete_course(*_, courseId):
    try:
        course = session.query(Course).where(Course.id == courseId).one()
        session.delete(course)
        session.commit()
        return True
    except Exception:
        return False


@query.field("enrollments")
def resolve_enrollments(*_):
    return session.query(Enrollment)


@query.field("enrollment")
def resolve_enrollment(*_, enrollmentId):
    enrollment = session.query(Enrollment).where(Enrollment.id == enrollmentId).one()
    return enrollment


@query.field("getEnrollmentsByCourse")
def resolve_get_enrollments_by_courset(*_, courseId):
    enrollments = session.query(Enrollment).where(Enrollment.course_id == courseId)
    return enrollments


@mutate.field("addEnrollment")
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


@mutate.field("addCourseTeacher")
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


@query.field("getTeachersByCourse")
def resolve_get_teachers_by_courset(*_, courseId):
    courseTeachers = session.query(CourseTeacher).where(
        CourseTeacher.course_id == courseId
    )
    return courseTeachers


@mutate.field("addClass")
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


@query.field("getClassesByCourse")
def resolve_get_classes_by_course(*_, courseId):
    classes = session.query(Class).where(Class.course_id == courseId)
    return classes


schema = make_executable_schema(type_defs, query, mutate, user, datetime_scalar)
middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["POST"],
        allow_headers=["access-control-allow-origin", "authorization", "content-type"],
    )
]
app = FastAPI(debug=True, middleware=middleware)


def protect_route(resolver, obj, info: GraphQLResolveInfo, **args):
    non_routed_mutations = ["IntrospectionQuery", "register", "login"]
    mutation_name = info.operation.name.value
    if mutation_name in non_routed_mutations:
        return resolver(obj, info, **args)
    headers = info.context["request"].headers
    authorization_header = headers.get("Authorization")
    if not authorization_header:
        raise HttpBadRequestError("Authorization header missing or empty")
    token = authorization_header.split(" ")[-1]
    verified = JWTManager.verify_jwt(token)
    if not verified:
        raise HttpBadRequestError("Expired or invalid JWT")

    value = resolver(obj, info, **args)
    return value


app.mount(
    "/graphql/",
    GraphQL(
        schema, debug=True, http_handler=GraphQLHTTPHandler(middleware=[protect_route])
    ),
)
