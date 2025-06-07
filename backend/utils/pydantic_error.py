from math import log
from nexios.http import Request, Response
from pydantic import ValidationError
from nexios.logging import getLogger

logger = getLogger(__name__)

async def handle_pydantic_error(request: Request, response: Response, error: ValidationError):
    formatted_errors = {err['loc'][0]: err['msg'] for err in error.errors()}
    logger.error(formatted_errors)
    return response.json({"message": "detail", "errors": formatted_errors}, status_code=400)