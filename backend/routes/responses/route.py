from nexios.routing import Router
from nexios.http import Request, Response
from dto.responses import Success200, Error400
from ._models import FormResponses
from models.form_response import FormResponse
from models.forms import Forms
from nexios.auth.decorator import auth
import csv
import io
responses_router = Router(prefix="/v1/responses", tags=["v1", "responses"])


@responses_router.get("/{form_id}", 
    summary="Get Form Responses",
    security=[{"bearerAuth": []}],
    responses={200: FormResponses, 400: Error400})
async def get_form_responses(req: Request, res: Response, form_id):
    
    form = await Forms.filter(id=form_id, owner = req.user).first().prefetch_related("responses")
    if not form:
        return res.json({"error": "Form not found"},status_code=404)
    
    response = await form.responses.all().order_by("-created_at")
    return [await form.to_dict() for form in response]    



@responses_router.get("/{form_id}/r/{response_id}", 
    summary="Get Form Response Detail",
    security=[{"bearerAuth": []}],
    responses={200: FormResponses, 400: Error400})
async def get_form_response_detail(req: Request, res: Response, form_id, response_id):
    
    form = await Forms.filter(id=form_id, owner = req.user).first().prefetch_related("responses")
    if not form:
        return res.json({"error": "Form not found"},status_code=404)
    
    response = await form.responses.filter(id=response_id).first()
    if not response:
        return res.json({"error": "Response not found"},status_code=404)
    
    return await response.to_dict()

@responses_router.get("/download/{form_id}", 
    summary="Download Form Response as CSV",
    security=[{"bearerAuth": []}],
    responses={200: None, 400: Error400})
async def download_form_responses(req: Request, res: Response, form_id):
    print("======")
    print("form_id", form_id)
  
    
    form = await Forms.filter(id=form_id, owner=req.user).first().prefetch_related("responses")
    if not form:
        return res.json({"error": "Form not found"}, status_code=404)

    fields = await form.fields.all()
    responses = await form.responses.all()
    
    buffer = io.StringIO()
    writer = csv.writer(buffer)

    writer.writerow([f"Form Title: {form.title}"])
    writer.writerow([])  

    fieldnames = [x.field_name for x in fields]
    if form.collect_email:
        fieldnames.insert(0, "Email")
    dict_writer = csv.DictWriter(buffer, fieldnames=fieldnames)
    dict_writer.writeheader()

    for resp in responses:
        print("="* 20)
        print("resp", resp.response)
        writer.writerow({**resp.response})

    buffer.seek(0)

    return res.resp(buffer.read(), headers={
        "Content-Type": "text/csv",
        "Content-Disposition": f"attachment; filename={form.title}.csv"
    })