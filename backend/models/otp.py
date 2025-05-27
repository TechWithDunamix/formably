from .base import BaseModel
from tortoise import fields
from datetime import datetime, UTC, timedelta
class OTPCode(BaseModel):
    code = fields.CharField(max_length=8, unique=True, null=False)
    user = fields.ForeignKeyField("models.User", related_name="otp_codes")
    used = fields.BooleanField(default = False)
   

    class Meta:
        table = "otp_codes"
        ordering = ["-created_at"]
        unique_together = (("code", "user"),)


    @classmethod
    async def verify_code(cls, user_id, code):
        print(f"Verifying OTP code: {code} for user_id: {user_id}")
        obj = await cls.filter(user_id = user_id, code = code).first()
        if not obj:
            return 
        
        if (obj.created_at +  timedelta(hours=1)) < datetime.now(UTC) or obj.used:
            return
    
        return obj
    
    