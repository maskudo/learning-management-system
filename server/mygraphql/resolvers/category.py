from ariadne import ObjectType, QueryType
from ariadne.exceptions import HttpError
from sqlalchemy.exc import NoResultFound

from db import session
from models.Category import Category

categoryQuery = QueryType()
categoryMutate = ObjectType("Mutation")


@categoryMutate.field("addCategory")
def resolve_add_category(*_, name, description):
    try:
        session.query(Category).where(Category.name == name).one()
        raise HttpError("Category already exists")
    except NoResultFound:
        categoryObj = Category(name, description)
        session.add(categoryObj)
        session.commit()
        return categoryObj


@categoryMutate.field("deleteCategory")
def resolve_delete_category(*_, categoryId):
    try:
        category = session.query(Category).where(Category.id == categoryId).one()
        session.delete(category)
        session.commit()
        return True
    except Exception:
        return False


@categoryQuery.field("categories")
def resolve_categories(*_):
    return session.query(Category)


@categoryQuery.field("category")
def resolve_category(*_, categoryId):
    category = session.query(Category).where(Category.id == categoryId).one()
    return category
