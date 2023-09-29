from models import Base
from models.Category import Category
from models.Course import Course
from models.Enrollment import Enrollment
from models.User import User
from sqlalchemy.orm import sessionmaker
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
from sqlalchemy import create_engine
from sqlalchemy_utils import create_database, database_exists

from utils.hash import hash_password


DATABASE_URI = "postgresql://postgres:test1234@localhost:5432/learningmgmtsystem"
engine = create_engine(DATABASE_URI)
if not database_exists(engine.url):
    create_database(engine.url)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

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
    user = session.query(User).where(User.email == email).first()
    if not user:
        return None
    hashed_password = hash_password(password)
    if hashed_password == user.password.__str__():
        return user
    return None


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
app.mount("/graphql/", GraphQL(schema, debug=True))
