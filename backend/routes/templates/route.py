from re import L
from nexios import Router
from nexios.http import Request, Response
from dto.responses import Success200, Error400
from models import Forms
from utils.format_forms import format_form_template,FormTemplateResponse
from typing import List
from nexios.auth.decorator import auth
from models.form_fields import FormFields
from models.form_sections import FormSections
from ._models import TemplateResponse
templates_router = Router("/v1/templates", tags=["Templates"])


@templates_router.get("/list", responses=List[FormTemplateResponse])
async def get_templates(req: Request, res: Response):
    templates = await Forms.filter(as_template=True, draft=False).order_by("-created_at")

    return [await format_form_template(form) for form in templates]




@templates_router.post("/{id}/use", responses=TemplateResponse, security=[{"bearerAuth": []}])
@auth(["jwt"])
async def use_template(req: Request, res: Response):
    obj_id = req.path_params.get("id")

    # Fetch the form template
    old_obj = await Forms.filter(as_template=True, draft=False, id=obj_id).prefetch_related("fields").first()
    if not old_obj:
        return res.json({"error": "Template Response", "message": "Template Not Found"})

    fields_to_copy = old_obj._meta.fields_map.keys()
    form_data = {field: getattr(old_obj, field) for field in fields_to_copy if field != "id"}
    form_data.pop("sections");form_data.pop("fields");form_data.pop("owner");form_data.pop("responses")
    form_data["as_template"] = False
    form_data["draft"] = True
    form_data["public_id"] = old_obj.generate_public_id()

    new_obj = await Forms.create(**form_data)
    new_obj.owner = req.user
    await new_obj.save()
    for section in await old_obj.sections.all():
        section_fields = section._meta.fields_map.keys()
        section_data = {f: getattr(section, f) for f in section_fields if f != "id"}
        section_data.pop("form_ref"); section_data.pop("fields")

        new_section = await FormSections.create(**section_data)
        new_section.form_ref = new_obj
        new_section.order = section.order
        await new_section.save()

        for field in await section.fields.all():
            field_fields = field._meta.fields_map.keys()
            field_data = {f: getattr(field, f) for f in field_fields if f != "id"}
            field_data.pop("form_ref"); field_data.pop("section_ref")

            new_field = await FormFields.create(**field_data)
            new_field.form_ref = new_obj
            new_field.section_ref = new_section
            await new_field.save()


    return {"form_id": new_obj.id}

     