from math import e
from nexios.routing import Router
from nexios.http import Request, Response
from models import Forms
from utils.format_forms import format_form
from dto.responses import Success200, Error400
from routes.forms._models import FormResponse
from datetime import UTC, datetime
from tortoise.expressions import Q
from models import Forms 
from utils.pydantic_conv import create_model_from_form
from user_agents import parse
from models.form_response import FormResponse

public_router = Router(prefix="/v1/public", tags=["v1", "public"])
async def get_active_forms():
    now = datetime.now(UTC)

    query = Q(draft=False) & Q(is_active=True) 

    return  Forms.filter(query)

def make_key_string_from_dict(dict):
    new_dict = {}
    for key, value in dict.items():
        new_dict[key] = str(value)
    return new_dict

@public_router.get("/{form_id}/details", responses={200: FormResponse, 400: Error400})
async def get_public_form(req: Request, res: Response, form_id):
    activate_form = await get_active_forms()
    print(await activate_form, form_id)
    form = await activate_form.filter(public_id=form_id).first()
    if not form:
        return res.status(404).json({"error": "Form not found"},status_code=404)

    if form.active_until and form.active_until < datetime.now(UTC):
        print("expired")
        print(form.active_until)
        return res.status(404).json({"error": "Form not found"},status_code=404)
    return await format_form(form)


@public_router.post("/{form_id}/submit", responses={200: Success200, 400: Error400})
async def submit_form(req: Request, res: Response, form_id):
    print(req.client)
    activate_form = await get_active_forms()
    form = await activate_form.filter(public_id=form_id).first()
    if not form:
        return res.status(404).json({"error": "Form not found"},status_code=404)

    if form.active_until and form.active_until < datetime.now(UTC):
        print("expired")
        print(form.active_until)
        return res.status(404).json({"error": "Form not found"},status_code=404)
    
    form_data = await format_form(form)
    pydantic_model = create_model_from_form(form_data)
    form_data = pydantic_model(**await req.json)
    user_agent = parse(req.headers.get("User-Agent", ""))
    # print(user_agent.browser.family)
    # print(user_agent.os.family)
    # print(user_agent.device.family)
    # print(user_agent.device.brand)

    if await form.responses.all().count() > form.max_response:
        return res.json({"error": "Response limit exceeded"},status_code=400)
    
    await FormResponse.create(
        form_ref = form,
        device_browser = str(user_agent.browser.family),
        device_os = str(user_agent.os.family),
        device_family = str(user_agent.device.family),
        device_brand = str(user_agent.device.brand),
        response = make_key_string_from_dict(form_data.model_dump(exclude_unset=True)),
    )
    return res.json({"success": "Form submitted successfully"},status_code=200) 