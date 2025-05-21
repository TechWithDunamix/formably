from re import L
from nexios import Router
from nexios.http import Request, Response
from dto.responses import Success200, Error400
from models import Forms
from utils.format_forms import format_form
from routes.forms._models import FormResponse
from typing import List
templates_router = Router("/api/templates")


@templates_router.get("/list", responses=List[FormResponse])
async def get_templates(req: Request, res: Response):
    templates = Forms.filter(is_template=True, draft=False).order_by("-created_at")

    return [await format_form(form) for form in templates]
