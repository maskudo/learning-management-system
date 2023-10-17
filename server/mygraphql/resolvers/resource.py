from ariadne import ObjectType, QueryType
from db import session

from models.Resource import Resource


resourceQuery = QueryType()
resourceMutate = ObjectType("Mutation")


@resourceMutate.field("submitResources")
def resolve_add_resource(*_, resources):
    print(resources)
    course_id = resources["course_id"]
    resources = resources["resources"]
    for resource in resources:
        res = Resource(resource["title"], resource["description"], course_id)
        session.add(res)
    session.commit()
    return True


@resourceQuery.field("getResourcesByCourse")
def resolve_get_resources_by_course(*_, courseId):
    resources = session.query(Resource).where(Resource.course_id == courseId).all()
    return resources
