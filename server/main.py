from ariadne.asgi.handlers import GraphQLHTTPHandler
from ariadne.exceptions import HttpBadRequestError
from graphql.type import GraphQLResolveInfo
from middleware.JWTManager import JWTManager
from models.Category import Category
from models.Course import Course
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


@query.field("login")
def resolve_login_user(*_, email, password):
    existing_user = session.query(User).where(User.email == email).first()
    if not existing_user:
        return None

    hashed_password = hash_password(password)
    if hashed_password != existing_user.password.__str__():
        return None
    token = JWTManager.generate_token({"sub": email})
    login_info = {"email": email, "token": token}
    return login_info


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


@mutate.field("addUser")
def resolve_add_user(*_, user):
    try:
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
    except Exception:
        return None


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


@mutate.field("addEnrollment")
def resolve_add_enrollment(*_, enrollment):
    try:
        enrollmentObj = Enrollment(
            enrollment["student_id"],
            enrollment["course_id"],
            enrollment.get("cancelled", False),
            enrollment.get("cancellation_reason", None),
        )
        session.add(enrollmentObj)
        session.commit()
        return enrollmentObj
    except Exception:
        return None


schema = make_executable_schema(type_defs, query, mutate, user, datetime_scalar)
app = FastAPI(debug=True)


def protect_route(resolver, obj, info: GraphQLResolveInfo, **args):
    non_routed_mutations = ["register", "login"]
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
