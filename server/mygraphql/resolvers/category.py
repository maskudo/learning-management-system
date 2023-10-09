from ariadne import ObjectType, QueryType
from models.Category import Category

from db import session

categoryQuery = QueryType()
categoryMutate = ObjectType("Mutation")


@categoryMutate.field("addCategory")
def resolve_add_category(*_, name, description):
    try:
        categoryObj = Category(name, description)
        session.add(categoryObj)
        session.commit()
        return categoryObj
    except Exception:
        return None


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
