from pydantic import BaseModel

class TemplateResponse(BaseModel):
    form_id: str
    