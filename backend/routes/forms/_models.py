from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import Optional, List, Dict, Any, Union
from enum import Enum
from datetime import datetime, date
from uuid import UUID
from utils.pydantic_conv import make_optional
from models import FormFields

class FieldTypeEnum(str, Enum):
    TEXT = "text"
    TEXTAREA = "textarea"
    NUMBER = "number"
    INTEGER = "integer"
    SCALE = "scale"
    BOOLEAN = "boolean"
    DATE = "date"
    DATETIME = "datetime"
    EMAIL = "email"
    IMAGE_URL = "image_url"
    UUID = "uuid"
    SELECT = "select"
    RADIO = "radio"
    CHECKBOX = "checkbox"
    MULTISELECT = "multiselect"

class FormFieldCreate(BaseModel):
    field_name: str = Field(..., max_length=100)
    field_type: FieldTypeEnum
    required: bool = True
    constraints: Optional[Dict[str, Any]] = Field(
        None,
        description="Field constraints based on type. Examples: "
                    "text: min_length, max_length, pattern; "
                    "number: min, max; "
                    "date: min_date, max_date; "
                    "select/radio: items (list of choices); "
                    "checkbox/multiselect: items (list of choices), min_items, max_items; "
                    "scale: min (default 1), max (default 10)"
    )
    section: str = Field(..., max_length=512)
    field_order: int = 0

    @field_validator('constraints')
    def validate_constraints(cls, v, values):
        if v is None:
            return v
        
        field_type = values.data.get('field_type')
        if not field_type:
            return v
        
        # Validate constraints based on field type
        if field_type in [FieldTypeEnum.TEXT, FieldTypeEnum.TEXTAREA, FieldTypeEnum.EMAIL]:
            if 'min_length' in v and not isinstance(v['min_length'], int):
                raise ValueError("min_length must be an integer")
            if 'max_length' in v and not isinstance(v['max_length'], int):
                raise ValueError("max_length must be an integer")
            if 'pattern' in v and not isinstance(v['pattern'], str):
                raise ValueError("pattern must be a string")
        
        elif field_type in [FieldTypeEnum.NUMBER, FieldTypeEnum.INTEGER, FieldTypeEnum.SCALE]:
            if 'min' in v and not isinstance(v['min'], (int, float)):
                raise ValueError("min must be a number")
            if 'max' in v and not isinstance(v['max'], (int, float)):
                raise ValueError("max must be a number")
        
        elif field_type in [FieldTypeEnum.DATE, FieldTypeEnum.DATETIME]:
            for date_constraint in ['min_date', 'max_date']:
                if date_constraint in v:
                    if not isinstance(v[date_constraint], (str, date, datetime)):
                        raise ValueError(f"{date_constraint} must be a date/datetime or ISO format string")
        
        elif field_type in [FieldTypeEnum.SELECT, FieldTypeEnum.RADIO]:
            if 'items' in v and not isinstance(v['items'], list):
                raise ValueError("items must be a list of choices")
        
        elif field_type in [FieldTypeEnum.CHECKBOX, FieldTypeEnum.MULTISELECT]:
            if 'items' in v and not isinstance(v['items'], list):
                raise ValueError("items must be a list of choices")
            if 'min_items' in v and not isinstance(v['min_items'], int):
                raise ValueError("min_items must be an integer")
            if 'max_items' in v and not isinstance(v['max_items'], int):
                raise ValueError("max_items must be an integer")
        
        return v

    model_config = ConfigDict(use_enum_values=True)

class FormSectionCreate(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    order: int = 0
    fields: Optional[List[FormFieldCreate]] = None

class FormCreate(BaseModel):
    title: str = Field(..., max_length=300)
    detail: Optional[str] = None
    logo: Optional[str] = None  # URL to logo
    cover_image: Optional[str] = None  # URL to cover image
    max_response: Optional[int] = Field(None, ge=1)
    is_active: bool = True
    as_template: bool = False
    active_until: Optional[datetime] = None
    company_website: Optional[str] = None
    draft: bool = False
    primary_color: str = Field(default="default", max_length=128)
    secondary_color: str = Field(default="default", max_length=128)  
    collect_email: bool = True
    multi_response: bool = True
    sections: List[FormSectionCreate]
    
    model_config = ConfigDict(json_schema_extra={
        "example": {
            "title": "Customer Feedback Form",
            "detail": "Please provide your feedback about our services",
            "logo": "https://example.com/logo.png",
            "cover_image": "https://example.com/cover.jpg",
            "max_response": 1000,
            "is_active": True,
            "as_template": False,
            "active_until": "2026-06-30T00:00:00",
            "company_website": "https://example.com",
            "draft": False,
            "primary_color": "#3b82f6",
            "secondary_color": "#10b981",
            "collect_email": True,
            "multi_response": False,
            "sections": [
                {
                    "title": "Personal Information",
                    "description": "Tell us about yourself",
                    "order": 0,
                    "fields": [
                        {
                            "field_name": "full_name",
                            "field_type": "text",
                            "required": True,
                            "section": "Personal Information",
                            "field_order": 0,
                            "constraints": {
                                "min_length": 3,
                                "max_length": 100
                            }
                        },
                        {
                            "field_name": "email",
                            "field_type": "email",
                            "required": True,
                            "section": "Personal Information",
                            "field_order": 1,
                            "constraints": {
                                "pattern": r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                            }
                        },
                        {
                            "field_name": "birth_date",
                            "field_type": "date",
                            "required": False,
                            "section": "Personal Information",
                            "field_order": 2,
                            "constraints": {
                                "min_date": "1900-01-01",
                                "max_date": "2023-01-01"
                            }
                        },
                        {
                            "field_name": "appointment_time",
                            "field_type": "datetime",
                            "required": True,
                            "section": "Personal Information",
                            "field_order": 3,
                            "constraints": {
                                "min_datetime": "2023-06-01T00:00:00",
                                "max_datetime": "2029-12-31T23:59:59"
                            }
                        }
                    ]
                },
                {
                    "title": "Feedback",
                    "description": "Your opinion matters to us",
                    "order": 1,
                    "fields": [
                        {
                            "field_name": "satisfaction",
                            "field_type": "scale",
                            "required": True,
                            "section": "Feedback",
                            "field_order": 0,
                            "constraints": {
                                "min": 1,
                                "max": 5
                            }
                        },
                        {
                            "field_name": "feedback_type",
                            "field_type": "select",
                            "required": True,
                            "section": "Feedback",
                            "field_order": 1,
                            "constraints": {
                                "items": ["Compliment", "Complaint", "Suggestion"]
                            }
                        },
                        {
                            "field_name": "improvement_areas",
                            "field_type": "multiselect",
                            "required": False,
                            "section": "Feedback",
                            "field_order": 2,
                            "constraints": {
                                "items": ["Speed", "Quality", "Price", "Customer Service"],
                                "min_items": 1,
                                "max_items": 3
                            }
                        },
                        {
                            "field_name": "subscribe",
                            "field_type": "checkbox",
                            "required": False,
                            "section": "Feedback",
                            "field_order": 3,
                            "constraints": {
                                "items": ["Newsletter", "Promotions", "Product Updates"]
                            }
                        },
                        {
                            "field_name": "comments",
                            "field_type": "textarea",
                            "required": False,
                            "section": "Feedback",
                            "field_order": 4,
                            "constraints": {
                                "max_length": 1000
                            }
                        }
                    ]
                }
            ]
        }
    })


FormResponse = FormCreate
FormFieldsResponse = FormFieldCreate
FormSectionResponse = FormSectionCreate
UpdateForm = make_optional(FormCreate)