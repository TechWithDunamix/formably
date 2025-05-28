from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UpdateUser(BaseModel):
    first_name: Optional[str] = Field(None, max_length=120)
    last_name: Optional[str] = Field(None, max_length=120)
    email: Optional[EmailStr] = Field(None, max_length=120)
    company: Optional[str] = Field(None, max_length=120)