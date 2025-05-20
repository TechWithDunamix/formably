from urllib import request
from nexios.routing import Router
from nexios.http import Request, Response
from nexios.auth.decorator import auth
from dto.responses import Success200, Error400
from ._models import FormCreate,FormResponse,FormFieldsResponse,FormSectionResponse,UpdateForm
from models.forms import Forms
from models.form_sections import FormSections
from models.form_fields import FormFields
from tortoise.expressions import Q
from utils.format_forms import format_form
from tortoise.transactions import in_transaction
from nexios.openapi import Query

forms_router = Router(prefix="/v1/forms", tags=["v1", "forms"])

@forms_router.post("/create", 
                   summary="Create New Form",
                   request_model=FormCreate,
                   security=[{"bearerAuth": []}],
                   responses={200: Success200, 400: Error400})
@auth(["jwt"]) 
async def create_form(req: Request, res: Response):
    user = req.user
    
    form_data = FormCreate(**await req.json)
    
    async with in_transaction():
        form = await Forms.create(
            title=form_data.title,
            detail=form_data.detail,
            logo=form_data.logo,
            cover_image=form_data.cover_image,
            owner=user,
            max_response=form_data.max_response,
            is_active=form_data.is_active,
            as_template=form_data.as_template,
            active_until=form_data.active_until,
            company_website=form_data.company_website,
            draft=form_data.draft,
            primary_color=form_data.primary_color,
            secondary_school=form_data.secondary_color,  
            collect_email=form_data.collect_email,
            multi_response=form_data.multi_response,
            
        )

        
        for section_data in form_data.sections:
            section = await FormSections.create(
                form_ref=form,
                title=section_data.title,
                description=section_data.description,
                order=section_data.order
            )
            
            if section_data.fields:
                for field_data in section_data.fields:
                    await FormFields.create(
                        form_ref=form,
                        section_ref=section,
                        field_name=field_data.field_name,
                        field_type=field_data.field_type,
                        required=field_data.required,
                        constraints=field_data.constraints,
                        section=field_data.section,
                        field_order=field_data.field_order
                    )
        
        return {"success": "Form created successfully", "form_id": str(form.id)}
            


@forms_router.get("/all", 
                  summary="List Forms",
                  security=[{"bearerAuth": []}],
                  parameters=[Query(name="limit"), Query(name="offset")],
                  responses={200: FormResponse, 400: Error400})
async def list_forms(req: Request, res: Response):
        user = req.user
        limit = int(req.query_params.get("limit",20))
        offset = int(req.query_params.get("offset",0))
        forms = await Forms.filter(owner=user).order_by("-created_at").limit(limit).offset(offset).prefetch_related(
            "sections",
            "sections__fields",
            "fields"
        )

        return [{**await format_form(form), "responses_count": await form.responses.all().count()} for form in forms]


@forms_router.get("/{form_id}/details", 
                  summary="Get Form Details",
                  security=[{"bearerAuth": []}],
                  responses={200: FormResponse, 400: Error400})
@auth(["jwt"]) 
async def get_forms(req: Request, res: Response):
        form_id = req.path_params.get("form_id")
        user = req.user

        # Get the form with related sections and fields
        form = await Forms.get_or_none(id=form_id, owner=user).prefetch_related(
            "sections",
            "sections__fields",
            "fields"
        )
        
        if not form:
            return res.status(404).json({"error": "Form not found"})

        

        return await format_form(form)


@forms_router.put("/{form_id}/update", 
                  summary="Update Form",
                  request_model=UpdateForm,
                  security=[{"bearerAuth": []}],
                  responses={200: Success200, 400: Error400})
@auth(["jwt"]) 
async def update_form(req: Request, res: Response):
    form_id = req.path_params.get("form_id")
    user = req.user
    form_data = UpdateForm(**await req.json)
    
    async with in_transaction():
        form = await Forms.get_or_none(id=form_id, owner=user).prefetch_related(
            "sections",
            "sections__fields",
            "fields"
        )
        
        if not form:
            return res.status(404).json({"error": "Form not found"})
        
        form.update_from_dict(form_data.model_dump(
            exclude_unset=True,
            exclude={"sections"}
        ))
        await form.save()
        
        if form_data.sections is not None:
            existing_sections = {str(section.id): section for section in await form.sections.all()}
            existing_fields = {}
            
            for section in existing_sections.values():
                section_fields = {str(field.id): field for field in await section.fields.all()}
                existing_fields.update(section_fields)
            
            for section_data in form_data.sections:
                if hasattr(section_data, 'id') and section_data.id in existing_sections:
                    section = existing_sections[section_data.id]
                    section.title = section_data.title
                    section.description = section_data.description
                    section.order = section_data.order
                    await section.save()
                    
                    if section_data.fields is not None:
                        for field_data in section_data.fields:
                            if hasattr(field_data, 'id') and field_data.id in existing_fields:
                                field = existing_fields[field_data.id]
                                field.field_name = field_data.field_name
                                field.field_type = field_data.field_type
                                field.required = field_data.required
                                field.constraints = field_data.constraints
                                field.section = field_data.section
                                field.field_order = field_data.field_order
                                await field.save()
                                del existing_fields[field_data.id]
                            else:
                                await FormFields.create(
                                    form_ref=form,
                                    section_ref=section,
                                    field_name=field_data.field_name,
                                    field_type=field_data.field_type,
                                    required=field_data.required,
                                    constraints=field_data.constraints,
                                    section=field_data.section,
                                    field_order=field_data.field_order
                                )
                else:
                    section = await FormSections.create(
                        form_ref=form,
                        title=section_data.title,
                        description=section_data.description,
                        order=section_data.order or 1
                    )
                    
                    if section_data.fields is not None:
                        for field_data in section_data.fields:
                            await FormFields.create(
                                form_ref=form,
                                section_ref=section,
                                field_name=field_data.field_name,
                                field_type=field_data.field_type,
                                required=field_data.required,
                                constraints=field_data.constraints,
                                section=field_data.section,
                                field_order=field_data.field_order
                            )
            
            # Delete fields that were removed
            for field_id in existing_fields:
                await FormFields.filter(id=field_id).delete()
            
            # Delete sections that were removed
            for section_id in existing_sections:
                if section_id not in [s.id for s in form_data.sections if hasattr(s, 'id')]:
                    await FormSections.filter(id=section_id).delete()
    
    return {"success": "Form updated successfully"}


@forms_router.delete("/{form_id}/delete",
                    summary="Delete Form",
                    security=[{"bearerAuth": []}],
                    responses={200: Success200, 400: Error400})
@auth(["jwt"])
async def delete_form(req: Request, res: Response):
    form_id = req.path_params.get("form_id")
    user = req.user

    form = await Forms.get_or_none(id=form_id, owner=user)
    
    if not form:
        return res.status(404).json({"error": "Form not found"})
    
    await form.delete()
    
    return {"success": "Form deleted successfully"}