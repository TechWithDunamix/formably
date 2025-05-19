from models import  Forms, FormSections, FormFields
from typing import List, Optional
from pydantic import BaseModel
class FormFieldResponse(BaseModel):
    field_name: str
    field_type: str
    required: bool
    constraints: Optional[dict] = None
    section: str
    field_order: int

class FormSectionResponse(BaseModel):
    title: str
    description: Optional[str] = None
    order: int
    fields: List[FormFieldResponse] = []

class FormResponse(BaseModel):
    id: str
    title: Optional[str] = None
    detail:Optional[str] = None
    logo: Optional[str] = None
    cover_image: Optional[str] = None
    max_response: Optional[int] = None
    is_active: bool
    as_template: bool
    active_until: Optional[str] = None
    company_website: Optional[str] = None
    draft: bool
    primary_color: str
    secondary_color: str
    collect_email: Optional[bool] = True
    multi_response: bool
    public_id: Optional[str] = None
    sections: List[FormSectionResponse]
    created_at: str
    updated_at: str


async def format_form(form :Forms):
    """
    Formats a Forms object into a structured FormResponse.

    This function retrieves sections and fields associated with a given form, 
    organizes them into a hierarchical structure, and returns a formatted 
    FormResponse object. It includes fields that do not belong to any section 
    under a "General" section.

    Args:
        obj (Forms): The Forms object to be formatted.

    Returns:
        dict: A dictionary representation of the formatted form data.
    """
   
    if not form.public_id:
        print(True)
        form.public_id = form.generate_public_id()
        await form.save()

    sections = []
    for section in await form.sections.all().order_by("order"):
        section_fields = []
        for field in await section.fields.all().order_by("field_order"):

            section_fields.append(FormFieldResponse(
                field_name=field.field_name,
                field_type=field.field_type,
                required=field.required,
                constraints=field.constraints,
                section=field.section,
                field_order=field.field_order
            ))
        
        sections.append(FormSectionResponse(
            title=section.title,
            description=section.description,
            order=section.order,
            fields=section_fields
        ))

    # Include fields not in any section (if any)
    orphan_fields = []
    for field in await form.fields.filter(section_ref=None).order_by("field_order"):
        orphan_fields.append(FormFieldResponse(
            field_name=field.field_name,
            field_type=field.field_type,
            required=field.required,
            constraints=field.constraints,
            section=field.section,
            field_order=field.field_order
        ))
    
    if orphan_fields:
        sections.append(FormSectionResponse(
            title="General",
            description="Fields not in any specific section",
            order=999,  # Put at the end
            fields=orphan_fields
        ))

    response = FormResponse(
        id=str(form.id),
        title=form.title,
        detail=form.detail or "",
        logo=form.logo or None,
        cover_image=form.cover_image or None,
        max_response=form.max_response,
        is_active=form.is_active,
        as_template=form.as_template,
        active_until=str(form.active_until) if form.active_until else None,
        company_website=form.company_website,
        draft=form.draft,
        primary_color=form.primary_color,
        secondary_color=form.secondary_school,  # Note: field name mismatch
        collect_email=form.collect_email,
        multi_response=form.multi_response,
        sections=sections,
        created_at=str(form.created_at),
        updated_at=str(form.updated_at),
        public_id=form.public_id
    )

    return response.model_dump()