from ariadne.asgi.handlers import GraphQLHTTPHandler
from ariadne.exceptions import HttpBadRequestError
from graphql.type import GraphQLResolveInfo
from starlette.middleware import Middleware
from middleware.JWTManager import JWTManager
from starlette.middleware.cors import CORSMiddleware
from ariadne import ScalarType, make_executable_schema, upload_scalar
from ariadne.asgi import GraphQL
from schema import type_defs
from fastapi import FastAPI
from starlette.staticfiles import StaticFiles

# resolvers
from mygraphql.resolvers.auth import mutate as authMutate
from mygraphql.resolvers.user import userMutate, userQuery
from mygraphql.resolvers.category import categoryQuery, categoryMutate
from mygraphql.resolvers.course import courseMutate, courseQuery
from mygraphql.resolvers.enrollment import enrollmentQuery, enrollmentMutate
from mygraphql.resolvers.course_teacher import courseTeacherQuery, courseTeacherMutate
from mygraphql.resolvers.classes import classQuery, classMutate
from mygraphql.resolvers.assignment import assignmentQuery, assignmentMutate
from mygraphql.resolvers.question import questionQuery, questionMutate
from mygraphql.resolvers.submission import submissionQuery, submissionMutate
from mygraphql.resolvers.resource import resourceQuery, resourceMutate

datetime_scalar = ScalarType("Datetime")


@datetime_scalar.serializer
def serialize_datetime(value):
    return value.isoformat()


schema = make_executable_schema(
    type_defs,
    datetime_scalar,
    authMutate,
    userQuery,
    userMutate,
    categoryQuery,
    categoryMutate,
    courseQuery,
    courseMutate,
    enrollmentMutate,
    enrollmentQuery,
    courseTeacherQuery,
    courseTeacherMutate,
    classQuery,
    classMutate,
    assignmentQuery,
    assignmentMutate,
    questionQuery,
    questionMutate,
    submissionQuery,
    submissionMutate,
    resourceQuery,
    resourceMutate,
    upload_scalar,
)
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


upload_dir = "uploads"
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")
app.mount(
    "/graphql/",
    GraphQL(
        schema, debug=True, http_handler=GraphQLHTTPHandler(middleware=[protect_route])
    ),
)
