from pydantic import BaseModel
from typing import Optional,Dict
class Error404(BaseModel):
    message: str = "Not Found"
    detail: Dict[str, str] = {"detail": "Not Found"}

class Error500(BaseModel):
    detail: str

class Success200(BaseModel):
    detail: str = "Success"

class Error400(BaseModel):
    message: str
    errors: Dict[str, str]


class Error401(BaseModel):
    message: str = "Unauthorized"
    detail: Dict[str, str]

class Error403(BaseModel):
    message: str = "Forbidden"
    detail: Dict[str, str]