from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import create_database, database_exists

# ruff: noqa: F401
from models import (
    Base,
    Assignment,
    Attendance,
    Category,
    Class,
    Course,
    CourseTeacher,
    Enrollment,
    Question,
    Submission,
    User,
    Resource,
    FileResource,
)


DATABASE_URI = "postgresql://postgres:test1234@localhost:5432/learningmgmtsystem"
engine = create_engine(DATABASE_URI)
if not database_exists(engine.url):
    create_database(engine.url)

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()
