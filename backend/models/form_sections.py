# form_sections.py
from .base import BaseModel
from tortoise import fields as f

class FormSections(BaseModel):
    form_ref = f.ForeignKeyField("models.Forms", related_name="sections")
    title = f.CharField(max_length=200)
    description = f.TextField(null=True)
    order = f.IntField(default=0)
    
    class Meta:
        table = "form_sections"
        ordering = ["order"]