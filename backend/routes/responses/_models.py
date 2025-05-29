from pydantic import BaseModel
from typing import Any, Optional,Dict
from datetime import datetime
class FormResponses(BaseModel):
    form_id: str 
    response : Dict[str, Any]
    device_family :Optional[str]
    device_brand :Optional[str]
    device_os :Optional[str]
    device_browser :Optional[str]
    created_at : datetime
    update_at : datetime