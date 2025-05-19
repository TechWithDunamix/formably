from nexios.http import Request, Response
from pydantic import ValidationError

async def handle_pydantic_error(request: Request, response: Response, error: ValidationError):
    formatted_errors = {err['loc'][0]: err['msg'] for err in error.errors()}
    return response.json({"message": "detail", "errors": formatted_errors}, status_code=400)