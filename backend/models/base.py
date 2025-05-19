from uuid import uuid4
from tortoise import fields
from tortoise.models import Model


class BaseModel(Model):
    id = fields.UUIDField(pk=True, default=uuid4)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True) 

    class Meta:
        abstract = True
