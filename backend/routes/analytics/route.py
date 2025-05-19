# analytics.py
from nexios.routing import Router
from nexios.http import Request, Response
from nexios.auth.decorator import auth
from dto.responses import Success200, Error400
from models.forms import Forms
from models.form_response import FormResponse
from tortoise.expressions import Q
from datetime import datetime, timedelta
import io
import base64
from collections import defaultdict
from ._models import ResponseStats

analytics_router = Router(prefix="/v1/analytics", tags=["v1", "analytics"])

@analytics_router.get("/responses/{form_id}/summary",
                     summary="Get Form Response Summary",
                     security=[{"bearerAuth": []}],
                     responses={200: ResponseStats, 400: Error400})
@auth(["jwt"])
async def get_response_summary(req: Request, res: Response):
    form_id = req.path_params.get("form_id")
    user = req.user
    
    form = await Forms.get_or_none(id=form_id, owner=user)
    if not form:
        return res.status(404).json({"error": "Form not found"})
    
    total_responses = await FormResponse.filter(form_ref=form).count()
    
    # Get response count by device type
    device_counts = {
        "desktop": await FormResponse.filter(form_ref=form, device_family__icontains="desktop").count(),
        "mobile": await FormResponse.filter(form_ref=form, device_family__icontains="mobile").count(),
        "tablet": await FormResponse.filter(form_ref=form, device_family__icontains="tablet").count(),
        "other": await FormResponse.filter(form_ref=form).filter(
            ~Q(device_family__icontains="desktop") &
            ~Q(device_family__icontains="mobile") &
            ~Q(device_family__icontains="tablet")
        ).count()
    }
    
    # Get browser distribution
    browsers = await FormResponse.filter(form_ref=form).values_list("device_browser", flat=True)
    browser_distribution = defaultdict(int)
    for browser in browsers:
        if browser:
            browser_distribution[browser.split()[0]] += 1 
    
    return {
        "total_responses": total_responses,
        "device_distribution": device_counts,
        "browser_distribution": dict(browser_distribution),
        "completion_rate": None,  # Could be calculated if you track started responses
    }

