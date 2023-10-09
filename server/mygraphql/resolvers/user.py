from ariadne import ObjectType, QueryType
from models.User import User
from db import session

userQuery = QueryType()
userMutate = ObjectType("Mutation")


@userQuery.field("users")
def resolve_users(*_):
    users = session.query(User)
    return users


@userQuery.field("getUserByEmail")
def resolve_get_user_by_email(*_, email):
    user = session.query(User).where(User.email == email).one()
    return user


@userQuery.field("user")
def resolve_user(*_, userId):
    user = session.query(User).where(User.id == userId).one()
    return user


@userMutate.field("deleteUser")
def resolve_delete_User(*_, userId):
    try:
        user = session.query(User).where(User.id == userId).one()
        session.delete(user)
        session.commit()
        return True
    except Exception:
        return False
