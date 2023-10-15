from ariadne import ObjectType
from ariadne.exceptions import HttpError
from db import session
from middleware.JWTManager import JWTManager

from models.User import User
from utils.hash import hash_password

mutate = ObjectType("Mutation")


@mutate.field("login")
def resolve_login_user(*_, email, password):
    existing_user = session.query(User).where(User.email == email).first()
    if not existing_user:
        raise HttpError(f"Email '{email}' doesn't exist.")

    hashed_password = hash_password(password)
    if hashed_password != existing_user.password:
        raise HttpError("Incorrect Email or Password")
    token = JWTManager.generate_token({"sub": email})
    login_info = {"email": email, "token": token}
    return login_info


@mutate.field("register")
def resolve_register(*_, user):
    email_check = session.query(User).where(User.email == user["email"]).first()
    phone_check = session.query(User).where(User.phone_no == user["phone_no"]).first()
    if email_check:
        raise HttpError("Email already in use!")
    elif phone_check:
        raise HttpError("Phone number already in use!")
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
