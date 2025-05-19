from .base import BaseModel
from tortoise import fields as f

class FormResponse(BaseModel):
    form_ref = f.ForeignKeyField("models.Forms", related_name="responses")
    response = f.JSONField(null = True)
    device_family = f.CharField(max_length = 512, null = True)
    device_brand = f.CharField(max_length = 512, null = True)
    device_os = f.CharField(max_length = 512, null = True)
    device_browser = f.CharField(max_length = 512, null = True)


    async def to_dict(self) -> dict:
        form_ref = await self.form_ref
        return {
            "id": self.id,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "form_ref": form_ref.id,
            "response": self.response,
            "device_family": self.device_family,
            "device_brand": self.device_brand,
            "device_os": self.device_os,
            "device_browser": self.device_browser,
        }

    