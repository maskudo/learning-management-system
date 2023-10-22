import os
from ariadne import ObjectType, QueryType
from db import session
from models.FileResource import FileResource

from models.Resource import Resource
from utils.fns import generate_unique_filename


resourceQuery = QueryType()
resourceMutate = ObjectType("Mutation")

upload_dir = "uploads"
if not os.path.exists(upload_dir):
    os.makedirs(upload_dir)


@resourceMutate.field("submitResources")
async def resolve_add_resource(*_, resources):
    print(resources)
    course_id = resources["course_id"]
    resources = resources["resources"]
    for resource in resources:
        res = Resource(resource["title"], resource["description"], course_id)
        session.add(res)
        session.flush()
        if resource["files"]:
            for file in resource["files"]:
                print(file)
                unique_filename = generate_unique_filename(file["name"])
                file_path = os.path.join(upload_dir, unique_filename)
                with open(file_path, "wb") as file_obj:
                    content = await file["originFileObj"].read()
                    file_obj.write(content)
                file_res = FileResource(file["name"], file_path, res.id)
                session.add(file_res)

    session.commit()
    return True


@resourceQuery.field("getResourcesByCourse")
def resolve_get_resources_by_course(*_, courseId):
    resources = session.query(Resource).where(Resource.course_id == courseId).all()
    return resources


# @resourceMutate.field("uploadFileResources")
# async def resovle_upload_file_resource(*_, courseId, files):
#     upload_dir = "uploads"
#     if not os.path.exists(upload_dir):
#         os.makedirs(upload_dir)
#
#     for file in files:
#         unique_filename = generate_unique_filename(file.filename)
#         file_path = os.path.join(upload_dir, unique_filename)
#         with open(file_path, "wb") as file_obj:
#             content = await file["originFileObj"].read()
#             file_obj.write(content)
#     return True
