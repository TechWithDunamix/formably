from pydantic import BaseModel
from typing import Optional
class CreateUser(BaseModel):
    first_name :str
    last_name :Optional[str] = None
    email :str
    password :str
    company :Optional[str] = None


class LoginUser(BaseModel):
    email :str
    password :str


class ConfirmUser(BaseModel):
    user_id :str
    code :str
    