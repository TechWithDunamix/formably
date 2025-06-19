from pydantic import BaseModel, Field, EmailStr, field_validator, create_model
from typing import Any, List, Optional, Dict, Union, get_args, get_origin
from uuid import UUID
from datetime import datetime, date
from functools import partial


def get_type(field_type: str):
    return {
        "text": str,
        "textarea": str,
        "number": float,
        "integer": int,
        "scale": int,
        "boolean": bool,
        "email": EmailStr,
        "date": date,
        "datetime": datetime,
        "uuid": UUID,
        "select": str,
        "radio": str,
        "checkbox": List[str],
        "multiselect": List[str],
    }.get(field_type, Any)


def create_model_from_form(form: Dict[str, Any]) -> BaseModel:
    fields: Dict[str, tuple] = {}
    validators: Dict[str, classmethod] = {}

    for section_idx, section in enumerate(form.get("sections", [])):
        for field_idx, field in enumerate(section.get("fields", [])):
            name = field["field_name"]
            type_name = field["field_type"]
            required = field.get("required", False)
            constraints = field.get("constraints") or {}
            
            # Create unique identifier for this field
            field_id = f"{name}_s{section_idx}_f{field_idx}"

            pyd_type = get_type(type_name)
            default = ... if required else None
            kwargs = {}

            # Base string constraints
            if pyd_type == str:
                if "min_length" in constraints:
                    kwargs["min_length"] = constraints["min_length"]
                if "max_length" in constraints:
                    kwargs["max_length"] = constraints["max_length"]
                if "pattern" in constraints:
                    kwargs["pattern"] = constraints["pattern"]

            # Base numeric constraints
            if pyd_type in [int, float]:
                if "min" in constraints:
                    kwargs["ge"] = constraints["min"]
                if "max" in constraints:
                    kwargs["le"] = constraints["max"]

            # Scale specific constraints
            if type_name == "scale":
                if "min" in constraints:
                    kwargs["ge"] = constraints["min"]
                else:
                    kwargs["ge"] = 1  # Default minimum for scale
                if "max" in constraints:
                    kwargs["le"] = constraints["max"]
                else:
                    kwargs["le"] = 10  # Default maximum for scale

            # Date constraints
            if type_name == "date":
                if "min_date" in constraints:
                    min_date = constraints["min_date"]
                    if isinstance(min_date, str):
                        min_date = date.fromisoformat(min_date)

                    def make_min_date_validator(min_date, name):
                        @field_validator(name, mode="before")
                        def validator(cls, v):
                            if isinstance(v, str):
                                v = date.fromisoformat(v)
                            if v < min_date:
                                raise ValueError(f"Date must be on or after {min_date}")
                            return v
                        return validator

                    validators[f"validate_{field_id}_min_date"] = make_min_date_validator(min_date, name)

                if "max_date" in constraints:
                    max_date = constraints["max_date"]
                    if isinstance(max_date, str):
                        max_date = date.fromisoformat(max_date)

                    def make_max_date_validator(max_date, name):
                        @field_validator(name, mode="before")
                        def validator(cls, v):
                            if isinstance(v, str):
                                v = date.fromisoformat(v)
                            if v > max_date:
                                raise ValueError(f"Date must be on or before {max_date}")
                            return v
                        return validator

                    validators[f"validate_{field_id}_max_date"] = make_max_date_validator(max_date, name)

            # Datetime constraints
            if type_name == "datetime":
                if "min_datetime" in constraints:
                    min_datetime = constraints["min_datetime"]
                    if isinstance(min_datetime, str):
                        min_datetime = datetime.fromisoformat(min_datetime)

                    def make_min_datetime_validator(min_datetime, name):
                        @field_validator(name, mode="before")
                        def validator(cls, v):
                            if isinstance(v, str):
                                v = datetime.fromisoformat(v)
                            if v < min_datetime:
                                raise ValueError(f"Datetime must be on or after {min_datetime}")
                            return v
                        return validator

                    validators[f"validate_{field_id}_min_datetime"] = make_min_datetime_validator(min_datetime, name)

                if "max_datetime" in constraints:
                    max_datetime = constraints["max_datetime"]
                    if isinstance(max_datetime, str):
                        max_datetime = datetime.fromisoformat(max_datetime)

                    def make_max_datetime_validator(max_datetime, name):
                        @field_validator(name, mode="before")
                        def validator(cls, v):
                            if isinstance(v, str):
                                v = datetime.fromisoformat(v)
                            if v > max_datetime:
                                raise ValueError(f"Datetime must be on or before {max_datetime}")
                            return v
                        return validator

                    validators[f"validate_{field_id}_max_datetime"] = make_max_datetime_validator(max_datetime, name)

            # Checkbox/multiselect constraints
            if type_name in {"checkbox", "multiselect"}:
                if "min_items" in constraints:
                    kwargs["min_length"] = constraints["min_items"]
                if "max_items" in constraints:
                    kwargs["max_length"] = constraints["max_items"]
                if "items" in constraints:
                    valid_choices = constraints["items"]

                    def make_list_validator(choices, name):
                        @field_validator(name, mode="before")
                        def validator(cls, v):
                            if not isinstance(v, list):
                                raise ValueError(f"{name} must be a list")
                            invalid = [item for item in v if item not in choices]
                            if invalid:
                                raise ValueError(f"Invalid choices in {name}: {invalid}")
                            return v
                        return validator

                    validators[f"validate_{field_id}_items"] = make_list_validator(valid_choices, name)

            # Select/radio constraints
            if type_name in {"select", "radio"} and "items" in constraints:
                valid_choices = constraints["items"]

                def make_choice_validator(choices, name):
                    @field_validator(name, mode="before")
                    def validator(cls, v):
                        if v not in choices:
                            raise ValueError(f"{name} must be one of {choices}")
                        return v
                    return validator

                validators[f"validate_{field_id}_choice"] = make_choice_validator(valid_choices, name)

            final_type = Optional[pyd_type] if not required else pyd_type
            fields[name] = (final_type, Field(default, **kwargs))

    model_name = form.get("title", "FormModel").replace(" ", "")
    return create_model(model_name, __validators__=validators, **fields)


# The make_optional function remains unchanged
def make_optional(model: type[BaseModel]) -> type[BaseModel]:
    fields = {}

    for name, field in model.model_fields.items():
        field_type = field.annotation
        default = None

        if isinstance(field_type, type) and issubclass(field_type, BaseModel):
            field_type = make_optional(field_type)
        
        elif get_origin(field_type) in (list, List):
            inner_type = get_args(field_type)[0]
            if isinstance(inner_type, type) and issubclass(inner_type, BaseModel):
                field_type = list[make_optional(inner_type)]

        # Wrap it as Optional
        field_type = Optional[field_type]

        fields[name] = (field_type, default)

    return create_model(f"{model.__name__}Update", __config__=model.model_config, **fields)