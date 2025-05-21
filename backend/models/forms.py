from email.policy import default
from .base import BaseModel
from tortoise import fields as f
import time, uuid, hashlib
class Forms(BaseModel):

    title = f.CharField(
        max_length = 300
    )

    detail =  f.TextField(null = True)

    logo = f.TextField(null = True) # Url to logo (ultimatly on cloudinary)

    cover_image = f.TextField(null = True) # Url to logo (ultimatly on cloudinary)

    owner = f.ForeignKeyField(
        "models.User",
        on_delete = f.CASCADE
    )

    max_response = f.IntField(null = True)

    is_active = f.BooleanField(
        default = True
    )

    as_template = f.BooleanField(
        default = False
    )

    tag = f.CharField(
        null = True,
        max_length =  True
    )

    active_until = f.DatetimeField(null = True)

    public_template = f.BooleanField(
        default = False
    )

    company_website = f.TextField(
        null = True
    )

    draft = f.BooleanField(default = False)

    primary_color = f.CharField(
        default = "default",
        max_length = 128
    )

    secondary_school  = f.CharField(
        default = "default",
        max_length = 128

    )

    collect_email = f.BooleanField(default = True)

    multi_response = f.BooleanField(default = True)

    public_id = f.CharField(max_length=100, null=True)
    class Meta:
        table = "forms"


    def generate_public_id(self):
        unique_data = f"{uuid.uuid4()}-{time.time()}"
        full_hash = hashlib.sha1(unique_data.encode()).hexdigest()
        return full_hash[:6]

    async def save(self, *args, **kwargs):
        if not self.public_id:
            self.public_id = self.generate_public_id()
        return await super().save(*args, **kwargs)

