from tortoise import fields as f
from enum import Enum
from .base import BaseModel

class FieldTypeEnum(str, Enum):
    TEXT = "text"
    TEXTAREA = "textarea"
    NUMBER = "number"
    INTEGER = "integer"
    SCALE = "scale"
    BOOLEAN = "boolean"
    DATE = "date"
    DATETIME = "datetime"
    EMAIL = "email"
    IMAGE_URL = "image_url"
    UUID = "uuid"
    SELECT = "select"
    RADIO = "radio"
    CHECKBOX = "checkbox"
    MULTISELECT = "multiselect"

class FormFields(BaseModel):
    form_ref = f.ForeignKeyField("models.Forms", related_name="fields")
    section_ref = f.ForeignKeyField("models.FormSections", null=True, related_name="fields")  # Optional section reference
    field_order = f.IntField(default=0)


    field_name = f.CharField(max_length=100)
    field_type = f.CharEnumField(enum_type=FieldTypeEnum, max_length=20)
    required = f.BooleanField(default=True)
    constraints = f.JSONField(null=True)  # e.g., {"min_length": 3, "max": 30}
    section = f.CharField(max_length=512)
    class Meta:
        table = "Form Fields"
        ordering = ["section_ref__order", "field_order"]


    def __str__(self):
        return self.field_name

