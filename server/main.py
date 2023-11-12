from pathlib import Path

from ariadne import ScalarType, make_executable_schema, upload_scalar
from ariadne.asgi import GraphQL
from ariadne.asgi.handlers import GraphQLHTTPHandler
from ariadne.exceptions import HttpBadRequestError, HttpError
from fastapi import FastAPI, Request, Response, WebSocket, WebSocketDisconnect
from graphql.type import GraphQLResolveInfo
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from starlette.websockets import WebSocketClose

from db import session
from middleware.JWTManager import JWTManager
from models.FileResource import FileResource
from mygraphql.resolvers.assignment import assignmentMutate, assignmentQuery

# resolvers
from mygraphql.resolvers.auth import mutate as authMutate
from mygraphql.resolvers.category import categoryMutate, categoryQuery
from mygraphql.resolvers.classes import classMutate, classQuery
from mygraphql.resolvers.course import courseMutate, courseQuery
from mygraphql.resolvers.course_teacher import courseTeacherMutate, courseTeacherQuery
from mygraphql.resolvers.enrollment import enrollmentMutate, enrollmentQuery
from mygraphql.resolvers.question import questionMutate, questionQuery
from mygraphql.resolvers.resource import resourceMutate, resourceQuery
from mygraphql.resolvers.submission import submissionMutate, submissionQuery
from mygraphql.resolvers.user import userMutate, userQuery
from schema import type_defs
from wsockets import ConnectionManager

datetime_scalar = ScalarType("Datetime")


CHUNK_SIZE: int = 1024 * 1024


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
        allow_methods=["POST", "GET"],
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


manager = ConnectionManager()


@app.websocket("/classes")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # print(data)
            event = data["event"]
            if event == "join-room":
                data = data["data"]
                roomId = data["roomId"]
                userId = data["userId"]
                await manager.join_room(roomId, userId, websocket)
            # await manager.send_message(websocket, {"userID": data["data"]["userId"]})

    except WebSocketDisconnect or WebSocketClose:
        await manager.disconnect(websocket)
        print("disconnected", websocket)


@app.get("/video/{id}")
def stream_video(id, request: Request):
    start, end = request.headers["range"].replace("bytes=", "").split("-")
    start = int(start)
    end = int(end) if end else start + CHUNK_SIZE
    video_obj = session.query(FileResource).get(id)
    if not video_obj:
        raise HttpError("Resource not found")
    video_path = Path(video_obj.path)
    with open(video_path, "rb") as video:
        video.seek(start)
        data = video.read(end - start)
        filesize = str(video_path.stat().st_size)
        headers = {
            "Content-Range": f"bytes {str(start)}-{str(end)}/{filesize}",
            "Accept-Ranges": "bytes",
        }
        return Response(data, status_code=206, headers=headers, media_type="video/mp4")


upload_dir = "uploads"
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")
app.mount(
    "/graphql/",
    GraphQL(
        schema, debug=True, http_handler=GraphQLHTTPHandler(middleware=[protect_route])
    ),
)
