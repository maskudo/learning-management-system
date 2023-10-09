from ariadne import ObjectType, QueryType
from models.Assignment import Assignment

from db import session

assignmentQuery = QueryType()
assignmentMutate = ObjectType("Mutation")


@assignmentMutate.field("addAssignment")
def resolve_add_assignment(*_, assignmentInfo):
    assignmentObj = Assignment(
        assignmentInfo["name"],
        assignmentInfo["course_id"],
        assignmentInfo["deadline"],
    )
    session.add(assignmentObj)
    session.commit()
    return assignmentObj


# @assignmentMutate.field("deleteAssignment")
# def resolve_delete_assignment(*_, asssignmentId):
#     try:
#         assignment = (
#             session.query(Assignment).where(Assignment.id == asssignmentId).one()
#         )
#         session.delete(assignment)
#         session.commit()
#         return True
#     except Exception:
#         return False


@assignmentQuery.field("getAssignment")
def resolve_assignment(*_, assignmentId):
    assignment = session.query(Assignment).where(Assignment.id == assignmentId).first()
    return assignment
