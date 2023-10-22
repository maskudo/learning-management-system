from datetime import date
from sqlalchemy import Column, Date, ForeignKey, Integer, String
from models import Base


class FileResource(Base):
    __tablename__ = "file_resources"
    id = Column(Integer, primary_key=True)
    created_at = Column(Date, default=date.today)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=False)
    name = Column(String, nullable=False)
    path = Column(String, nullable=False)

    def __init__(self, name: str, path: str, resource_id: int) -> None:
        self.name = name
        self.path = path
        self.resource_id = resource_id

    def __repr__(self) -> str:
        return f"FileResource(path='{self.path}', name='{self.name}')"
