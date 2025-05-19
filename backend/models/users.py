from email.policy import default
from .base import  BaseModel
from tortoise import fields as f
import bcrypt




class User(BaseModel):

    first_name = f.CharField(
        max_length = 120
    )

    last_name = f.CharField(
        max_length = 120,
        null = True
    )

    email  = f.CharField(
        max_length = 120
    )

    hashed_password = f.TextField()

    company = f.CharField(null = True, max_length = 120)

    is_activate = f.BooleanField(
        default = False
    )

    def set_password(self, password):
        self.hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.hashed_password.encode('utf-8'))
    
    @classmethod
    async def create_user(cls, first_name, last_name, email, password, company = None):
        user = cls(first_name=first_name, last_name=last_name, email=email, company=company)
        user.set_password(password)
        await user.save()
        return user
    
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


    def to_dict(self):
        return {
            "id": str(self.id),
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "company": self.company,
            "is_activate": self.is_activate
        }